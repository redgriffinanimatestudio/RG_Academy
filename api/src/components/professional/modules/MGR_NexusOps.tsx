import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Cpu, 
  Activity, 
  Database, 
  Globe, 
  Server, 
  AlertTriangle,
  RefreshCw,
  Search,
  Settings
} from 'lucide-react';

const MGR_NexusOps: React.FC = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/v1/system/health');
        const result = await response.json();
        if (result.success) setMetrics(result.data);
      } catch (e) {
        console.error('Failed to fetch system metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  const NODES = [
    { id: 'master-01', region: 'Asia-Pacific', status: 'online', load: 42, sync: '100%' },
    { id: 'node-eu-02', region: 'Europe', status: 'online', load: 28, sync: '100%' },
    { id: 'node-us-05', region: 'Americas', status: 'warning', load: 88, sync: '94%' },
    { id: 'backup-01', region: 'Global', status: 'standby', load: 5, sync: '100%' }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-12">
      {/* SYSTEM HEALTH OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Cluster Sync', value: '100%', icon: Database, color: 'text-emerald-400' },
          { label: 'Network Load', value: '34ms', icon: Globe, color: 'text-sky-400' },
          { label: 'Threat Status', value: 'Nominal', icon: Shield, color: 'text-amber-400' }
        ].map((stat, i) => (
          <motion.div key={i} variants={item} className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon size={56} />
            </div>
            <div className="relative z-10 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
              <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3>
            </div>
            <div className="absolute bottom-4 left-8 right-8 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full bg-current opacity-20 ${stat.color}`} style={{ width: '70%' }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* REGIONAL NODES GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
             <div className="size-10 rounded-xl bg-sky-400/10 flex items-center justify-center text-sky-400 border border-sky-400/20 shadow-xl shadow-sky-400/5">
                <Server size={20} />
             </div>
             <div>
                <h2 className="text-lg font-black uppercase tracking-widest text-white">Managed Nodes</h2>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Status: Identity Sync Node Active</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all"><RefreshCw size={16} /></button>
             <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all"><Search size={16} /></button>
             <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all"><Settings size={16} /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {NODES.map((node) => (
            <motion.div 
              key={node.id}
              variants={item}
              className={`p-6 rounded-3xl border transition-all relative overflow-hidden group bg-gradient-to-b from-white/[0.03] to-transparent ${
                node.status === 'online' ? 'border-emerald-500/10 hover:border-emerald-500/40' : 
                node.status === 'warning' ? 'border-amber-500/10 hover:border-amber-500/40 animate-pulse' : 
                'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{node.region}</span>
                    <span className="text-sm font-black text-white">{node.id}</span>
                  </div>
                  <div className={`size-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
                    node.status === 'online' ? 'bg-emerald-500 shadow-emerald-500/50' : 
                    node.status === 'warning' ? 'bg-amber-500 shadow-amber-500/50' : 
                    'bg-white/20'
                  }`} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest">
                    <span className="text-white/40 uppercase">Load</span>
                    <span className={node.load > 80 ? 'text-amber-500' : 'text-emerald-500'}>{node.load}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${node.load}%` }} 
                      className={`h-full ${node.load > 80 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-[9px] font-black uppercase tracking-widest text-white/30">
                   <Activity size={12} /> Sync Status: {node.sync}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RECENT SYSTEM AUDIT LOG */}
      <section className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-white/5" />
          Cluster Audit Log
          <div className="h-[1px] flex-1 bg-white/5" />
        </h4>
        <div className="p-2 space-y-1">
          {[
            { msg: 'Identity Handshake: ASIA-HUB -> MASTER', time: '02s ago', type: 'system' },
            { msg: 'High CPU Load on AMERICAS-NODE-05', time: '05s ago', type: 'warning' },
            { msg: 'Auth Token Revoked: [UID: 2bc...9a1]', time: '14s ago', type: 'security' },
            { msg: 'Scheduled Backup initiated', time: '01m ago', type: 'system' }
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] transition-colors group cursor-default">
              <div className="flex items-center gap-4">
                 <div className={`size-1.5 rounded-full ${
                    log.type === 'warning' ? 'bg-amber-500 animate-pulse' : 
                    log.type === 'security' ? 'bg-red-500' : 'bg-primary'
                 }`} />
                 <span className="text-[10px] font-bold text-white/60 tracking-widest group-hover:text-white transition-colors uppercase">{log.msg}</span>
              </div>
              <span className="text-[9px] font-black uppercase text-white/20">{log.time}</span>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default MGR_NexusOps;
