import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import { loginUser } from '../../services/authServices';
import { setCredentials } from '../../features/auth/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Login API call
      const data = await loginUser(formData);

      // Support responses that may nest the payload (e.g. { data: { token, user } })
      const payload = data?.data ? data.data : data;

      console.log('Login Response:', payload);

      const token = payload?.token;
      const user = payload?.user;

      // Validate response before accessing properties
      if (!token || !user) {
        throw new Error('Invalid login response');
      }

      // Save token and user separately so the auth interceptor can read them cleanly.
      localStorage.setItem('token', token);
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (err) {
        console.warn('Failed to stringify user for localStorage', err);
      }

      console.log('Saved to localStorage:', {
        token: token ? 'stored' : 'missing',
        user: (() => {
          try {
            return JSON.parse(localStorage.getItem('user'));
          } catch (_) {
            return null;
          }
        })(),
      });

      // Save to Redux
      dispatch(
        setCredentials({
          user,
          token,
        })
      );

      toast.success('Welcome to CourseCraft 🚀');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login Error:', error);

      const errPayload = error?.response?.data ?? error?.message ?? 'Login failed';
      const errMessage =
        typeof errPayload === 'string'
          ? errPayload
          : errPayload?.message || JSON.stringify(errPayload);

      toast.error(errMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* LEFT SECTION */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-black via-green-950 to-green-900">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)] rounded-full blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)] rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500/20 p-3 rounded-2xl">
              <BookOpen className="w-8 h-8 text-green-400" />
            </div>
            <span className="text-3xl font-bold text-green-400">
              CourseCraft
            </span>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Master Skills
            <br />
            with AI Learning
          </h1>

          <p className="text-gray-300 mb-8 max-w-md">
            AI-powered notes, quizzes, progress tracking,
            and smart study plans — all in one platform.
          </p>

          <div className="flex items-center gap-3 text-green-400">
            <Sparkles className="w-5 h-5" />
            <span>
              Smart Learning • AI Notes • Gamified Growth
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-zinc-900 border border-green-900/40 rounded-3xl p-8 shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-green-400 text-center">
            Welcome Back
          </h2>

          <p className="text-gray-400 text-center mt-2 mb-8">
            Login to continue learning
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black border border-green-900 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black border border-green-900 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition"
            >
              {loading ? 'Signing In...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            New here?{' '}
            <Link
              to="/register"
              className="text-green-400 font-semibold"
            >
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;