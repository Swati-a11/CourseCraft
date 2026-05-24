import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import DashboardLayout from '../../layouts/DashboardLayout';

import NotesTab from '../../components/courses/NotesTab';
import VideoTab from '../../components/courses/VideoTab';
import QuizTab from '../../components/courses/QuizTab';
import PersonalNotesTab from '../../components/courses/PersonalNotesTab';

import { submitQuizResult } from '../../services/quizService';
import { getCourseById } from '../../services/courseService';

import {
  getCourseProgress,
  updateTopicProgress,
} from '../../services/courseProgressService';

const tabs = ['Notes', 'Video', 'Quiz', 'Personal Notes'];

const TopicPage = () => {
  const navigate = useNavigate();

  // URL PARAMS
  const { courseId, topicIndex } = useParams();

  // CONVERT TO NUMBER
  const topicNumber = Number(topicIndex);

  // STATES
  const [activeTab, setActiveTab] = useState('Notes');

  const [loading, setLoading] = useState(true);

  const [course, setCourse] = useState(null);

  const [topicDetails, setTopicDetails] = useState(null);

  const [error, setError] = useState('');

  const [progress, setProgress] = useState({
    notesCompleted: false,
    videoCompleted: false,
    quizPassed: false,
    quizAttempted: false,
    score: 0,
  });

  // =========================
  // LOAD COURSE + PROGRESS
  // =========================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        setError('');

        // VALIDATION
        if (!courseId) {
          setError('Course ID missing.');
          return;
        }

        if (!topicNumber || isNaN(topicNumber)) {
          setError('Invalid topic.');
          return;
        }

        console.log('Course ID:', courseId);
        console.log('Topic Number:', topicNumber);

        // FETCH COURSE
        const courseRes = await getCourseById(courseId);

        console.log('Course Response:', courseRes.data);

        const fetchedCourse = courseRes?.data;

        if (!fetchedCourse) {
          setError('Course not found.');
          return;
        }

        // SAFE TOPICS
        const safeTopics = Array.isArray(
          fetchedCourse.topics
        )
          ? fetchedCourse.topics
          : [];

        // ADD IDS
        const topics = safeTopics.map(
          (topic, index) => ({
            ...topic,
            id: index + 1,
          })
        );

        const updatedCourse = {
          ...fetchedCourse,
          topics,
        };

        setCourse(updatedCourse);

        // CURRENT TOPIC
        const currentTopic =
          topics[topicNumber - 1];

        console.log(
          'Current Topic:',
          currentTopic
        );

        if (!currentTopic) {
          setError('Topic not found.');
          return;
        }

        setTopicDetails(currentTopic);

        // FETCH PROGRESS
        try {
          const progressRes =
            await getCourseProgress(courseId);

          console.log(
            'Progress Response:',
            progressRes.data
          );

          const topicProgress =
            progressRes?.data?.completedTopics?.find(
              (t) =>
                t.topicIndex === topicNumber
            );

          setProgress({
            notesCompleted:
              topicProgress?.notesCompleted ||
              false,

            videoCompleted:
              topicProgress?.videoCompleted ||
              false,

            quizPassed:
              topicProgress?.quizPassed ||
              false,

            quizAttempted:
              topicProgress?.quizAttempted ||
              topicProgress?.quizPassed ||
              false,

            score:
              topicProgress?.quizScore || 0,
          });
        } catch (progressError) {
          console.log(
            'Progress not found yet:',
            progressError.message
          );
        }
      } catch (error) {
        console.error(
          'Topic Load Error:',
          error?.response?.data ||
            error.message
        );

        if (
          error?.response?.status === 404
        ) {
          setError(
            'Course no longer exists.'
          );

          setTimeout(() => {
            navigate('/dashboard');
          }, 2500);
        } else {
          setError(
            error?.response?.data?.message ||
              'Failed to load topic.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId, topicNumber, navigate]);

  // =========================
  // SAVE PROGRESS
  // =========================

  useEffect(() => {
    if (
      loading ||
      !courseId ||
      !topicDetails
    ) {
      return;
    }

    const saveProgress = async () => {
      try {
        await updateTopicProgress(
          courseId,
          {
            topicIndex: topicNumber,

            notesCompleted:
              progress.notesCompleted,

            videoCompleted:
              progress.videoCompleted,

            quizPassed:
              progress.quizPassed,

            quizScore: progress.score,
          }
        );

        console.log(
          'Progress Saved'
        );
      } catch (error) {
        console.error(
          'Progress Save Error:',
          error?.response?.data ||
            error.message
        );
      }
    };

    saveProgress();
  }, [
    progress,
    courseId,
    topicNumber,
    loading,
    topicDetails,
  ]);

  // =========================
  // PROGRESS %
  // =========================

  const completionPercent =
    (progress.notesCompleted ? 33 : 0) +
    (progress.videoCompleted ? 33 : 0) +
    (progress.quizAttempted ? 34 : 0);

  const quizUnlocked =
    progress.notesCompleted &&
    progress.videoCompleted;

  const topicCompleted =
    progress.notesCompleted &&
    progress.videoCompleted &&
    progress.quizPassed;

  // =========================
  // RENDER TAB
  // =========================

  const renderTab = () => {
    if (!topicDetails) {
      return (
        <div className="text-gray-400">
          Topic details unavailable.
        </div>
      );
    }

    switch (activeTab) {
      // NOTES
      case 'Notes':
        return (
          <NotesTab
            title={topicDetails.title}
            notes={topicDetails.notes}
            completed={
              progress.notesCompleted
            }
            onComplete={() =>
              setProgress((prev) => ({
                ...prev,
                notesCompleted: true,
              }))
            }
          />
        );

      // VIDEO
      case 'Video':
        return (
          <VideoTab
            title={topicDetails.title}
            videoUrl={
              topicDetails.videoUrl
            }
            completed={
              progress.videoCompleted
            }
            onComplete={() =>
              setProgress((prev) => ({
                ...prev,
                videoCompleted: true,
              }))
            }
          />
        );

      // QUIZ
      case 'Quiz':
        return quizUnlocked ? (
          <QuizTab
            topicId={topicNumber}
            topicTitle={
              topicDetails.title
            }
            questions={
              topicDetails.quiz || []
            }
            onComplete={async (
              data
            ) => {
              const {
                score,
                percentage,
                passed,
                answers,
              } = data;

              setProgress((prev) => ({
                ...prev,
                quizPassed: passed,
                quizAttempted: true,
                score: percentage,
              }));

              try {
                await submitQuizResult({
                  topicId:
                    topicNumber,

                  topicTitle:
                    topicDetails.title,

                  courseId,

                  score,

                  totalQuestions:
                    topicDetails.quiz
                      ?.length || 0,

                  percentage,

                  passed,

                  answers,
                });
                
                // Navigate to progress page after successful quiz submission
                navigate('/progress');
              } catch (error) {
                console.error(
                  'Quiz Submit Error:',
                  error.message
                );
              }
            }}
          />
        ) : (
          <div className="text-center py-10 text-gray-400">
            Complete Notes +
            Video to unlock Quiz 🔒
          </div>
        );

      // PERSONAL NOTES
      case 'Personal Notes':
        return <PersonalNotesTab />;

      default:
        return null;
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh] text-green-400 text-lg">
          Loading topic details...
        </div>
      </DashboardLayout>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-red-400 text-lg mb-4">
            {error}
          </p>

          <button
            onClick={() =>
              navigate('/dashboard')
            }
            className="bg-green-500 hover:bg-green-600 text-black px-5 py-2 rounded-lg font-semibold"
          >
            Go To Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <DashboardLayout>
      {/* TITLE */}

      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">
          Topic {topicNumber}:{' '}
          {topicDetails?.title}
        </h1>
      </div>

      {/* PROGRESS */}

      <div className="w-full bg-zinc-800 h-3 rounded-full mt-3">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-500"
          style={{
            width: `${completionPercent}%`,
          }}
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

      {/* TABS */}

      <div className="flex gap-3 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            disabled={
              tab === 'Quiz' &&
              !quizUnlocked
            }
            onClick={() =>
              setActiveTab(tab)
            }
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab
                ? 'bg-green-600 text-black'
                : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
            } ${
              tab === 'Quiz' &&
              !quizUnlocked
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}

      <div className="bg-zinc-900 p-6 rounded-xl border border-white/5 shadow-xl">
        {renderTab()}
      </div>
    </DashboardLayout>
  );
};

export default TopicPage;