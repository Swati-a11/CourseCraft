import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import TopicList from '../../components/learning/TopicList';
import NotesView from '../../components/learning/NotesView';
import VideoPlayer from '../../components/learning/VideoPlayer';
import QuizEngine from '../../components/learning/QuizEngine';
import QuizResults from '../../components/learning/QuizResults';
import PersonalNotes from '../../components/learning/PersonalNotes';
import { PlayCircle, FileText } from 'lucide-react';

const CourseLearningPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('video');
  const [loading, setLoading] = useState(true);

  // States for Quiz
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    if (!courseId || courseId === 'undefined') {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/learning/course/${courseId}`);
      setCourse(res.data.course);
      setProgress(res.data.progress);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load course", error);
      setLoading(false);
    }
  };

  const handleTopicSelect = (index) => {
    setActiveTopicIndex(index);
    setShowQuiz(false);
    setQuizResults(null);
    setActiveTab('video');
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizSubmit = async (answers) => {
    try {
      const res = await api.post('/learning/quiz/submit', {
        courseId,
        topicIndex: activeTopicIndex,
        answers
      });

      setQuizResults(res.data);
      setShowQuiz(false);
      // Update local progress State
      fetchCourseData(); 
    } catch (error) {
      console.error("Failed to submit quiz", error);
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Course...</div>;
  if (!course) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Course not found.</div>;

  const activeTopic = course.topics[activeTopicIndex];

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full">
        <div className="p-6 border-b border-zinc-800">
          <button onClick={() => navigate('/my-courses')} className="text-zinc-400 hover:text-white mb-4 text-sm flex items-center gap-2">
            ← Back to My Courses
          </button>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            {course.title}
          </h2>
          <div className="mt-4 bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-green-500 h-full transition-all duration-500" 
              style={{ width: `${progress?.totalProgress || 0}%` }}
            ></div>
          </div>
          <p className="text-xs text-zinc-400 mt-2">{progress?.totalProgress || 0}% Completed</p>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <TopicList 
            topics={course.topics} 
            progress={progress} 
            activeIndex={activeTopicIndex} 
            onSelect={handleTopicSelect} 
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
        <div className="p-8 max-w-5xl mx-auto w-full">
          <h1 className="text-3xl font-extrabold mb-8">{activeTopic?.title}</h1>
          
          {quizResults ? (
            <QuizResults results={quizResults} onRetry={() => setQuizResults(null)} onNext={() => handleTopicSelect(Math.min(activeTopicIndex + 1, course.topics.length - 1))} />
          ) : showQuiz ? (
            <QuizEngine topic={activeTopic} onSubmit={handleQuizSubmit} onCancel={() => setShowQuiz(false)} />
          ) : (
            <div className="space-y-8">
              
              <div className="flex gap-4 border-b border-zinc-800 pb-2">
                {activeTopic?.videoUrl && (
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`px-6 py-3 rounded-t-lg font-semibold flex items-center gap-2 transition-all ${
                      activeTab === 'video'
                        ? 'bg-green-600/20 text-green-400 border-b-2 border-green-500'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <PlayCircle size={18} /> Video Lesson
                  </button>
                )}
                {activeTopic?.notes && (
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-6 py-3 rounded-t-lg font-semibold flex items-center gap-2 transition-all ${
                      activeTab === 'notes'
                        ? 'bg-green-600/20 text-green-400 border-b-2 border-green-500'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <FileText size={18} /> Theory & Notes
                  </button>
                )}
              </div>

              {activeTab === 'video' && activeTopic?.videoUrl && (
                <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <VideoPlayer url={activeTopic.videoUrl} />
                </section>
              )}
              
              {activeTab === 'notes' && activeTopic?.notes && (
                <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <NotesView content={activeTopic.notes} />
                </section>
              )}
              
              <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center mt-8">
                <h3 className="text-2xl font-bold mb-2">Ready to test your knowledge?</h3>
                <p className="text-zinc-400 mb-6 max-w-md">Take the topic quiz to earn XP, maintain your streak, and unlock the next topics!</p>
                <button 
                  onClick={handleStartQuiz}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transform hover:-translate-y-1"
                >
                  Start Quiz
                </button>
              </section>

              <section className="h-80 mt-12 border-t border-zinc-800 pt-8">
                <PersonalNotes courseId={courseId} initialNotes={progress?.personalNotes || ''} />
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPage;
