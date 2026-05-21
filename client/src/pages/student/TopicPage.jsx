import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

import NotesTab from '../../components/courses/NotesTab';
import VideoTab from '../../components/courses/VideoTab';
import QuizTab from '../../components/courses/QuizTab';
import PersonalNotesTab from '../../components/courses/PersonalNotesTab';
import CompletionModal from '../../components/modals/CompletionModal';

import { submitQuizResult } from '../../services/quizService';
import { getCourseById } from '../../services/courseService';
import {
  getCourseProgress,
  updateTopicProgress,
} from '../../services/courseProgressService';

const tabs = ['Notes', 'Video', 'Quiz', 'Personal Notes'];

const TopicPage = () => {
  const { id } = useParams();
  const courseId = localStorage.getItem('selectedCourseId');
  const topicIndex = Number(id);

  const [activeTab, setActiveTab] = useState('Notes');
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [topicDetails, setTopicDetails] = useState(null);
  const [error, setError] = useState('');

  const isValidObjectId = (val) => typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val);

  const [progress, setProgress] = useState({
    notesCompleted: false,
    videoCompleted: false,
    quizPassed: false,
    quizAttempted: false,
    score: 0,
  });

  // =========================
  // LOAD COURSE & PROGRESS
  // =========================
  useEffect(() => {
    const loadData = async () => {
      if (!courseId || isNaN(topicIndex) || !isValidObjectId(courseId)) {
        setError(
          'No selected course found. Please open the course details page first.'
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [courseRes, progressRes] = await Promise.all([
          getCourseById(courseId),
          getCourseProgress(courseId),
        ]);

        const fetchedCourse = courseRes.data;
        const topics = (fetchedCourse.topics || []).map((topic, index) => ({
          ...topic,
          id: index + 1,
        }));

        setCourse({ ...fetchedCourse, topics });

        const currentTopic = topics[topicIndex - 1];
        if (!currentTopic) {
          setError('Topic not found for this course.');
          setLoading(false);
          return;
        }

        setTopicDetails(currentTopic);

        const topicProgress =
          progressRes?.data?.completedTopics?.find(
            (t) => t.topicIndex === topicIndex
          );

        setProgress({
          notesCompleted: topicProgress?.notesCompleted || false,
          videoCompleted: topicProgress?.videoCompleted || false,
          quizPassed: topicProgress?.quizPassed || false,
          quizAttempted:
            topicProgress?.quizAttempted || topicProgress?.quizPassed || false,
          score: topicProgress?.quizScore || 0,
        });
      } catch (error) {
        console.error('Topic load error:', error?.response?.data || error.message);
        setError('Unable to load topic or course details.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId, topicIndex]);

  // =========================
  // SAVE PROGRESS
  // =========================
  useEffect(() => {
    if (
      loading ||
      !courseId ||
      isNaN(topicIndex) ||
      !isValidObjectId(courseId) ||
      !topicDetails
    )
      return;

    const saveProgress = async () => {
      try {
        await updateTopicProgress(courseId, {
          topicIndex,
          notesCompleted: progress.notesCompleted,
          videoCompleted: progress.videoCompleted,
          quizPassed: progress.quizPassed,
          quizScore: progress.score,
        });
      } catch (error) {
        console.error('Save error:', error?.response?.data || error?.message);
      }
    };

    saveProgress();
  }, [progress, courseId, topicIndex, loading, topicDetails]);

  const completionPercent =
    (progress.notesCompleted ? 33 : 0) +
    (progress.videoCompleted ? 33 : 0) +
    (progress.quizAttempted ? 34 : 0);

  const quizUnlocked = progress.notesCompleted && progress.videoCompleted;
  const topicCompleted = progress.notesCompleted && progress.videoCompleted && progress.quizPassed;

  const renderTab = () => {
    if (!topicDetails) return <div className="text-gray-400">Topic details not available.</div>;

    switch (activeTab) {
      case 'Notes':
        return (
          <NotesTab
            title={topicDetails.title}
            notes={topicDetails.notes}
            completed={progress.notesCompleted}
            onComplete={() => setProgress((prev) => ({ ...prev, notesCompleted: true }))}
          />
        );

      case 'Video':
        return (
          <VideoTab
            title={topicDetails.title}
            videoUrl={topicDetails.videoUrl}
            completed={progress.videoCompleted}
            onComplete={() => setProgress((prev) => ({ ...prev, videoCompleted: true }))}
          />
        );

      case 'Quiz':
        return quizUnlocked ? (
          <QuizTab
            topicId={topicIndex}
            topicTitle={topicDetails.title}
            questions={topicDetails.quiz}
            onComplete={async (data) => {
              const { score, percentage, passed, answers } = data;

              setProgress((prev) => ({
                ...prev,
                quizPassed: passed,
                quizAttempted: true,
                score: percentage,
              }));

              try {
                await submitQuizResult({
                  topicId: topicIndex,
                  topicTitle: topicDetails.title,
                  courseId,
                  score,
                  totalQuestions: topicDetails.quiz?.length || 10,
                  percentage,
                  passed,
                  answers,
                });
              } catch (error) {
                console.error(error.message);
              }
            }}
          />
        ) : (
          <div className="text-center py-10 text-gray-400">
            Complete Notes + Video to unlock quiz 🔒
          </div>
        );

      case 'Personal Notes':
        return <PersonalNotesTab />;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh] text-green-400">
          Loading topic details...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-400 mt-10">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">
          Topic {topicIndex}: {topicDetails?.title || ''}
        </h1>
      </div>

      <div className="w-full bg-zinc-800 h-3 rounded-full mt-3">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${completionPercent}%` }}
        />
      </div>

      <p className="text-sm text-gray-400 mt-2 mb-6">
        {completionPercent}% Complete
        {topicCompleted && (
          <span className="text-green-400 ml-3 font-semibold">
            ✔ Completed
          </span>
        )}
      </p>

      <div className="flex gap-3 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            disabled={tab === 'Quiz' && !quizUnlocked}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab
                ? 'bg-green-600 text-black'
                : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
            } ${tab === 'Quiz' && !quizUnlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 p-6 rounded-xl border border-white/5 shadow-xl">
        {renderTab()}
      </div>
    </DashboardLayout>
  );
};

export default TopicPage;