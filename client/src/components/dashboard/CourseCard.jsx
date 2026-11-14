import { Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

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
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-5">
        <h3 className={`text-xl font-semibold mb-2 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {course.title}
        </h3>

        <p className={`text-sm mb-4 transition-colors ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>{course.description}</p>

        <div className={`flex items-center justify-between text-sm mb-4 transition-colors ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
          <span className="flex items-center gap-1">
            <BookOpen size={16} /> {course.topics} Topics
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} /> {course.duration}
          </span>
        </div>

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