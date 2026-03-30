import { 
  GraduationCap, 
  Box, 
  Sparkles, 
  Play, 
  Cpu, 
  Briefcase, 
  Target,
  FlaskConical,
  LucideIcon
} from 'lucide-react';

export interface Specialization {
  id: string;
  nameKey: string;
  slug: string;
}

export interface Chair {
  id: string;
  nameKey: string;
  slug: string;
  specializations?: Specialization[];
}

export interface Department {
  id: string;
  nameKey: string;
  icon: LucideIcon;
  chairs: Chair[];
}

export const ACADEMIC_TREE: Department[] = [
  {
    id: 'fundamental_arts',
    nameKey: 'dept_fundamental_arts',
    icon: FlaskConical,
    chairs: [
      { id: 'drawing_plastic', nameKey: 'chair_drawing_plastic', slug: 'drawing-plastic', specializations: [{ id: 'anatomy', nameKey: 'spec_anatomy', slug: 'anatomy' }] },
      { id: 'composition_design', nameKey: 'chair_composition_design', slug: 'composition-design' },
      { id: 'art_history', nameKey: 'chair_art_history', slug: 'art-history' },
      { id: 'photo_optics', nameKey: 'chair_photo_optics', slug: 'photo-optics' }
    ]
  },
  {
    id: 'cg_production',
    nameKey: 'dept_cg_production',
    icon: Box,
    chairs: [
      { id: 'modeling_3d', nameKey: 'chair_modeling_3d', slug: 'modeling-3d', specializations: [{ id: 'hardsurface', nameKey: 'spec_hardsurface', slug: 'hardsurface' }, { id: 'organic', nameKey: 'spec_organic', slug: 'organic' }] },
      { id: 'texturing_lookdev', nameKey: 'chair_texturing_lookdev', slug: 'texturing-lookdev' },
      { id: 'rigging_tech_anim', nameKey: 'chair_rigging_tech_anim', slug: 'rigging-tech-anim' },
      { id: 'character_animation', nameKey: 'chair_character_animation', slug: 'character-animation' },
      { id: 'lighting_render', nameKey: 'chair_lighting_render', slug: 'lighting-render' },
      { id: 'compositing_matte', nameKey: 'chair_compositing_matte', slug: 'compositing-matte' }
    ]
  },
  {
    id: 'vfx_sim',
    nameKey: 'dept_vfx_sim',
    icon: Sparkles,
    chairs: [
      { id: 'procedural_fx', nameKey: 'chair_procedural_fx', slug: 'procedural-fx' },
      { id: 'matchmove_layout', nameKey: 'chair_matchmove_layout', slug: 'matchmove-layout' },
      { id: 'virtual_production', nameKey: 'chair_virtual_production', slug: 'virtual-production' },
      { id: 'mocap_retarget', nameKey: 'chair_mocap_retarget', slug: 'mocap-retarget' }
    ]
  },
  {
    id: 'game_art',
    nameKey: 'dept_game_art',
    icon: Play,
    chairs: [
      { id: 'env_design', nameKey: 'chair_env_design', slug: 'env-design' },
      { id: 'stylized_art', nameKey: 'chair_stylized_art', slug: 'stylized-art' },
      { id: 'tech_art', nameKey: 'chair_tech_art', slug: 'tech-art' },
      { id: 'game_ui_ux', nameKey: 'chair_game_ui_ux', slug: 'game-ui-ux' }
    ]
  },
  {
    id: 'ai_coding',
    nameKey: 'dept_ai_coding',
    icon: Cpu,
    chairs: [
      { id: 'cs_foundations', nameKey: 'chair_cs_foundations', slug: 'cs-foundations' },
      { id: 'python_ml', nameKey: 'chair_python_ml', slug: 'python-ml' },
      { id: 'ai_content', nameKey: 'chair_ai_content', slug: 'ai-content' },
      { id: 'ai_agents', nameKey: 'chair_ai_agents', slug: 'ai-agents' },
      { id: 'ethics_gov', nameKey: 'chair_ethics_gov', slug: 'ethics-gov' }
    ]
  },
  {
    id: 'prod_mgmt',
    nameKey: 'dept_prod_mgmt',
    icon: Briefcase,
    chairs: [
      { id: 'pipeline_mgmt', nameKey: 'chair_pipeline_mgmt', slug: 'pipeline-mgmt' },
      { id: 'agile_pm', nameKey: 'chair_agile_pm', slug: 'agile-pm' },
      { id: 'soft_skills', nameKey: 'chair_soft_skills', slug: 'soft-skills' },
      { id: 'career_strat', nameKey: 'chair_career_strat', slug: 'career-strat' }
    ]
  },
  {
    id: 'prep_school',
    nameKey: 'dept_prep_school',
    icon: Target,
    chairs: [
      { id: 'world_hist', nameKey: 'chair_world_hist', slug: 'world-hist' },
      { id: 'az_hist', nameKey: 'chair_az_hist', slug: 'az-hist' },
      { id: 'geography', nameKey: 'chair_geography', slug: 'geography' },
      { id: 'english', nameKey: 'chair_english', slug: 'english' },
      { id: 'russian', nameKey: 'chair_russian', slug: 'russian' },
      { id: 'prep_coding', nameKey: 'chair_prep_coding', slug: 'prep-coding' }
    ]
  }
];
