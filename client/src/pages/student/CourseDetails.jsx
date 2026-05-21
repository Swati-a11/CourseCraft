import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getCourseById } from '../../services/courseService';
import { getCourseProgress } from '../../services/courseProgressService';

const CourseDetails = () => {
  const { id } = useParams(); // courseId
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      localStorage.setItem('selectedCourseId', id);
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, progressRes] = await Promise.all([
          getCourseById(id),
          getCourseProgress(id),
        ]);

        const fetchedCourse = courseRes.data;
        const topics = (fetchedCourse.topics || []).map((topic, index) => ({
          ...topic,
          id: index + 1,
        }));

        localStorage.setItem('selectedCourseId', fetchedCourse._id);
        setCourse({ ...fetchedCourse, topics });
        setProgress(progressRes.data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh] text-green-400">
          Loading course details...
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-400 mt-10">Course not found.</div>
      </DashboardLayout>
    );
  }

  const completedTopicsMap = new Set(
    progress?.completedTopics
      ?.filter((t) => t.notesCompleted && t.videoCompleted && t.quizPassed)
      .map((t) => t.topicIndex) || []
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          {course.title}
        </h1>
        <p className="text-gray-400">
          Course ID: {id} • {course.topics?.length || 0} Topics • {course.level || 'Beginner'}
        </p>
      </div>

      <div className="grid gap-4">
        {course.topics?.map((topic, index) => {
          const topicIndex = index + 1;
          const isCompleted = completedTopicsMap.has(topicIndex);

          return (
            <Link
              key={topicIndex}
              to={`/topic/${topicIndex}`}
              onClick={() => localStorage.setItem('selectedCourseId', id)}
              className="bg-zinc-900 border border-green-900/30 rounded-xl p-5 hover:border-green-500/40 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Topic {topicIndex}
                  </p>
                  <h3 className="text-lg font-semibold text-white">
                    {topic.title}
                  </h3>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isCompleted
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {isCompleted ? 'Completed' : 'Pending'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default CourseDetails;