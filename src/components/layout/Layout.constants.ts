import { 
  Box, Video, UserPlus, Cpu, MessageSquare, Users, GraduationCap, Shield, Target, LayoutDashboard, Zap, DollarSign, LifeBuoy, BarChart3, Binary, Briefcase, ClipboardList, TrendingUp, Landmark, ShieldCheck, HeartPulse, Terminal, Key, Activity, Settings, Database, Filter, Globe, Layers, Lock, Monitor, Share2, Smartphone
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
  student: [{ 
    name: 'student_learning_dashboard', 
    icon: GraduationCap, 
    subcategories: [
      { name: 'learning_nexus' }, 
      { name: 'career_trajectory' }, 
      { name: 'certificate_vault' }, 
      { name: 'ai_mentor_node' },
      { name: 'workshop_archive' }
    ] 
  }],
  admin: [{ 
    name: 'master_control', 
    icon: Shield, 
    subcategories: [
      { name: 'platform_telemetry' }, 
      { name: 'user_directory' }, 
      { name: 'global_projects' }, 
      { name: 'financial_ledger' }, 
      { name: 'system_logs' },
      { name: 'security_matrix' }
    ] 
  }],
  chief_manager: [{ 
    name: 'strategic_hub', 
    icon: Target, 
    subcategories: [
      { name: 'ecosystem_overview' }, 
      { name: 'fleet_analytics' }, 
      { name: 'macro_forecasting' },
      { name: 'governance_node' }
    ] 
  }],
  manager: [{ 
    name: 'operational_hub', 
    icon: LayoutDashboard, 
    subcategories: [
      { name: 'academy_operations' }, 
      { name: 'studio_pipeline' }, 
      { name: 'content_oversight' }, 
      { name: 'moderation_matrix' },
      { name: 'deployment_tracker' }
    ] 
  }],
  hr: [{ 
    name: 'hr_talent_management', 
    icon: UserPlus, 
    subcategories: [
      { name: 'talent_matrix' }, 
      { name: 'recruitment_pipeline' }, 
      { name: 'identity_verification' }, 
      { name: 'performance_nodes' },
      { name: 'payroll_sync' }
    ] 
  }],
  finance: [{ 
    name: 'finance_treasury_control', 
    icon: DollarSign, 
    subcategories: [
      { name: 'treasury_hub' }, 
      { name: 'escrow_vaults' }, 
      { name: 'payout_logics' }, 
      { name: 'cash_flow_matrix' },
      { name: 'tax_compliance' }
    ] 
  }],
  support: [{ 
    name: 'support_user_assistance', 
    icon: LifeBuoy, 
    subcategories: [
      { name: 'ticket_matrix' }, 
      { name: 'queue_management' }, 
      { name: 'resolution_node' }, 
      { name: 'system_health' },
      { name: 'feedback_loop' }
    ] 
  }],
  lecturer: [{ 
    name: 'lecturer_instructor_node', 
    icon: Video, 
    subcategories: [
      { name: 'curriculum_builder' }, 
      { name: 'student_insights' }, 
      { name: 'revenue_matrix' }, 
      { name: 'live_stream_uplink' },
      { name: 'feedback_nexus' }
    ] 
  }],
  client: [{ 
    name: 'client_project_control', 
    icon: Box, 
    subcategories: [
      { name: 'active_briefs' }, 
      { name: 'billing_node' }, 
      { name: 'escrow_tracking' },
      { name: 'project_archive' }
    ] 
  }],
  executor: [{ 
    name: 'executor_freelance_node', 
    icon: Zap, 
    subcategories: [
      { name: 'active_contracts' }, 
      { name: 'portfolio_nexus' }, 
      { name: 'earnings_ledger' }, 
      { name: 'skill_verification' },
      { name: 'node_settings' }
    ] 
  }],
  agency: [{
    name: 'agency_management_hub',
    icon: Briefcase,
    subcategories: [
      { name: 'talent_roster' },
      { name: 'agency_projects' },
      { name: 'financial_bridge' },
      { name: 'sub_agent_nodes' }
    ]
  }]
};

// --- SUPERADMIN MASTER HUB ---
export const SUPERADMIN_HUB = [
  { name: 'superadmin_hub', icon: ShieldCheck, subcategories: [
    { name: 'master_control', icon: Terminal, role: 'admin' },
    { name: 'hr_talent_management', icon: UserPlus, role: 'hr' },
    { name: 'finance_treasury_control', icon: DollarSign, role: 'finance' },
    { name: 'student_learning_dashboard', icon: GraduationCap, role: 'student' },
    { name: 'lecturer_instructor_node', icon: Video, role: 'lecturer' },
    { name: 'strategic_hub', icon: Target, role: 'chief_manager' },
    { name: 'operational_hub', icon: LayoutDashboard, role: 'manager' },
    { name: 'client_project_control', icon: Box, role: 'client' },
    { name: 'executor_freelance_node', icon: Zap, role: 'executor' },
    { name: 'support_user_assistance', icon: LifeBuoy, role: 'support' },
    { name: 'agency_hub', icon: Briefcase, role: 'agency' }
  ]}
];

// --- ROLE PERSPECTIVES (Universal Hubs) ---
export const PERSPECTIVES = [
  { id: 'admin', icon: Shield, label: 'Master Admin', color: '#ef4444' },
  { id: 'hr', icon: UserPlus, label: 'HR Talent', color: '#378add' },
  { id: 'finance', icon: DollarSign, label: 'Treasury', color: '#1d9e75' },
  { id: 'support', icon: LifeBuoy, label: 'User Support', color: '#7f77dd' },
  { id: 'lecturer', icon: Video, label: 'Instructor', color: '#1d9e75' },
  { id: 'client', icon: Box, label: 'Client Node', color: '#ef9f27' },
  { id: 'executor', icon: Zap, label: 'Freelance Node', color: '#e24b4a' },
  { id: 'student', icon: GraduationCap, label: 'Student Nexus', color: '#378add' },
  { id: 'chief_manager', icon: Target, label: 'Strategic Hub', color: '#7f77dd' },
  { id: 'manager', icon: LayoutDashboard, label: 'Operations', color: '#1d9e75' },
  { id: 'agency', icon: Briefcase, label: 'Agency Hub', color: '#9333ea' }
];

