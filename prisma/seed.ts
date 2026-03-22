import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding fresh ecosystem data...');

  // 1. CLEANUP (Ordered to respect FK constraints)
  await prisma.report.deleteMany();
  await prisma.review.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.application.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.portfolioItem.deleteMany(); // Delete children first
  await prisma.profile.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  // 2. USERS
  const admin = await prisma.user.create({
    data: {
      email: 'admin@redgriffin.academy',
      displayName: 'System Architect',
      role: 'admin',
      source: 'local',
      profile: {
        create: {
          bio: 'Lead architect of Red Griffin Ecosystem',
          location: 'Digital Space',
          avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png'
        }
      }
    }
  });

  const lecturer = await prisma.user.create({
    data: {
      email: 'lecturer@example.com',
      displayName: 'Alex Rivers',
      role: 'lecturer',
      profile: {
        create: {
          bio: 'VFX Artist with 10+ years experience',
          avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-2.png'
        }
      }
    }
  });

  // 3. SKILLS
  const skills = await Promise.all([
    prisma.skill.create({ data: { name: 'Unreal Engine' } }),
    prisma.skill.create({ data: { name: 'Houdini' } }),
    prisma.skill.create({ data: { name: 'ZBrush' } }),
    prisma.skill.create({ data: { name: 'Maya' } }),
  ]);

  // 4. CATEGORIES
  const cat3d = await prisma.category.create({
    data: {
      name: '3D Modeling',
      type: 'academy',
      order: 1,
      subcategories: JSON.stringify(['Character Design', 'Environment Art', 'Hard Surface'])
    }
  });

  const catVfx = await prisma.category.create({
    data: {
      name: 'VFX & Dynamics',
      type: 'academy',
      order: 2,
      subcategories: JSON.stringify(['Destruction', 'Water Sims', 'Fire & Smoke'])
    }
  });

  // 5. COURSES
  const course = await prisma.course.create({
    data: {
      slug: 'unreal-engine-masterclass',
      title: 'Unreal Engine 5: The Ultimate Masterclass',
      description: 'Master UE5 from scratch to advanced cinematic rendering.',
      lecturerId: admin.id,
      lecturerName: admin.displayName || 'Admin',
      price: 199.99,
      thumbnail: 'https://images.unsplash.com/photo-1616440835904-715057537c4f?q=80&w=1000',
      level: 'intermediate',
      status: 'published',
      tags: JSON.stringify(['UE5', 'Rendering', 'Gamedev']),
      categoryId: cat3d.id,
      lessons: {
        create: [
          { title: 'Introduction to Interface', content: '...', videoUrl: '...', type: 'video', duration: '15m', order: 1, isFree: true },
          { title: 'Nanite and Lumen', content: '...', videoUrl: '...', type: 'video', duration: '45m', order: 2 }
        ]
      }
    }
  });

  // 6. PROJECTS (STUDIO)
  await prisma.project.create({
    data: {
      title: 'Cinematic Trailer for Indie RPG',
      slug: 'cinematic-indie-rpg',
      description: 'We need a high-quality 30s trailer for our upcoming RPG.',
      clientId: admin.id,
      budget: 5000,
      urgency: 'urgent',
      tags: JSON.stringify(['Animation', 'Rendering', 'indie']),
      status: 'open'
    }
  });

  // 7. SERVICES
  await prisma.service.create({
    data: {
      title: 'High-poly Character Sculpting',
      description: 'I will sculpt a professional 3D character for your game.',
      executorId: lecturer.id,
      price: 450,
      category: 'Character Design',
      tags: JSON.stringify(['ZBrush', 'Sculpting']),
      rating: 4.9
    }
  });

  console.log('✅ Ecosystem seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
