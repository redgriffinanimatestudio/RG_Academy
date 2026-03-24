import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  LayoutDashboard, 
  Layers, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Lock,
  Eye,
  Edit3,
  Trash2,
  Database,
  Target,
  Video,
  GraduationCap,
  Box,
  Briefcase
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TABS = [
  { id: 'hier', label: 'Иерархия', icon: Layers },
  { id: 'matrix', label: 'Матрица прав', icon: Database },
  { id: 'dash', label: 'Дашборд', icon: LayoutDashboard },
  { id: 'combo', label: 'Комбинации', icon: Users },
  { id: 'cond', label: 'Условия доступа', icon: ShieldCheck }
];

const HIERARCHY = [
  { id: 'admin', label: 'Admin', sub: 'Полный доступ · bypass rules · выдаёт admin', color: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-500/10' },
  { id: 'manager', label: 'Manager', sub: 'Операции · контракты · аналитика', color: 'text-amber-500', border: 'border-amber-500/50', bg: 'bg-amber-500/10' },
  { id: 'moderator', label: 'Moderator', sub: 'Контент · читает всё · бан юзеров', color: 'text-orange-500', border: 'border-orange-500/50', bg: 'bg-orange-500/10' },
  { id: 'lecturer', label: 'Lecturer', sub: 'Создаёт курсы · уроки · публикует', color: 'text-indigo-400', border: 'border-indigo-400/50', bg: 'bg-indigo-400/10' },
  { id: 'executor', label: 'Executor', sub: 'Берёт проекты · milestones · услуги', color: 'text-emerald-400', border: 'border-emerald-400/50', bg: 'bg-emerald-400/10' },
  { id: 'client', label: 'Client', sub: 'Создаёт проекты · нанимает · контракты', color: 'text-sky-400', border: 'border-sky-400/50', bg: 'bg-sky-400/10' },
  { id: 'student', label: 'Student', sub: 'Учится · прогресс · сертификаты', color: 'text-primary', border: 'border-primary/50', bg: 'bg-primary/10' },
  { id: 'guest', label: 'Guest', sub: 'Только чтение публичного', color: 'text-white/40', border: 'border-white/10', bg: 'bg-white/5' }
];

export const RolePermissionMatrix = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('hier');

  const sym = (type: 'ok' | 'no' | 'cond' | 'own') => {
    switch(type) {
      case 'ok': return <span className="text-emerald-500 text-lg">●</span>;
      case 'own': return <span className="text-blue-400 text-lg">★</span>;
      case 'cond': return <span className="text-amber-500 text-base">▲</span>;
      case 'no': return <span className="text-white/10 text-lg">—</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-primary text-bg-dark shadow-lg shadow-primary/20 scale-[1.02]' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'hier' && (
            <motion.div
              key="hier"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/10">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white">Иерархия прав</h3>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Global Administrative Access Levels & Inheritance</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 relative">
                  {/* Super Tier */}
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-24 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Super</div>
                    <div className="flex-1 flex gap-4">
                      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex-1 max-w-sm group hover:border-red-500/40 transition-all">
                        <div className="text-red-500 text-sm font-black uppercase tracking-widest mb-2 flex items-center justify-between">
                          Admin <Shield size={14} />
                        </div>
                        <p className="text-[10px] text-white/40 font-bold leading-relaxed uppercase tracking-wider">Полный доступ · bypass rules · выдаёт admin</p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-12 md:ml-36 border-l-2 border-dashed border-white/5 h-8" />

                  {/* Ops Tier */}
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-24 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Operations</div>
                    <div className="flex-1 flex gap-4">
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex-1 max-w-sm group hover:border-amber-500/40 transition-all">
                        <div className="text-amber-500 text-sm font-black uppercase tracking-widest mb-2 flex items-center justify-between">
                          Manager <Target size={14} />
                        </div>
                        <p className="text-[10px] text-white/40 font-bold leading-relaxed uppercase tracking-wider">Операции · контракты · аналитика</p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-12 md:ml-36 border-l-2 border-dashed border-white/5 h-8" />

                  {/* Content Tier */}
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-24 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Content</div>
                    <div className="flex-1 flex gap-4">
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 flex-1 max-w-sm group hover:border-orange-500/40 transition-all">
                        <div className="text-orange-500 text-sm font-black uppercase tracking-widest mb-2 flex items-center justify-between">
                          Moderator <ShieldCheck size={14} />
                        </div>
                        <p className="text-[10px] text-white/40 font-bold leading-relaxed uppercase tracking-wider">Контент · читает всё · бан юзеров</p>
                      </div>
                    </div>
                  </div>

                  <div className="my-8 py-4 px-8 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 italic">Независимые роли — комбинируются друг с другом</p>
                  </div>

                  {/* Independent Tiers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-4">Academy Hub</div>
                      <div className="grid gap-3">
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 flex items-center justify-between group hover:border-indigo-500/40 transition-all">
                          <div>
                            <div className="text-indigo-400 text-xs font-black uppercase tracking-widest">Lecturer</div>
                            <p className="text-[9px] text-white/30 font-bold uppercase mt-1">Создаёт & Публикует курсы</p>
                          </div>
                          <Video size={18} className="text-indigo-400/20" />
                        </div>
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex items-center justify-between opacity-60 hover:opacity-100 transition-all">
                          <div>
                            <div className="text-primary text-xs font-black uppercase tracking-widest">Student</div>
                            <p className="text-[9px] text-white/30 font-bold uppercase mt-1">Обучение & Сертификаты</p>
                          </div>
                          <GraduationCap size={18} className="text-primary/20" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-4">Studio Engine</div>
                      <div className="grid gap-3">
                        <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-5 flex items-center justify-between group hover:border-sky-500/40 transition-all">
                          <div>
                            <div className="text-sky-400 text-xs font-black uppercase tracking-widest">Client</div>
                            <p className="text-[9px] text-white/30 font-bold uppercase mt-1">Заказчик · Нанимает талант</p>
                          </div>
                          <Box size={18} className="text-sky-400/20" />
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 flex items-center justify-between opacity-60 hover:opacity-100 transition-all">
                          <div>
                            <div className="text-emerald-400 text-xs font-black uppercase tracking-widest">Executor</div>
                            <p className="text-[9px] text-white/30 font-bold uppercase mt-1">Исполнитель · Продакшн</p>
                          </div>
                          <Briefcase size={18} className="text-emerald-400/20" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-x-12 gap-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-white/20 text-xs font-black">⊃</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Полное наследование прав</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/20 text-xs font-black">—</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Независимые роли</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield size={12} className="text-red-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Super Admin hardcoded by email</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'matrix' && (
            <motion.div
              key="matrix"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Ресурс / Действие</th>
                      {['Guest', 'Student', 'Lecturer', 'Client', 'Exec', 'Mod', 'Mgr', 'Admin'].map(r => (
                        <th key={r} className="px-4 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 text-center border-l border-white/5">{r}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { section: '📚 ACADEMY — Courses' },
                      { action: 'Просмотр списка', perms: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok'] },
                      { action: 'Просмотр черновиков', perms: ['no', 'no', 'own', 'no', 'no', 'ok', 'ok', 'ok'] },
                      { action: 'Создать курс', perms: ['no', 'no', 'ok', 'no', 'no', 'no', 'ok', 'ok'] },
                      { action: 'Редактировать курс', perms: ['no', 'no', 'own', 'no', 'no', 'no', 'ok', 'ok'] },
                      { action: 'Опубликовать/снять', perms: ['no', 'no', 'own', 'no', 'no', 'ok', 'ok', 'ok'] },
                      
                      { section: '📖 ACADEMY — Lessons' },
                      { action: 'Список уроков', perms: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok'] },
                      { action: 'Контент урока', perms: ['no', 'cond', 'own', 'no', 'no', 'ok', 'ok', 'ok'] },
                      { action: 'CRUD уроков', perms: ['no', 'no', 'own', 'no', 'no', 'no', 'ok', 'ok'] },
                      
                      { section: '🎬 STUDIO — Projects' },
                      { action: 'Список открытых проектов', perms: ['no', 'no', 'no', 'ok', 'ok', 'ok', 'ok', 'ok'] },
                      { action: 'Создать проект', perms: ['no', 'no', 'no', 'ok', 'no', 'no', 'ok', 'ok'] },
                      { action: 'Редактировать проект', perms: ['no', 'no', 'no', 'own', 'cond', 'no', 'ok', 'ok'] },
                      
                      { section: '🔒 ADMIN — Control' },
                      { action: 'Читать любой профиль', perms: ['no', 'no', 'no', 'no', 'no', 'ok', 'ok', 'ok'] },
                      { action: 'Изменить роли юзера', perms: ['no', 'no', 'no', 'no', 'no', 'no', 'cond', 'ok'] },
                      { action: 'Удалить юзера', perms: ['no', 'no', 'no', 'no', 'no', 'no', 'no', 'ok'] }
                    ].map((row, i) => {
                      if ('section' in row) {
                        return (
                          <tr key={i} className="bg-primary/5">
                            <td colSpan={9} className="px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary">{row.section}</td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-5 text-[11px] font-bold text-white/60 group-hover:text-white transition-colors">{row.action}</td>
                          {row.perms?.map((p, pIdx) => (
                            <td key={pIdx} className="px-4 py-5 text-center border-l border-white/5">
                              {sym(p as any)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-8 border-t border-white/10 bg-black/40 flex flex-wrap gap-8">
                <div className="flex items-center gap-3"><span className="text-emerald-500 text-lg">●</span> <span className="text-[10px] font-black uppercase text-white/40">Полный доступ</span></div>
                <div className="flex items-center gap-3"><span className="text-blue-400 text-lg">★</span> <span className="text-[10px] font-black uppercase text-white/40">Только свои</span></div>
                <div className="flex items-center gap-3"><span className="text-amber-500 text-lg">▲</span> <span className="text-[10px] font-black uppercase text-white/40">Условный</span></div>
                <div className="flex items-center gap-3"><span className="text-white/10 text-lg">—</span> <span className="text-[10px] font-black uppercase text-white/40">Нет доступа</span></div>
              </div>
            </motion.div>
          )}

          {activeTab === 'dash' && (
            <motion.div
              key="dash"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { role: 'Student', color: 'text-primary', bg: 'bg-primary/10', items: ['Мои курсы + прогресс', 'Сертификаты', 'История записей', 'Рекомендованные курсы'] },
                { role: 'Lecturer', color: 'text-indigo-400', bg: 'bg-indigo-400/10', items: ['Мои созданные курсы', 'Список студентов', 'Доход / аналитика', 'Отзывы на мои курсы', 'Редактировать курс'] },
                { role: 'Client', color: 'text-sky-400', bg: 'bg-sky-400/10', items: ['Мои проекты', 'Входящие заявки', 'Активные контракты', 'Выплата milestone', 'Поиск исполнителей'] },
                { role: 'Executor', color: 'text-emerald-400', bg: 'bg-emerald-400/10', items: ['Мои заявки на проекты', 'Активные контракты', 'Milestones прогресс', 'Мои услуги (Services)', 'Открытые проекты'] },
                { role: 'Moderator', color: 'text-orange-500', bg: 'bg-orange-500/10', items: ['Очередь публикации', 'Жалобы / отзывы', 'Все юзеры (чтение)', 'Бан пользователей', 'Уведомления'] },
                { role: 'Manager', color: 'text-amber-500', bg: 'bg-amber-500/10', items: ['Все контракты платформы', 'Создание контрактов', 'Выдача сертификатов', 'Аналитика системы', 'Управление ролями'] },
                { role: 'Admin', color: 'text-red-500', bg: 'bg-red-500/10', items: ['Все права Manager+', 'Выдача роли Admin', 'Hard delete пользователей', 'Audit log', 'Settings bypass'] }
              ].map(card => (
                <div key={card.role} className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl group hover:border-white/20 transition-all">
                  <div className={`px-6 py-4 border-b border-white/5 ${card.bg}`}>
                    <h4 className={`text-xs font-black uppercase tracking-widest ${card.color}`}>{card.role} Hub</h4>
                  </div>
                  <div className="p-6 space-y-3">
                    {card.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 group/item">
                        <div className={`size-1.5 rounded-full bg-white/10 group-hover/item:bg-current transition-colors ${card.color}`} />
                        <span className="text-[10px] font-bold text-white/40 group-hover/item:text-white transition-colors uppercase tracking-wider">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'combo' && (
            <motion.div
              key="combo"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                { title: 'Обычный студент', roles: ['student'], desc: 'Базовый случай. Только записывается на курсы, смотрит уроки, получает сертификаты.' },
                { title: 'Студент-преподаватель', roles: ['student', 'lecturer'], desc: 'Учится сам и одновременно ведёт свои курсы. Типичный сценарий для середняка.' },
                { title: 'Фрилансер', roles: ['executor'], desc: 'Берёт проекты от клиентов, работает по контрактам, выставляет услуги.' },
                { title: 'Студия / субподряд', roles: ['executor', 'client'], desc: 'Берёт крупный проект как executor и нанимает помощников как client.' },
                { title: 'Операционный менеджер', roles: ['manager'], desc: 'Включает все права moderator. Создаёт контракты, выдаёт сертификаты, видит аналитику.' },
                { title: 'Невалидный дубль', roles: ['manager', 'moderator'], error: true, desc: 'Manager уже включает все права moderator — дублировать бессмысленно.' }
              ].map((combo, idx) => (
                <div key={idx} className={`bg-white/[0.03] border rounded-[2rem] p-8 backdrop-blur-xl space-y-6 ${combo.error ? 'border-red-500/20' : 'border-white/10 hover:border-white/20'} transition-all`}>
                  <div className="space-y-3">
                    {combo.error && <div className="flex items-center gap-2 text-red-500 text-[8px] font-black uppercase tracking-widest mb-4 bg-red-500/10 px-3 py-1.5 rounded-lg w-fit"><AlertTriangle size={10} /> Конфликт ролей</div>}
                    <h4 className={`text-sm font-black uppercase tracking-tight ${combo.error ? 'text-red-500/60' : 'text-white'}`}>{combo.title}</h4>
                    <div className="flex flex-wrap gap-2">
                      {combo.roles.map(r => (
                        <span key={r} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">{r}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] font-medium text-white/40 leading-relaxed uppercase tracking-wide">{combo.desc}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'cond' && (
            <motion.div
              key="cond"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">Условия доступа</h3>
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-1">Backend access policy checks & ownership validation</p>
                </div>
                <Lock className="text-white/5" size={40} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Действие</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Роль</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Условие проверки</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { action: 'Читать урок', role: 'student', cond: 'Существует enrollment: userId = uid + courseId совпадает', type: 'cond' },
                      { action: 'Оставить отзыв', role: 'student', cond: 'progress = 100% ИЛИ все уроки completed', type: 'cond' },
                      { action: 'Редактировать курс', role: 'lecturer', cond: 'course.lecturerId = req.uid', type: 'own' },
                      { action: 'CRUD уроков', role: 'lecturer', cond: 'parent course.lecturerId = req.uid', type: 'own' },
                      { action: 'Редактировать проект', role: 'client', cond: 'project.clientId = req.uid', type: 'own' },
                      { action: 'Выплатить milestone', role: 'client', cond: 'contract.clientId = uid + contract.status = active', type: 'cond' },
                      { action: 'Смотреть контракт', role: 'executor', cond: 'contract.executorId = uid', type: 'own' },
                      { action: 'Писать в чат', role: 'любой', cond: 'uid входит в chatRoom.participants[]', type: 'cond' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-5 text-[11px] font-bold text-white/80 uppercase">{row.action}</td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                            row.type === 'cond' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                          }`}>
                            {row.role}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-[10px] font-bold text-white/30 italic uppercase tracking-wider">{row.cond}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-8 bg-black/40 border-t border-white/5 flex items-center gap-4 text-red-400/60">
                <Info size={16} />
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  Bypass: Admin + Manager имеют приоритет над всеми условиями выше. Moderator = read-only bypass.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
