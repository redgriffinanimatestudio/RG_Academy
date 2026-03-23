import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  route: string;
  descriptionKey: string;
  roles: string[];
}

interface ApiSection {
  titleKey: string;
  endpoints: ApiEndpoint[];
}

const API_DATA: ApiSection[] = [
  {
    titleKey: 'courses_api',
    endpoints: [
      { method: 'GET', route: '/courses', descriptionKey: 'catalog_desc', roles: ['public'] },
      { method: 'GET', route: '/courses/:slug', descriptionKey: 'course_page_desc', roles: ['public'] },
      { method: 'GET', route: '/courses/search', descriptionKey: 'fulltext_search_desc', roles: ['public'] },
      { method: 'POST', route: '/courses', descriptionKey: 'create_course_desc', roles: ['lecturer'] },
      { method: 'PATCH', route: '/courses/:id', descriptionKey: 'update_course_desc', roles: ['lecturer'] },
      { method: 'DELETE', route: '/courses/:id', descriptionKey: 'delete_course_desc', roles: ['lecturer', 'admin'] },
      { method: 'PATCH', route: '/courses/:id/publish', descriptionKey: 'publish_course_desc', roles: ['lecturer', 'moderator'] },
      { method: 'GET', route: '/courses/:id/students', descriptionKey: 'students_list_desc', roles: ['lecturer'] },
      { method: 'GET', route: '/courses/me', descriptionKey: 'my_courses_lecturer_desc', roles: ['lecturer'] },
      { method: 'GET', route: '/courses/:id/analytics', descriptionKey: 'course_analytics_desc', roles: ['lecturer'] },
    ]
  },
  {
    titleKey: 'lessons_api',
    endpoints: [
      { method: 'GET', route: '/courses/:id/lessons', descriptionKey: 'lessons_list_desc', roles: ['public'] },
      { method: 'POST', route: '/courses/:id/lessons', descriptionKey: 'create_lesson_desc', roles: ['lecturer'] },
      { method: 'GET', route: '/lessons/:id', descriptionKey: 'lesson_content_desc', roles: ['student', 'lecturer'] },
      { method: 'PATCH', route: '/lessons/:id', descriptionKey: 'update_lesson_desc', roles: ['lecturer'] },
      { method: 'DELETE', route: '/lessons/:id', descriptionKey: 'delete_lesson_desc', roles: ['lecturer', 'admin'] },
      { method: 'PATCH', route: '/lessons/:id/order', descriptionKey: 'reorder_lessons_desc', roles: ['lecturer'] },
      { method: 'POST', route: '/lessons/:id/complete', descriptionKey: 'complete_lesson_desc', roles: ['student'] },
      { method: 'POST', route: '/lessons/:id/video', descriptionKey: 'upload_video_desc', roles: ['lecturer'] },
    ]
  },
  {
    titleKey: 'enrollments_api',
    endpoints: [
      { method: 'POST', route: '/enrollments', descriptionKey: 'enroll_course_desc', roles: ['student'] },
      { method: 'DELETE', route: '/enrollments/:id', descriptionKey: 'cancel_enroll_desc', roles: ['student', 'admin'] },
      { method: 'GET', route: '/enrollments/me', descriptionKey: 'my_enrollments_desc', roles: ['student'] },
      { method: 'GET', route: '/enrollments/:id/progress', descriptionKey: 'course_progress_desc', roles: ['student', 'lecturer'] },
      { method: 'GET', route: '/enrollments/check/:courseId', descriptionKey: 'check_enroll_desc', roles: ['student'] },
    ]
  },
  {
    titleKey: 'reviews_api',
    endpoints: [
      { method: 'GET', route: '/courses/:id/reviews', descriptionKey: 'course_reviews_desc', roles: ['public'] },
      { method: 'POST', route: '/courses/:id/reviews', descriptionKey: 'leave_review_desc', roles: ['student'] },
      { method: 'PATCH', route: '/reviews/:id', descriptionKey: 'edit_review_desc', roles: ['student'] },
      { method: 'DELETE', route: '/reviews/:id', descriptionKey: 'delete_review_desc', roles: ['student', 'moderator'] },
    ]
  }
];

const DevDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('endpoints');
  const [activeFilter, setActiveFilter] = useState('all');

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-emerald-400 bg-emerald-400/10';
      case 'POST': return 'text-indigo-400 bg-indigo-400/10';
      case 'PATCH': return 'text-amber-400 bg-amber-400/10';
      case 'DELETE': return 'text-rose-400 bg-rose-400/10';
      default: return 'text-zinc-400 bg-zinc-400/10';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'public': return 'border-zinc-700 text-zinc-400';
      case 'lecturer': return 'border-indigo-500/30 text-indigo-400';
      case 'admin': return 'border-rose-500/30 text-rose-400';
      case 'moderator': return 'border-amber-500/30 text-amber-400';
      case 'student': return 'border-sky-500/30 text-sky-400';
      default: return 'border-zinc-700 text-zinc-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-mono text-xs pt-20">
      {/* Top Nav Tabs */}
      <div className="border-b border-zinc-800 bg-[#0f0f0f] sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button className="p-4 flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors">
            <ChevronLeft size={14} />
          </button>
          {[
            { id: 'endpoints', label: t('endpoints') },
            { id: 'entities', label: t('entities') },
            { id: 'controller', label: t('controller') },
            { id: 'service', label: t('service') },
            { id: 'dto', label: t('dto') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-white bg-white/5'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="flex-1" />
          <div className="relative px-4">
            <Search size={14} className="absolute left-7 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder={t('search_api')}
              className="bg-zinc-900 border border-zinc-800 rounded px-8 py-1.5 w-48 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button className="p-4 flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Sub Filters */}
      <div className="border-b border-zinc-800 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'Все' },
            { id: 'courses', label: 'Courses' },
            { id: 'lessons', label: 'Lessons' },
            { id: 'enrollments', label: 'Enrollments' },
            { id: 'reviews', label: 'Reviews' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2 rounded border transition-all whitespace-nowrap ${
                activeFilter === filter.id
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-[#0f0f0f] border-b border-zinc-800 text-[10px] font-black tracking-widest text-zinc-500 uppercase">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-[80px_1.5fr_2fr_1fr] py-3">
          <div>{t('method')}</div>
          <div>{t('route')}</div>
          <div>{t('description')}</div>
          <div className="text-right">{t('roles')}</div>
        </div>
      </div>

      {/* API Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-8 pb-20">
        {API_DATA.map((section) => (
          <div key={section.titleKey} className="space-y-1">
            <div className="py-2 px-4 bg-indigo-500/5 text-indigo-400 font-bold border-l-2 border-indigo-500 mb-2">
              {t(section.titleKey)}
            </div>
            {section.endpoints.map((endpoint, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="grid grid-cols-[80px_1.5fr_2fr_1fr] py-3 px-4 border-b border-zinc-900 hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <div className="flex items-center">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                </div>
                <div className="flex items-center font-bold text-zinc-100 group-hover:text-primary transition-colors">
                  {endpoint.route}
                </div>
                <div className="flex items-center text-zinc-500 italic">
                  {t(endpoint.descriptionKey)}
                </div>
                <div className="flex items-center justify-end gap-1 flex-wrap">
                  {endpoint.roles.map((role) => (
                    <span key={role} className={`px-2 py-0.5 rounded-full border text-[9px] ${getRoleColor(role)}`}>
                      {t(`${role}_role`)}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-zinc-800 py-2 px-4 text-[10px] text-zinc-600 flex justify-between items-center z-20">
        <div>Показано: 27 эндпоинтов · Нажмите строку — получите код</div>
        <div className="flex gap-4">
          <span className="text-emerald-500">● Online</span>
          <span>v1.4.2-stable</span>
        </div>
      </div>
    </div>
  );
};

export default DevDashboard;
