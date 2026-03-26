import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, Clock, Zap, Shield, 
  BarChart3, PieChart, Briefcase, DollarSign, 
  CheckCircle, AlertCircle, MessageSquare, 
  Settings, UserCheck, Star, Target, Rocket
} from 'lucide-react';

// --- CHIEF MANAGER DASHBOARD CONTENT ---

export function ChiefManagerDashboardContent({ activeModule, theme }: any) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeModule}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {activeModule === 'overview' && <StrategyOverview theme={theme} />}
        {activeModule === 'staff' && <StaffOverview theme={theme} />}
        {activeModule === 'contracts' && <ContractsOverview theme={theme} />}
        
        {!['overview', 'staff', 'contracts'].includes(activeModule) && (
          <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <Target size={64} className="mb-6" style={{ color: theme.accent }} />
            <h2 className="text-xl font-black uppercase tracking-[0.5em]">{activeModule.replace(/_/g, ' ')} Module</h2>
            <p className="text-xs mt-2 uppercase tracking-widest">Strategy Hub Operational</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// --- SUB-COMPONENTS ---

function StrategyOverview({ theme }: any) {
  const metrics = [
    { label: 'Выручка (квартал)', value: '$72,440', sub: '↑ +18% vs Q4 2025', icon: DollarSign, color: theme.accent },
    { label: 'NPS платформы', value: '74', sub: '↑ +6 pts за квартал', icon: Star, color: '#1d9e75' },
    { label: 'Retention (30d)', value: '68%', sub: '↓ −4% vs пред. мес.', icon: Clock, color: '#ef9f27' },
    { label: 'Staff активных', value: '24', sub: '3 вакансии открыты', icon: Users, color: '#378add' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-[#111] border border-white/5 rounded-3xl p-6 space-y-4 group hover:border-white/10 transition-all shadow-2xl">
            <div className="flex justify-between items-start">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">{m.label}</div>
              <m.icon size={18} style={{ color: m.color }} className="opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-black text-white tracking-tighter">{m.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: m.color }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <BarChart3 size={20} style={{ color: theme.accent }} /> KPI по отделам
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Academy — курсов опубл.', val: '312', trend: '↑ +18', c: '#378add' },
              { label: 'Studio — проектов закрыто', val: '143', trend: '↑ +22', c: '#1d9e75' },
              { label: 'Support — SLA <24h', val: '91%', trend: '↑ +3%', c: '#ef9f27' },
              { label: 'Finance — просроч. выплат', val: '4', trend: '↑ +4', c: '#e24b4a' }
            ].map((k, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                <div className="text-xs font-bold text-white/60 uppercase">{k.label}</div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-black text-white">{k.val}</div>
                  <div className="text-[10px] font-black uppercase" style={{ color: k.c }}>{k.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <PieChart size={20} style={{ color: theme.accent }} /> Доход по направлениям
          </h3>
          <div className="space-y-6">
            {[
              { label: 'Academy', val: '$46k', p: 64, c: theme.accent },
              { label: 'Studio', val: '$25k', p: 35, c: '#378add' },
              { label: 'Services', val: '$12k', p: 18, c: '#1d9e75' }
            ].map((r, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/40">{r.label}</span>
                  <span className="text-white">{r.val}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${r.p}%` }} className="h-full" style={{ background: r.c }} />
                </div>
              </div>
            ))}
            <div className="pt-6 border-top border-white/5">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                <span className="text-white/20">Цель квартала</span>
                <span style={{ color: theme.accent }}>$72,440 / $80,000</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '90.5%' }} className="h-full" style={{ background: theme.accent }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffOverview({ theme }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6">
      <UserCheck size={48} className="mx-auto text-white/10" />
      <h3 className="text-xl font-black uppercase tracking-tight text-white/20">Staff Performance Directory</h3>
      <p className="text-[10px] text-white/10 font-black uppercase tracking-widest">24 Active Personnel · 5 Departments · 94% Avg SLA</p>
      <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Open Team Registry</button>
    </div>
  );
}

function ContractsOverview({ theme }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6">
      <Briefcase size={48} className="mx-auto text-white/10" />
      <h3 className="text-xl font-black uppercase tracking-tight text-white/20">High-Value Contracts</h3>
      <p className="text-[10px] text-white/10 font-black uppercase tracking-widest">12 Active Contracts · $148k Total Value</p>
      <button className="px-8 py-3 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest">Audit Pipeline</button>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function ChiefManagerDashboard() {
  return (
    <div className="p-8">
      <ChiefManagerDashboardContent activeModule="overview" theme={{ accent: '#7f77dd' }} />
    </div>
  );
}
