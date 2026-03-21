import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ACADEMY_CATEGORIES = [
  {
    id: 'modeling_3d',
    name: 'modeling_3d',
    type: 'academy',
    order: 1,
    subcategories: [
      { name: 'char_modeling', topics: ['Anatomy for Artists', 'Stylized Characters', 'Realistic Humans', 'Creature Sculpting', 'Retopology'] },
      { name: 'env_art', topics: ['Modular Environments', 'Foliage & Nature', 'World Building', 'Photogrammetry', 'Interior Design'] }
    ]
  },
  {
    id: 'animation',
    name: 'animation',
    type: 'academy',
    order: 2,
    subcategories: [
      { name: 'animation_3d', topics: ['Body Mechanics', 'Acting for Animation', 'Creature Animation', 'Facial Animation', 'Lip Sync'] },
      { name: 'animation_2d', topics: ['Traditional 2D', 'Toon Boom Harmony', 'Spine 2D', 'Motion Graphics', 'Storyboarding'] }
    ]
  },
  {
    id: 'vfx_compositing',
    name: 'vfx_compositing',
    type: 'academy',
    order: 3,
    subcategories: [
      { name: 'visual_effects', topics: ['Houdini Dynamics', 'Niagara VFX', 'Fluid Simulation', 'Destruction FX', 'Particle Systems'] }
    ]
  }
];

const STUDIO_CATEGORIES = [
  {
    id: 'prod_services',
    name: 'prod_services',
    type: 'studio',
    order: 1,
    subcategories: [
      { name: 'anim_prod', topics: ['Feature Film Animation', 'Commercial Animation', 'Game Cinematics', 'Motion Capture'] },
      { name: 'vfx_post', topics: ['CGI Environments', 'Digital Compositing', 'Color Grading', 'Sound Design'] }
    ]
  },
  {
    id: 'talent_network',
    name: 'talent_network',
    type: 'studio',
    order: 2,
    subcategories: [
      { name: 'creative_talent', topics: ['Concept Artists', '3D Generalists', 'Animators', 'VFX Supervisors'] },
      { name: 'technical_talent', topics: ['Pipeline Engineers', 'Technical Directors', 'Game Developers', 'Rigger'] }
    ]
  },
  {
    id: 'studio_solutions',
    name: 'studio_solutions',
    type: 'studio',
    order: 3,
    subcategories: [
      { name: 'infrastructure', topics: ['Render Farm Access', 'Pipeline Tools', 'Asset Management', 'Collaboration Hub'] }
    ]
  }
];

async function seed() {
  console.log('Starting migration to Firestore...');
  const batch = writeBatch(db);

  // Seed Categories
  [...ACADEMY_CATEGORIES, ...STUDIO_CATEGORIES].forEach(cat => {
    const ref = doc(collection(db, 'categories'), cat.id);
    batch.set(ref, cat);
  });

  await batch.commit();
  console.log('Successfully migrated all categories to Firestore!');
  process.exit(0);
}

seed().catch(console.error);
