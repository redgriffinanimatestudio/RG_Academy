import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding networking data...');

  // 1. Find or create users
  const user1 = await prisma.user.upsert({
    where: { email: 'designer@example.com' },
    update: {},
    create: {
      email: 'designer@example.com',
      displayName: 'Alex Design',
      role: 'specialist',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'dev@example.com' },
    update: {},
    create: {
      email: 'dev@example.com',
      displayName: 'John Coder',
      role: 'specialist',
    },
  });

  // 2. Create Profiles
  await prisma.profile.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      bio: 'Senior UI/UX Designer with 10 years experience.',
      location: 'New York, USA',
      skills: {
        connectOrCreate: [
          { where: { name: 'UI/UX' }, create: { name: 'UI/UX' } },
          { where: { name: 'Figma' }, create: { name: 'Figma' } },
        ],
      },
      portfolio: {
        create: [
          { title: 'Mobile App Redesign', mediaUrl: 'https://images.unsplash.com/photo-1551288049-bbbda536339a', category: 'Mobile' },
        ],
      },
    },
  });

  await prisma.profile.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      bio: 'Fullstack Developer specializing in React and Node.js.',
      location: 'London, UK',
      skills: {
        connectOrCreate: [
          { where: { name: 'React' }, create: { name: 'React' } },
          { where: { name: 'Node.js' }, create: { name: 'Node.js' } },
        ],
      },
    },
  });

  console.log('Networking data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
