import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import CourseCover from './CourseCover';

const CourseCard = ({ course }) => {
  const { isLight } = useTheme();
  return (
    <Link
      to={`/course/${course.shortId || course._id || course.id}`}
      className={`block border rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 ${
        isLight
          ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          : 'bg-zinc-900 border-azure-900/30 hover:border-azure-500/40'
      }`}
    >
      <CourseCover title={course.title} image={course.image} />

      <div className="p-5">
        <h3 className={`text-xl font-semibold mb-2 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {course.title}
        </h3>

        {course.description && <p className={`text-sm mb-4 line-clamp-3 transition-colors ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{course.description}</p>}

        <div className={`flex items-center justify-between text-sm mb-4 transition-colors ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
          {course.topics > 0 && <span className="flex items-center gap-1"><BookOpen size={16} aria-hidden="true" /> {course.topics} topics</span>}
          {course.duration && <span className="flex items-center gap-1"><Clock size={16} aria-hidden="true" /> {course.duration}</span>}
          {course.level && <span>{course.level}</span>}
        </div>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--cc-course-link)]">Continue learning <ArrowRight size={16} aria-hidden="true" /></span>

        <div>
          <div className={`flex justify-between text-xs mb-1 transition-colors ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className={`w-full rounded-full h-2 transition-colors ${isLight ? 'bg-slate-100' : 'bg-zinc-800'}`}>
            <div
              className="bg-azure-500 h-2 rounded-full"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
