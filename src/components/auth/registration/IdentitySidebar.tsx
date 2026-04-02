import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Zap, 
  Settings, 
  Shield, 
  Share2 
} from 'lucide-react';

interface IdentitySidebarProps {
  role: string;
  step: number;
}

const IdentitySidebar: React.FC<IdentitySidebarProps> = ({ role, step }) => {
  const { t } = useTranslation();
  
  const roleThemes: Record<string, { color: string; icon: any; title: string; lineage: string[] }> = {
    user: { color: "#6366f1", icon: <User />, title: "Node: User", lineage: ["User"] },
    student: { color: "#ec4899", icon: <GraduationCap />, title: "Academy Path", lineage: ["User", "Student"] },
    client: { color: "#3b82f6", icon: <Briefcase />, title: "Studio Path", lineage: ["User", "Client"] },
    community: { color: "#10b981", icon: <Users />, title: "Community", lineage: ["User", "Community"] },
    artist: { color: "#ec4899", icon: <Zap />, title: "Artist/VFX", lineage: ["User", "Student", "Artist"] },
    engineer: { color: "#ec4899", icon: <Settings />, title: "Engineer", lineage: ["User", "Student", "Engineer"] },
    manager: { color: "#3b82f6", icon: <Shield />, title: "Manager", lineage: ["User", "Client", "Manager"] },
    client_ceo: { color: "#3b82f6", icon: <Briefcase />, title: "Client/CEO", lineage: ["User", "Client", "CEO"] },
    executor: { color: "#ef4444", icon: <Shield />, title: "Pro Specialist", lineage: ["User", "Student", "Artist", "Executor"] },
    partner: { color: "#fbbf24", icon: <Briefcase />, title: "Agency Partner", lineage: ["User", "Client", "Partner"] },
    moderator: { color: "#10b981", icon: <Shield />, title: "Moderator", lineage: ["User", "Community", "Moderator"] }
  };

  const theme = roleThemes[role] || roleThemes.user;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:flex flex-col w-64 border-r border-white/5 pr-8 space-y-8"
    >
      <div className="space-y-4">
        <div 
          className="size-20 rounded-[2.2rem] bg-[#0a0a0a] border-2 flex items-center justify-center shadow-2xl relative group"
          style={{ 
            borderColor: theme.color,
            boxShadow: `0 0 40px ${theme.color}30`
          }}
        >
          <div className="absolute inset-0 rounded-[2.2rem] animate-pulse opacity-20" style={{ backgroundColor: theme.color }} />
          <div style={{ color: theme.color }} className="relative z-10">
            {React.cloneElement(theme.icon as React.ReactElement, { size: 32 })}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-white italic">{theme.title}</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Neural ID Locked</p>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 opacity-40">
          <Share2 size={12} className="text-white" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Identity Shard</span>
        </div>
        
        <div className="relative pl-4 space-y-6">
          <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-white/10" />
          {theme.lineage.map((item, i) => (
            <div key={item} className="relative flex items-center gap-4">
              <div className={`absolute left-[-16px] size-2 rounded-full border border-white/20 ${i === theme.lineage.length - 1 ? 'bg-white shadow-[0_0_10px_white]' : 'bg-[#0a0a0a]'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${i === theme.lineage.length - 1 ? 'text-white' : 'text-white/20'}`}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-8">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">Step Progression</span>
            <span className="text-[8px] font-black text-white">{step}/5</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 5) * 100}%` }}
              className="h-full bg-white shadow-[0_0_10px_white]"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IdentitySidebar;
