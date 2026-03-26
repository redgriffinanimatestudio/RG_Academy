import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Users, Clock, Zap, Shield, 
  Play, Award, Star, Video, CreditCard, 
  MessageSquare, Settings, Globe, Layers, 
  Box, Briefcase, Filter, Search, MoreVertical
} from 'lucide-react';

// --- MANAGER DASHBOARD CONTENT ---

export function ManagerDashboardContent({ activeModule, theme }: any) {
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
        {activeModule === 'overview' && <ManagerOverview theme={theme} />}
        {activeModule === 'courses' && <CoursesOverview theme={theme} />}
        {activeModule === 'projects' && <ProjectsOverview theme={theme} />}
        
        {!['overview', 'courses', 'projects'].includes(activeModule) && (
          <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <Briefcase size={64} className="mb-6" style={{ color: theme.accent }} />
            <h2 className="text-xl font-black uppercase tracking-[0.5em]">{activeModule.replace(/_/g, ' ')} Module</h2>
            <p className="text-xs mt-2 uppercase tracking-widest">Operations Node Operational</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// --- SUB-COMPONENTS ---

function ManagerOverview({ theme }: any) {
  const metrics = [
    { label: 'На публикацию', value: '7', sub: 'курсов ожидают', icon: Video, color: '#ef9f27' },
    { label: 'Открытых проектов', value: '87', sub: '↑ +12 за неделю', icon: Box, color: theme.accent },
    { label: 'Активных контрактов', value: '34', sub: '$148k суммарно', icon: Briefcase, color: '#378add' },
    { label: 'Жалоб на отзывы', value: '3', sub: 'требуют решения', icon: MessageSquare, color: '#e24b4a' },
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
            <Video size={20} style={{ color: theme.accent }} /> Courses Pending Review
          </h3>
          <div className="space-y-4">
            {[
              { title: 'Houdini FX Vol.2', author: 'S. Chen', lessons: 12, c: '#378add' },
              { title: 'ZBrush Creatures', author: 'D. Miller', lessons: 9, c: '#1d9e75' },
              { title: 'UE5 Lighting', author: 'E. Vance', lessons: 8, c: '#ef9f27' },
              { title: 'Maya Rigging Pro', author: 'A. Rivera', lessons: 15, c: '#e24b4a' }
            ].map((c, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                <div>
                  <div className="text-xs font-bold text-white uppercase">{c.title}</div>
                  <div className="text-[9px] text-white/20 font-black uppercase mt-1">{c.author} · {c.lessons} Lessons</div>
                </div>
                <button className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase rounded-lg tracking-widest hover:bg-primary hover:text-bg-dark transition-all">Review</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <Activity size={20} style={{ color: theme.accent }} /> Platform Activity
          </h3>
          <div className="space-y-6">
            {[
              { label: 'Новых юзеров', val: 134, p: 70, c: theme.accent },
              { label: 'Записей на курс', val: 320, p: 85, c: '#378add' },
              { label: 'Новых проектов', val: 12, p: 40, c: '#7f77dd' },
              { label: 'Жалоб', val: 3, p: 8, c: '#e24b4a' }
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
          </div>
        </div>
      </div>
    </div>
  );
}

function CoursesOverview({ theme }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6">
      <Video size={48} className="mx-auto text-white/10" />
      <h3 className="text-xl font-black uppercase tracking-tight text-white/20">Course Management Hub</h3>
      <p className="text-[10px] text-white/10 font-black uppercase tracking-widest">312 Published · 7 Pending · 28 Archived</p>
      <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Open Academy Registry</button>
    </div>
  );
}

function ProjectsOverview({ theme }: any) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6">
      <Box size={48} className="mx-auto text-white/10" />
      <h3 className="text-xl font-black uppercase tracking-tight text-white/20">Studio Projects Hub</h3>
      <p className="text-[10px] text-white/10 font-black uppercase tracking-widest">87 Open · 34 Active · 143 Completed</p>
      <button className="px-8 py-3 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest">Open Studio Manager</button>
    </div>
  );
}

import { Activity } from 'lucide-react';

// --- MAIN PAGE COMPONENT ---

export default function ManagerDashboard() {
  return (
    <div className="p-8">
      <ManagerDashboardContent activeModule="overview" theme={{ accent: '#1d9e75' }} />
    </div>
  );
}
