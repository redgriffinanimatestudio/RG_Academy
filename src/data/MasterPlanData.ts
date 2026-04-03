import { 
  Building2, 
  Globe, 
  Zap, 
  Layers, 
  Cpu, 
  Layout, 
  Palette, 
  Compass, 
  Target,
  PenTool
} from 'lucide-react';

export interface RoadmapNode {
  id: string;
  name: string;
  phase: 'genesis' | 'tech' | 'applied' | 'deployment';
  duration: string; // "Standard Hours" or "Neural Sync Cycles"
  difficulty: 'beginner' | 'specialist' | 'master';
  software?: string[];
  description: string;
  workshopId?: string;
}

export interface SovereignPath {
  id: string;
  disciplineId: string;
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
    disciplineId: 'archviz',
    name: 'Digital Architect (ArchViz)',
    description: 'Transform architecture into high-stakes visual narratives from blueprint to photorealistic rendering.',
    icon: Building2,
    phases: [
      {
        name: 'phase_genesis',
        nodes: [
          { id: 'art_hist', name: 'Art_History: Genesis', phase: 'genesis', duration: '40h', difficulty: 'beginner', description: 'Classical aesthetics and the evolution of visual form.', workshopId: 'WS_GEN_01' },
          { id: 'arch_hist', name: 'Arch_History: Evolution', phase: 'genesis', duration: '60h', difficulty: 'specialist', description: 'From Gothic structures to Modernist and Parametric design.', workshopId: 'WS_GEN_02' },
          { id: 'comp_logic', name: 'Composition_Logic', phase: 'genesis', duration: '30h', difficulty: 'master', description: 'Spatial harmony, urbanism, and structural visual balance.', workshopId: 'WS_GEN_03' }
        ]
      },
      {
        name: 'phase_tech',
        nodes: [
          { id: 'autocad', name: 'AutoCAD: 2D_Base', phase: 'tech', duration: '50h', difficulty: 'beginner', software: ['AutoCAD'], description: 'Drafting industrial-grade blueprints.' },
          { id: 'revit', name: 'Revit: BIM_Matrix', phase: 'tech', duration: '80h', difficulty: 'specialist', software: ['Revit'], description: 'Building Information Modeling and structural nodes.' },
          { id: '3dsmax_arch', name: '3dsMax: Fidelity_Modeling', phase: 'tech', duration: '120h', difficulty: 'master', software: ['3ds Max'], description: 'High-poly architectural modeling and scene organization.' }
        ]
      },
      {
        name: 'phase_applied',
        nodes: [
          { id: 'corona_light', name: 'Corona_Light_Sync', phase: 'applied', duration: '70h', difficulty: 'specialist', software: ['Corona Renderer'], description: 'Photorealistic lighting scenarios and material optimization.' },
          { id: 'city_vis', name: 'Cityscape_Visualization', phase: 'applied', duration: '100h', difficulty: 'master', software: ['3ds Max', 'RailClone'], description: 'Large-scale urban rendering and procedural environments.' }
        ]
      }
    ]
  },
  {
    id: 'environment_artist',
    disciplineId: 'world_gen',
    name: 'Environment Artist (World_Builder)',
    description: 'Constructing cinematic game worlds and procedural landscapes for next-gen interactive nodes.',
    icon: Globe,
    phases: [
      {
        name: 'phase_genesis',
        nodes: [
          { id: 'geology_artist', name: 'Geology_For_Artists', phase: 'genesis', duration: '30h', difficulty: 'beginner', description: 'Understanding rock formations, vegetation clusters, and soil erosion.' },
          { id: 'world_comp', name: 'World_Composition', phase: 'genesis', duration: '50h', difficulty: 'specialist', description: 'Level design layout, focal points, and player pathing logic.' }
        ]
      },
      {
        name: 'phase_tech',
        nodes: [
          { id: 'ue5_engine', name: 'UE5: Neural_Engine', phase: 'tech', duration: '150h', difficulty: 'specialist', software: ['Unreal Engine 5'], description: 'Mastering Nanite, Lumen, and Blueprint logic.' },
          { id: 'substance_3d', name: 'Substance: PBR_Mastery', phase: 'tech', duration: '80h', difficulty: 'master', software: ['Substance Painter/Designer'], description: 'Procedural texturing and industrial PBR workflows.' }
        ]
      },
      {
        name: 'phase_applied',
        nodes: [
          { id: 'nanite_workflow', name: 'Nanite: Industrial_Scale', phase: 'applied', duration: '100h', difficulty: 'master', software: ['UE5', 'ZBrush'], description: 'High-poly sculpting and cinematic environmental density.' }
        ]
      }
    ]
  },
  {
    id: 'vfx_artist',
    disciplineId: 'vfx_sim',
    name: 'VFX Artist (Technical Director)',
    description: 'Bending the laws of physics. Mastering simulations, particle flow, and cinematic destruction.',
    icon: Zap,
    phases: [
      {
        name: 'phase_genesis',
        nodes: [
          { id: 'fluid_dyn', name: 'Fluid_Dynamics: Theory', phase: 'genesis', duration: '40h', difficulty: 'beginner', description: 'Introduction to liquid physics and smoke behavior.' },
          { id: 'comp_math', name: 'Compositing_Math', phase: 'genesis', duration: '60h', difficulty: 'specialist', description: 'The math behind color layers and image merging.' }
        ]
      },
      {
        name: 'phase_tech',
        nodes: [
          { id: 'houdini_core', name: 'Houdini: Procedural_Sovereignty', phase: 'tech', duration: '200h', difficulty: 'master', software: ['Houdini'], description: 'Mastering VEX and DOP networks for high-end VFX.' }
        ]
      },
      {
        name: 'phase_applied',
        nodes: [
          { id: 'simulation_node', name: 'Destruction_Sim_Matrix', phase: 'applied', duration: '120h', difficulty: 'master', software: ['Houdini', 'Nuke'], description: 'Advanced rigid body dynamics and cinematic compositing.' }
        ]
      }
    ]
  },
  {
    id: 'character_animator',
    disciplineId: 'char_anim',
    name: 'Breathe_Life: Character Animation',
    description: 'Master the art of soulful movement, performance, and advanced rigging nodes.',
    icon: Target,
    phases: [
      {
        name: 'phase_genesis',
        nodes: [
          { id: 'acting_theory', name: 'Acting_For_Animators', phase: 'genesis', duration: '50h', difficulty: 'beginner', description: 'Mastering timing, weight, and emotional arcs.' },
          { id: 'rig_logic', name: 'Standard_Rigging_Nodes', phase: 'genesis', duration: '40h', difficulty: 'specialist', description: 'Foundation of bipedal and quadrupedal limb mechanics.' }
        ]
      },
      {
        name: 'phase_tech',
        nodes: [
          { id: 'maya_perf', name: 'Maya: Performance_Mastery', phase: 'tech', duration: '150h', difficulty: 'specialist', software: ['Maya'], description: 'Industrial character performance and facial expression sync.' },
          { id: 'mobu_rig', name: 'MotionBuilder: Retargeting', phase: 'tech', duration: '80h', difficulty: 'master', software: ['MotionBuilder'], description: 'Handling high-density motion capture data.' }
        ]
      }
    ]
  },
  {
    id: 'motion_designer',
    disciplineId: 'motion_design',
    name: 'Neural_Flow: Motion Design',
    description: 'Architecting cinematic title sequences, sleek branding, and high-stakes visual communication.',
    icon: Layers,
    phases: [
      {
        name: 'phase_genesis',
        nodes: [
          { id: 'typo_motion', name: 'Typography_In_Motion', phase: 'genesis', duration: '40h', difficulty: 'beginner', description: 'Kinetic text, readability, and high-concept layout.' },
          { id: 'color_theory_flow', name: 'Industrial_Color_Flow', phase: 'genesis', duration: '30h', difficulty: 'specialist', description: 'The psychology of palettes in high-end advertising.' }
        ]
      },
      {
        name: 'phase_tech',
        nodes: [
          { id: 'ae_industrial', name: 'AfterEffects: Pure_Flow', phase: 'tech', duration: '120h', difficulty: 'specialist', software: ['After Effects'], description: 'Mastering expressions, scripts, and compositing layers.' },
          { id: 'c4d_sync', name: 'Cinema4D: Abstract_Nodes', phase: 'tech', duration: '140h', difficulty: 'master', software: ['Cinema 4D'], description: '3D motion design, MoGraph, and complex abstract sims.' }
        ]
      }
    ]
  },
  {
    id: 'concept_artist',
    disciplineId: 'concept_art',
    name: 'Genesis: Concept & Design',
    description: 'The foundation of all high-end visuals. Designing the soul of digital entities and worlds.',
    icon: PenTool,
    phases: [
      {
        name: 'phase_genesis',
        nodes: [
          { id: 'anatomy_art', name: 'Anatomy: Human_Nodes', phase: 'genesis', duration: '50h', difficulty: 'beginner', description: 'Industrial focus on skeletal and muscle structure for animation.' },
          { id: 'light_color', name: 'Light_Color_Matrix', phase: 'genesis', duration: '40h', difficulty: 'specialist', description: 'Theory of lighting, mood, and digital matte painting nodes.' }
        ]
      },
      {
        name: 'phase_tech',
        nodes: [
          { id: 'ps_mastery', name: 'Photoshop: Industrial_Core', phase: 'tech', duration: '120h', difficulty: 'specialist', software: ['Photoshop'], description: 'High-end concept workflow, layers, and brushing techniques.' }
        ]
      }
    ]
  }
];
