import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Video, 
  Box, 
  Briefcase, 
  ChevronRight,
  Info,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Users,
  Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../context/AuthContext';
import { useAlert } from './Alert';

const PERMS: Record<string, any> = {
  s: {
    id: 'student',
    label: 'Student',
    color: '#378add',
    bg: 'bg-[#378add]',
    lightBg: 'bg-[#E6F1FB]',
    textColor: 'text-[#185FA5]',
    borderColor: 'border-[#85B7EB]',
    icon: GraduationCap,
    academy: [
      'Просматривать опубликованные курсы',
      'Смотреть список уроков',
      'Читать контент урока (если enrolled)',
      'Записаться на курс',
      'Отслеживать прогресс',
      'Завершить урок',
      'Оставить отзыв (после прохождения)',
      'Получить сертификат',
    ],
    studio: [],
    shared: [
      'Читать/писать в чат (если в participants)',
      'Свои уведомления',
    ],
    dashboard: [
      'Мои курсы + прогресс',
      'Сертификаты',
      'История записей',
      'Рекомендованные курсы',
    ],
  },
  l: {
    id: 'lecturer',
    label: 'Lecturer',
    color: '#7f77dd',
    bg: 'bg-[#7f77dd]',
    lightBg: 'bg-[#EEEDFE]',
    textColor: 'text-[#3C3489]',
    borderColor: 'border-[#AFA9EC]',
    icon: Video,
    academy: [
      'Создавать курсы (draft)',
      'Редактировать свои курсы',
      'Публиковать / снимать свои курсы',
      'Создавать / редактировать уроки',
      'Загружать видео (→ S3)',
      'Переставлять порядок уроков',
      'Видеть список студентов курса',
      'Аналитика своих курсов (доход, просмотры)',
      'Читать черновики своих курсов',
    ],
    studio: [],
    shared: [
      'Читать/писать в чат (если в participants)',
      'Свои уведомления',
    ],
    dashboard: [
      'Мои созданные курсы',
      'Список студентов',
      'Доход / аналитика',
      'Отзывы на мои курсы',
      'Создать / редактировать курс',
    ],
  },
  c: {
    id: 'client',
    label: 'Client',
    color: '#1d9e75',
    bg: 'bg-[#1d9e75]',
    lightBg: 'bg-[#E1F5EE]',
    textColor: 'text-[#0F6E56]',
    borderColor: 'border-[#5DCAA5]',
    icon: Box,
    academy: [],
    studio: [
      'Создавать проекты (clientId = uid)',
      'Редактировать свои проекты',
      'Просматривать все открытые проекты',
      'Видеть заявки на свои проекты',
      'Принимать / отклонять заявки',
      'Управлять задачами своего проекта',
      'Просматривать свои контракты',
      'Выплачивать milestone (если active)',
      'Просматривать список услуг (executor)',
    ],
    shared: [
      'Читать/писать в чат (если в participants)',
      'Свои уведомления',
    ],
    dashboard: [
      'Мои проекты',
      'Входящие заявки от исполнителей',
      'Активные контракты',
      'Выплата milestone',
      'Поиск исполнителей',
    ],
  },
  e: {
    id: 'executor',
    label: 'Executor',
    color: '#5dcaa5',
    bg: 'bg-[#5dcaa5]',
    lightBg: 'bg-[#9FE1CB]',
    textColor: 'text-[#04342C]',
    borderColor: 'border-[#1D9E75]',
    icon: Briefcase,
    academy: [],
    studio: [
      'Просматривать открытые проекты',
      'Подавать заявки на проекты',
      'Видеть свои поданные заявки',
      'Редактировать задачи (если назначен)',
      'Просматривать свои контракты',
      'Обновлять статус milestone (done)',
      'Создавать / редактировать услуги',
    ],
    shared: [
      'Читать/писать в чат (если в participants)',
      'Свои уведомления',
    ],
    dashboard: [
      'Мои заявки на проекты',
      'Активные контракты',
      'Milestones прогресс',
      'Мои услуги (Services)',
      'Открытые проекты',
    ],
  },
};

const NAMES: Record<string, string> = {
  '': 'Выбери роли выше',
  's': 'Студент',
  'l': 'Лектор',
  'c': 'Клиент',
  'e': 'Исполнитель',
  'sl': 'Студент + лектор',
  'sc': 'Студент + клиент',
  'se': 'Студент + исполнитель',
  'lc': 'Лектор + клиент',
  'le': 'Лектор + исполнитель',
  'ce': 'Клиент + исполнитель (субподряд)',
  'slc': 'Студент + лектор + клиент',
  'sle': 'Студент + лектор + исполнитель',
  'sce': 'Студент + клиент + исполнитель',
  'lce': 'Лектор + клиент + исполнитель',
  'slce': 'Максимальный пользовательский профиль',
};

const OVERLAPS: Record<string, string[]> = {
  'sl': ['Может учиться сам на своих же курсах','Видит студентов — и сам является студентом'],
  'ce': ['Может нанимать других и сам браться за работу','Субподряд: взял проект как executor, нанял помощника как client'],
  'lce': ['Преподаёт, берёт проекты, нанимает помощников — полный CG-фрилансер'],
  'slce': ['Полный участник платформы — учится, преподаёт, заказывает и исполняет'],
  'sc': ['Учится и одновременно заказывает CG-услуги для своих проектов'],
  'se': ['Учится и параллельно берёт заказы на фриланс'],
  'le': ['Преподаёт и сам берёт студийные проекты'],
  'lc': ['Преподаёт и заказывает услуги у других исполнителей'],
};

const PRESETS = [
  { id: 'student', label: 'Студент', roles: ['s'] },
  { id: 'lecturer', label: 'Лектор', roles: ['l'] },
  { id: 'sl', label: 'Студент + лектор', roles: ['s', 'l'] },
  { id: 'freelancer', label: 'Фрилансер', roles: ['e'] },
  { id: 'studio', label: 'Студия (субподряд)', roles: ['c', 'e'] },
  { id: 'all', label: 'Всё сразу', roles: ['s', 'l', 'c', 'e'] },
];

export const RoleCombinationMatrix = () => {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const alert = useAlert();
  const [activeRoles, setActiveRoles] = useState<Set<string>>(new Set(['s']));
  const [isApplying, setIsApplying] = useState(false);

  // Initialize from user profile if available
  React.useEffect(() => {
    if (profile?.roles && profile.roles.length > 0) {
      // Map full role names back to short keys (s, l, c, e)
      const mapped = new Set<string>();
      profile.roles.forEach(r => {
        if (r === 'student') mapped.add('s');
        if (r === 'lecturer') mapped.add('l');
        if (r === 'client') mapped.add('c');
        if (r === 'executor') mapped.add('e');
      });
      if (mapped.size > 0) setActiveRoles(mapped);
    }
  }, [profile]);

  const toggleRole = (role: string) => {
    const next = new Set(activeRoles);
    if (next.has(role)) {
      next.delete(role);
    } else {
      next.add(role);
    }
    setActiveRoles(next);
  };

  const setPreset = (roles: string[]) => {
    setActiveRoles(new Set(roles));
  };

  const applyRoles = async () => {
    if (!user) {
      alert.showError('Authentication required to apply roles');
      return;
    }

    try {
      setIsApplying(true);
      const rolesArray = Array.from(activeRoles).map(r => PERMS[r].id);
      
      const res = await fetch(`/api/v1/admin/users/${user.uid}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({ roles: rolesArray })
      });

      if (!res.ok) throw new Error('Failed to update roles');
      
      alert.showSuccess('Роли успешно применены! Перезагрузите страницу.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (e: any) {
      alert.showError(e.message || 'Ошибка применения ролей');
    } finally {
      setIsApplying(false);
    }
  };

  const rolesArray = useMemo(() => ['s', 'l', 'c', 'e'].filter(r => activeRoles.has(r)), [activeRoles]);
  const currentKey = useMemo(() => rolesArray.join(''), [rolesArray]);

  const combinedPermissions = useMemo(() => {
    const zones = ['academy', 'studio', 'shared', 'dashboard'];
    const result: Record<string, { text: string, role: string }[]> = {
      academy: [],
      studio: [],
      shared: [],
      dashboard: []
    };

    zones.forEach(zone => {
      const seen = new Set<string>();
      rolesArray.forEach(r => {
        (PERMS[r][zone] || []).forEach((p: string) => {
          if (!seen.has(p)) {
            seen.add(p);
            result[zone].push({ text: p, role: r });
          }
        });
      });
    });

    return result;
  }, [rolesArray]);

  const activeOverlaps = useMemo(() => {
    const msgs: string[] = [];
    
    // Check for all possible sub-combinations
    for (let i = 0; i < rolesArray.length; i++) {
      for (let j = i + 1; j <= rolesArray.length; j++) {
        const s = rolesArray.slice(i, j).join('');
        if (OVERLAPS[s]) msgs.push(...OVERLAPS[s]);
      }
    }
    if (OVERLAPS[currentKey]) msgs.push(...OVERLAPS[currentKey]);
    
    return [...new Set(msgs)];
  }, [rolesArray, currentKey]);

  return (
    <div className="space-y-8">
      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <Info className="text-primary" size={20} />
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest">
            Выбери одну или несколько ролей — увидишь что получает этот пользователь
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {Object.entries(PERMS).map(([id, data]) => {
            const isActive = activeRoles.has(id);
            const Icon = data.icon;
            return (
              <button
                key={id}
                onClick={() => toggleRole(id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all duration-300 ${
                  isActive 
                    ? `${data.bg} border-transparent text-bg-dark shadow-lg shadow-${data.id}/20 scale-105` 
                    : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                }`}
              >
                <Icon size={18} />
                <span className="text-xs font-black uppercase tracking-widest">{data.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Пресеты:</span>
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => setPreset(preset.roles)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all uppercase tracking-wider"
              >
                {preset.label}
              </button>
            ))}
          </div>
          
          <button
            onClick={applyRoles}
            disabled={isApplying}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              isApplying 
                ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                : 'bg-primary text-bg-dark hover:scale-105 shadow-lg shadow-primary/20'
            }`}
          >
            {isApplying ? 'Сохранение...' : 'Применить к моему профилю'}
          </button>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="bg-white/5 border-b border-white/10 p-6 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-white">
              {NAMES[currentKey] || (rolesArray.length > 0 ? `${rolesArray.length} Роли` : 'Нет ролей')}
            </h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">User profile structure</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {rolesArray.length === 0 ? (
              <span className="px-4 py-2 rounded-full bg-white/5 text-white/20 text-[10px] font-black uppercase tracking-widest border border-white/5">Нет ролей</span>
            ) : (
              rolesArray.map(r => {
                const data = PERMS[r];
                const Icon = data.icon;
                return (
                  <span key={r} className={`flex items-center gap-2 px-4 py-2 rounded-full ${data.bg} text-bg-dark text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/20`}>
                    <Icon size={12} />
                    {data.label}
                  </span>
                );
              })
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[
            { id: 'academy', label: 'Academy', color: 'text-primary' },
            { id: 'studio', label: 'Studio', color: 'text-primary-hover' },
            { id: 'shared', label: 'Shared / Global', color: 'text-white/60' },
            { id: 'dashboard', label: 'Dashboard Hub', color: 'text-[#ef9f27]' }
          ].map((zone, idx) => (
            <div key={zone.id} className={`p-8 ${idx < 3 ? 'md:border-r border-white/5' : ''} border-b md:border-b-0 border-white/5`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`size-2 rounded-full bg-current ${zone.color}`} />
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${zone.color}`}>
                  {zone.label}
                </h4>
              </div>
              
              <div className="space-y-4">
                {combinedPermissions[zone.id].length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 opacity-20">
                    <Zap size={24} className="mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest italic">Нет доступа</span>
                  </div>
                ) : (
                  combinedPermissions[zone.id].map((perm, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3 group">
                      <div className={`size-1.5 rounded-full mt-1.5 shrink-0 transition-transform group-hover:scale-125 ${PERMS[perm.role].bg}`} />
                      <span className="text-[11px] font-medium text-white/70 leading-relaxed transition-colors group-hover:text-white">
                        {perm.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {activeOverlaps.length > 0 && rolesArray.length > 1 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-primary/5 border-t border-primary/20 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-primary" size={18} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                  Пересечения и синергия ролей
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOverlaps.map((msg, mIdx) => (
                  <div key={mIdx} className="flex items-center gap-3 bg-primary/10 border border-primary/10 p-4 rounded-2xl">
                    <ChevronRight size={14} className="text-primary" />
                    <span className="text-[11px] font-bold text-white/90">{msg}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-8 py-6 border-t border-white/5">
        {Object.entries(PERMS).map(([id, data]) => (
          <div key={id} className="flex items-center gap-3">
            <div className={`size-2.5 rounded-full ${data.bg}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{data.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
