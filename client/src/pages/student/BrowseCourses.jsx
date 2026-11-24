import PageLoader from '../../components/common/PageLoader';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardLayout from '../../layouts/DashboardLayout';

import { getAllCourses, searchCourses, generateCourse } from '../../services/courseService';
import { enrollCourse } from '../../services/enrollmentService';

const BrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');
  const [generateTopic, setGenerateTopic] = useState('');
  const [generating, setGenerating] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchCourses = async (query = '') => {
    setLoading(true);
    setError('');

    try {
      const res = query ? await searchCourses(query) : await getAllCourses();
      const all = res.data?.courses || res.data || [];
      setCourses(Array.isArray(all) ? all : []);
    } catch (apiError) {
      console.error('Error fetching courses:', apiError.response?.data || apiError.message);
      setCourses([]);
      setError('Unable to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q')?.trim() || '';
    setSearchQuery(q);
    setSearchInput(q);
    fetchCourses(q);
  }, [location.search]);

  const handleEnroll = async (courseId) => {
    try {
      const res = await enrollCourse(courseId);

      toast.success(
        res.data?.message || 'Course enrolled successfully!'
      );

      setTimeout(() => {
        navigate('/my-courses');
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Enrollment failed'
      );
    }
  };

  const handleGenerate = async (event) => {
    event.preventDefault();

    const topic = generateTopic.trim();
    if (!topic) {
      toast.error('Please enter a topic to generate a course');
      return;
    }

    setGenerating(true);

    try {
      const res = await generateCourse(topic);
      console.log('Generate course response:', res.data);
      const responseData = res.data?.data || res.data;
      console.log('Generate course response data:', responseData);
      toast.success(res.data?.message || 'Course generated successfully');
      setGenerateTopic('');
      await fetchCourses('');
      navigate('/browse-courses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Course generation failed');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageLoader text="Finding courses for you…" />
      </DashboardLayout>
    );
  }

  const displayCourses = courses.length > 0 ? courses : ([]);
  const noResults = !!searchQuery && displayCourses.length === 0;

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Browse Courses</h1>
          <p className="text-sm text-gray-400 mt-2">
            Search the catalog or generate a new course topic from AI.
          </p>
        </div>

        <form onSubmit={(event) => { event.preventDefault(); navigate(`/browse-courses${searchInput.trim() ? `?q=${encodeURIComponent(searchInput.trim())}` : ''}`); }} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="course-search" className="sr-only">Search courses</label>
          <input id="course-search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search courses" className="cc-document-input" />
          <button type="submit" className="cc-document-button">Search</button>
        </form>

        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="generate-topic" className="sr-only">Topic for a new course</label>
          <input
            id="generate-topic"
            value={generateTopic}
            onChange={(event) => setGenerateTopic(event.target.value)}
            placeholder="Enter a topic to generate a new course"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-gray-500 focus:border-azure-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={generating}
            className="rounded-2xl bg-azure-600 px-6 py-3 text-[var(--cc-action-ink)] font-semibold hover:bg-azure-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate Course'}
          </button>
        </form>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-900/10 p-6 text-red-200 mb-6">
          {error}
        </div>
      ) : null}

      {searchQuery ? (
        <p className="text-sm text-gray-400 mb-6">
          Search results for <span className="font-semibold text-white">"{searchQuery}"</span>
        </p>
      ) : null}

      {noResults ? (
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-900/10 p-8 text-yellow-200 mb-6">
          No courses found for <span className="font-semibold">"{searchQuery}"</span>.
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCourses.map((course) => (
          <div
            key={course._id}
            className="bg-zinc-900 p-5 rounded-xl border border-azure-900/30"
          >
            <h2 className="text-xl font-bold text-white mb-2">
              {course.title}
            </h2>

            <p className="text-gray-400 mb-2">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-azure-300 mb-4">
              {course.topics?.length ? (
                <span className="bg-azure-900/20 px-2 py-1 rounded-full">
                  {course.topics.length} topics
                </span>
              ) : null}
              {course.level ? (
                <span className="bg-azure-900/20 px-2 py-1 rounded-full">
                  {course.level}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to={`/courses/${course.shortId || course._id}`}
                className="w-full text-center px-4 py-2 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition"
              >
                View Course
              </Link>
              <button
                onClick={() => handleEnroll(course._id)}
                className="w-full px-4 py-2 bg-azure-600 text-[var(--cc-action-ink)] rounded-lg font-medium hover:bg-azure-700 transition"
              >
                Enroll Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default BrowseCourses;
