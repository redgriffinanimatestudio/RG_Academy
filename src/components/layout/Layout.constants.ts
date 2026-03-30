import { 
  Box, Video, UserPlus, Cpu, MessageSquare, Users, GraduationCap, Shield, Target, LayoutDashboard, Zap, DollarSign, LifeBuoy, BarChart3, Binary, Briefcase, ClipboardList, TrendingUp, Landmark, ShieldCheck, HeartPulse
} from 'lucide-react';

export const LANGUAGES = [
  { code: 'eng', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' }
];

export const ACADEMY_CATEGORIES = [
  { name: 'modeling_3d', icon: Box, subcategories: [{ name: 'char_modeling' }, { name: 'env_art' }] },
  { name: 'animation', icon: Video, subcategories: [{ name: 'animation_3d' }, { name: 'animation_2d' }] },
  { name: 'vfx_compositing', icon: Zap, subcategories: [{ name: 'visual_effects' }] }
];

export const STUDIO_CATEGORIES = [
  { name: 'prod_services', icon: Video, subcategories: [{ name: 'anim_prod' }, { name: 'vfx_post' }] },
  { name: 'talent_network', icon: UserPlus, subcategories: [{ name: 'creative_talent' }, { name: 'technical_talent' }] },
  { name: 'studio_solutions', icon: Cpu, subcategories: [{ name: 'infrastructure' }] }
];

export const COMMUNITY_CATEGORIES = [
  { name: 'discussions', icon: MessageSquare, subcategories: [{ name: 'general_chat' }] },
  { name: 'showcase', icon: Users, subcategories: [{ name: 'art_gallery' }] }
];

export const DASHBOARD_MENUS: Record<string, any[]> = {
  student: [{ name: 'learning_dashboard', icon: GraduationCap, subcategories: [{ name: 'my_progress' }, { name: 'my_trajectory' }, { name: 'certifications' }] }],
  admin: [{ name: 'master_control', icon: Shield, subcategories: [{ name: 'ecosystem_stats' }, { name: 'users' }, { name: 'projects' }, { name: 'financial_hub' }, { name: 'reports' }] }],
  chief_manager: [{ name: 'strategic_hub', icon: Target, subcategories: [{ name: 'operational_overview' }, { name: 'fleet_stats' }, { name: 'macro_reports' }] }],
  manager: [{ name: 'operational_hub', icon: LayoutDashboard, subcategories: [{ name: 'academy_ops' }, { name: 'studio_ops' }, { name: 'content_review' }, { name: 'moderation' }] }],
  hr: [{ name: 'talent_management', icon: UserPlus, subcategories: [{ name: 'talent_matrix' }, { name: 'recruitment_pipeline' }, { name: 'identity_verification' }] }],
  finance: [{ name: 'treasury_control', icon: DollarSign, subcategories: [{ name: 'cash_flow' }, { name: 'escrow_management' }, { name: 'payout_logic' }, { name: 'financial_hub' }] }],
  support: [{ name: 'user_assistance', icon: LifeBuoy, subcategories: [{ name: 'active_tickets' }, { name: 'queue_management' }, { name: 'issue_resolution' }] }],
  lecturer: [{ name: 'instructor_node', icon: Video, subcategories: [{ name: 'my_courses' }, { name: 'student_stats' }, { name: 'curriculum_builder' }, { name: 'lecturer_wallet' }] }],
  client: [{ name: 'project_control', icon: Box, subcategories: [{ name: 'active_briefs' }, { name: 'billing_history' }, { name: 'financial_hub' }] }],
  executor: [{ name: 'freelance_node', icon: Zap, subcategories: [{ name: 'active_contracts' }, { name: 'portfolio_export' }, { name: 'earnings_hub' }, { name: 'financial_hub' }] }]
};
