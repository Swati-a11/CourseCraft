import { Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Link
      to={`/course/${course.shortId || course._id || course.id}`}
      className="block bg-zinc-900 border border-green-900/30 rounded-2xl overflow-hidden hover:border-green-500/40 hover:-translate-y-1 transition-all duration-300"
    >
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-5">
        <h3 className="text-xl font-semibold text-white mb-2">
          {course.title}
        </h3>

        <p className="text-gray-400 text-sm mb-4">{course.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <BookOpen size={16} /> {course.topics} Topics
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} /> {course.duration}
          </span>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1 text-gray-400">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;