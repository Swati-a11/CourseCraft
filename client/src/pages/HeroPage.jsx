import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import {
  BookOpen,
  Sparkles,
  Flame,
  PenTool,
  ArrowRight,
  Sun,
  Moon,
  Layers,
  FileText,
  Search,
  Award
} from 'lucide-react';
import {
  ContainerScroll,
  ContainerSticky,
  ContainerAnimated,
  ContainerInset,
  HeroVideo
} from '../components/ui/animated-scroll';

const Youtube = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const HeroPage = () => {
  const navigate = useNavigate();
  const { isLight, toggleTheme } = useTheme();
  const token = localStorage.getItem('token');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const coreFeatures = [
    { icon: Search, title: 'Playlist Tracker', desc: 'Track YouTube playlists and never lose your progress' },
    { icon: FileText, title: 'AI Notes', desc: 'Generate smart notes from any YouTube video instantly' },
    { icon: Award, title: 'Streak System', desc: 'Build daily learning habits with streak tracking' },
    { icon: BookOpen, title: 'Practice Questions', desc: 'AI-generated questions to test your understanding' },
  ];

  const extraFeatures = [
    { icon: Youtube, title: 'AI Note Generator', desc: 'Input a YouTube video link to extract clear, ordered study text notes.' },
    { icon: Layers, title: 'Smart Playlist Fetcher', desc: 'Pasting a YouTube playlist URL systematically imports and organizes all video cards within.' },
    { icon: FileText, title: 'AI PDF Summarizer', desc: 'Drop textbooks or long PDFs to instantly extract comprehensive outlines.' },
  ];

  const steps = [
    { num: '01', title: 'Sign Up', desc: 'Create your free account in seconds' },
    { num: '02', title: 'Add Content', desc: 'Browse course and start learning' },
    { num: '03', title: 'Start Learning', desc: 'Get AI notes, questions and track progress' },
  ];

  const testimonials = [
    { name: 'Rahul Sharma', role: 'Engineering Student', text: 'CourseCraft helped me complete my DSA playlist in 2 weeks with daily streaks!', avatar: 'R' },
    { name: 'Priya Singh', role: 'Self-learner', text: 'The AI notes feature saves me hours of note-taking. Absolutely love it!', avatar: 'P' },
    { name: 'Arjun Mehta', role: 'Developer', text: 'Practice questions after each video made my concepts super strong.', avatar: 'A' },
  ];

  const handleExploreClick = () => {
    if (token) {
      navigate('/dashboard', { replace: true });
    } else {
      setShowOnboarding(true);
    }
  };

  const handleCtaClick = () => {
    if (token) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/register');
    }
  };

  const handleLoginClick = () => {
    if (token) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login');
    }
  };

  const stickyBgStyle = {
    background: isLight
      ? 'radial-gradient(40% 40% at 50% 20%, #dcfce7 0%, #f0fdf4 40%, #ffffff 80%, #ffffff 100%)'
      : 'radial-gradient(40% 40% at 50% 20%, #0e3320 0%, #071a0f 40%, #030a05 80%, #020617 100%)',
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isLight ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'}`}>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md border-b transition-colors duration-300 ${isLight ? 'bg-white/80 border-green-200' : 'bg-slate-950/80 border-white/5'}`}>
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-green-400" />
          <span className={`text-xl font-bold transition-colors duration-300 ${isLight ? 'text-slate-950' : 'text-white'}`}>CourseCraft</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all cursor-pointer ${isLight ? 'border-green-200 hover:bg-green-100 text-green-600 hover:text-green-700' : 'border-white/10 hover:bg-white/5 text-gray-300 hover:text-white'}`}
            title="Toggle theme"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={handleLoginClick}
            className={`text-sm font-medium transition-colors cursor-pointer ${isLight ? 'text-slate-950 hover:text-green-600' : 'text-gray-400 hover:text-white'}`}
          >
            Login
          </button>
          <button
            onClick={handleCtaClick}
            className={`text-sm font-semibold px-4 py-2 rounded-full transition-all cursor-pointer shadow-[0_2px_10px_rgba(34,197,94,0.2)] ${isLight ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-400 text-black'}`}
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section with Animated Scroll */}
      <ContainerScroll className="h-[350vh]">
        <ContainerSticky
          style={stickyBgStyle}
          className="px-6 py-10 flex flex-col items-center justify-center transition-colors duration-300"
        >
          {/* Hero Text */}
          <ContainerAnimated className="space-y-6 text-center max-w-3xl mx-auto pt-20">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 ${isLight ? 'border-green-200 bg-green-100 text-green-600' : 'border-green-500/30 bg-green-500/10 text-green-400'} text-sm`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${isLight ? 'bg-green-600' : 'bg-green-400'}`} />
              AI-Powered Learning Platform
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Enter the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Grid
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed transition-colors duration-300 ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>
              Experience the next evolution of learning, where knowledge flows with unparalleled speed. Track playlists, generate AI notes, and build daily streaks.
            </p>

            {/* CTA Button Wrapper with Conditional State Controls */}
            <div className="relative flex items-center justify-center min-h-[64px]">
              {!showOnboarding ? (
                <motion.button
                  key="explore-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExploreClick}
                  className={`group relative flex items-center gap-2 mx-auto w-fit rounded-full border px-8 py-3 transition-all text-lg cursor-pointer ${isLight ? 'border-green-600 bg-green-100 text-green-600 shadow-[0px_4px_24px_rgba(22,163,74,0.2)] hover:bg-green-200' : 'border-green-500 bg-black/20 text-green-400 shadow-[0px_4px_24px_rgba(34,197,94,0.3)] hover:bg-green-500/10'}`}
                >
                  Explore the Network
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              ) : (
                <motion.button
                  key="get-started-btn"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className={`group relative flex items-center gap-2 mx-auto w-fit rounded-full border px-8 py-3 transition-all text-lg cursor-pointer ${isLight ? 'border-green-600 bg-green-600 text-white shadow-[0px_4px_24px_rgba(22,163,74,0.3)] hover:bg-green-700' : 'border-green-500 bg-green-500 text-black shadow-[0px_4px_24px_rgba(34,197,94,0.5)] hover:bg-green-400'}`}
                >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}
            </div>
          </ContainerAnimated>

          {/* Animated Video/Preview */}
          <ContainerInset className="max-h-[450px] w-full max-w-4xl mx-auto py-6 mt-8">
            <HeroVideo
              src="https://videos.pexels.com/video-files/8566672/8566672-uhd_2560_1440_30fps.mp4"
            />
          </ContainerInset>

        </ContainerSticky>
      </ContainerScroll>

      {/* Features Section */}
      <section className="py-24 px-6 bg-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                learn faster
              </span>
            </h2>
            <p className={`text-lg transition-colors duration-300 ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>
              Powerful AI tools built for serious learners
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] hover:border-green-500/40 ${isLight ? 'bg-white border-green-200 text-slate-950' : 'bg-white/5 border-white/10 text-gray-400'}`}
              >
                <feature.icon className="w-8 h-8 text-green-400 mb-4 transition-transform duration-300 group-hover:scale-110" />
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${isLight ? 'text-slate-950' : 'text-white'}`}>{feature.title}</h3>
                <p className="text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-24 px-6 transition-colors duration-300 ${isLight ? 'bg-green-50/50 border-t border-b border-green-200' : 'bg-[#030a05]'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              How it{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                works
              </span>
            </h2>
            <p className={isLight ? 'text-slate-950' : 'text-gray-400'}>Get started in 3 simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center group"
              >
                <div className={`text-6xl font-bold mb-4 transition-transform duration-300 group-hover:scale-105 ${isLight ? 'text-green-600/20' : 'text-green-500/20'}`}>{step.num}</div>
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isLight ? 'text-slate-950' : 'text-white'}`}>{step.title}</h3>
                <p className={isLight ? 'text-slate-950' : 'text-gray-400'}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* "Some More Features" Section */}
      <section className="py-24 px-6 bg-transparent border-b dark:border-white/5 border-green-200">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Some More{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className={`text-lg transition-colors duration-300 ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>
              Advanced components built for your modern learning stack
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {extraFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] hover:border-green-500/40 ${isLight ? 'bg-white border-green-200 text-slate-950' : 'bg-white/5 border-white/10 text-gray-400'}`}
              >
                <feature.icon className="w-8 h-8 text-green-400 mb-4 transition-transform duration-300 group-hover:scale-110" />
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${isLight ? 'text-slate-950' : 'text-white'}`}>{feature.title}</h3>
                <p className="text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* My Achievements Section */}
      <section className={`py-24 px-6 border-b transition-colors duration-300 ${isLight ? 'bg-white border-green-200' : 'bg-transparent border-white/5'}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              My{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Achievements
              </span>
            </h2>
            <p className={`text-lg font-medium transition-colors duration-300 ${isLight ? 'text-slate-950' : 'text-gray-400'}`}>
              Celebrate your learning milestones and earned certificates
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`group p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] hover:border-green-500/40 ${isLight ? 'bg-white border-green-200 text-slate-950' : 'bg-white/5 border-white/10 text-gray-400'}`}
            >
              <Award className="w-8 h-8 text-green-400 mb-4 transition-transform duration-300 group-hover:scale-110" />
              <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                AI Study Plan Generator
              </h3>
              <p className="text-sm leading-relaxed">
                Generate customized linear schedules and topics tailored to your learning speed.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`group p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] hover:border-green-500/40 ${isLight ? 'bg-white border-green-200 text-slate-950' : 'bg-white/5 border-white/10 text-gray-400'}`}
            >
              <Search className="w-8 h-8 text-green-400 mb-4 transition-transform duration-300 group-hover:scale-110" />
              <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Browse Courses
              </h3>
              <p className="text-sm leading-relaxed">
                Search the catalog or generate a new course topic from AI.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Loved by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                learners
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border transition-all duration-300 ${isLight ? 'bg-white border-green-200 text-slate-950 shadow-sm' : 'bg-white/5 border-white/10 text-gray-300'}`}
              >
                <p className="mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${isLight ? 'bg-green-100 border-green-200 text-green-600' : 'bg-green-500/20 border-green-500/30 text-green-400'}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className={`font-medium text-sm transition-colors duration-300 ${isLight ? 'text-slate-950' : 'text-white'}`}>{t.name}</div>
                    <div className={`text-xs transition-colors duration-300 ${isLight ? 'text-green-600' : 'text-gray-500'}`}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-24 px-6 text-center transition-colors duration-300 ${isLight ? 'bg-green-50/50 border-t border-green-200' : 'bg-[#030a05]'}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <h2 className="text-4xl font-bold">
            Ready to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              start learning?
            </span>
          </h2>
          <p className={isLight ? 'text-slate-950' : 'text-gray-400'}>Join thousands of learners already using CourseCraft</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCtaClick}
            className={`group font-bold px-8 py-4 rounded-full text-lg transition-all flex items-center gap-2 mx-auto cursor-pointer ${isLight ? 'bg-green-600 hover:bg-green-700 text-white shadow-[0px_4px_30px_rgba(22,163,74,0.3)]' : 'bg-green-500 hover:bg-green-400 text-black shadow-[0px_4px_30px_rgba(34,197,94,0.4)]'}`}
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-6 border-t text-center text-sm transition-colors duration-300 ${isLight ? 'bg-white border-green-200 text-slate-950' : 'bg-black border-white/5 text-gray-500'}`}>
        <p>© 2026 CourseCraft. Built with ❤️ for learners.</p>
      </footer>

    </div>
  );
};

export default HeroPage;
