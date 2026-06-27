import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ContainerScroll,
  ContainerSticky,
  ContainerAnimated,
  ContainerInset,
  HeroVideo
} from '../components/ui/animated-scroll';

const HeroPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const features = [
    { icon: '📚', title: 'Playlist Tracker', desc: 'Track YouTube playlists and never lose your progress' },
    { icon: '🤖', title: 'AI Notes', desc: 'Generate smart notes from any YouTube video instantly' },
    { icon: '🔥', title: 'Streak System', desc: 'Build daily learning habits with streak tracking' },
    { icon: '📝', title: 'Practice Questions', desc: 'AI-generated questions to test your understanding' },
  ];

  const steps = [
    { num: '01', title: 'Sign Up', desc: 'Create your free account in seconds' },
    { num: '02', title: 'Add Content', desc: 'Paste any YouTube video or playlist link' },
    { num: '03', title: 'Start Learning', desc: 'Get AI notes, questions and track progress' },
  ];

  const testimonials = [
    { name: 'Rahul Sharma', role: 'Engineering Student', text: 'CourseCraft helped me complete my DSA playlist in 2 weeks with daily streaks!', avatar: 'R' },
    { name: 'Priya Singh', role: 'Self-learner', text: 'The AI notes feature saves me hours of note-taking. Absolutely love it!', avatar: 'P' },
    { name: 'Arjun Mehta', role: 'Developer', text: 'Practice questions after each video made my concepts super strong.', avatar: 'A' },
  ];

  const handleCtaClick = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleLoginClick = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-2xl">📚</span>
          <span className="text-xl font-bold text-white">CourseCraft</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLoginClick}
            className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={handleCtaClick}
            className="text-sm bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-full transition-all cursor-pointer"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section with Animated Scroll */}
      <ContainerScroll className="h-[350vh]">
        <ContainerSticky
          style={{
            background: 'radial-gradient(40% 40% at 50% 20%, #0e3320 0%, #071a0f 40%, #030a05 80%, #000000 100%)',
          }}
          className="px-6 py-10 text-slate-50 flex flex-col items-center justify-center"
        >
          {/* Hero Text */}
          <ContainerAnimated className="space-y-6 text-center max-w-3xl mx-auto pt-20">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              AI-Powered Learning Platform
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Enter the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                Grid
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Experience the next evolution of learning, where knowledge flows with unparalleled speed. Track playlists, generate AI notes, and build daily streaks.
            </p>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCtaClick}
              className="group relative flex items-center gap-2 mx-auto w-fit rounded-full border border-green-500 bg-black/20 px-8 py-3 shadow-[0px_4px_24px_#22c55e50] hover:bg-green-500/10 transition-all text-green-400 font-semibold text-lg cursor-pointer"
            >
              Explore the Network
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </motion.button>
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
      <section className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Everything you need to <span className="text-green-400">learn faster</span></h2>
            <p className="text-gray-400 text-lg">Powerful AI tools built for serious learners</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-[#030a05]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How it <span className="text-green-400">works</span></h2>
            <p className="text-gray-400">Get started in 3 simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-green-500/20 mb-4">{step.num}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Loved by <span className="text-green-400">learners</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <p className="text-gray-300 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#030a05] text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <h2 className="text-4xl font-bold">Ready to <span className="text-green-400">start learning?</span></h2>
          <p className="text-gray-400">Join thousands of learners already using CourseCraft</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCtaClick}
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-full text-lg transition-all shadow-[0px_4px_30px_#22c55e50] cursor-pointer"
          >
            Get Started Free →
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center text-gray-500 text-sm bg-black">
        <p>© 2026 CourseCraft. Built with ❤️ for learners.</p>
      </footer>

    </div>
  );
};

export default HeroPage;
