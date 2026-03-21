import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Play, 
  Clock, 
  BarChart, 
  Users, 
  Star, 
  ChevronRight, 
  CheckCircle, 
  Lock,
  Globe,
  Award,
  Calendar,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

// This would normally come from a service
const MOCK_COURSES = [
  {
    id: '1',
    slug: 'mastering-character-rigging-maya',
    title: 'Mastering Character Rigging in Maya',
    lecturer: 'Alex Rivera',
    lecturerAvatar: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',
    rating: 4.9,
    reviews: 1240,
    price: 89.99,
    students: 15420,
    duration: '24h 15m',
    levelKey: 'advanced',
    thumbnail: 'https://picsum.photos/seed/rigging/1200/600',
    category: 'Animation',
    description: 'Learn the industry-standard techniques for creating robust, animator-friendly character rigs in Autodesk Maya. This comprehensive course covers everything from skeleton creation to advanced facial rigging and skinning.',
    learningPoints: [
      'Anatomy-based skeleton creation',
      'Advanced IK/FK switching systems',
      'Facial rigging with blendshapes and joints',
      'Deformation techniques and skin weight painting',
      'Custom attribute creation and UI for animators'
    ],
    curriculum: [
      { title: 'Introduction to Rigging', lessons: ['What is Rigging?', 'Maya Interface for Riggers', 'Naming Conventions'] },
      { title: 'Skeleton & Joints', lessons: ['Joint Hierarchies', 'Orienting Joints', 'Mirroring Skeletons'] },
      { title: 'Skinning & Deformations', lessons: ['Smooth Skinning', 'Weight Painting', 'Delta Mush & Correctives'] }
    ]
  },
  // ... more courses could be added here
];

export default function CourseDetail() {
  const { t } = useTranslation();
  const { slug, lang } = useParams();
  const navigate = useNavigate();
  
  // In a real app, fetch by slug
  const course = MOCK_COURSES.find(c => c.slug === slug) || MOCK_COURSES[0];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                <Globe size={14} />
                {t(course.category.toLowerCase().replace(' ', '_'))}
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">
                {course.title}
              </h1>
              <p className="text-xl text-white/60 font-medium leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="avatar size-12 rounded-full border border-white/10 overflow-hidden">
                    <img src={course.lecturerAvatar} alt={course.lecturer} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{t('by')}</p>
                    <p className="text-sm font-bold text-white">{course.lecturer}</p>
                  </div>
                </div>
                
                <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Star size={18} className="text-primary" fill="currentColor" />
                    <span className="text-white font-bold">{course.rating}</span>
                    <span className="text-white/20">({course.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Placeholder */}
            <div className="aspect-video rounded-[2.5rem] bg-zinc-900 border border-white/5 overflow-hidden relative group cursor-pointer">
              <img src={course.thumbnail} alt="Preview" className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-bg-dark shadow-2xl shadow-primary/40 transform transition-transform group-hover:scale-110">
                  <Play size={40} fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-8 left-8">
                <span className="px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-widest text-white border border-white/10">
                  Watch Preview
                </span>
              </div>
            </div>

            {/* What you'll learn */}
            <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-8">
              <h2 className="text-3xl font-black uppercase tracking-tight text-white">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {course.learningPoints.map((point, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      <CheckCircle size={18} className="text-emerald-500" />
                    </div>
                    <p className="text-sm font-medium text-white/60 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black uppercase tracking-tight text-white">Course Curriculum</h2>
              <div className="space-y-4">
                {course.curriculum.map((section, idx) => (
                  <div key={idx} className="p-8 rounded-3xl bg-zinc-900 border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-black uppercase tracking-tight text-white">{section.title}</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{section.lessons.length} Lessons</span>
                    </div>
                    <div className="space-y-3">
                      {section.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                          <div className="flex items-center gap-4">
                            <div className="size-8 bg-white/5 rounded-lg flex items-center justify-center text-white/20">
                              <Lock size={14} />
                            </div>
                            <span className="text-sm font-medium text-white/40">{lesson}</span>
                          </div>
                          <span className="text-[10px] font-black text-white/10">12:45</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-8 rounded-[2.5rem] bg-white text-bg-dark space-y-8 shadow-2xl shadow-primary/10">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Price</span>
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black">${course.price}</span>
                  <span className="text-lg font-bold opacity-40 line-through">$149.99</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => navigate(`/learn/${lang}/${course.slug}`)}
                  className="w-full py-5 bg-bg-dark text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                >
                  Enroll Now
                </button>
                <p className="text-center text-[10px] font-bold opacity-40 uppercase tracking-widest">
                  30-Day Money-Back Guarantee
                </p>
              </div>

              <div className="pt-8 border-t border-bg-dark/5 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">This course includes:</p>
                <div className="space-y-4">
                  {[
                    { icon: Clock, label: course.duration + ' on-demand video' },
                    { icon: BarChart, label: t(course.levelKey) + ' Level' },
                    { icon: Users, label: course.students.toLocaleString() + ' Students' },
                    { icon: Globe, label: 'English / Russian Subtitles' },
                    { icon: Award, label: 'Certificate of completion' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <item.icon size={18} className="opacity-40" />
                      <span className="text-sm font-bold opacity-80">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-bg-dark/5 space-y-4 border border-bg-dark/5">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-emerald-600" />
                  <span className="text-xs font-black uppercase tracking-tight">Secure Payment</span>
                </div>
                <div className="flex gap-2">
                  {/* Stripe logo placeholders */}
                  <div className="h-6 w-10 bg-bg-dark/10 rounded" />
                  <div className="h-6 w-10 bg-bg-dark/10 rounded" />
                  <div className="h-6 w-10 bg-bg-dark/10 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
