import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Layout, 
  Shield, 
  Settings, 
  Plus,
  FileText,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Search,
  Filter,
  MoreVertical,
  Cpu,
  Zap,
  Briefcase,
  Box,
  Video,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Globe,
  Star,
  Clock,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Lock,
  MessageSquare,
  Send,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  XCircle,
  Database,
  Cloud,
  HardDrive,
  TrendingUp,
  PieChart,
  Target,
  Rocket,
  Scale,
  Award,
  CreditCard,
  Flag,
  CheckCircle,
  Eye,
  AlertTriangle,
  LifeBuoy,
  FileSearch,
  UserPlus,
  Ticket,
  ShieldAlert
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { userService, UserProfile } from '../services/userService';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAuth } from '../context/AuthContext';

export function AdminDashboardContent({ activeModule, theme, user }: any) {
  const currentTheme = theme || {
    accent: '#00f5d4',
    blue: '#378add',
    green: '#1d9e75',
    amber: '#ef9f27',
    red: '#e24b4a',
    purple: '#7f77dd'
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeModule}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="flex-1 w-full"
      >
        {activeModule === 'dashboard' && <AdminOverview theme={currentTheme} />}
        {activeModule === 'users' && <UsersList theme={currentTheme} />}
        {activeModule === 'profile' && <UserProfileView theme={currentTheme} />}
        {activeModule === 'create' && <EditUserView theme={currentTheme} />}
        {activeModule === 'detail' && <UserDetailsView theme={currentTheme} />}
        {activeModule === 'chat' && <AdminChat theme={currentTheme} />}
        {activeModule === 'settings' && <AdminSettings theme={currentTheme} />}
        {activeModule === 'rbac' && <AdminRBACMatrix theme={currentTheme} />}
        
        {!['dashboard', 'users', 'profile', 'create', 'detail', 'chat', 'settings', 'rbac'].includes(activeModule) && (
          <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <ShieldAlert size={64} className="mb-6" style={{ color: currentTheme.accent }} />
            <h2 className="text-xl font-black uppercase tracking-[0.5em]">Module Initializing...</h2>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminDashboard() {
  const { lang } = useParams();
  const { user, profile, activeRole, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModule = searchParams.get('view') || 'dashboard';
  const navigate = useNavigate();

  const theme = {
    bg: '#0a0a0a',
    bg2: '#111',
    bg3: '#181818',
    bg4: '#222',
    accent: '#00f5d4',
    accent2: '#00c4aa',
    border: '#2a2a2a',
    border2: '#333',
    text: '#e8e6df',
    text2: '#888',
    text3: '#555',
    red: '#e24b4a',
    amber: '#ef9f27',
    green: '#1d9e75',
    blue: '#378add',
    purple: '#7f77dd'
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00f5d4]" /></div>;
  if (!user || (profile && !adminService.isAdmin(profile.roles))) return <Navigate to={`/${lang || 'eng'}`} />;

  const handleModuleChange = (id: string) => {
    setSearchParams({ view: id });
  };

  const titles: Record<string, string[]> = {
    dashboard: ['Dashboard', 'Red Griffin / Overview'],
    users: ['Пользователи', 'Red Griffin / Users'],
    profile: ['Профиль · Alex Kim', 'Red Griffin / Users / Alex Kim'],
    create: ['Редактировать пользователя', 'Red Griffin / Users / Edit'],
    detail: ['Детальная страница · Alex Kim', 'Red Griffin / Users / Alex Kim / Detail'],
    chat: ['Сообщения', 'Red Griffin / Messages'],
    settings: ['Настройки', 'Red Griffin / Settings'],
    rbac: ['Матрица прав', 'Red Griffin / Users / Permissions']
  };

  const currentTitle = titles[activeModule] || ['Admin Panel', 'Red Griffin / Admin'];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#e8e6df] font-sans selection:bg-[#00f5d4]/30 overflow-hidden h-screen">
      {/* FULL SIDEBAR (matches admin_full_ui_dark.html) */}
      <aside className="w-[220px] bg-[#111] border-r border-[#2a2a2a] flex flex-col h-full shrink-0 z-50">
        <div className="p-5 border-b border-[#2a2a2a] flex items-center gap-3">
          <div className="size-8 bg-[#00f5d4] rounded-lg flex items-center justify-center font-bold text-[#050505] tracking-tighter shadow-lg shadow-[#00f5d4]/20">RG</div>
          <div className="min-w-0">
            <div className="text-sm font-bold tracking-tight">Red Griffin</div>
            <div className="text-[10px] font-black text-[#00f5d4] uppercase tracking-widest leading-none mt-1">Admin Panel</div>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <SidebarItem id="dashboard" label="Dashboard" icon={Layout} active={activeModule} color={theme.accent} onChange={handleModuleChange} />
          
          <div className="px-6 pt-6 pb-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">Пользователи</div>
          <SidebarItem id="users" label="Все пользователи" icon={Users} active={activeModule} color={theme.blue} badge="4821" onChange={handleModuleChange} />
          <SidebarItem id="rbac" label="Матрица прав" icon={ShieldCheck} active={activeModule} color={theme.purple} onChange={handleModuleChange} />
          <SidebarItem id="profile" label="Профиль" icon={UserCheck} active={activeModule} color={theme.purple} onChange={handleModuleChange} />
          
          <div className="px-6 pt-6 pb-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">Контент</div>
          <SidebarItem id="create" label="Создать / редакт." icon={Edit} active={activeModule} color={theme.green} onChange={handleModuleChange} />
          <SidebarItem id="detail" label="Детальная страница" icon={FileSearch} active={activeModule} color={theme.amber} onChange={handleModuleChange} />
          
          <div className="px-6 pt-6 pb-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">Коммуникации</div>
          <SidebarItem id="chat" label="Чат / сообщения" icon={MessageSquare} active={activeModule} color={theme.green} badge="3" onChange={handleModuleChange} />
          
          <div className="px-6 pt-6 pb-2 text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">Система</div>
          <SidebarItem id="settings" label="Настройки" icon={Settings} active={activeModule} color={theme.text3} onChange={handleModuleChange} />
        </nav>

        <div className="p-4 border-t border-[#2a2a2a] bg-black/20 flex flex-col gap-4">
          <button onClick={() => navigate(`/aca/${lang || 'eng'}`)} className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all">
            <ChevronLeft size={14} /> Back to Site
          </button>
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-red-500/10 flex items-center justify-center text-[11px] font-black text-[#e24b4a] shrink-0">AD</div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">Admin</div>
              <div className="text-[9px] text-[#555] truncate font-black uppercase tracking-widest leading-none mt-0.5">{user?.email}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-16 bg-[#111] border-b border-[#2a2a2a] flex items-center justify-between px-8 shrink-0">
          <div className="flex flex-col">
            <div className="text-[15px] font-medium">{currentTitle[0]}</div>
            <div className="text-[11px] text-[#555]">{currentTitle[1]}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-8 border border-[#333] rounded-lg flex items-center justify-center relative cursor-pointer hover:border-[#00f5d4] transition-all group">
              <Bell size={14} className="text-[#888] group-hover:text-[#00f5d4]" />
              <div className="absolute top-1.5 right-1.5 size-1.5 bg-[#e24b4a] rounded-full border border-[#111]" />
            </div>
            <button onClick={() => handleModuleChange('create')} className="h-8 px-4 border border-[#333] rounded-lg text-[12px] text-[#888] hover:text-[#00f5d4] hover:border-[#00f5d4] transition-all">+ Создать</button>
            <button onClick={() => handleModuleChange('users')} className="h-8 px-4 bg-[#00f5d4] text-[#050505] rounded-lg text-[12px] font-medium hover:bg-[#00c4aa] transition-all shadow-lg shadow-[#00f5d4]/10">Пользователи</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[#0a0a0a]">
          <AdminDashboardContent activeModule={activeModule} theme={theme} user={user} />
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ id, label, icon: Icon, active, color, badge, onChange }: any) {
  const isActive = active === id;
  return (
    <button
      onClick={() => onChange(id)}
      className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs font-medium transition-all relative group ${
        isActive ? 'text-[#00f5d4] bg-[#00f5d4]/5' : 'text-[#888] hover:text-[#e8e6df] hover:bg-white/5'
      }`}
    >
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#00f5d4]" />}
      <div className="size-1.5 rounded-full" style={{ background: color }} />
      <span className="flex-1 text-left uppercase tracking-widest text-[10px] font-black truncate">{label}</span>
      {badge && <span className="bg-red-500/10 text-[#e24b4a] text-[10px] px-1.5 py-0.5 rounded-full font-black">{badge}</span>}
    </button>
  );
}

// --- MODULES ---

function AdminOverview({ theme }: any) {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Пользователи" value="4 821" change="+134 за неделю" up p={72} color={theme.accent} />
        <MetricCard label="Курсов опубл." value="312" change="+18 за месяц" up p={60} color={theme.blue} />
        <MetricCard label="Открытых проектов" value="87" change="−5 vs пред. нед." p={40} color={theme.amber} />
        <MetricCard label="Доход (месяц)" value="$24 180" change="+12%" up p={82} color={theme.green} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[13px] font-medium uppercase tracking-widest text-white/80">Распределение ролей</h3>
            <button className="text-[11px] text-[#00f5d4] hover:underline font-black uppercase">Все →</button>
          </div>
          <BarRow label="Student" value="3 760" p={78} color={theme.blue} />
          <BarRow label="Lecturer" value="580" p={12} color={theme.green} />
          <BarRow label="Client" value="340" p={7} color={theme.amber} />
          <BarRow label="Executor" value="117" p={5} color={theme.red} />
          <BarRow label="Staff" value="24" p={2} color={theme.purple} />
        </div>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[13px] font-medium uppercase tracking-widest text-white/80">Аудит лог</h3>
            <button className="text-[11px] text-[#00f5d4] hover:underline font-black uppercase">Весь лог →</button>
          </div>
          <div className="space-y-4">
            <LogItem time="14:32" icon="R" title="alex@gmail.com → роль lecturer" desc="Изменение роли администратором" bg={`${theme.blue}20`} color={theme.blue} />
            <LogItem time="14:18" icon="C" title="Курс «Maya Rigging» опубликован" desc="Лектор: Sara R." bg={`${theme.green}20`} color={theme.green} />
            <LogItem time="13:55" icon="B" title="spam_user_042 заблокирован" desc="Модератор: Anna L." bg={`${theme.red}20`} color={theme.red} />
            <LogItem time="12:11" icon="$" title="Контракт #CTR-441 создан" desc="$4 800 · Nebula Games" bg={`${theme.amber}20`} color={theme.amber} />
          </div>
        </div>
      </div>

      <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center bg-black/20">
          <h3 className="text-[13px] font-medium uppercase tracking-widest text-white/80">Последние регистрации</h3>
          <button className="text-[11px] text-[#00f5d4] hover:underline font-black uppercase">Все пользователи →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-[#555] uppercase tracking-[0.2em] border-b border-[#2a2a2a] bg-black/40">
                <th className="px-6 py-4">Пользователь</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Роль</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4 text-right">Дата</th>
                <th className="px-6 py-4">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              <TableUserRow name="Alex Kim" email="alex@gmail.com" role="lecturer" roleColor="blue" status="активен" date="22 мар 2026" initials="AK" />
              <TableUserRow name="Sara R." email="sara@mail.ru" role="student" roleColor="gray" status="активен" date="21 мар 2026" initials="SR" />
              <TableUserRow name="John D." email="john@studio.io" role="executor" roleColor="amber" status="заблокирован" statusColor="red" date="20 мар 2026" initials="JD" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UsersList({ theme }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#111] p-4 border border-[#2a2a2a] rounded-xl">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={14} />
            <input className="bg-[#181818] border border-[#2a2a2a] rounded-lg py-2 pl-9 pr-4 text-[12px] font-black uppercase tracking-widest outline-none focus:border-[#00f5d4] w-60" placeholder="Поиск пользователя..." />
          </div>
          <select className="bg-[#181818] border border-[#2a2a2a] rounded-lg px-3 py-2 text-[11px] font-black uppercase tracking-widest outline-none">
            <option>Все роли</option>
            <option>student</option>
            <option>lecturer</option>
            <option>client</option>
            <option>executor</option>
          </select>
          <select className="bg-[#181818] border border-[#2a2a2a] rounded-lg px-3 py-2 text-[11px] font-black uppercase tracking-widest outline-none">
            <option>Все статусы</option>
            <option>активен</option>
            <option>заблокирован</option>
          </select>
        </div>
        <button className="h-10 px-6 bg-[#00f5d4] text-[#050505] rounded-lg text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#00f5d4]/10">+ Добавить</button>
      </div>

      <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-[#555] uppercase tracking-[0.2em] border-b border-[#2a2a2a] bg-black/40">
              <th className="px-6 py-4">Пользователь</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Роль</th>
              <th className="px-6 py-4">Статус</th>
              <th className="px-6 py-4">Курсов</th>
              <th className="px-6 py-4">Проектов</th>
              <th className="px-6 py-4 text-right">Дата рег.</th>
              <th className="px-6 py-4">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {[
              { n: 'Alex Kim', e: 'alex@gmail.com', r: 'lecturer', s: 'активен', c: 4, p: '—', d: '22.03.26', rc: 'blue', i: 'AK' },
              { n: 'Sara R.', e: 'sara@mail.ru', r: 'student', s: 'активен', c: 7, p: '—', d: '21.03.26', rc: 'gray', i: 'SR' },
              { n: 'John D.', e: 'john@studio.io', r: 'executor', s: 'заблокирован', c: '—', p: 3, d: '20.03.26', rc: 'amber', sc: 'red', i: 'JD' },
              { n: 'Maria N.', e: 'maria@corp.com', r: 'client', s: 'активен', c: 2, p: 5, d: '19.03.26', rc: 'purple', i: 'MN' },
              { n: 'Dmitri V.', e: 'dmitri@rg.io', r: 'manager', s: 'активен', c: '—', p: '—', d: '01.01.26', rc: 'teal', i: 'DV' }
            ].map((u, i) => (
              <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg flex items-center justify-center text-[11px] font-bold shadow-lg" style={{ background: `${u.rc === 'blue' ? theme.blue : u.rc === 'amber' ? theme.amber : u.rc === 'purple' ? theme.purple : theme.green}20`, color: u.rc === 'blue' ? theme.blue : u.rc === 'amber' ? theme.amber : u.rc === 'purple' ? theme.purple : theme.green }}>{u.i}</div>
                    <div><div className="text-[12px] font-bold text-white group-hover:text-[#00f5d4] transition-colors">{u.n}</div><div className="text-[9px] text-[#555] font-black uppercase tracking-widest mt-0.5">uid_00{i+100}</div></div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[12px] text-[#888]">{u.e}</td>
                <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${u.rc === 'blue' ? 'bg-blue-500/10 text-blue-500' : u.rc === 'amber' ? 'bg-amber-500/10 text-amber-500' : u.rc === 'purple' ? 'bg-purple-500/10 text-purple-500' : 'bg-white/10 text-[#888]'}`}>{u.r}</span></td>
                <td className="px-6 py-4"><span className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${u.sc === 'red' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}><div className="size-1 rounded-full bg-current" />{u.s}</span></td>
                <td className="px-6 py-4 text-[12px] text-[#888]">{u.c}</td>
                <td className="px-6 py-4 text-[12px] text-[#888]">{u.p}</td>
                <td className="px-6 py-4 text-right text-[11px] text-[#555]">{u.d}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button className="px-3 py-1 bg-[#222] border border-[#333] rounded text-[10px] font-black uppercase tracking-widest hover:border-[#00f5d4] transition-all">Профиль</button>
                    {u.sc === 'red' ? <button className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">Разблок.</button> : <button className="px-3 py-1 bg-[#222] border border-[#333] rounded text-[10px] font-black uppercase tracking-widest hover:border-[#00f5d4] transition-all">Ред.</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-[#555]">
        <span>Показано 5 из 4 821</span>
        <div className="flex gap-1.5">
          <button className="px-4 py-1.5 bg-[#222] border border-[#333] rounded hover:text-white transition-all">← Пред.</button>
          <button className="px-4 py-1.5 bg-[#333] text-white rounded">1</button>
          <button className="px-4 py-1.5 bg-[#222] border border-[#333] rounded hover:text-white transition-all">2</button>
          <button className="px-4 py-1.5 bg-[#222] border border-[#333] rounded hover:text-white transition-all">3</button>
          <button className="px-4 py-1.5 bg-[#222] border border-[#333] rounded hover:text-white transition-all">След. →</button>
        </div>
      </div>
    </div>
  );
}

function UserProfileView({ theme }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-8 flex items-start gap-8 shadow-2xl">
        <div className="size-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-4xl font-bold text-blue-500 shrink-0 shadow-lg">AK</div>
        <div className="flex-1">
          <h2 className="text-2xl font-black tracking-tighter uppercase text-white">Alex Kim</h2>
          <div className="text-[12px] font-bold text-[#555] uppercase tracking-widest mt-1">uid_00182 · Зарегистрирован 22 марта 2026</div>
          <div className="flex gap-2 mt-6">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded text-[10px] font-black uppercase tracking-widest border border-blue-500/20">lecturer</span>
            <span className="px-3 py-1 bg-white/5 text-[#888] rounded text-[10px] font-black uppercase tracking-widest border border-white/10">student</span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-black uppercase tracking-widest border border-emerald-500/20"><div className="size-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />активен</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="h-11 px-6 bg-[#222] border border-[#333] rounded-xl text-[11px] font-black uppercase tracking-widest hover:border-[#00f5d4] transition-all">Редактировать</button>
          <button className="h-11 px-6 border border-red-500/30 text-red-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all">Заблокировать</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox val="4" label="Курсов опубл." />
        <StatBox val="1 240" label="Студентов" />
        <StatBox val="$3 180" label="Доход (мес.)" />
        <StatBox val="4.8" label="Средний рейтинг" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-8 space-y-6 shadow-2xl">
          <h3 className="text-[13px] font-black uppercase tracking-[0.2em] border-b border-[#2a2a2a] pb-6 text-white/60">Информация</h3>
          <div className="space-y-5">
            <ProfileInfoRow label="Email" value="alex@gmail.com" />
            <ProfileInfoRow label="Роли" value={<div className="flex gap-1.5"><span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[9px] font-black uppercase tracking-widest">lecturer</span><span className="px-2 py-0.5 bg-white/5 text-[#888] rounded text-[9px] font-black uppercase tracking-widest">student</span></div>} />
            <ProfileInfoRow label="Bio" value={<span className="text-[#888] font-bold">Senior 3D Artist, 10+ лет опыта</span>} />
            <ProfileInfoRow label="Статус" value={<span className="text-emerald-500 font-black uppercase tracking-widest text-[11px]">активен</span>} />
            <ProfileInfoRow label="Создан" value={<span className="text-[#555] font-black uppercase tracking-widest text-[11px]">22 марта 2026</span>} />
            <ProfileInfoRow label="Последний вход" value={<span className="text-[#555] font-black uppercase tracking-widest text-[11px]">Сегодня, 14:22</span>} />
          </div>
        </div>
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-8 space-y-6 shadow-2xl">
          <h3 className="text-[13px] font-black uppercase tracking-[0.2em] border-b border-[#2a2a2a] pb-6 text-white/60">Курсы пользователя</h3>
          <div className="space-y-2">
            <UserCourseItem title="Houdini FX Vol.2" students="480 студентов" status="опубликован" color={theme.green} />
            <UserCourseItem title="VFX Compositing" students="390 студентов" status="опубликован" color={theme.green} />
            <UserCourseItem title="Particles Pro" students="0 студентов" status="черновик" color={theme.amber} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EditUserView({ theme }: any) {
  return (
    <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-10 space-y-10 shadow-2xl">
      <div className="flex justify-between items-center border-b border-[#2a2a2a] pb-8">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Редактировать пользователя</h3>
        <span className="text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">User ID: uid_00182</span>
      </div>
      
      <div className="space-y-10">
        <div className="space-y-6">
          <div className="text-[11px] font-black text-[#555] uppercase tracking-[0.3em]">Основная информация</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormGroup label="Имя" defaultValue="Alex Kim" />
            <FormGroup label="Email" defaultValue="alex@gmail.com" />
            <div className="flex flex-col gap-3">
              <label className="text-[10px] text-[#555] uppercase font-black tracking-widest">Статус</label>
              <select className="bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[13px] font-bold text-white outline-none focus:border-[#00f5d4] transition-all">
                <option selected>активен</option>
                <option>заблокирован</option>
              </select>
            </div>
            <FormGroup label="Фото URL" placeholder="https://..." />
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-[11px] font-black text-[#555] uppercase tracking-[0.3em]">Роли пользователя</div>
          <div className="flex flex-wrap gap-4">
            {['student', 'lecturer', 'client', 'executor', 'moderator', 'manager', 'hr', 'finance', 'support', 'chief_manager'].map(r => (
              <label key={r} className="flex items-center gap-3 cursor-pointer group bg-[#111] px-4 py-2.5 rounded-xl border border-white/5 hover:border-[#00f5d4]/30 transition-all">
                <input type="checkbox" defaultChecked={r === 'student' || r === 'lecturer'} className="size-4 accent-[#00f5d4]" />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#888] group-hover:text-white transition-colors">{r}</span>
              </label>
            ))}
            <label className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/40 border border-transparent opacity-40 cursor-not-allowed">
              <input type="checkbox" disabled className="size-4" />
              <span className="text-[11px] font-black uppercase tracking-widest">admin</span>
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-[11px] font-black text-[#555] uppercase tracking-[0.3em]">Bio</div>
          <textarea className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl p-6 text-[13px] font-medium text-[#e8e6df] outline-none focus:border-[#00f5d4] h-40 leading-relaxed transition-all" defaultValue="Senior 3D Artist, 10+ лет опыта в Houdini и Maya" />
        </div>

        <div className="flex justify-end gap-4 pt-10 border-t border-[#2a2a2a]">
          <button className="h-12 px-8 bg-[#222] border border-[#333] rounded-xl text-[11px] font-black uppercase tracking-widest hover:text-white transition-all">Отмена</button>
          <button className="h-12 px-8 border border-red-500/30 text-red-500 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all">Заблокировать</button>
          <button className="h-12 px-10 bg-[#00f5d4] text-[#050505] rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#00f5d4]/20 hover:scale-105 transition-all">Сохранить изменения</button>
        </div>
      </div>
    </div>
  );
}

function UserDetailsView({ theme }: any) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button className="h-9 px-5 bg-[#222] border border-[#333] rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">← Назад</button>
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#555]">Пользователи / Alex Kim / Detailed History</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-8 space-y-8 shadow-2xl">
            <h3 className="text-[13px] font-black uppercase tracking-[0.2em] border-b border-[#2a2a2a] pb-6">Полная история действий</h3>
            <div className="space-y-6">
              <LogItem time="14:32" icon="R" title="Роль изменена → lecturer" desc="Администратором · IP 192.168.1.1" bg={theme.blue + '20'} color={theme.blue} />
              <LogItem time="12:18" icon="L" title="Вход в систему" desc="Chrome 122 · macOS · IP 192.168.1.1" bg={theme.green + '20'} color={theme.green} />
              <LogItem time="Вчера" icon="C" title="Курс «Houdini FX» обновлён" desc="Добавлено 3 урока" bg={theme.amber + '20'} color={theme.amber} />
              <LogItem time="20 мар" icon="$" title="Получен доход $480" desc="Зачисление от 6 студентов" bg={theme.purple + '20'} color={theme.purple} />
            </div>
          </div>
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-[13px] font-black uppercase tracking-[0.2em] border-b border-[#2a2a2a] pb-6">Firestore Document Snapshot</h3>
            <div className="bg-[#050505] border border-[#2a2a2a] rounded-2xl p-8 font-mono text-[12px] leading-loose shadow-inner relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity"><Plus size={16} /></div>
              <span className="text-[#555]">// path: /users/uid_00182</span><br />
              {'{'}<br />
              &nbsp;&nbsp;<span className="text-[#00f5d4]">uid</span>: <span className="text-amber-400">"uid_00182"</span>,<br />
              &nbsp;&nbsp;<span className="text-[#00f5d4]">email</span>: <span className="text-amber-400">"alex@gmail.com"</span>,<br />
              &nbsp;&nbsp;<span className="text-[#00f5d4]">displayName</span>: <span className="text-amber-400">"Alex Kim"</span>,<br />
              &nbsp;&nbsp;<span className="text-[#00f5d4]">roles</span>: [<span className="text-amber-400">"student"</span>, <span className="text-amber-400">"lecturer"</span>],<br />
              &nbsp;&nbsp;<span className="text-[#00f5d4]">createdAt</span>: <span className="text-blue-400">Timestamp(2026-03-22)</span><br />
              {'}'}
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-[13px] font-black uppercase tracking-[0.2em] border-b border-[#2a2a2a] pb-6">Быстрые действия</h3>
            <div className="flex flex-col gap-3">
              <ActionButton label="Редактировать профиль" />
              <ActionButton label="Изменить роли" />
              <ActionButton label="Отправить уведомление" />
              <ActionButton label="Сбросить пароль" />
              <ActionButton label="Выдать сертификат" color={theme.amber} />
              <ActionButton label="Заблокировать" danger />
            </div>
          </div>
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-[13px] font-black uppercase tracking-[0.2em] border-b border-[#2a2a2a] pb-6">Связанные данные</h3>
            <div className="space-y-2">
              <DataRow label="Курсов" value="4" color={theme.accent} />
              <DataRow label="Enrollments" value="12" />
              <DataRow label="Отзывов оставлено" value="8" />
              <DataRow label="Сертификатов" value="3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminChat({ theme }: any) {
  return (
    <div className="bg-[#181818] border border-[#2a2a2a] rounded-[2.5rem] overflow-hidden h-[650px] flex shadow-2xl">
      <div className="w-[280px] border-r border-[#2a2a2a] flex flex-col bg-[#111]">
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={14} />
            <input className="w-full bg-[#181818] border border-[#2a2a2a] rounded-xl py-2.5 pl-10 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:border-[#00f5d4] transition-all" placeholder="Поиск..." />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <ChatItem name="Sara R." msg="Курс готов к публикации" time="14:32" active color={theme.blue} initials="SR" />
          <ChatItem name="Dmitri V." msg="Отчёт за март готов" time="12:18" color={theme.green} initials="DV" />
          <ChatItem name="Anna L." msg="Пользователь заблокирован" time="Вчера" color={theme.amber} initials="AL" />
          <ChatItem name="Roman S." msg="Просроченных milestone: 4" time="Вчера" color={theme.purple} initials="RS" />
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-[#0a0a0a]">
        <div className="p-6 border-b border-[#2a2a2a] bg-[#111] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-500 shadow-lg">SR</div>
            <div>
              <div className="text-[14px] font-black tracking-tight uppercase">Sara R.</div>
              <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">● онлайн · lecturer</div>
            </div>
          </div>
          <button className="p-3 hover:bg-white/5 rounded-xl transition-all text-[#555] hover:text-white"><MoreVertical size={20} /></button>
        </div>
        <div className="flex-1 p-8 overflow-y-auto no-scrollbar flex flex-col gap-6">
          <Message other msg="Добрый день! Курс «Houdini FX Vol.2» готов к публикации. Можете проверить?" time="14:28" />
          <Message me msg="Хорошо, проверю сегодня до конца дня." time="14:30" />
          <Message other msg="Спасибо! Там 12 уроков и 2 теста. Также добавил субтитры на английском." time="14:31" />
          <Message me msg="Отлично. Опубликую после проверки thumbnail и описания." time="14:32" />
        </div>
        <div className="p-6 bg-[#111] border-t border-[#2a2a2a] flex gap-4">
          <input className="flex-1 bg-[#181818] border border-[#2a2a2a] rounded-2xl py-4 px-6 text-[12px] font-bold text-white outline-none focus:border-[#00f5d4] transition-all" placeholder="Введите сообщение..." />
          <button className="px-8 bg-[#00f5d4] text-[#050505] rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#00f5d4]/20 hover:scale-105 transition-all">Отправить</button>
        </div>
      </div>
    </div>
  );
}

function AdminSettings({ theme }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
      <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-2 h-fit shadow-2xl">
        {['Общие', 'Безопасность', 'Уведомления', 'Интеграции', 'Firebase', 'API'].map((s, i) => (
          <button key={s} className={`w-full text-left px-5 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'text-[#00f5d4] bg-[#00f5d4]/5' : 'text-[#555] hover:bg-white/5 hover:text-white'}`}>{s}</button>
        ))}
      </div>
      <div className="space-y-8">
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-10 space-y-8 shadow-2xl">
          <h3 className="text-[15px] font-black uppercase tracking-[0.2em] border-b border-[#2a2a2a] pb-6 mb-2">Настройки платформы</h3>
          <SettingToggle label="Режим обслуживания" desc="Временно закрыть доступ к платформе" />
          <SettingToggle label="Регистрация открыта" desc="Разрешить новым пользователям регистрацию" on />
          <SettingToggle label="Email верификация" desc="Требовать подтверждение email при регистрации" on />
          <SettingToggle label="Gemini AI ассистент" desc="Включить AI чат на всех страницах" on />
        </div>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-10 space-y-8 shadow-2xl">
          <h3 className="text-[15px] font-black uppercase tracking-[0.2em] border-b border-[#2a2a2a] pb-6 mb-2">Переменные окружения</h3>
          <FormGroup label="Firebase Project ID" defaultValue="red-griffin-academy" readOnly />
          <FormGroup label="Gemini API Key" defaultValue="●●●●●●●●●●●●●●●●" type="password" />
          <FormGroup label="App URL" defaultValue="https://red-griffin.app" />
          <div className="flex justify-end pt-6"><button className="px-10 py-4 bg-[#00f5d4] text-[#050505] rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#00f5d4]/20 hover:scale-105 transition-all">Сохранить</button></div>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-10 space-y-8 shadow-2xl">
          <h3 className="text-[15px] font-black uppercase tracking-[0.2em] text-red-500 border-b border-red-500/10 pb-6">Опасная зона</h3>
          <div className="flex items-center justify-between py-2 border-b border-red-500/10">
            <div><div className="text-[13px] text-red-500 font-black uppercase tracking-widest">Очистить кэш</div><div className="text-[11px] text-[#555] font-bold uppercase mt-1">Сбросить все кешированные данные</div></div>
            <button className="px-6 py-2.5 bg-[#222] border border-[#333] rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-red-500/40 transition-all">Очистить</button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div><div className="text-[13px] text-red-500 font-black uppercase tracking-widest">Сбросить Firestore Rules</div><div className="text-[11px] text-[#555] font-bold uppercase mt-1">Вернуть к дефолтным правилам доступа</div></div>
            <button className="px-6 py-2.5 bg-[#222] border border-[#333] rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-red-500/40 transition-all">Сбросить</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminRBACMatrix({ theme }: any) {
  const [activeGroup, setActiveGroup] = useState("all");
  
  const rows = [
    {g:"users", section:"Управление пользователями"},
    {g:"users", label:"Просматривать всех пользователей",     sub:"GET /admin/users",                   cm:1, mg:1, mo:2},
    {g:"users", label:"Полный профиль пользователя",           sub:"GET /admin/users/:id",               cm:1, mg:1, mo:1},
    {g:"users", label:"Назначать / снимать роли",              sub:"PATCH /admin/users/:id/roles",       cm:1, mg:0, mo:0},
    {g:"users", label:"Временно блокировать аккаунт",          sub:"PATCH /admin/users/:id/suspend",     cm:1, mg:1, mo:1},
    {g:"users", label:"Удалять аккаунт навсегда",              sub:"DELETE /admin/users/:id",            cm:1, mg:0, mo:0},
    {g:"users", label:"Выдавать предупреждения",               sub:"POST /admin/users/:id/warn",         cm:1, mg:1, mo:1},
    {g:"users", label:"Экспортировать данные пользователя",    sub:"GET /admin/users/:id/export",        cm:1, mg:0, mo:0},

    {g:"content", section:"Модерация контента"},
    {g:"content", label:"Просматривать все курсы (draft)",     sub:"GET /admin/courses?status=all",      cm:1, mg:1, mo:1},
    {g:"content", label:"Снять курс с публикации",             sub:"PATCH /courses/:id/publish",         cm:1, mg:1, mo:1},
    {g:"content", label:"Удалить курс",                        sub:"DELETE /admin/courses/:id",          cm:1, mg:1, mo:1},
    {g:"content", label:"Просматривать флагнутый контент",     sub:"GET /admin/content/flagged",         cm:1, mg:1, mo:1},
    {g:"content", label:"Обрабатывать жалобы пользователей",   sub:"PATCH /admin/reports/:id",           cm:1, mg:1, mo:1},
    {g:"content", label:"Одобрять публикацию услуг Studio",    sub:"PATCH /services/:id/approve",        cm:1, mg:1, mo:1},
    {g:"content", label:"Управлять витриной курсов",           sub:"PATCH /admin/featured/courses",      cm:1, mg:1, mo:0},
    {g:"content", label:"Обновить правила платформы",          sub:"PATCH /admin/content/policy",        cm:1, mg:0, mo:0},

    {g:"finance", section:"Финансы и транзакции"},
    {g:"finance", label:"Просматривать выручку платформы",     sub:"GET /admin/finance/revenue",         cm:1, mg:0, mo:0},
    {g:"finance", label:"Все транзакции Stripe",               sub:"GET /admin/finance/transactions",    cm:1, mg:0, mo:0},
    {g:"finance", label:"Выплаты исполнителям",                sub:"GET /admin/finance/payouts",         cm:1, mg:0, mo:0},
    {g:"finance", label:"Инициировать возврат",                sub:"POST /admin/finance/refund/:id",     cm:1, mg:0, mo:2},
    {g:"finance", label:"Баланс Stripe аккаунта",              sub:"GET /admin/finance/stripe/balance",  cm:1, mg:0, mo:0},
    {g:"finance", label:"Управлять комиссией платформы",       sub:"PATCH /admin/finance/commission",    cm:2, mg:0, mo:0},
    {g:"finance", label:"Просматривать все возвраты",          sub:"GET /admin/finance/refunds",         cm:1, mg:0, mo:0},

    {g:"analytics", section:"Аналитика платформы"},
    {g:"analytics", label:"Метрики пользователей (DAU/MAU)",   sub:"GET /admin/analytics/users",         cm:1, mg:1, mo:0},
    {g:"analytics", label:"Аналитика Academy Mode",            sub:"GET /admin/analytics/courses",       cm:1, mg:1, mo:0},
    {g:"analytics", label:"Аналитика Studio Mode",             sub:"GET /admin/analytics/studio",        cm:1, mg:1, mo:0},
    {g:"analytics", label:"Нагрузка на модерацию",             sub:"GET /admin/analytics/moderation",    cm:1, mg:1, mo:0},
    {g:"analytics", label:"Когортный анализ",                  sub:"GET /admin/analytics/cohorts",       cm:1, mg:1, mo:0},
    {g:"analytics", label:"Сформировать отчёт",                sub:"POST /admin/analytics/report",       cm:1, mg:1, mo:0},

    {g:"team", section:"Управление командой"},
    {g:"team", label:"Просматривать список модераторов",        sub:"GET /admin/moderators",              cm:1, mg:2, mo:0},
    {g:"team", label:"Назначать нового модератора",             sub:"POST /admin/moderators",             cm:1, mg:0, mo:0},
    {g:"team", label:"Снимать модератора с должности",          sub:"DELETE /admin/moderators/:id",       cm:1, mg:0, mo:0},
    {g:"team", label:"Управлять менеджерами",                   sub:"POST/DELETE /admin/managers",        cm:1, mg:0, mo:0},
    {g:"team", label:"Настраивать права стаффа",                sub:"PATCH /admin/staff/:id/perms",       cm:1, mg:0, mo:0},
    {g:"team", label:"Просматривать audit log",                 sub:"GET /admin/audit-log",               cm:1, mg:2, mo:0},

    {g:"system", section:"Системные настройки"},
    {g:"system", label:"Управлять промо-кодами",                sub:"POST /admin/promo-codes",            cm:1, mg:1, mo:0},
    {g:"system", label:"Массовые уведомления",                  sub:"POST /admin/notifications/broadcast",cm:1, mg:1, mo:0},
    {g:"system", label:"Email кампании",                        sub:"GET /admin/email/campaigns",         cm:1, mg:1, mo:0},
    {g:"system", label:"Системные настройки платформы",         sub:"PATCH /admin/system/settings",       cm:2, mg:0, mo:0},
    {g:"system", label:"Управлять SEO и метаданными",           sub:"PATCH /admin/seo",                   cm:1, mg:1, mo:0},
    {g:"system", label:"Экспорт audit log в CSV/PDF",           sub:"POST /admin/audit-log/export",       cm:1, mg:0, mo:0},
  ];

  const sym = (v: number) => {
    if (v === 1) return <span className="text-emerald-500 text-xl">●</span>;
    if (v === 2) return <span className="text-amber-500 text-lg">◑</span>;
    return <span className="text-white/10 text-xl">○</span>;
  };

  const filteredRows = rows.filter(r => activeGroup === "all" || r.g === activeGroup);

  return (
    <div className="space-y-8">
      <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-10 shadow-2xl space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#2a2a2a] pb-8">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Administrative Roles Matrix</h3>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#555] mt-2">Chief Manager · Manager · Moderator Permissions</p>
          </div>
          <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-[#555]">
            <div className="flex items-center gap-2"><span className="text-emerald-500">●</span> Full Access</div>
            <div className="flex items-center gap-2"><span className="text-amber-500">◑</span> Partial</div>
            <div className="flex items-center gap-2"><span className="text-white/10">○</span> Restricted</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "users", "content", "finance", "analytics", "team", "system"].map(g => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeGroup === g ? "bg-[#00f5d4] text-[#050505] shadow-lg shadow-[#00f5d4]/20" : "bg-[#111] border border-[#2a2a2a] text-[#555] hover:text-white"
              }`}
            >
              {g === "all" ? "Все модули" : g}
            </button>
          ))}
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/40 text-[9px] font-black text-[#555] uppercase tracking-widest">
                <th className="px-8 py-5">Действие / Эндпоинт</th>
                <th className="px-8 py-5 text-center w-32">Chief Manager</th>
                <th className="px-8 py-5 text-center w-32">Manager</th>
                <th className="px-8 py-5 text-center w-32">Moderator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {filteredRows.map((r, i) => (
                r.section ? (
                  <tr key={i} className="bg-black/20">
                    <td colSpan={4} className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#555]">{r.section}</td>
                  </tr>
                ) : (
                  <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="text-[12px] font-bold text-white/80 group-hover:text-white">{r.label}</div>
                      <div className="text-[10px] font-mono text-[#555] mt-1 group-hover:text-[#00f5d4]/60 transition-colors">{r.sub}</div>
                    </td>
                    <td className="px-8 py-5 text-center">{sym(r.cm!)}</td>
                    <td className="px-8 py-5 text-center">{sym(r.mg!)}</td>
                    <td className="px-8 py-5 text-center">{sym(r.mo!)}</td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-[#555] px-2">
          Total Actions Filtered: {filteredRows.filter(r => !r.section).length}
        </div>
      </div>
    </div>
  );
}

// --- SHARED COMPONENTS ---

function MetricCard({ label, value, change, up, p, color }: any) {
  return (
    <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-6 space-y-5 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: color }} />
      <div className="text-[10px] font-black text-[#555] uppercase tracking-[0.2em] group-hover:text-[#888] transition-colors relative z-10">{label}</div>
      <div className="text-4xl font-black text-white tracking-tighter relative z-10">{value}</div>
      <div className={`text-[10px] font-black flex items-center gap-1.5 relative z-10 uppercase tracking-widest ${up ? 'text-emerald-500' : 'text-red-500'}`}>{up ? '↑' : '↓'} {change}</div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden relative z-10">
        <motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} transition={{ duration: 1.5 }} className="h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ background: color }} />
      </div>
    </div>
  );
}

function StatBox({ val, label }: any) {
  return (
    <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 text-center shadow-xl hover:border-[#00f5d4]/20 transition-all group">
      <div className="text-3xl font-black text-[#00f5d4] tracking-tighter group-hover:scale-110 transition-transform">{val}</div>
      <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mt-2">{label}</div>
    </div>
  );
}

function BarRow({ label, value, p, color }: any) {
  return (
    <div className="flex items-center gap-6 group">
      <div className="w-20 text-[11px] font-black uppercase tracking-widest text-[#555] group-hover:text-[#888] transition-colors">{label}</div>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} transition={{ duration: 1 }} className="h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ background: color }} />
      </div>
      <div className="w-12 text-right text-[11px] font-black text-white/40 group-hover:text-white/80 transition-colors">{value}</div>
    </div>
  );
}

function LogItem({ time, icon, title, desc, bg, color }: any) {
  return (
    <div className="flex gap-5 group cursor-default p-2 rounded-xl hover:bg-white/[0.02] transition-all">
      <div className="text-[10px] font-black text-[#555] pt-1.5 w-10 shrink-0 group-hover:text-[#888] transition-colors">{time}</div>
      <div className="size-8 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 border border-white/5 shadow-lg group-hover:scale-110 transition-all" style={{ background: bg, color }}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold text-white/80 group-hover:text-[#00f5d4] transition-colors truncate">{title}</div>
        <div className="text-[10px] text-[#555] font-black uppercase tracking-widest mt-1 truncate">{desc}</div>
      </div>
    </div>
  );
}

function TableUserRow({ name, email, role, roleColor, status, statusColor, date, initials }: any) {
  const colors: Record<string, string> = { blue: '#378add', gray: '#555', amber: '#ef9f27', red: '#e24b4a' };
  return (
    <tr className="hover:bg-white/[0.01] transition-colors group">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="size-9 rounded-xl flex items-center justify-center text-[11px] font-bold shadow-lg group-hover:scale-110 transition-all" style={{ background: `${colors[roleColor]}20`, color: colors[roleColor] }}>{initials}</div>
          <div className="text-[12px] font-bold text-white group-hover:text-[#00f5d4] transition-colors">{name}</div>
        </div>
      </td>
      <td className="px-6 py-5 text-[12px] text-[#888]">{email}</td>
      <td className="px-6 py-5"><span className="px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest" style={{ color: colors[roleColor], background: `${colors[roleColor]}10`, border: `1px solid ${colors[roleColor]}20` }}>{role}</span></td>
      <td className="px-6 py-5"><span className={`flex items-center gap-2 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${statusColor === 'red' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}><div className="size-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />{status}</span></td>
      <td className="px-6 py-5 text-right text-[11px] font-black text-[#555] uppercase tracking-widest">{date}</td>
      <td className="px-6 py-5 text-right"><button className="px-4 py-1.5 bg-[#222] border border-[#333] rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-[#00f5d4] hover:text-white transition-all">Открыть</button></td>
    </tr>
  );
}

function ActionButton({ label, danger, color }: any) {
  return (
    <button className={`w-full text-left px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border border-[#333] transition-all hover:bg-white/5 ${danger ? 'text-red-500 hover:border-red-500/40' : color ? 'text-amber-500 hover:border-amber-500/40' : 'text-[#888] hover:border-[#00f5d4] hover:text-[#00f5d4]'}`}>{label}</button>
  );
}

function DataRow({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-none group">
      <div className="text-[11px] font-black uppercase tracking-widest text-[#555] group-hover:text-[#888] transition-colors">{label}</div>
      <div className="text-[12px] font-black tracking-tighter" style={{ color: color || '#888' }}>{value}</div>
    </div>
  );
}

function ProfileInfoRow({ label, value }: any) {
  return (
    <div className="flex gap-6 group">
      <div className="w-32 text-[11px] font-black uppercase tracking-[0.2em] text-[#555] pt-0.5 group-hover:text-[#888] transition-colors">{label}</div>
      <div className="text-[13px] font-bold text-white/80 group-hover:text-white transition-colors">{value}</div>
    </div>
  );
}

function UserCourseItem({ title, students, status, color }: any) {
  return (
    <div className="flex items-center gap-5 py-4 border-b border-white/5 last:border-none group cursor-default">
      <div className="size-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5 shadow-lg group-hover:scale-110 transition-all" style={{ background: `${color}15`, color }}><Box size={20} /></div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-black uppercase tracking-tight text-white group-hover:text-[#00f5d4] transition-colors">{title}</div>
        <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mt-1.5">{students} · <span style={{ color }}>{status}</span></div>
      </div>
      <ChevronRight size={16} className="text-white/5 group-hover:text-white/20 transition-colors" />
    </div>
  );
}

function ChatItem({ name, msg, time, active, color, initials }: any) {
  return (
    <div className={`p-5 flex gap-4 cursor-pointer border-b border-white/5 transition-all hover:bg-white/[0.02] ${active ? 'bg-[#00f5d4]/5 border-l-2 border-l-[#00f5d4]' : ''}`}>
      <div className="size-10 rounded-xl flex items-center justify-center text-[12px] font-black shadow-lg" style={{ background: `${color}20`, color }}>{initials}</div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <div className={`text-[12px] font-black uppercase tracking-tight ${active ? 'text-[#00f5d4]' : 'text-white'}`}>{name}</div>
          <div className="text-[9px] font-black text-[#555] uppercase tracking-widest">{time}</div>
        </div>
        <div className="text-[11px] font-medium text-[#555] truncate group-hover:text-[#888]">{msg}</div>
      </div>
    </div>
  );
}

function Message({ me, other, msg, time }: any) {
  return (
    <div className={`flex flex-col max-w-[75%] gap-2 ${me ? 'self-end items-end' : 'self-start'}`}>
      <div className={`px-5 py-3.5 rounded-2xl text-[13px] font-medium leading-relaxed shadow-xl ${me ? 'bg-[#00f5d4]/10 text-white rounded-tr-none border border-[#00f5d4]/20' : 'bg-[#181818] text-[#e8e6df] rounded-tl-none border border-[#2a2a2a]'}`}>
        {msg}
      </div>
      <div className="text-[10px] font-black uppercase tracking-widest text-[#555] px-1">{time}</div>
    </div>
  );
}

function SettingToggle({ label, desc, on }: any) {
  const [active, setActive] = useState(on);
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-none group">
      <div>
        <div className="text-[13px] text-white font-black uppercase tracking-tight group-hover:text-[#00f5d4] transition-colors">{label}</div>
        <div className="text-[11px] text-[#555] font-bold uppercase tracking-widest mt-1.5">{desc}</div>
      </div>
      <button onClick={() => setActive(!active)} className={`w-10 h-5.5 rounded-full relative transition-all border border-[#333] shadow-inner ${active ? 'bg-[#00f5d4]' : 'bg-[#111]'}`}>
        <div className={`absolute top-0.5 size-4 bg-white rounded-full shadow-lg transition-all ${active ? 'left-[20px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

function FormGroup({ label, placeholder, defaultValue, type = 'text', readOnly }: any) {
  return (
    <div className="flex flex-col gap-3 group">
      <label className="text-[10px] text-[#555] uppercase font-black tracking-[0.2em] group-focus-within:text-[#00f5d4] transition-colors">{label}</label>
      <input 
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`bg-[#111] border border-[#2a2a2a] rounded-xl px-5 py-3.5 text-[13px] font-bold outline-none focus:border-[#00f5d4] shadow-inner transition-all ${readOnly ? 'text-[#555] cursor-not-allowed' : 'text-white'}`} 
      />
    </div>
  );
}
