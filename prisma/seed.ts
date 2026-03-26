import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding fresh ecosystem data...');

  // 1. CLEANUP (Ordered to respect FK constraints)
  await prisma.message.deleteMany();
  await prisma.chatRoom.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.feedEvent.deleteMany();
  await prisma.connection.deleteMany();
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
  await prisma.portfolioItem.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  // 2. USERS
  const admin = await prisma.user.create({
    data: {
      email: 'admin@redgriffin.academy',
      displayName: 'System Architect',
      role: 'admin',
      primaryRole: 'admin',
      roles: JSON.stringify(['admin', 'student', 'lecturer']),
      isAdmin: true,
      isStudent: true,
      isLecturer: true,
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
      primaryRole: 'lecturer',
      roles: JSON.stringify(['lecturer']),
      isLecturer: true,
      isStudent: false,
      profile: {
        create: {
          bio: 'VFX Artist with 10+ years experience',
          avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-2.png'
        }
      }
    }
  });

  const student = await prisma.user.create({
    data: {
      email: 'student@example.com',
      displayName: 'New Artist',
      role: 'student',
      primaryRole: 'student',
      roles: JSON.stringify(['student']),
      isStudent: true,
      profile: {
        create: {
          bio: 'Learning the magic of CG',
          avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-3.png'
        }
      }
    }
  });

  // NEW USERS FOR ALL ROLES
  const chiefManager = await prisma.user.create({
    data: {
      email: 'chief@redgriffin.academy',
      displayName: 'Elena Vance',
      role: 'chief_manager',
      primaryRole: 'chief_manager',
      roles: JSON.stringify(['chief_manager', 'admin']),
      isStudent: false,
      isAdmin: true,
      profile: {
        create: {
          bio: 'Strategic director of RG Academy',
          avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-4.png',
          location: 'HQ Central'
        }
      }
    }
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@redgriffin.academy',
      displayName: 'Marcus Aurelius',
      role: 'manager',
      primaryRole: 'manager',
      roles: JSON.stringify(['manager', 'lecturer']),
      isLecturer: true,
      profile: {
        create: {
          bio: 'Operational manager and part-time lecturer',
          avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-5.png'
        }
      }
    }
  });

  const moderator = await prisma.user.create({
    data: {
      email: 'moderator@redgriffin.academy',
      displayName: 'Sarah Connor',
      role: 'moderator',
      primaryRole: 'moderator',
      roles: JSON.stringify(['moderator']),
      profile: {
        create: {
          bio: 'Platform moderation and community safety',
          avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-6.png'
        }
      }
    }
  });

  const hr = await prisma.user.create({
    data: {
      email: 'hr@redgriffin.academy',
      displayName: 'Miranda Lawson',
      role: 'hr',
      primaryRole: 'hr',
      roles: JSON.stringify(['hr']),
      profile: {
        create: {
          bio: 'Head of Talent Acquisition',
          avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-7.png'
        }
      }
    }
  });

  const finance = await prisma.user.create({
    data: {
      email: 'finance@redgriffin.academy',
      displayName: 'Garrus Vakarian',
      role: 'finance',
      primaryRole: 'finance',
      roles: JSON.stringify(['finance']),
      profile: {
        create: {
          bio: 'Financial operations and contracts',
          avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-8.png'
        }
      }
    }
  });

  const support = await prisma.user.create({
    data: {
      email: 'support@redgriffin.academy',
      displayName: 'Tali Zorah',
      role: 'support',
      primaryRole: 'support',
      roles: JSON.stringify(['support']),
      profile: {
        create: {
          bio: 'Technical support and user assistance',
          avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-9.png'
        }
      }
    }
  });

  const client = await prisma.user.create({
    data: {
      email: 'client@example.com',
      displayName: 'Cyberdyne Systems',
      role: 'client',
      primaryRole: 'client',
      roles: JSON.stringify(['client']),
      isClient: true,
      profile: {
        create: {
          bio: 'Innovative tech company looking for CG talent',
          avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-10.png'
        }
      }
    }
  });

  const executor = await prisma.user.create({
    data: {
      email: 'executor@example.com',
      displayName: 'Solid Snake',
      role: 'executor',
      primaryRole: 'executor',
      roles: JSON.stringify(['executor', 'student']),
      isExecutor: true,
      isStudent: true,
      profile: {
        create: {
          bio: 'Freelance CG Generalist and Unreal specialist',
          avatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-11.png'
        }
      }
    }
  });

  // 8. CHAT
  const room = await prisma.chatRoom.create({
    data: {
      type: 'direct',
      participants: JSON.stringify([admin.id, student.id]),
      lastMessage: 'Welcome to the platform!'
    }
  });

  await prisma.message.create({
    data: {
      roomId: room.id,
      senderId: admin.id,
      text: 'Hello! I am the system architect. If you have any questions, feel free to ask.'
    }
  });

  // 9. NOTIFICATIONS
  await prisma.notification.createMany({
    data: [
      { userId: student.id, type: 'info', title: 'Welcome', message: 'Your creative journey starts here.', link: '/aca/eng' },
      { userId: admin.id, type: 'success', title: 'System Status', message: 'All systems operational.', link: '/admin/eng' }
    ]
  });

  console.log('✅ Ecosystem seeded successfully!');

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
