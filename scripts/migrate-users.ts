import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface FirestoreUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  role?: string;
  roles?: string[];
  bio?: string;
  location?: string;
  createdAt?: { _seconds: number };
}

async function migrateUsers(filePath: string) {
  console.log(`\n🚀 [ETL] Starting User Migration from ${filePath}...`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}. Please provide a valid Firestore export JSON.`);
    return;
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const firestoreUsers: FirestoreUser[] = JSON.parse(rawData);
  
  let success = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`📊 Found ${firestoreUsers.length} users to process.\n`);

  for (const fsUser of firestoreUsers) {
    try {
      if (!fsUser.email) {
        console.warn(`⚠️ Skipping user ${fsUser.id}: No email found.`);
        skipped++;
        continue;
      }

      // 1. Normalize Roles
      const rolesArray = fsUser.roles || (fsUser.role ? [fsUser.role] : ['student']);
      const primaryRole = fsUser.role || rolesArray[0] || 'student';

      // 2. Map to Prisma Model
      await prisma.user.upsert({
        where: { email: fsUser.email },
        update: {
          remoteId: fsUser.id,
          displayName: fsUser.displayName,
          photoURL: fsUser.photoURL,
          phone: fsUser.phone,
          role: primaryRole,
          primaryRole: primaryRole,
          roles: JSON.stringify(rolesArray),
          isStudent: rolesArray.includes('student'),
          isLecturer: rolesArray.includes('lecturer'),
          isExecutor: rolesArray.includes('executor'),
          isAdmin: rolesArray.includes('admin'),
          lastSyncedAt: new Date()
        },
        create: {
          id: fsUser.id, // Keeping ID from Firestore for continuity
          email: fsUser.email,
          remoteId: fsUser.id,
          displayName: fsUser.displayName || 'RG Artist',
          photoURL: fsUser.photoURL,
          phone: fsUser.phone,
          role: primaryRole,
          primaryRole: primaryRole,
          roles: JSON.stringify(rolesArray),
          isStudent: true,
          source: 'firestore_migration',
          createdAt: fsUser.createdAt ? new Date(fsUser.createdAt._seconds * 1000) : new Date(),
          profile: {
            create: {
              bio: fsUser.bio || 'New member of Red Griffin ecosystem',
              location: fsUser.location || 'Remote',
              avatar: fsUser.photoURL
            }
          }
        }
      });

      success++;
      if (success % 10 === 0) process.stdout.write('.');
    } catch (e: any) {
      console.error(`\n❌ Error migrating ${fsUser.email}:`, e.message);
      errors++;
    }
  }

  console.log(`\n\n✅ Migration Finished!`);
  console.log(`------------------------`);
  console.log(`✨ Success: ${success}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`💥 Errors:  ${errors}`);
  console.log(`------------------------\n`);
}

// Check if a file path is provided as an argument
const dataPath = process.argv[2] || './scripts/firestore-users.json';
migrateUsers(dataPath)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
