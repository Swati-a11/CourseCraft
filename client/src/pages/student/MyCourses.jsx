import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #000000, #0b1f14, #003d1f)",
        color: "#00ff88",
        fontSize: "18px",
        fontWeight: "600",
      }}
    >
      Loading your courses...
    </div>
  );

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000, #0b1f14, #003d1f)",
        color: "#fff",
      }}
    >
      <h2
        style={{
          marginBottom: "25px",
          fontSize: "28px",
          fontWeight: "700",
          color: "#00ff88",
        }}
      >
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
              <h3 style={{ color: "#00ff88", marginBottom: "8px" }}>
                {item.title || item.course?.title || "Untitled Course"}
              </h3>

              <p style={{ color: "#ccc", fontSize: "14px", lineHeight: "1.5" }}>
                {item.description || item.course?.description || "No description available."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;