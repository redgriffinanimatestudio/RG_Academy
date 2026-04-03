import { 
  Video, 
  Box, 
  Zap, 
  Users, 
  Layout, 
  Cpu, 
  Globe, 
  Camera, 
  PenTool, 
  Layers, 
  Target,
  Home
} from 'lucide-react';

export interface Discipline {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  software: string[];
  levels: string[];
}

export const CG_DISCIPLINES: Discipline[] = [
  {
    id: 'char_anim',
    name: 'Breathe_Life: Character Animation',
    description: 'Transform static models into living, breathing entities with soulful motion and rigging mastery.',
    icon: Users,
    color: 'text-primary',
    software: ['Maya', 'MotionBuilder', 'After Effects'],
    levels: ['Initiate (L1)', 'Specialist (L2)', 'Master (L3)']
  },
  {
    id: 'world_gen',
    name: 'World_Forge: Environment Design',
    description: 'Construct vast, high-fidelity digital worlds from the smallest prop to procedural landscapes.',
    icon: Globe,
    color: 'text-cyan-400',
    software: ['3ds Max', 'Unreal Engine', 'Substance 3D', 'Ps'],
    levels: ['Initiate (L1)', 'Specialist (L2)', 'Master (L3)']
  },
  {
    id: 'vfx_sim',
    name: 'Chaos_Control: Visual FX & Sim',
    description: 'Master the physics of fire, water, and mass destruction. Pure procedural wizardry.',
    icon: Zap,
    color: 'text-orange-500',
    software: ['Houdini', 'Maya (Bifrost)', 'Arnold'],
    levels: ['Initiate (L1)', 'Specialist (L2)', 'Master (L3)']
  },
  {
    id: 'motion_design',
    name: 'Neural_Flow: Motion Graphics',
    description: 'High-stakes visual communication, sleek branding, and cinematic title design.',
    icon: Layers,
    color: 'text-emerald-500',
    software: ['After Effects', 'Illustrator', 'Cinema 4D'],
    levels: ['Initiate (L1)', 'Specialist (L2)', 'Master (L3)']
  },
  {
    id: 'archviz',
    name: 'Meta_Arch: ArchViz & XR',
    description: 'Architecting the future of real-estate and virtual spaces with photorealistic precision.',
    icon: Home,
    color: 'text-purple-500',
    software: ['3ds Max', 'Revit', 'Unreal Engine', 'V-Ray'],
    levels: ['Initiate (L1)', 'Specialist (L2)', 'Master (L3)']
  },
  {
    id: 'concept_art',
    name: 'Genesis: Concept & Design',
    description: 'The foundation of all high-end visuals. Designing the soul of characters and worlds.',
    icon: PenTool,
    color: 'text-rose-500',
    software: ['Photoshop', 'Illustrator', 'Procreate'],
    levels: ['Initiate (L1)', 'Specialist (L2)', 'Master (L3)']
  }
];

export const SOFTWARE_MAP = {
  adobe: {
    name: 'Adobe Creative Suite',
    products: [
      { id: 'ps', name: 'Photoshop', category: 'Photography & Design' },
      { id: 'ai', name: 'Illustrator', category: 'Vector Illustration' },
      { id: 'ae', name: 'After Effects', category: 'Motion Graphics & VFX' },
      { id: 'pr', name: 'Premiere Pro', category: 'Video Editing' },
      { id: 'sub', name: 'Substance 3D', category: '3D Texturing' }
    ]
  },
  autodesk: {
    name: 'Autodesk Industrial Suite',
    products: [
      { id: 'maya', name: 'Maya', category: 'Animation & VFX' },
      { id: '3ds', name: '3ds Max', category: 'ArchViz & Game Design' },
      { id: 'flame', name: 'Flame', category: 'High-End Finishing' },
      { id: 'mud', name: 'Mudbox', category: 'Digital Sculpting' }
    ]
  }
};
