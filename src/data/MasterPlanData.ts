import { 
  Building2, 
  Globe, 
  Zap, 
  Layers, 
  Cpu, 
  Layout, 
  Palette, 
  Compass, 
  Target 
} from 'lucide-react';

export interface RoadmapNode {
  id: string;
  name: string;
  phase: 'genesis' | 'tech' | 'applied' | 'deployment';
  duration: string; // "Standard Hours" or "Neural Sync Cycles"
  difficulty: 'beginner' | 'specialist' | 'master';
  software?: string[];
  description: string;
}

export interface SovereignPath {
  id: string;
  name: string;
  description: string;
  icon: any;
  phases: {
    name: string;
    nodes: RoadmapNode[];
  }[];
}

export const MASTER_PLAN_DATA: SovereignPath[] = [
  {
    id: 'digital_architect',
    name: 'Digital Architect (ArchViz)',
    description: 'Transform architecture into high-stakes visual narratives from blueprint to photorealistic rendering.',
    icon: Building2,
    phases: [
      {
        name: 'Phase 01: Theoretical Genesis',
        nodes: [
          { id: 'art_hist', name: 'Art_History: Genesis', phase: 'genesis', duration: '40h', difficulty: 'beginner', description: 'Classical aesthetics and the evolution of visual form.' },
          { id: 'arch_hist', name: 'Arch_History: Evolution', phase: 'genesis', duration: '60h', difficulty: 'specialist', description: 'From Gothic structures to Modernist and Parametric design.' },
          { id: 'comp_logic', name: 'Composition_Logic', phase: 'genesis', duration: '30h', difficulty: 'master', description: 'Spatial harmony, urbanism, and structural visual balance.' }
        ]
      },
      {
        name: 'Phase 02: Toolset Synchronization',
        nodes: [
          { id: 'autocad', name: 'AutoCAD: 2D_Base', phase: 'tech', duration: '50h', difficulty: 'beginner', software: ['AutoCAD'], description: 'Drafting industrial-grade blueprints.' },
          { id: 'revit', name: 'Revit: BIM_Matrix', phase: 'tech', duration: '80h', difficulty: 'specialist', software: ['Revit'], description: 'Building Information Modeling and structural nodes.' },
          { id: '3dsmax_arch', name: '3dsMax: Fidelity_Modeling', phase: 'tech', duration: '120h', difficulty: 'master', software: ['3ds Max'], description: 'High-poly architectural modeling and scene organization.' }
        ]
      },
      {
        name: 'Phase 03: Production Practice',
        nodes: [
          { id: 'corona_light', name: 'Corona_Light_Sync', phase: 'applied', duration: '70h', difficulty: 'specialist', software: ['Corona Renderer'], description: 'Photorealistic lighting scenarios and material optimization.' },
          { id: 'city_vis', name: 'Cityscape_Visualization', phase: 'applied', duration: '100h', difficulty: 'master', software: ['3ds Max', 'RailClone'], description: 'Large-scale urban rendering and procedural environments.' }
        ]
      }
    ]
  },
  {
    id: 'environment_artist',
    name: 'Environment Artist (World_Builder)',
    description: 'Constructing cinematic game worlds and procedural landscapes for next-gen interactive nodes.',
    icon: Globe,
    phases: [
      {
        name: 'Phase 01: Genesis Grounding',
        nodes: [
          { id: 'geology_artist', name: 'Geology_For_Artists', phase: 'genesis', duration: '30h', difficulty: 'beginner', description: 'Understanding rock formations, vegetation clusters, and soil erosion.' },
          { id: 'world_comp', name: 'World_Composition', phase: 'genesis', duration: '50h', difficulty: 'specialist', description: 'Level design layout, focal points, and player pathing logic.' }
        ]
      },
      {
        name: 'Phase 02: Tech Sync',
        nodes: [
          { id: 'ue5_engine', name: 'UE5: Neural_Engine', phase: 'tech', duration: '150h', difficulty: 'specialist', software: ['Unreal Engine 5'], description: 'Mastering Nanite, Lumen, and Blueprint logic.' },
          { id: 'substance_3d', name: 'Substance: PBR_Mastery', phase: 'tech', duration: '80h', difficulty: 'master', software: ['Substance Painter/Designer'], description: 'Procedural texturing and industrial PBR workflows.' }
        ]
      }
    ]
  },
  {
    id: 'vfx_artist',
    name: 'VFX Artist (Technical Director)',
    description: 'Bending the laws of physics. Mastering simulations, particle flow, and cinematic destruction.',
    icon: Zap,
    phases: [
      {
        name: 'Phase 01: Physical Theory',
        nodes: [
          { id: 'fluid_dyn', name: 'Fluid_Dynamics: Theory', phase: 'genesis', duration: '40h', difficulty: 'beginner', description: 'Introduction to liquid physics and smoke behavior.' },
          { id: 'comp_math', name: 'Compositing_Math', phase: 'genesis', duration: '60h', difficulty: 'specialist', description: 'The math behind color layers and image merging.' }
        ]
      },
      {
        name: 'Phase 02: Simulation Node',
        nodes: [
          { id: 'houdini_core', name: 'Houdini: Procedural_Sovereignty', phase: 'tech', duration: '200h', difficulty: 'master', software: ['Houdini'], description: 'Mastering VEX and DOP networks for high-end VFX.' }
        ]
      }
    ]
  }
];
