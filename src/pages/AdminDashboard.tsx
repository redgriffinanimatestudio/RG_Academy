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
        {['courses', 'topics', 'services'].includes(activeModule) && <div className="p-20 text-center bg-[#111] border border-white/5 rounded-[2.5rem] opacity-40 uppercase font-black tracking-widest">{activeModule} Management System Initializing...</div>}
        
        {!['dashboard', 'users', 'profile', 'create', 'detail', 'chat', 'settings', 'rbac', 'courses', 'topics', 'services'].includes(activeModule) && (
          <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <ShieldAlert size={64} className="mb-6" style={{ color: currentTheme.accent }} />
            <div className="text-xl font-black uppercase tracking-widest text-white">Module Not Found</div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminDashboard() {
  const { profile: user, loading, logout } = useAuth();
  const { lang } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeModule = searchParams.get('view') || 'dashboard';

  const theme = {
    accent: '#00f5d4',
    blue: '#378add',
    green: '#1d9e75',
    amber: '#ef9f27',
    red: '#e24b4a',
    purple: '#7f77dd'
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#00f5d4] font-black uppercase tracking-widest animate-pulse">Initializing Security Protocol...</div>;
  if (!user || !user.roles.includes('admin')) return <Navigate to={`/${lang || 'eng'}/login`} />;

  const menuItems = [
    { id: 'dashboard', label: 'Обзор', icon: Layout },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'courses', label: 'Курсы', icon: Box },
    { id: 'topics', label: 'Топики', icon: Hash },
    { id: 'services', label: 'Услуги', icon: Briefcase },
    { id: 'chat', label: 'Поддержка', icon: MessageSquare, badge: 3 },
    { id: 'rbac', label: 'Права доступа', icon: ShieldCheck },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#00f5d4]/30">
      {/* Admin Sidebar Navigation */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-[100] transition-all">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
          <div className="size-10 bg-[#00f5d4] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00f5d4]/20 shrink-0">
            <Shield size={24} className="text-[#050505]" />
          </div>
          <div>
            <div className="text-sm font-black uppercase tracking-widest leading-none">CORE</div>
            <div className="text-[10px] font-bold text-[#555] uppercase tracking-[0.3em] mt-1">Management</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/admin/${lang || 'eng'}?view=${item.id}`)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${activeModule === item.id ? 'bg-[#00f5d4]/5 border border-[#00f5d4]/10' : 'hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={18} className={`transition-colors ${activeModule === item.id ? 'text-[#00f5d4]' : 'text-[#555] group-hover:text-white'}`} />
                <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${activeModule === item.id ? 'text-white' : 'text-[#555] group-hover:text-white'}`}>{item.label}</span>
              </div>
              {item.badge && <span className="px-2 py-0.5 bg-red-500 rounded-lg text-[8px] font-black text-white">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-4 px-2">
            <div className="size-10 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center text-[12px] font-bold text-[#00f5d4] shadow-lg">SA</div>
            <div className="min-w-0">
              <div className="text-[11px] font-black uppercase tracking-widest truncate">{user.displayName || 'Admin'}</div>
              <div className="text-[9px] font-bold text-[#555] uppercase tracking-widest mt-0.5">System Admin</div>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all group">
            <LogOut size={18} />
            <span className="text-[11px] font-black uppercase tracking-widest">Выход</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="ml-72 flex-1 p-12 transition-all">
        {/* Module Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#00f5d4] font-black uppercase tracking-[0.4em] text-[10px]">
              <Zap size={14} fill="currentColor" />
              Red Griffin System OS v4.2
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white leading-none uppercase">
              {menuItems.find(m => m.id === activeModule)?.label || 'Управление'} <br />
              <span className="text-[#00f5d4] italic">Terminal.</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-[#0a0a0a] border border-white/5 p-2 rounded-2xl shadow-xl">
            <button className="size-12 rounded-xl flex items-center justify-center text-[#555] hover:text-white transition-colors relative">
              <Bell size={20} />
              <div className="absolute top-3 right-3 size-2 bg-red-500 rounded-full border-2 border-[#0a0a0a]" />
            </button>
            <button className="size-12 rounded-xl flex items-center justify-center text-[#555] hover:text-white transition-colors"><Settings size={20} /></button>
            <div className="w-[1px] h-6 bg-white/5 mx-2" />
            <button className="flex items-center gap-3 pl-2 pr-4 py-2 hover:bg-white/5 rounded-xl transition-all group">
              <div className="size-8 rounded-lg bg-[#00f5d4]/10 border border-[#00f5d4]/20 flex items-center justify-center text-[#00f5d4] text-[10px] font-bold">A</div>
              <ChevronDown size={14} className="text-[#555] group-hover:text-white transition-colors" />
            </button>
          </div>
        </header>

        <AdminDashboardContent activeModule={activeModule} theme={theme} user={user} />
      </main>
    </div>
  );
}

function AdminOverview({ theme }: any) {
  return (
    <div className="space-y-12">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Пользователи" value="1,284" trend="+12%" icon={Users} color={theme.accent} />
        <StatCard label="Выручка" value="$42.5k" trend="+8%" icon={DollarSign} color={theme.amber} />
        <StatCard label="Проекты" value="86" trend="-3%" icon={Briefcase} color={theme.blue} />
        <StatCard label="Задачи" value="242" trend="+18%" icon={Zap} color={theme.green} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">Активность Платформы</h3>
            <div className="flex gap-2">
              {['24h', '7d', '30d'].map(t => (
                <button key={t} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all ${t === '7d' ? 'bg-[#00f5d4] text-[#050505]' : 'text-[#555] hover:text-white'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-80 w-full bg-[#111] rounded-[2rem] border border-dashed border-white/5 flex items-center justify-center">
            <TrendingUp size={48} className="text-white/5" />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#555]">Системный Статус</h3>
            <div className="space-y-4">
              <StatusIndicator label="API Server" status="Active" color={theme.green} />
              <StatusIndicator label="Database" status="Synced" color={theme.accent} />
              <StatusIndicator label="Auth Provider" status="Online" color={theme.accent} />
              <StatusIndicator label="Gemini AI" status="Active" color={theme.purple} />
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#555]">Инфраструктура</h3>
            <div className="space-y-4">
              <UsageBar label="CPU Usage" value={42} color={theme.accent} />
              <UsageBar label="Memory" value={68} color={theme.blue} />
              <UsageBar label="Storage" value={24} color={theme.amber} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminRBACMatrix({ theme }: any) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f5d4]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="relative z-10 space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">Роли и Доступы</h2>
            <p className="text-[11px] font-bold text-[#555] uppercase tracking-widest">Матрица управления правами доступа экосистемы</p>
          </div>
          <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
            <Plus size={16} className="text-[#00f5d4]" /> Добавить Роль
          </button>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#555]">Модуль / Права</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#00f5d4]">Admin</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Manager</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Moderator</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#555]">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <RBACRow label="Управление пользователями" perms={[3, 2, 1, 0]} />
              <RBACRow label="Редактирование контента" perms={[3, 3, 2, 0]} />
              <RBACRow label="Финансовые отчеты" perms={[3, 1, 0, 0]} />
              <RBACRow label="Системные настройки" perms={[3, 0, 0, 0]} />
              <RBACRow label="Модерация чатов" perms={[3, 2, 3, 0]} />
              <RBACRow label="Аналитика API" perms={[3, 1, 0, 0]} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UsersList({ theme }: any) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#555] group-focus-within:text-[#00f5d4] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Поиск по имени, email или ID..." 
            className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold text-white outline-none focus:border-[#00f5d4]/40 focus:ring-4 focus:ring-[#00f5d4]/5 transition-all shadow-xl"
          />
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="p-5 bg-[#0a0a0a] border border-white/5 rounded-2xl text-[#555] hover:text-white transition-all"><Filter size={20} /></button>
          <button className="px-8 py-5 bg-[#00f5d4] text-[#050505] rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#00f5d4]/20 hover:scale-105 transition-all flex items-center gap-3">
            <UserPlus size={18} /> Добавить пользователя
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#555]">Пользователь</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#555]">Email</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#555]">Роль</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#555]">Статус</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#555] text-right">Дата рег.</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#555] text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <UserRow name="Alex Griffin" email="alex@red-griffin.art" role="Admin" status="Активен" date="21 Мар 2026" roleColor="accent" />
            <UserRow name="Sarah Connor" email="sarah.c@sky.net" role="Manager" status="Активен" date="18 Мар 2026" roleColor="amber" />
            <UserRow name="Marcus Wright" email="m.wright@salvation.org" role="User" status="Приостановлен" date="15 Мар 2026" roleColor="blue" statusColor="red" />
            <UserRow name="Kyle Reese" email="k.reese@resistance.io" role="Moderator" status="Активен" date="12 Мар 2026" roleColor="purple" />
            <UserRow name="Elena Belova" email="black.widow@redroom.ru" role="User" status="Активен" date="10 Мар 2026" roleColor="blue" />
          </tbody>
        </table>
        <div className="p-8 border-t border-white/5 flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#555]">Показано 5 из 1,284 пользователей</div>
          <div className="flex gap-2">
            <button className="p-3 bg-[#111] border border-[#222] rounded-xl text-[#555] hover:text-white transition-all"><ChevronLeft size={16} /></button>
            <button className="p-3 bg-[#111] border border-[#222] rounded-xl text-[#555] hover:text-white transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserProfileView({ theme }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
      <div className="space-y-10">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
              <Edit size={16} className="text-[#00f5d4]" /> Редактировать профиль
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="relative group">
              <div className="size-40 rounded-[2.5rem] bg-[#111] border-4 border-white/5 flex items-center justify-center text-5xl font-black text-[#00f5d4] shadow-2xl shadow-[#00f5d4]/10">AG</div>
              <div className="absolute -bottom-2 -right-2 p-3 bg-[#00f5d4] text-[#050505] rounded-2xl shadow-xl border-4 border-[#0a0a0a]">
                <ShieldCheck size={20} />
              </div>
            </div>
            <div className="text-center md:text-left space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Alex Griffin</h2>
                  <span className="px-3 py-1 bg-[#00f5d4]/10 border border-[#00f5d4]/20 rounded-full text-[10px] font-black uppercase tracking-widest text-[#00f5d4]">Admin</span>
                </div>
                <p className="text-[13px] font-bold text-[#555] uppercase tracking-widest">alex@red-griffin.art · ID: RG-884291</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#888]"><Calendar size={14} className="text-[#00f5d4]" /> Регистрация: 21 Мар 2026</div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#888]"><Globe size={14} className="text-[#00f5d4]" /> Москва, Россия</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#555] border-b border-white/5 pb-6">Личная Информация</h3>
            <div className="space-y-6">
              <ProfileInfoRow label="Полное имя" value="Александр Григорьев" />
              <ProfileInfoRow label="Телефон" value="+7 (999) 000-00-00" />
              <ProfileInfoRow label="Специализация" value="Senior Character Artist" />
              <ProfileInfoRow label="Опыт работы" value="8 лет" />
              <ProfileInfoRow label="Веб-сайт" value="alexgriffin.pro" />
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#555] border-b border-white/5 pb-6">Статистика Аккаунта</h3>
            <div className="space-y-6">
              <DataRow label="Пройдено курсов" value="12" color={theme.green} />
              <DataRow label="Активных проектов" value="4" color={theme.blue} />
              <DataRow label="Средний балл" value="4.9 / 5.0" color={theme.amber} />
              <DataRow label="Всего потрачено" value="$2,450" color={theme.accent} />
              <DataRow label="Последний вход" value="Сегодня, 14:22" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#555]">Управление аккаунтом</h3>
          <div className="space-y-3">
            <ActionButton label="Сбросить пароль" />
            <ActionButton label="Заблокировать доступ" color="amber" />
            <ActionButton label="Удалить все данные" danger />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#555]">Текущее обучение</h3>
          <div className="space-y-2">
            <UserCourseItem title="Advanced Character Rigging" students="80% завершено" status="In Progress" color={theme.amber} />
            <UserCourseItem title="Mastering Houdini FX" students="45% завершено" status="In Progress" color={theme.blue} />
            <UserCourseItem title="ZBrush Anatomy Masterclass" students="Завершено" status="Completed" color={theme.green} />
          </div>
          <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-[#555] hover:text-white transition-colors">Показать все курсы</button>
        </div>
      </div>
    </div>
  );
}

function EditUserView({ theme }: any) {
  return (
    <div className="max-w-4xl mx-auto bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 shadow-2xl space-y-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f5d4]/5 blur-[80px] rounded-full pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">Создать Пользователя</h2>
          <p className="text-[11px] font-bold text-[#555] uppercase tracking-widest">Добавление нового участника в экосистему</p>
        </div>
        <div className="flex gap-3">
          <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Отмена</button>
          <button className="px-10 py-4 bg-[#00f5d4] text-[#050505] rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#00f5d4]/20 hover:scale-105 transition-all flex items-center gap-3">
            <Save size={18} /> Сохранить
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <FormGroup label="Имя пользователя" placeholder="Напр. Alex Griffin" />
        <FormGroup label="Email адрес" placeholder="user@red-griffin.art" type="email" />
        <FormGroup label="Роль в системе" defaultValue="Student" />
        <FormGroup label="Временный пароль" type="password" />
      </div>

      <div className="space-y-6 pt-6 border-t border-white/5">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#555]">Права доступа</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingToggle label="Доступ к Studio" desc="Разрешить просмотр проектов" on />
          <SettingToggle label="Создание курсов" desc="Права лектора академии" />
          <SettingToggle label="Управление API" desc="Доступ к системным ключам" />
          <SettingToggle label="Модерация" desc="Права на удаление комментариев" on />
        </div>
      </div>
    </div>
  );
}

function UserDetailsView({ theme }: any) {
  return (
    <div className="p-20 text-center opacity-40 uppercase font-black tracking-widest">Extended User Intelligence Protocol Offline...</div>
  );
}

function AdminChat({ theme }: any) {
  return (
    <div className="h-[700px] bg-[#0a0a0a] border border-white/5 rounded-[3rem] overflow-hidden flex shadow-2xl">
      <div className="w-80 border-r border-white/5 flex flex-col">
        <div className="p-8 border-b border-white/5 space-y-6">
          <h3 className="text-xl font-black uppercase tracking-tighter text-white italic">Обращения</h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
            <input type="text" placeholder="Поиск чатов..." className="w-full bg-[#111] border-none rounded-xl pl-11 pr-4 py-3 text-[11px] font-bold text-white placeholder:text-[#333] outline-none focus:ring-1 focus:ring-[#00f5d4]/20" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <ChatItem name="Marcus Wright" msg="Не могу активировать курс..." time="14:22" active initials="MW" color={theme.blue} />
          <ChatItem name="Elena Belova" msg="Вопрос по оплате картой" time="12:05" initials="EB" color={theme.purple} />
          <ChatItem name="Kyle Reese" msg="Ошибка при загрузке модели" time="Вчера" initials="KR" color={theme.amber} />
          <ChatItem name="Sarah Connor" msg="Заявка на роль лектора" time="Вчера" initials="SC" color={theme.green} />
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-white/[0.01]">
        <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-[#378add]/20 text-[#378add] flex items-center justify-center font-black">MW</div>
            <div>
              <div className="text-[13px] font-black uppercase tracking-tight">Marcus Wright</div>
              <div className="text-[9px] font-black text-[#1d9e75] uppercase tracking-widest">В сети</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-3 text-[#555] hover:text-white transition-colors"><Phone size={18} /></button>
            <button className="p-3 text-[#555] hover:text-white transition-colors"><MoreVertical size={18} /></button>
          </div>
        </div>
        <div className="flex-1 p-10 overflow-y-auto no-scrollbar flex flex-col gap-6">
          <Message msg="Добрый день! У меня возникла проблема с доступом к курсу 'Advanced Character Rigging' после оплаты." time="14:15" />
          <Message msg="ID транзакции: TX-99281-RG" time="14:16" />
          <Message me msg="Здравствуйте, Маркус! Вижу вашу оплату в системе. Секунду, проверю статус активации." time="14:20" />
          <Message me msg="Проблема решена. Попробуйте обновить страницу дашборда, курс должен появиться в разделе 'Моё обучение'." time="14:21" />
          <Message msg="Да, всё появилось! Спасибо за быструю помощь." time="14:22" />
        </div>
        <div className="p-8 bg-[#0a0a0a] border-t border-white/5">
          <div className="relative">
            <input type="text" placeholder="Введите сообщение..." className="w-full bg-[#111] border-none rounded-2xl pl-6 pr-16 py-5 text-[13px] font-medium text-white outline-none focus:ring-2 focus:ring-[#00f5d4]/10" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-4 bg-[#00f5d4] text-[#050505] rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#00f5d4]/20"><Send size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminSettings({ theme }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
      <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-2 h-fit shadow-2xl">
        {['Общие', 'Безопасность', 'Уведомления', 'Интеграции', 'API'].map((s, i) => (
          <button key={s} className={`w-full text-left px-5 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'text-[#00f5d4] bg-[#00f5d4]/5' : 'text-[#555] hover:bg-white/5 hover:text-white'}`}>{s}</button>
        ))}
      </div>
      <div className="space-y-8">
        <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-10 space-y-8 shadow-2xl">
          <h3 className="text-[15px] font-black uppercase tracking-[0.2em] border-b border-[#2a2a2a] pb-6 mb-2">Настройки платформы</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            <SettingToggle label="Режим обслуживания" desc="Временно закрыть доступ" />
            <SettingToggle label="Регистрация" desc="Разрешить новых пользователей" on />
            <SettingToggle label="Email верификация" desc="Требовать подтверждение" on />
            <SettingToggle label="Gemini AI" desc="Включить ассистента" on />
          </div>
        </div>

        <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-10 space-y-8 shadow-2xl">
          <h3 className="text-[15px] font-black uppercase tracking-[0.2em] border-b border-[#2a2a2a] pb-6 mb-2">Переменные окружения</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormGroup label="Gemini API Key" defaultValue="●●●●●●●●●●●●●●●●" type="password" />
            <FormGroup label="App URL" defaultValue="https://red-griffin.app" />
          </div>
          <div className="flex justify-end pt-6"><button className="px-10 py-4 bg-[#00f5d4] text-[#050505] rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#00f5d4]/20 hover:scale-105 transition-all">Сохранить</button></div>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-10 space-y-8 shadow-2xl">
          <h3 className="text-[15px] font-black uppercase tracking-[0.2em] text-red-500 border-b border-red-500/10 pb-6">Опасная зона</h3>
          <div className="flex items-center justify-between py-2 border-b border-red-500/10">
            <div><div className="text-[13px] text-red-500 font-black uppercase tracking-widest">Очистить кэш</div><div className="text-[11px] text-[#555] font-bold uppercase mt-1">Сбросить все кешированные данные</div></div>
            <button className="px-6 py-2.5 bg-[#222] border border-[#333] rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-red-500/40 transition-all">Очистить</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color }: any) {
  const isUp = trend.startsWith('+');
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 space-y-6 hover:border-white/10 transition-all shadow-xl group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity"><Icon size={64} style={{ color }} /></div>
      <div className="flex justify-between items-start relative z-10">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[#555] group-hover:text-white transition-colors"><Icon size={20} /></div>
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${isUp ? 'text-[#1d9e75]' : 'text-red-500'}`}>
          {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <div className="space-y-1 relative z-10">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-[#555]">{label}</div>
        <div className="text-4xl font-black tracking-tighter text-white">{value}</div>
      </div>
    </div>
  );
}

function StatusIndicator({ label, status, color }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
      <span className="text-[10px] font-black uppercase tracking-widest text-[#555] group-hover:text-[#888]">{label}</span>
      <div className="flex items-center gap-2">
        <div className="size-1.5 rounded-full shadow-[0_0_8px_currentColor] animate-pulse" style={{ color, backgroundColor: 'currentColor' }} />
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>{status}</span>
      </div>
    </div>
  );
}

function UsageBar({ label, value, color }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
        <span className="text-[#555]">{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function RBACRow({ label, perms }: any) {
  return (
    <tr className="group hover:bg-white/[0.01] transition-colors">
      <td className="py-6 text-[12px] font-bold text-white/60 group-hover:text-white transition-colors">{label}</td>
      {perms.map((p: number, i: number) => (
        <td key={i} className="py-6">
          <div className={`size-5 rounded-lg flex items-center justify-center ${p === 3 ? 'bg-emerald-500/20 text-emerald-500' : p === 2 ? 'bg-blue-500/20 text-blue-500' : p === 1 ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-[#333]'}`}>
            {p > 0 ? <Check size={12} strokeWidth={4} /> : <X size={12} />}
          </div>
        </td>
      ))}
    </tr>
  );
}

function UserRow({ name, email, role, status, date, roleColor, statusColor }: any) {
  const colors: any = {
    accent: '#00f5d4',
    amber: '#ef9f27',
    blue: '#378add',
    purple: '#7f77dd'
  };
  const initials = name.split(' ').map((n: any) => n[0]).join('');
  
  return (
    <tr className="hover:bg-white/[0.01] transition-colors group">
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl flex items-center justify-center text-[12px] font-black shadow-lg group-hover:scale-110 transition-all" style={{ background: `${colors[roleColor]}20`, color: colors[roleColor] }}>{initials}</div>
          <div className="text-[13px] font-black uppercase tracking-tight text-white group-hover:text-[#00f5d4] transition-colors">{name}</div>
        </div>
      </td>
      <td className="px-8 py-6 text-[12px] font-bold text-[#555]">{email}</td>
      <td className="px-8 py-6"><span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest" style={{ color: colors[roleColor], background: `${colors[roleColor]}10`, border: `1px solid ${colors[roleColor]}20` }}>{role}</span></td>
      <td className="px-8 py-6"><span className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${statusColor === 'red' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}><div className="size-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />{status}</span></td>
      <td className="px-8 py-6 text-right text-[11px] font-black text-[#555] uppercase tracking-widest">{date}</td>
      <td className="px-8 py-6 text-right">
        <div className="flex justify-end gap-2">
          <button className="p-2.5 bg-[#111] border border-[#222] rounded-lg text-[#555] hover:text-[#00f5d4] hover:border-[#00f5d4]/40 transition-all"><Edit size={14} /></button>
          <button className="p-2.5 bg-[#111] border border-[#222] rounded-lg text-[#555] hover:text-red-500 hover:border-red-500/40 transition-all"><Trash2 size={14} /></button>
        </div>
      </td>
    </tr>
  );
}

function Check({ size, ...props }: any) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>; }
function X({ size, ...props }: any) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>; }
function ChevronDown({ size, ...props }: any) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9"></polyline></svg>; }
function DollarSign({ size, ...props }: any) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>; }
function Hash({ size, ...props }: any) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>; }
