import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Layout, 
  Shield, 
  BarChart3, 
  Settings, 
  DollarSign, 
  Search, 
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Lock,
  Eye,
  FileText,
  Zap,
  Globe,
  Bell,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { adminService, Permission } from '../services/adminService';
import { userService, UserProfile } from '../services/userService';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

type AdminModule = 'dashboard' | 'users' | 'profile' | 'create' | 'detail' | 'chat' | 'settings';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeModule, setActiveModule] = useState<AdminModule>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      userService.getProfile(user.uid).then(setUserProfile);
    }
  }, [user]);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00f5d4]" /></div>;
  if (!user || (userProfile && !adminService.isAdmin(userProfile.roles))) return <Navigate to={`/${lang || 'eng'}`} />;

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout, color: '#00f5d4' },
    { type: 'section', label: 'Пользователи' },
    { id: 'users', label: 'Все пользователи', icon: Users, color: '#378add', badge: '4821' },
    { id: 'profile', label: 'Профиль', icon: Shield, color: '#7f77dd' },
    { type: 'section', label: 'Контент' },
    { id: 'create', label: 'Создать / редакт.', icon: Plus, color: '#1d9e75' },
    { id: 'detail', label: 'Детальная страница', icon: FileText, color: '#ef9f27' },
    { type: 'section', label: 'Коммуникации' },
    { id: 'chat', label: 'Чат / сообщения', icon: Bell, color: '#1d9e75', badge: '3' },
    { type: 'section', label: 'Система' },
    { id: 'settings', label: 'Настройки', icon: Settings, color: '#555' },
  ];

  const metrics = [
    { label: 'Пользователи', value: '4 821', change: '+134 за неделю', trend: 'up', color: '#00f5d4', progress: 72 },
    { label: 'Курсов опубл.', value: '312', change: '+18 за месяц', trend: 'up', color: '#378add', progress: 60 },
    { label: 'Открытых проектов', value: '87', change: '−5 vs пред. нед.', trend: 'down', color: '#ef9f27', progress: 40 },
    { label: 'Доход (месяц)', value: '$24 180', change: '+12%', trend: 'up', color: '#1d9e75', progress: 82 },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#e8e6df] font-sans selection:bg-[#00f5d4]/30">
      {/* SIDEBAR */}
      <aside className="w-[240px] bg-[#111] border-r border-[#2a2a2a] flex flex-col sticky top-0 h-screen z-50">
        <div className="p-6 border-b border-[#2a2a2a] flex items-center gap-3">
          <div className="size-8 bg-[#00f5d4] rounded-lg flex items-center justify-center font-bold text-[#050505] tracking-tighter">RG</div>
          <div>
            <div className="text-sm font-bold tracking-tight">Red Griffin</div>
            <div className="text-[9px] font-black text-[#00f5d4] uppercase tracking-widest leading-none mt-1">Admin Panel</div>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item, idx) => {
            if (item.type === 'section') {
              return (
                <div key={idx} className="px-6 pt-6 pb-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">
                  {item.label}
                </div>
              );
            }
            const Icon = item.icon as any;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as AdminModule)}
                className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs font-medium transition-all relative group ${
                  isActive ? 'text-[#00f5d4] bg-[#00f5d4]/5' : 'text-[#888] hover:text-[#e8e6df] hover:bg-white/5'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#00f5d4]" />}
                <div className="size-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="flex-1 text-left uppercase tracking-widest text-[10px] font-black">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500/10 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#2a2a2a] flex items-center gap-3 bg-black/20">
          <div className="size-8 rounded-full bg-red-500/10 flex items-center justify-center text-[10px] font-black text-red-500">
            {user?.displayName?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold truncate">{user?.displayName || 'Admin'}</div>
            <div className="text-[9px] text-[#555] truncate font-black uppercase tracking-widest">{user?.email}</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOPBAR */}
        <header className="h-16 bg-[#111] border-b border-[#2a2a2a] flex items-center justify-between px-8 shrink-0">
          <div className="flex flex-col">
            <div className="text-sm font-bold uppercase tracking-tight">{activeModule}</div>
            <div className="text-[9px] text-[#555] font-black uppercase tracking-widest">Red Griffin / {activeModule === 'dashboard' ? 'Overview' : activeModule}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative size-8 border border-[#333] rounded-lg flex items-center justify-center text-[#888] hover:text-[#00f5d4] cursor-pointer transition-colors">
              <Bell size={14} />
              <div className="absolute top-1.5 right-1.5 size-1.5 bg-red-500 rounded-full border border-[#111]" />
            </div>
            <button className="h-8 px-4 border border-[#333] rounded-lg text-[10px] font-black uppercase tracking-widest text-[#888] hover:border-[#00f5d4] hover:text-[#00f5d4] transition-all">
              + Создать
            </button>
            <button 
              onClick={() => setActiveModule('users')}
              className="h-8 px-4 bg-[#00f5d4] text-[#050505] rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
            >
              Пользователи
            </button>
          </div>
        </header>

        {/* CONTENT SCREEN */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[#0a0a0a]">
          <AnimatePresence mode="wait">
            {activeModule === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* METRICS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {metrics.map((m, i) => (
                    <div key={i} className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-5 space-y-4">
                      <div className="text-[9px] font-black text-[#555] uppercase tracking-widest">{m.label}</div>
                      <div className="text-3xl font-black tracking-tighter">{m.value}</div>
                      <div className={`text-[10px] font-bold flex items-center gap-1 ${m.trend === 'up' ? 'text-[#1d9e75]' : 'text-red-500'}`}>
                        {m.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {m.change}
                      </div>
                      <div className="h-1 bg-[#222] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${m.progress}%`, background: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* ROLES CHART */}
                  <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-[11px] font-black uppercase tracking-widest">Распределение ролей</div>
                      <button onClick={() => setActiveModule('users')} className="text-[9px] font-black text-[#00f5d4] uppercase tracking-widest hover:underline">Все →</button>
                    </div>
                    <div className="space-y-5">
                      {[
                        { label: 'Student', val: 3760, max: 4821, color: '#378add' },
                        { label: 'Lecturer', val: 580, max: 4821, color: '#1d9e75' },
                        { label: 'Client', val: 340, max: 4821, color: '#ef9f27' },
                        { label: 'Executor', val: 117, max: 4821, color: '#e24b4a' },
                        { label: 'Staff', val: 24, max: 4821, color: '#7f77dd' },
                      ].map((r, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-[#888]">{r.label}</span>
                            <span>{r.val}</span>
                          </div>
                          <div className="h-1.5 bg-[#222] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(r.val / r.max) * 100}%`, background: r.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AUDIT LOG */}
                  <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-[11px] font-black uppercase tracking-widest">Аудит лог</div>
                      <button className="text-[9px] font-black text-[#00f5d4] uppercase tracking-widest hover:underline">Весь лог →</button>
                    </div>
                    <div className="space-y-1">
                      {[
                        { time: '14:32', icon: 'R', color: '#378add', bg: 'rgba(55,138,221,.12)', title: 'alex@gmail.com → роль lecturer', desc: 'Изменение роли администратором' },
                        { time: '14:18', icon: 'C', color: '#1d9e75', bg: 'rgba(29,158,117,.12)', title: 'Курс «Maya Rigging» опубликован', desc: 'Лектор: Sara R.' },
                        { time: '13:55', icon: 'B', color: '#e24b4a', bg: 'rgba(226,75,74,.12)', title: 'spam_user_042 заблокирован', desc: 'Модератор: Anna L.' },
                        { time: '12:11', icon: '$', color: '#ef9f27', bg: 'rgba(239,159,39,.12)', title: 'Контракт #CTR-441 создан', desc: '$4 800 · Nebula Games' },
                      ].map((log, i) => (
                        <div key={i} className="flex gap-4 py-3 border-b border-[#2a2a2a] last:border-0">
                          <div className="text-[10px] font-black text-[#555] pt-1">{log.time}</div>
                          <div className="size-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: log.bg, color: log.color }}>{log.icon}</div>
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold truncate">{log.title}</div>
                            <div className="text-[9px] text-[#555] font-black uppercase tracking-widest truncate">{log.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RECENT USERS TABLE */}
                <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                    <div className="text-[11px] font-black uppercase tracking-widest">Последние регистрации</div>
                    <button onClick={() => setActiveModule('users')} className="text-[9px] font-black text-[#00f5d4] uppercase tracking-widest hover:underline">Все пользователи →</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black/20">
                          <th className="px-6 py-4 text-[9px] font-black text-[#555] uppercase tracking-widest">Пользователь</th>
                          <th className="px-6 py-4 text-[9px] font-black text-[#555] uppercase tracking-widest">Email</th>
                          <th className="px-6 py-4 text-[9px] font-black text-[#555] uppercase tracking-widest">Роль</th>
                          <th className="px-6 py-4 text-[9px] font-black text-[#555] uppercase tracking-widest">Статус</th>
                          <th className="px-6 py-4 text-[9px] font-black text-[#555] uppercase tracking-widest">Дата</th>
                          <th className="px-6 py-4 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2a2a2a]">
                        {[
                          { name: 'Alex Kim', init: 'AK', email: 'alex@gmail.com', role: 'lecturer', roleColor: '#378add', status: 'активен', date: '22 мар 2026' },
                          { name: 'Sara R.', init: 'SR', email: 'sara@mail.ru', role: 'student', roleColor: '#888', status: 'активен', date: '21 мар 2026' },
                          { name: 'John D.', init: 'JD', email: 'john@studio.io', role: 'executor', roleColor: '#ef9f27', status: 'заблокирован', date: '20 мар 2026' },
                        ].map((u, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full flex items-center justify-center text-[10px] font-black" style={{ background: `${u.roleColor}20`, color: u.roleColor }}>{u.init}</div>
                                <div className="text-xs font-bold">{u.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-[#888] font-medium">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest" style={{ background: `${u.roleColor}15`, color: u.roleColor }}>{u.role}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className={`size-1.5 rounded-full ${u.status === 'активен' ? 'bg-[#1d9e75]' : 'bg-[#e24b4a]'}`} />
                                <span className={`text-[10px] font-bold ${u.status === 'активен' ? 'text-[#1d9e75]' : 'text-[#e24b4a]'}`}>{u.status}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[10px] text-[#555] font-black uppercase tracking-widest">{u.date}</td>
                            <td className="px-6 py-4 text-right">
                              <button className="h-7 px-3 border border-[#333] rounded-md text-[9px] font-black uppercase tracking-widest text-[#888] hover:border-[#00f5d4] hover:text-[#00f5d4] transition-all">Открыть</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other modules (Users, Settings, etc.) would be implemented here following the same design language */}
            {activeModule !== 'dashboard' && (
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full py-20 opacity-20"
              >
                {sidebarItems.find(i => i.id === activeModule)?.icon && (
                  React.createElement(sidebarItems.find(i => i.id === activeModule)!.icon as any, { size: 64 })
                )}
                <div className="text-[12px] font-black uppercase tracking-[0.5em] mt-6">
                  {activeModule} View Initializing...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
