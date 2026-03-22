import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

const ACADEMY_CATEGORIES = [
  {
    id: 'modeling_3d',
    name: 'modeling_3d',
    type: 'academy',
    order: 1,
    subcategories: JSON.stringify([
      { name: 'char_modeling', topics: ['Anatomy for Artists', 'Stylized Characters', 'Realistic Humans', 'Creature Sculpting', 'Retopology'] },
      { name: 'env_art', topics: ['Modular Environments', 'Foliage & Nature', 'World Building', 'Photogrammetry', 'Interior Design'] }
    ])
  },
  {
    id: 'animation',
    name: 'animation',
    type: 'academy',
    order: 2,
    subcategories: JSON.stringify([
      { name: 'animation_3d', topics: ['Body Mechanics', 'Acting for Animation', 'Creature Animation', 'Facial Animation', 'Lip Sync'] },
      { name: 'animation_2d', topics: ['Toon Boom Harmony', 'Spine 2D', 'Motion Graphics', 'Storyboarding'] }
    ])
  },
  {
    id: 'vfx_compositing',
    name: 'vfx_compositing',
    type: 'academy',
    order: 3,
    subcategories: JSON.stringify([
      { name: 'visual_effects', topics: ['Houdini Dynamics', 'Niagara VFX', 'Fluid Simulation', 'Destruction FX', 'Particle Systems'] }
    ])
  }
];

const STUDIO_CATEGORIES = [
  {
    id: 'prod_services',
    name: 'prod_services',
    type: 'studio',
    order: 1,
    subcategories: JSON.stringify([
      { name: 'anim_prod', topics: ['Feature Film Animation', 'Commercial Animation', 'Game Cinematics', 'Motion Capture'] },
      { name: 'vfx_post', topics: ['CGI Environments', 'Digital Compositing', 'Color Grading', 'Sound Design'] }
    ])
  },
  {
    id: 'talent_network',
    name: 'talent_network',
    type: 'studio',
    order: 2,
    subcategories: JSON.stringify([
      { name: 'creative_talent', topics: ['Concept Artists', '3D Generalists', 'Animators', 'VFX Supervisors'] },
      { name: 'technical_talent', topics: ['Pipeline Engineers', 'Technical Directors', 'Game Developers', 'Rigger'] }
    ])
  },
  {
    id: 'studio_solutions',
    name: 'studio_solutions',
    type: 'studio',
    order: 3,
    subcategories: JSON.stringify([
      { name: 'infrastructure', topics: ['Render Farm Access', 'Pipeline Tools', 'Asset Management', 'Collaboration Hub'] }
    ])
  }
];

const COURSES = [
  {
    id: '1',
    slug: 'mastering-character-rigging-maya',
    title: 'Mastering Character Rigging in Maya',
    description: 'Learn the industry-standard techniques for creating robust, animator-friendly character rigs in Autodesk Maya.',
    lecturerId: 'l1',
    lecturerName: 'Alex Rivera',
    lecturerAvatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',
    price: 89.99,
    rating: 4.9,
    reviewsCount: 1240,
    studentsCount: 15420,
    duration: '24h 15m',
    thumbnail: 'https://picsum.photos/seed/rigging/800/600',
    categoryId: 'animation',
    level: 'advanced',
    tags: JSON.stringify(['Maya', 'Rigging']),
    status: 'published',
  },
  {
    id: '2',
    slug: 'cinematic-vfx-houdini-destruction',
    title: 'Cinematic VFX: Houdini Destruction',
    description: 'Master destruction and simulation in Houdini for high-end cinematic sequences.',
    lecturerId: 'l2',
    lecturerName: 'Sarah Chen',
    lecturerAvatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-2.png',
    price: 129.99,
    rating: 4.8,
    reviewsCount: 850,
    studentsCount: 8200,
    duration: '32h 40m',
    thumbnail: 'https://picsum.photos/seed/houdini/800/600',
    categoryId: 'vfx_compositing',
    level: 'expert',
    tags: JSON.stringify(['Houdini', 'VFX']),
    status: 'published',
  },
  {
    id: '3',
    slug: 'environment-art-aaa-games',
    title: 'Environment Art for AAA Games',
    description: 'Create stunning, optimized environments for modern game engines.',
    lecturerId: 'l3',
    lecturerName: 'Marcus Thorne',
    lecturerAvatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-3.png',
    price: 94.99,
    rating: 4.7,
    reviewsCount: 2100,
    studentsCount: 22100,
    duration: '45h 20m',
    thumbnail: 'https://picsum.photos/seed/envart/800/600',
    categoryId: 'modeling_3d',
    level: 'intermediate',
    tags: JSON.stringify(['Unreal Engine', 'Modeling']),
    status: 'published',
  }
];

async function main() {
  console.log('Start seeding...');

  for (const cat of [...ACADEMY_CATEGORIES, ...STUDIO_CATEGORIES]) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: cat,
    });
  }

  for (const course of COURSES) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {},
      create: course,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
