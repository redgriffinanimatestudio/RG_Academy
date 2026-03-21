import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Play, 
  ChevronRight,
  Calendar,
  Star,
  Zap,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const MY_COURSES = [
  {
    id: '1',
    slug: 'mastering-character-rigging-maya',
    title: 'Mastering Character Rigging in Maya',
    progress: 40,
    thumbnail: 'https://picsum.photos/seed/rigging/400/225',
    lastAccessed: '2 hours ago',
    nextLesson: 'Naming Conventions'
  },
  {
    id: '4',
    slug: 'unreal-engine-5-real-time-lighting',
    title: 'Unreal Engine 5: Real-time Lighting',
    progress: 85,
    thumbnail: 'https://picsum.photos/seed/ue5/400/225',
    lastAccessed: '1 day ago',
    nextLesson: 'Volumetric Fog'
  }
];

export default function Dashboard() {
  const { t } = useTranslation();
  const { lang } = useParams();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <TrendingUp size={14} />
              Student Dashboard
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-none">
              Welcome back, <br />
              <span className="text-primary italic">Artist.</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-center min-w-[120px]">
              <div className="text-2xl font-black text-white">12</div>
              <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Courses</div>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-center min-w-[120px]">
              <div className="text-2xl font-black text-white">4</div>
              <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">Certificates</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: My Courses */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">Continue Learning</h2>
              <Link to={`/aca/${lang}`} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                Browse All
              </Link>
            </div>

            <div className="space-y-4">
              {MY_COURSES.map((course) => (
                <div key={course.id} className="p-6 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-48 aspect-video rounded-2xl overflow-hidden shrink-0 relative">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={32} className="text-primary" fill="currentColor" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                          Next: {course.nextLesson} • Last accessed {course.lastAccessed}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-white/40">Progress</span>
                          <span className="text-white">{course.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            className="h-full bg-primary" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Link 
                        to={`/learn/${lang}/${course.slug}`}
                        className="p-4 bg-white/5 text-white rounded-2xl group-hover:bg-primary group-hover:text-bg-dark transition-all border border-white/5"
                      >
                        <Play size={20} fill="currentColor" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Activity & Stats */}
          <div className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-white text-bg-dark space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tighter">Your Activity</h2>
              <div className="space-y-6">
                {[
                  { icon: Zap, title: 'Day Streak', value: '7 Days', sub: 'Top 5% of students' },
                  { icon: Clock, title: 'Time Spent', value: '14.5 Hours', sub: 'This week' },
                  { icon: Award, title: 'Skill Points', value: '2,450 XP', sub: 'Level 12 Artist' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-bg-dark/5 flex items-center justify-center">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{item.title}</div>
                      <div className="text-lg font-black">{item.value}</div>
                      <div className="text-[8px] font-bold opacity-40 uppercase tracking-widest">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-primary text-bg-dark space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tighter">Upcoming Quizzes</h2>
              <div className="space-y-4">
                {[
                  { title: 'Rigging Fundamentals', date: 'Mar 24', time: '10:00 AM' },
                  { title: 'Lighting Mastery', date: 'Mar 26', time: '02:00 PM' },
                ].map((quiz, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-bg-dark/5 border border-bg-dark/5 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black uppercase tracking-tight">{quiz.title}</div>
                      <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{quiz.date} • {quiz.time}</div>
                    </div>
                    <CheckCircle size={20} className="opacity-20" />
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-bg-dark text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all">
                View All Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
