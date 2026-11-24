import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import API from "../../services/api";
import { toast } from "react-toastify";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageLoader from "../../components/common/PageLoader";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDelete = (courseId) => {

    // Create a custom confirmation toast
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-white">Are you sure you want to unenroll?</p>
          <div className="flex gap-2 justify-end mt-2">
            <button 
              onClick={() => {
                toast.dismiss(t.id);
              }}
              className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-sm transition"
            >
              Cancel
            </button>
            <button 
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const token = localStorage.getItem("token");
                  await API.delete(`/enrollments/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setCourses(current => current.filter(c => (c.course?._id || c._id) !== courseId));
                  toast.success("Course deleted successfully!");
                } catch (error) {
                  console.error("Failed to delete course", error);
                  toast.error("Failed to delete course");
                }
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-sm transition font-medium"
            >
              Yes, Unenroll
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        position: "top-center",
        theme: "dark",
        style: { border: "1px solid #450a0a", background: "#18181b" }
      }
    );
  };

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/enrollments/my-courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(res.data.data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Could not load your courses. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <PageLoader text="Gathering your courses…" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="mx-auto max-w-6xl py-6 sm:py-10" aria-labelledby="my-courses-title">
        <header className="cc-page-heading mb-8">
          <div>
            <span className="cc-eyebrow">Your learning library</span>
            <h1 id="my-courses-title" className="text-4xl tracking-tight sm:text-5xl">My Courses</h1>
            <p>Every step forward is worth celebrating. Pick up where you left off.</p>
          </div>
          {!error && <span className="cc-count-badge">{courses.length} {courses.length === 1 ? 'course' : 'courses'}</span>}
        </header>

        {error ? <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-500/10 p-6 text-[var(--cc-error)]">{error}</p> : courses.length === 0 ? (
          <div className="rounded-2xl border border-[var(--cc-line)] bg-[var(--cc-surface)] p-6">
            <p className="text-[var(--cc-muted)]">No courses enrolled.</p>
            <Link to="/browse-courses" className="mt-2 inline-flex min-h-11 items-center font-semibold text-[var(--cc-course-link)] hover:underline">
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {courses.map((item) => {
              const courseId = item.course?._id || item._id;
              const title = item.title || item.course?.title || "Untitled Course";
              const progress = Math.min(100, Math.max(0, Number(item.progress) || 0));

              return (
                <article key={item._id} className="cc-enrolled-course">
                  <span className="cc-course-kicker">Your course</span>
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="min-w-0 text-xl font-semibold leading-snug tracking-tight">
                      <Link to={`/course/${courseId}`} className="cc-enrolled-link break-words hover:underline">
                        {title}
                      </Link>
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleDelete(courseId)}
                      className="cc-unenroll"
                      aria-label={`Unenroll from ${title}`}
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>

                  <p className="mt-3 mb-6 leading-relaxed text-[var(--cc-muted)]">
                    {item.description || item.course?.description || "No description available."}
                  </p>

                  <div className="mt-auto">
                    <div className="mb-2 flex items-center justify-between gap-3 font-mono text-xs">
                      <span className="text-[var(--cc-muted)]">Progress</span>
                      <span className="font-semibold text-[var(--cc-course-link)]">{progress}%</span>
                    </div>
                    <progress className="cc-progress" max={100} value={progress} aria-label={`${title} progress`} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default MyCourses;
