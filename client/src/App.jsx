import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/auths/Login';
import Register from './pages/auths/Register';

import Dashboard from './pages/student/Dashboard';
import CourseDetails from './pages/student/CourseDetails';
import TopicPage from './pages/student/TopicPage';
import StudyPlan from './pages/student/StudyPlan';
import ProgressPage from './pages/student/ProgressPage';
import WeakTopics from './pages/student/WeakTopics';
import Gamification from './pages/student/Gamification';
import Reminders from './pages/student/Reminders';
import BrowseCourses from './pages/student/BrowseCourses';
import MyCourses from './pages/student/MyCourses';
import Achievements from './pages/student/Achievements';
import Settings from './pages/student/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import YoutubeNotes from './pages/student/YoutubeNotes';

function App() {
  return (
    <>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<CourseDetails />} />

        {/* Existing Topic Route */}
        <Route path="/topic/:id" element={<TopicPage />} />

        {/* New Topic Route with courseId and topicIndex */}
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
        {/* Admin Route */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/youtube-notes" element={<YoutubeNotes />} />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-black text-red-500 flex items-center justify-center text-3xl font-bold">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>

      {/* Global Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: '#18181b',
          color: '#ffffff',
          border: '1px solid #14532d',
        }}
      />
    </>
  );
}

export default App;