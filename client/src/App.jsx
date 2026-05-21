import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth Pages
import Login from "./pages/auths/Login";
import Register from "./pages/auths/Register";

// Student Pages
import Dashboard from "./pages/student/Dashboard";
import CourseDetails from "./pages/student/CourseDetails";
import TopicPage from "./pages/student/TopicPage";
import StudyPlan from "./pages/student/StudyPlan";
import ProgressPage from "./pages/student/ProgressPage";
import WeakTopics from "./pages/student/WeakTopics";
import Gamification from "./pages/student/Gamification";
import Reminders from "./pages/student/Reminders";
import BrowseCourses from "./pages/student/BrowseCourses";
import MyCourses from "./pages/student/MyCourses";
import Achievements from "./pages/student/Achievements";
import Settings from "./pages/student/Settings";
import YoutubeNotes from "./pages/student/YoutubeNotes";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<CourseDetails />} />

        <Route path="/topic/:id" element={<TopicPage />} />
        <Route
          path="/courses/:courseId/topics/:topicIndex"
          element={<TopicPage />}
        />

        <Route path="/study-plan" element={<StudyPlan />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/weak-topics" element={<WeakTopics />} />
        <Route path="/gamification" element={<Gamification />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/browse-courses" element={<BrowseCourses />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/youtube-notes" element={<YoutubeNotes />} />

        {/* Admin Route */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-black text-red-500 text-3xl font-bold">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: "#18181b",
          color: "#ffffff",
          border: "1px solid #14532d",
        }}
      />
    </>
  );
}

export default App;