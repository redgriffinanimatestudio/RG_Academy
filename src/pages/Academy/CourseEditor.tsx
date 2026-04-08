import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { academyService, Course, Module, Lesson } from '../../services/academyService';
import Preloader from '../../components/Preloader';
import {
  Layers,
  FileText,
  Settings
} from 'lucide-react';
import {
  CourseEditorHeader,
  ModuleList,
  LessonEditor,
  CourseSettings
} from '../../components/course-editor';

const API_V1 = '/v1/academy';

interface CourseSettingsData {
  thumbnail: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  categoryId: string;
  tags: string[];
}

export default function CourseEditor() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activePanel, setActivePanel] = useState<'modules' | 'content' | 'settings'>('modules');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [courseSettings, setCourseSettings] = useState<CourseSettingsData>({
    thumbnail: '',
    price: 0,
    level: 'beginner',
    categoryId: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');

  const selectedLesson = modules
    .flatMap(m => m.lessons)
    .find(l => l.id === selectedLessonId) || null;

  useEffect(() => {
    async function loadCourseData() {
      if (!courseId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [courseData, curriculumData] = await Promise.all([
          academyService.getCourseBySlug(courseId),
          academyService.getCourseCurriculum(courseId)
        ]);
        if (courseData) {
          setCourse(courseData);
          setCourseSettings({
            thumbnail: courseData.thumbnail || '',
            price: courseData.price || 0,
            level: courseData.level || 'beginner',
            categoryId: courseData.categoryId || '',
            tags: courseData.tags || []
          });
        }
        setModules(curriculumData || []);
        if (curriculumData && curriculumData.length > 0) {
          setExpandedModules(new Set(curriculumData.map(m => m.id)));
          if (curriculumData[0].lessons && curriculumData[0].lessons.length > 0) {
            setSelectedModuleId(curriculumData[0].id);
            setSelectedLessonId(curriculumData[0].lessons[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load course data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourseData();
  }, [courseId]);

  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddModule = useCallback(async () => {
    if (!courseId) return;
    
    const newModule: Module = {
      id: generateId(),
      courseId,
      title: `Module ${modules.length + 1}`,
      order: modules.length,
      lessons: []
    };

    try {
      await apiClient.post(`${API_V1}/courses/${courseId}/modules`, {
        title: newModule.title,
        order: newModule.order
      });
    } catch (err) {
      console.log('Using local state for new module');
    }

    setModules(prev => [...prev, newModule]);
    setExpandedModules(prev => new Set([...prev, newModule.id]));
    setSelectedModuleId(newModule.id);
    setIsDirty(true);
  }, [courseId, modules.length]);

  const handleAddLesson = useCallback(async (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    const newLesson: Lesson = {
      id: generateId(),
      courseId: module.courseId,
      title: `Lesson ${(module.lessons?.length || 0) + 1}`,
      content: '',
      videoUrl: '',
      type: 'video',
      duration: '0:00',
      order: module.lessons?.length || 0,
      isFree: false,
      createdAt: new Date().toISOString(),
      moduleId
    };

    try {
      await apiClient.post(`${API_V1}/courses/${courseId}/lessons`, {
        title: newLesson.title,
        moduleId,
        type: newLesson.type,
        order: newLesson.order
      });
    } catch (err) {
      console.log('Using local state for new lesson');
    }

    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [...(m.lessons || []), newLesson]
        };
      }
      return m;
    }));
    setSelectedLessonId(newLesson.id);
    setIsDirty(true);
  }, [courseId, modules]);

  const handleDeleteModule = useCallback(async (moduleId: string) => {
    try {
      await apiClient.delete(`${API_V1}/courses/${courseId}/modules/${moduleId}`);
    } catch (err) {
      console.log('Using local state for delete');
    }

    setModules(prev => prev.filter(m => m.id !== moduleId));
    setExpandedModules(prev => {
      const next = new Set(prev);
      next.delete(moduleId);
      return next;
    });
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(null);
      setSelectedLessonId(null);
    }
    setIsDirty(true);
  }, [courseId, selectedModuleId]);

  const handleDeleteLesson = useCallback(async (lessonId: string) => {
    try {
      await apiClient.delete(`${API_V1}/courses/${courseId}/lessons/${lessonId}`);
    } catch (err) {
      console.log('Using local state for delete');
    }

    setModules(prev => prev.map(m => ({
      ...m,
      lessons: (m.lessons || []).filter(l => l.id !== lessonId)
    })));
    if (selectedLessonId === lessonId) {
      setSelectedLessonId(null);
    }
    setIsDirty(true);
  }, [courseId, selectedLessonId]);

  const handleReorderLessons = useCallback((moduleId: string, oldIndex: number, newIndex: number) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        const lessons = [...(m.lessons || [])];
        const [moved] = lessons.splice(oldIndex, 1);
        lessons.splice(newIndex, 0, moved);
        return {
          ...m,
          lessons: lessons.map((l, i) => ({ ...l, order: i }))
        };
      }
      return m;
    }));
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!courseId) return;
    try {
      setSaving(true);
      
      const curriculumPayload = modules.map((m, idx) => ({
        id: m.id,
        title: m.title,
        order: idx,
        lessons: (m.lessons || []).map((l, lIdx) => ({
          id: l.id,
          title: l.title,
          content: l.content,
          videoUrl: l.videoUrl,
          type: l.type,
          duration: l.duration,
          order: lIdx,
          isFree: l.isFree
        }))
      }));

      await apiClient.put(`${API_V1}/courses/${courseId}/curriculum`, {
        modules: curriculumPayload
      });

      await apiClient.put(`${API_V1}/courses/${courseId}`, {
        title: course?.title,
        ...courseSettings
      });

      setIsDirty(false);
      setLastSaved(new Date());
    } catch (err) {
      console.error('Failed to save course:', err);
    } finally {
      setSaving(false);
    }
  }, [courseId, course, courseSettings, modules]);

  const handlePublish = useCallback(async () => {
    if (!courseId) return;
    try {
      setIsPublishing(true);
      await academyService.updateCourseStatus(courseId, 'published');
      setCourse(prev => prev ? { ...prev, status: 'published' } : null);
    } catch (err) {
      console.error('Failed to publish course:', err);
    } finally {
      setIsPublishing(false);
    }
  }, [courseId]);

  const handleUnpublish = useCallback(async () => {
    if (!courseId) return;
    try {
      setIsPublishing(true);
      await academyService.updateCourseStatus(courseId, 'draft');
      setCourse(prev => prev ? { ...prev, status: 'draft' } : null);
    } catch (err) {
      console.error('Failed to unpublish course:', err);
    } finally {
      setIsPublishing(false);
    }
  }, [courseId]);

  const handlePreview = useCallback(() => {
    if (courseId) {
      navigate(`/aca/course/${courseId}`);
    }
  }, [courseId, navigate]);

  const updateLessonField = useCallback((lessonId: string, field: string, value: any) => {
    setModules(prev => prev.map(m => ({
      ...m,
      lessons: (m.lessons || []).map(l => {
        if (l.id === lessonId) {
          return { ...l, [field]: value };
        }
        return l;
      })
    })));
    setIsDirty(true);
  }, []);

  const updateModuleTitle = useCallback((moduleId: string, title: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return { ...m, title };
      }
      return m;
    }));
    setIsDirty(true);
  }, []);

  const toggleModule = useCallback((moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }, []);

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !courseSettings.tags.includes(newTag.trim())) {
      setCourseSettings(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      setIsDirty(true);
    }
  }, [newTag, courseSettings.tags]);

  const handleRemoveTag = useCallback((tag: string) => {
    setCourseSettings(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
    setIsDirty(true);
  }, []);

  if (loading) {
    return <Preloader message="INITIALIZING_EDITOR..." size="lg" className="h-screen bg-[#050505]" />;
  }

  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent blur-[140px] opacity-20" />
      </div>

      <CourseEditorHeader
        courseTitle={course?.title || ''}
        onTitleChange={(title) => {
          setCourse(prev => prev ? { ...prev, title } : null);
          setIsDirty(true);
        }}
        isDirty={isDirty}
        lastSaved={lastSaved}
        saving={saving}
        isPublishing={isPublishing}
        status={course?.status}
        onSave={handleSave}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onPreview={handlePreview}
      />

      <div className="relative z-20 lg:hidden flex border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        {[
          { id: 'modules', label: 'Modules', icon: Layers },
          { id: 'content', label: 'Content', icon: FileText },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id as typeof activePanel)}
            className={`flex-1 py-4 text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-colors ${
              activePanel === tab.id ? 'text-primary border-b-2 border-primary' : 'text-white/20'
            }`}
          >
            <tab.icon size={12} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="relative z-10 flex h-[calc(100vh-73px)]">
        <ModuleList
          modules={modules}
          selectedModuleId={selectedModuleId}
          selectedLessonId={selectedLessonId}
          expandedModules={expandedModules}
          onSelectModule={setSelectedModuleId}
          onToggleModule={toggleModule}
          onModuleTitleChange={updateModuleTitle}
          onAddModule={handleAddModule}
          onAddLesson={handleAddLesson}
          onDeleteModule={handleDeleteModule}
          onDeleteLesson={handleDeleteLesson}
          onSelectLesson={setSelectedLessonId}
          onReorderLessons={handleReorderLessons}
          activePanel={activePanel}
        />

        <LessonEditor
          lesson={selectedLesson}
          onUpdateLesson={updateLessonField}
          activePanel={activePanel}
        />

        <CourseSettings
          settings={courseSettings}
          newTag={newTag}
          onSettingsChange={setCourseSettings}
          onNewTagChange={setNewTag}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          stats={{
            status: course?.status,
            totalLessons,
            duration: course?.duration
          }}
          activePanel={activePanel}
        />
      </div>
    </div>
  );
}