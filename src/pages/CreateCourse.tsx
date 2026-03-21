import React, { useState } from 'react';
import { 
  Plus, 
  Video, 
  FileText, 
  Image as ImageIcon, 
  Trash2, 
  GripVertical,
  Save,
  Globe,
  Layout,
  BookOpen
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export default function CreateCourse() {
  const [sections, setSections] = useState<Section[]>([
    { id: 's1', title: 'Introduction', lessons: [{ id: 'l1', title: 'Welcome', type: 'video' }] }
  ]);

  const addSection = () => {
    setSections([...sections, { id: Math.random().toString(), title: 'New Section', lessons: [] }]);
  };

  const addLesson = (sectionId: string) => {
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { ...s, lessons: [...s.lessons, { id: Math.random().toString(), title: 'New Lesson', type: 'video' }] }
        : s
    ));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              <Layout size={14} />
              Instructor Studio
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-none">
              Create New <br />
              <span className="text-primary italic">Workshop.</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/5 flex items-center gap-2">
              <Save size={16} /> Save Draft
            </button>
            <button className="px-8 py-4 bg-primary text-bg-dark rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-primary/20">
              Publish Course
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Builder */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                  <BookOpen size={24} className="text-primary" /> General Info
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Course Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Advanced Rigging Systems"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white focus:border-primary transition-all outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Description</label>
                    <textarea 
                      placeholder="Tell students what they will learn..."
                      rows={4}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white focus:border-primary transition-all outline-none font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Curriculum Builder</h2>
                <button 
                  onClick={addSection}
                  className="px-4 py-2 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white rounded-xl hover:bg-white/10 transition-all border border-white/5 flex items-center gap-2"
                >
                  <Plus size={14} /> Add Section
                </button>
              </div>

              <div className="space-y-6">
                {sections.map((section, sIdx) => (
                  <div key={section.id} className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 space-y-6">
                    <div className="flex items-center gap-4">
                      <GripVertical size={20} className="text-white/10" />
                      <input 
                        type="text" 
                        value={section.title}
                        onChange={(e) => {
                          const newSections = [...sections];
                          newSections[sIdx].title = e.target.value;
                          setSections(newSections);
                        }}
                        className="bg-transparent border-none text-xl font-black uppercase tracking-tight text-white focus:ring-0 w-full p-0"
                      />
                      <button className="text-white/10 hover:text-rose-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {section.lessons.map((lesson, lIdx) => (
                        <div key={lesson.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="size-8 bg-white/5 rounded-lg flex items-center justify-center text-primary">
                              {lesson.type === 'video' ? <Video size={14} /> : <FileText size={14} />}
                            </div>
                            <input 
                              type="text" 
                              value={lesson.title}
                              onChange={(e) => {
                                const newSections = [...sections];
                                newSections[sIdx].lessons[lIdx].title = e.target.value;
                                setSections(newSections);
                              }}
                              className="bg-transparent border-none text-sm font-bold text-white/60 focus:ring-0 p-0"
                            />
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-white/20 hover:text-white transition-colors"><Plus size={14} /></button>
                            <button className="p-2 text-white/20 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => addLesson(section.id)}
                        className="w-full py-4 border border-dashed border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/10 hover:text-white/40 hover:border-white/20 transition-all"
                      >
                        Add Lesson
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-white text-bg-dark space-y-8">
              <h2 className="text-xl font-black uppercase tracking-tighter">Course Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Pricing (USD)</label>
                  <input 
                    type="number" 
                    placeholder="99.99"
                    className="w-full bg-bg-dark/5 border border-bg-dark/5 rounded-xl p-4 font-black outline-none focus:border-bg-dark/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Category</label>
                  <select className="w-full bg-bg-dark/5 border border-bg-dark/5 rounded-xl p-4 font-bold outline-none">
                    <option>Animation</option>
                    <option>3D Modeling</option>
                    <option>VFX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Thumbnail</label>
                  <div className="aspect-video rounded-2xl bg-bg-dark/5 border-2 border-dashed border-bg-dark/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-bg-dark/10 transition-all">
                    <ImageIcon size={24} className="opacity-20" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Upload Image</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-primary text-bg-dark space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tighter">Instructor Perks</h2>
              <div className="space-y-4">
                {[
                  { icon: Globe, label: 'Global reach to 50k+ students' },
                  { icon: Save, label: '80% revenue share' },
                  { icon: Layout, label: 'Dedicated support team' },
                ].map((perk, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <perk.icon size={18} className="opacity-40" />
                    <span className="text-xs font-bold opacity-80">{perk.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
