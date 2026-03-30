import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Zap, DollarSign, Target, Cpu, Boxes } from 'lucide-react';

interface LogEntry {
  id: string;
  type: 'enrollment' | 'payout' | 'verification' | 'system' | 'contract';
  message: string;
  timestamp: string;
  value?: string;
  accent: string;
  icon: any;
}

const ActivityFeed: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const mockActivities = [
    { type: 'enrollment', message: 'New Nexus Sync: User_842', value: 'UE5 NIAGARA', accent: '#378add', icon: Zap },
    { type: 'payout', message: 'Vault Release: Milestone_04', value: '$1,240.00', accent: '#1d9e75', icon: DollarSign },
    { type: 'verification', message: 'Asset Node Verified', value: 'LOD_300', accent: '#7f77dd', icon: Shield },
    { type: 'contract', message: 'Production Pipeline Created', value: 'NEBULA_CGI', accent: '#ef9f27', icon: Boxes },
    { type: 'system', message: 'Global Sync Complete', value: 'v4.0.2', accent: '#ef4444', icon: Cpu }
  ];

  useEffect(() => {
    // Initial logs
    const initialLogs = Array.from({ length: 6 }).map((_, i) => ({
      ...mockActivities[Math.floor(Math.random() * mockActivities.length)],
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(Date.now() - i * 120000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
    setLogs(initialLogs);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newEntry = {
        ...mockActivities[Math.floor(Math.random() * mockActivities.length)],
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setLogs(prev => [newEntry, ...prev.slice(0, 5)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-industrial border border-white/5 rounded-[3.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
        <Activity size={180} />
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 text-white italic">
            <Activity size={24} className="text-primary animate-pulse" /> Platform Telemetry
          </h3>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-mono">Live System Execution Logs</p>
        </div>
      </div>
      
      <div className="space-y-4 relative z-10">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between group/log hover:bg-white/[0.06] transition-all duration-500 overflow-hidden"
            >
              <div className="flex items-center gap-6">
                <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover/log:scale-110 transition-transform duration-500 shadow-xl border border-white/5">
                  <log.icon size={18} style={{ color: log.accent }} className="drop-shadow-[0_0_8px_currentColor]" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-white/80 uppercase tracking-tight group-hover/log:text-white transition-colors">{log.message}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest mt-1 italic" style={{ color: log.accent }}>
                    {log.value}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black font-mono text-white/20">{log.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="pt-4 relative z-10">
        <button className="w-full py-4 glass-premium border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/5 transition-all">
          Protocol Full History
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;
