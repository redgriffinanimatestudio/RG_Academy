import "dotenv/config";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateAdmin() {
  console.log('🛠️  Industrial Admin Update Node_v20...');
  try {
    const updated = await prisma.user.update({
      where: { email: 'admin@redgriffin.academy' },
      data: {
        roles: JSON.stringify(['admin', 'student', 'lecturer', 'agency', 'hr', 'finance', 'support']),
        isAgency: true,
        isHr: true,
        isFinance: true,
        isSupport: true
      }
    });
    console.log('✅ Master Architect Role Grid Synchronized:', updated.roles);
  } catch (err) {
    console.error('❌ Update failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdmin();
