import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🔍 [DATABASE AUDIT] Checking for active nodes...");
  const users = await prisma.user.findMany({
    select: { email: true, role: true, displayName: true }
  });
  
  if (users.length === 0) {
    console.log("❌ No users found in database.");
  } else {
    console.table(users);
  }
}

main()
  .catch(e => { console.error("❌ Prisma Audit Error:", e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
