import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getCourseById } from "../../services/courseService";
import { toast } from "react-toastify";
import { PlayCircle, FileText, HelpCircle, Lock } from "lucide-react";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [tab, setTab] = useState("videos");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    if (!courseId || courseId === 'undefined') {
      setError("Failed to load course. It may not exist.");
      return;
    }
    try {
      const res = await getCourseById(courseId);
      setCourse(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load course. It may not exist.");
    }
  };

  const handleRestrictedAction = () => {
    toast.info("Please enroll in this course to unlock this content!", {
      theme: "dark"
    });
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-red-400 text-center mt-20 text-xl font-semibold">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-azure-400 text-center mt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-azure-500 mr-3"></div>
          Loading course...
        </div>
      </DashboardLayout>
    );
  }

  // Enforce exactly up to 8 modules visually on the preview page
  const displayTopics = (course.topics || []).slice(0, 8);

  return (
    <DashboardLayout>
      <div className="p-6 text-white max-w-5xl mx-auto">
        <button onClick={() => navigate('/browse-courses')} className="text-zinc-400 hover:text-white mb-6 text-sm flex items-center gap-2">
          ← Back to Browse
        </button>

        {/* HEADER */}
        <div className="bg-zinc-900 border border-azure-500/20 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Lock size={120} />
          </div>
          <h1 className="text-4xl font-extrabold text-azure-400 mb-4 relative z-10">
            {course.title}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl relative z-10">
            {course.description}
          </p>
          <div className="mt-8 relative z-10">
            <button
              onClick={handleRestrictedAction}
              className="px-8 py-3 bg-gradient-to-r from-azure-600 to-azure-600 hover:from-azure-500 hover:to-sky-400 text-[var(--cc-action-ink)] font-bold rounded-xl shadow-[0_0_20px_rgba(83,166,245,0.3)] transition-all transform hover:-translate-y-1 flex items-center gap-2"
            >
              <Lock size={18} />
              Enroll Now to Unlock
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-6 border-b border-zinc-800 pb-2">
          <button
            onClick={() => setTab("videos")}
            className={`px-6 py-3 rounded-t-lg font-semibold flex items-center gap-2 transition-all ${
              tab === "videos"
                ? "bg-azure-600/20 text-azure-400 border-b-2 border-azure-500"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <PlayCircle size={18} /> Course Curriculum
          </button>
        </div>

        {/* CONTENT */}
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            Course Modules <span className="text-sm font-normal text-zinc-500 ml-2">({displayTopics.length} core topics)</span>
          </h2>
          
          <div className="grid gap-4">
            {displayTopics.length > 0 ? (
              displayTopics.map((topic, i) => (
                <div 
                  key={i} 
                  className="bg-black/40 border border-zinc-800 rounded-xl p-5 hover:border-azure-500/30 transition-all cursor-pointer group"
                  onClick={handleRestrictedAction}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-azure-500 font-bold group-hover:bg-azure-500/20 transition-colors">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-200 group-hover:text-azure-400 transition-colors">
                          {topic.title || `Module ${i + 1}`}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1">Includes Video Lesson, Notes & Quiz</p>
                      </div>
                    </div>
                    <Lock size={20} className="text-zinc-600 group-hover:text-azure-500 transition-colors" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-center py-8">No curriculum data available for preview.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetails;