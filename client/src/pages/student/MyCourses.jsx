// client/src/pages/student/MyCourses.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getMyCourses } from '../../services/enrollmentService';

const MyCourses = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, inProgress

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getMyCourses();
        setEnrolledCourses(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = enrolledCourses.filter((enrollment) => {
    const isCompleted = enrollment.progress?.isCompleted || false;
    if (filterStatus === 'completed') {
      return isCompleted;
    }
    if (filterStatus === 'inProgress') {
      return !isCompleted;
    }
    return true;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-green-400 text-xl font-semibold">
            Loading your courses...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Courses</h1>
          <p className="text-gray-400">
            {enrolledCourses.length} course
            {enrolledCourses.length !== 1 ? 's' : ''} enrolled
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'all'
                ? 'bg-green-600 text-black'
                : 'bg-zinc-900 text-gray-300 hover:text-green-400'
            }`}
          >
            All ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setFilterStatus('inProgress')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'inProgress'
                ? 'bg-green-600 text-black'
                : 'bg-zinc-900 text-gray-300 hover:text-green-400'
            }`}
          >
            In Progress (
            {enrolledCourses.filter((enrollment) => !enrollment.progress?.isCompleted).length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'completed'
                ? 'bg-green-600 text-black'
                : 'bg-zinc-900 text-gray-300 hover:text-green-400'
            }`}
          >
            Completed (
            {enrolledCourses.filter((enrollment) => enrollment.progress?.isCompleted).length})
          </button>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">
              {filterStatus === 'completed'
                ? 'No completed courses yet'
                : filterStatus === 'inProgress'
                ? 'No courses in progress'
                : 'No enrolled courses'}
            </p>
            <button
              onClick={() => navigate('/browse-courses')}
              className="px-6 py-2 bg-green-600 text-black rounded-lg font-medium hover:bg-green-700 transition"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((enrollment) => {
              const course = enrollment.course || {};
              const progress = enrollment.progress || {};
              const totalProgress = progress.totalProgress ?? 0;
              const isCompleted = progress.isCompleted ?? false;

              return (
                <div
                  key={course._id || enrollment.course?._id || enrollment.enrolledAt}
                  className="bg-zinc-900 border border-green-900/30 rounded-xl overflow-hidden hover:border-green-600 transition cursor-pointer"
                  onClick={() => navigate(`/course/${course.shortId || course._id}`)}
                >
                  {/* Course Thumbnail */}
                  <div className="h-40 bg-linear-to-br from-green-900/20 to-zinc-900 flex items-center justify-center">
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/300x200'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Course Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">Progress</span>
                        <span className="text-sm font-semibold text-green-400">
                          {totalProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${totalProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {course.level || 'Beginner'}
                      </span>
                      {isCompleted ? (
                        <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full font-medium">
                          ✅ Completed
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded-full font-medium">
                          📚 In Progress
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyCourses;
