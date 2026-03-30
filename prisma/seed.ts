import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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
      password: bcrypt.hashSync('admin', 10),
      displayName: 'System Architect',
      role: 'admin',
      primaryRole: 'admin',
      roles: JSON.stringify(['admin', 'student', 'lecturer', 'agency', 'hr', 'finance', 'support']),
      isAdmin: true,
      isStudent: true,
      isLecturer: true,
      isAgency: true,
      isHr: true,
      isFinance: true,
      isSupport: true,
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
      password: bcrypt.hashSync('admin', 10),
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
      password: bcrypt.hashSync('admin', 10),
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
      password: bcrypt.hashSync('admin', 10),
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
      password: bcrypt.hashSync('admin', 10),
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
      password: bcrypt.hashSync('admin', 10),
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
      password: bcrypt.hashSync('admin', 10),
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
      password: bcrypt.hashSync('admin', 10),
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
      password: bcrypt.hashSync('admin', 10),
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
      password: bcrypt.hashSync('admin', 10),
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
      password: bcrypt.hashSync('admin', 10),
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
      thumbnail: 'https://images.unsplash.com/photo-1620121692029-d088224efc74?auto=format&fit=crop&q=80',
      level: 'intermediate',
      status: 'published',
      tags: JSON.stringify(['UE5', 'Rendering', 'Gamedev']),
      categoryId: cat3d.id,
    }
  });

  // 5.1 MODULES & LESSONS (Industrial Hierarchy)
  const m1 = await prisma.module.create({
    data: { courseId: course.id, title: 'I: Neural Foundations & UI', order: 1 }
  });
  const m2 = await prisma.module.create({
    data: { courseId: course.id, title: 'II: Nanite & Lumen Architecture', order: 2 }
  });
  const m3 = await prisma.module.create({
    data: { courseId: course.id, title: 'III: Cinematic Rendering & Path Tracing', order: 3 }
  });

  await prisma.lesson.createMany({
    data: [
      { courseId: course.id, moduleId: m1.id, title: 'Session 01: Ecosystem Initialization', content: '<p>Standardizing the Unreal Engine workspace for industrial VFX production.</p>', videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'video', duration: '12m', order: 1, isFree: true },
      { courseId: course.id, moduleId: m1.id, title: 'Session 02: Folder Hierarchy & Naming Protocols', content: '<p>Ensuring cross-departmental compatibility.</p>', videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'video', duration: '18m', order: 2 },
      { courseId: course.id, moduleId: m2.id, title: 'Session 03: Virtualized Geometry Logic', content: '<p>Mastering Nanite for high-poly cinematic assets.</p>', videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'video', duration: '45m', order: 3 },
      { courseId: course.id, moduleId: m2.id, title: 'Session 04: Real-time Global Illumination (Lumen)', content: '<p>Calibrating infinite bounce lighting.</p>', videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'video', duration: '35m', order: 4 },
      { courseId: course.id, moduleId: m3.id, title: 'Session 05: Movie Render Queue Configuration', content: '<p>Exporting industrial-grade EXR sequences.</p>', videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'video', duration: '50m', order: 5 },
    ]
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
