import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { toast } from "react-toastify";
import DashboardLayout from "../../layouts/DashboardLayout";
import RobotLoader from "../../components/common/RobotLoader";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDelete = (e, courseId) => {
    e.stopPropagation();
    
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
                  setCourses(courses.filter(c => (c.course?._id || c._id) !== courseId));
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

        console.log("MY COURSES RESPONSE:", res.data);

        setCourses(res.data.data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading)
  return (
    <DashboardLayout>
      <RobotLoader text="Loading your courses..." />
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-green-400 mb-8">
          My Courses
        </h2>

      {courses.length === 0 ? (
        <h3 style={{ color: "#aaa" }}>No courses enrolled</h3>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {courses.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/course/${item.course?._id || item._id}`)}

              style={{
                background: "rgba(0, 0, 0, 0.6)",
                border: "1px solid rgba(0, 255, 136, 0.3)",
                borderRadius: "14px",
                padding: "18px",
                boxShadow: "0 0 12px rgba(0, 255, 136, 0.15)",
                transition: "0.3s",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 0 18px rgba(0, 255, 136, 0.35)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 0 12px rgba(0, 255, 136, 0.15)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ color: "#00ff88", marginBottom: "8px", flex: 1, paddingRight: "10px" }}>
                  {item.title || item.course?.title || "Untitled Course"}
                </h3>
                <button
                  onClick={(e) => handleDelete(e, item.course?._id || item._id)}
                  style={{
                    background: "rgba(255, 68, 68, 0.1)",
                    border: "1px solid rgba(255, 68, 68, 0.3)",
                    color: "#ff4444",
                    borderRadius: "6px",
                    padding: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s"
                  }}
                  title="Unenroll"
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(255, 68, 68, 0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(255, 68, 68, 0.1)";
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>

              <p style={{ color: "#ccc", fontSize: "14px", lineHeight: "1.5", marginBottom: "15px" }}>
                {item.description || item.course?.description || "No description available."}
              </p>

              {/* PROGRESS BAR */}
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Progress</span>
                  <span className="text-sm font-bold text-cyan-400">{item.progress || 0}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-green-500/20">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-cyan-400 transition-all duration-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                    style={{ width: `${item.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </DashboardLayout>
  );
};

export default MyCourses;