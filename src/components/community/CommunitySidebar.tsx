import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Shield } from 'lucide-react';

interface Alert {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  timestamp: Date;
}

interface CommunitySidebarProps {
  followingCount: number;
  followersCount: number;
  alerts: Alert[];
}

export default function CommunitySidebar({ followingCount, followersCount, alerts }: CommunitySidebarProps) {
  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'error': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'system': return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
      default: return 'bg-sky-500/10 border-sky-500/20 text-sky-400';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      case 'system': return <Shield className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 space-y-6 sticky top-32">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Your Network</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <div className="text-2xl font-black text-white">{followingCount}</div>
            <div className="text-[8px] font-black uppercase tracking-widest text-white/20">Following</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <div className="text-2xl font-black text-white">{followersCount}</div>
            <div className="text-[8px] font-black uppercase tracking-widest text-white/20">Followers</div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4 flex items-center gap-2">
            <Bell size={12} />
            Recent Alerts
          </h3>
          <AnimatePresence initial={false}>
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-4 rounded-2xl border mb-3 last:mb-0 ${getAlertStyles(alert.type)}`}
              >
                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div>
                    <h4 className="font-bold text-[10px] uppercase leading-tight mb-1">{alert.title}</h4>
                    <p className="text-[10px] opacity-80 leading-snug">{alert.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
