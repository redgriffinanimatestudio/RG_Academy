import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video } from 'lucide-react';
import { academyService } from '../../../../services/academyService';
import Preloader from '../../../../components/Preloader';
import NoDataPlaceholder from '../NoDataPlaceholder';

interface LecturerDashboardProps {
  view: string;
  accent: string;
  user: any;
  lang: string | undefined;
}

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ view, accent, user, lang }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLocalLoading(true);
      const res = await academyService.getCourses();
      // Filter by lecturerId and show all statuses for the lecturer themselves
      const filtered = res.filter((c: any) => c.lecturerId === user.id);
      setCourses(filtered);
    } catch (e) { console.error(e); } finally { setLocalLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleToggleStatus = async (courseId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await academyService.updateCourseStatus(courseId, nextStatus);
      fetchData();
    } catch (e) {
      alert('Failed to update course status.');
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 space-y-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black uppercase tracking-tight">Workshop Management</h3>
        <Link to={`/aca/${lang}/create`} className="px-6 py-3 bg-primary text-bg-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">+ Create New</Link>
      </div>
      
      {localLoading ? <Preloader message="Fetching workshops..." size="sm" /> : courses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col justify-between gap-6 group hover:border-primary/20 transition-all">
              <div className="flex items-start gap-6">
                <div className="size-20 rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl shrink-0">
                  <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt="" />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-black uppercase text-white leading-tight">{course.title}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${
                      course.status === 'published' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {course.status}
                    </span>
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">
                      Students: {course.studentsCount || 0}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleToggleStatus(course.id, course.status)}
                  className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    course.status === 'published' 
                      ? 'bg-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-500' 
                      : 'bg-primary text-bg-dark hover:scale-105'
                  }`}
                >
                  {course.status === 'published' ? 'Unpublish' : 'Publish Workshop'}
                </button>
                <Link 
                  to={`/aca/${lang}/course/${course.slug}/edit`}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase transition-all"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : <NoDataPlaceholder icon={Video} message="You haven't created any workshops yet." link={`/aca/${lang}/create`} linkText="Start Teaching" />}
    </div>
  );
};

export default LecturerDashboard;
