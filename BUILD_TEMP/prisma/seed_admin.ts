import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating Admin user...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@redgriffin.academy' },
    update: {
      role: 'admin',
      displayName: 'System Administrator'
    },
    create: {
      email: 'admin@redgriffin.academy',
      displayName: 'System Administrator',
      role: 'admin',
      source: 'local'
    },
  });

  console.log('Admin created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
