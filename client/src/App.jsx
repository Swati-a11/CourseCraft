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
import CourseLearningPage from "./pages/student/CourseLearningPage";

// Admin
import AdminDashboard from "./pages/admin/adminDashboard";

import { useEffect } from "react";

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Routes>

        {/* ROOT → ALWAYS LOGIN FIRST */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* AUTH */}
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        <Route
          path="/register"
          element={token ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* DASHBOARD (PROTECTED) */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        {/* COURSES */}
        <Route
          path="/browse-courses"
          element={token ? <BrowseCourses /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/my-courses"
          element={token ? <MyCourses /> : <Navigate to="/login" replace />}
        />

        {/* LMS ROUTES */}
        <Route
          path="/course/:courseId"
          element={token ? <CourseLearningPage /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/courses/:courseId"
          element={token ? <CourseDetails /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/courses/:courseId/topics/:id"
          element={token ? <TopicPage /> : <Navigate to="/login" replace />}
        />

        {/* FEATURES */}
        <Route path="/study-plan" element={token ? <StudyPlan /> : <Navigate to="/login" replace />} />
        <Route path="/progress" element={token ? <ProgressPage /> : <Navigate to="/login" replace />} />
        <Route path="/weak-topics" element={token ? <WeakTopics /> : <Navigate to="/login" replace />} />
        <Route path="/gamification" element={token ? <Gamification /> : <Navigate to="/login" replace />} />
        <Route path="/reminders" element={token ? <Reminders /> : <Navigate to="/login" replace />} />
        <Route path="/achievements" element={token ? <Achievements /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={token ? <Settings /> : <Navigate to="/login" replace />} />
        <Route path="/youtube-notes" element={token ? <YoutubeNotes /> : <Navigate to="/login" replace />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={token ? <AdminDashboard /> : <Navigate to="/login" replace />}
        />

        {/* 404 PAGE */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
              <h1 className="text-6xl font-bold text-red-500">404</h1>
              <p className="text-gray-400 mt-4 text-lg">Page Not Found</p>

              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="mt-6 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition"
              >
                Go To Dashboard
              </button>
            </div>
          }
        />

      </Routes>

      {/* TOAST NOTIFICATIONS */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
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