import { useState, useEffect } from 'react';
import { Bell, Shield, Palette, Volume2, Eye, Clock, Mail, Smartphone, User, Lock } from 'lucide-react';
import api from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import { toast } from 'react-toastify';

import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
  const { isLight, toggleTheme } = useTheme();

  // ===============================
  // USER PROFILE STATES
  // ===============================
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // ===============================
  // SETTINGS CONFIG STATES
  // ===============================
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    quizReminders: true,
    courseUpdateNotifications: true,
    darkMode: true,
    soundEnabled: false,
    theme: 'dark',
    privateProfile: false,
    twoFactorAuth: false,
    displayStreak: true,
    allowComments: true,
  });

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    // Load local storage settings if any
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error(e);
      }
    }

    // Load active user profile details
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setProfile({
          name: parsedUser.name || parsedUser.user?.name || '',
          email: parsedUser.email || parsedUser.user?.email || '',
          password: '',
          confirmPassword: ''
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    setSettings((prev) => (prev.darkMode === !isLight ? prev : { ...prev, darkMode: !isLight }));
  }, [isLight]);

  const handleToggle = (key) => {
    if (key === 'darkMode') {
      toggleTheme();
    }
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (profile.password && profile.password !== profile.confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // 1. Save profile details to API
      const profileData = {
        name: profile.name,
        email: profile.email
      };
      if (profile.password) {
        profileData.password = profile.password;
      }

      const res = await api.put('/auths/profile', profileData);
      
      // Update local storage user data
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        parsed.name = res.data.user?.name;
        parsed.email = res.data.user?.email;
        localStorage.setItem('user', JSON.stringify(parsed));
      }

      // 2. Save settings toggles to local storage
      localStorage.setItem('userSettings', JSON.stringify(settings));

      setSaveStatus('✓ Settings saved successfully!');
      toast.success("Profile and settings updated successfully!");
      setProfile((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const SettingToggle = ({ icon: Icon, label, value, onChange, description }) => (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
      isLight 
        ? 'bg-slate-50 border-slate-200/60 hover:border-slate-300/80 shadow-sm' 
        : 'bg-gradient-to-r from-white/5 to-white/0 border-white/10 hover:border-white/20'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`rounded-lg p-2 transition-all duration-300 ${isLight ? 'bg-sky-100' : 'bg-sky-500/20'}`}>
          <Icon className={isLight ? 'text-sky-600' : 'text-sky-400'} size={20} />
        </div>
        <div>
          <p className={`font-semibold transition-all duration-300 ${isLight ? 'text-slate-900' : 'text-white'}`}>{label}</p>
          {description && <p className={`text-xs mt-1 transition-all duration-300 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{description}</p>}
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        type="button"
        className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
          value ? 'bg-sky-500' : 'bg-gray-600'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all duration-300 ${
            value ? 'right-1' : 'left-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className={`min-h-screen py-8 px-4 sm:px-6 transition-all duration-300 ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-zinc-950 text-white'}`}>
        <div className="space-y-8 max-w-6xl mx-auto">
          {/* Header */}
          <section className={`rounded-4xl border p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            isLight 
              ? 'bg-gradient-to-br from-sky-500/10 via-white to-cyan-500/10 border-slate-200/80 shadow-slate-200/50'
              : 'bg-gradient-to-br from-sky-900/20 via-zinc-950/80 to-cyan-900/20 border-sky-500/40 shadow-sky-900/20'
          }`}>
            <h1 className={`text-3xl sm:text-4xl font-bold transition-all duration-300 ${isLight ? 'text-slate-900' : 'text-white'}`}>Settings</h1>
            <p className={`mt-2 text-sm sm:text-base transition-all duration-300 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>Customize your learning experience and profile preferences</p>
          </section>

          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* PROFILE CARD */}
            <div className="space-y-6">
              {/* Account Profile Details */}
              <section className={`rounded-4xl border p-6 shadow-md space-y-6 transition-all duration-300 ${
                isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/5 shadow-2xl'
              }`}>
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <User className="text-sky-400" size={28} />
                  <h2 className={`text-xl sm:text-2xl font-bold transition-all duration-300 ${isLight ? 'text-slate-900' : 'text-white'}`}>Profile Information</h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className={`block text-sm font-semibold mb-2 transition-all duration-300 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>Display Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      required
                      className={`w-full p-4 rounded-2xl outline-none transition-all duration-300 ${
                        isLight 
                          ? 'bg-slate-100 text-slate-900 border border-slate-200 focus:border-slate-450 focus:bg-white focus:ring-1 focus:ring-slate-350' 
                          : 'bg-zinc-855 text-white border border-white/5 focus:border-sky-500/50'
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <label className={`block text-sm font-semibold mb-2 transition-all duration-300 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      required
                      className={`w-full p-4 rounded-2xl outline-none transition-all duration-300 ${
                        isLight 
                          ? 'bg-slate-100 text-slate-900 border border-slate-200 focus:border-slate-450 focus:bg-white focus:ring-1 focus:ring-slate-350' 
                          : 'bg-zinc-855 text-white border border-white/5 focus:border-sky-500/50'
                      }`}
                    />
                  </div>
                </div>
              </section>

              {/* Password credentials change form */}
              <section className={`rounded-4xl border p-6 shadow-md space-y-6 transition-all duration-300 ${
                isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/5 shadow-2xl'
              }`}>
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <Lock className="text-sky-400" size={28} />
                  <h2 className={`text-xl sm:text-2xl font-bold transition-all duration-300 ${isLight ? 'text-slate-900' : 'text-white'}`}>Security Credentials</h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className={`block text-sm font-semibold mb-2 transition-all duration-300 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>New Password (optional)</label>
                    <input
                      type="password"
                      placeholder="Enter new password to change..."
                      value={profile.password}
                      onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                      className={`w-full p-4 rounded-2xl outline-none transition-all duration-300 ${
                        isLight 
                          ? 'bg-slate-100 text-slate-900 border border-slate-200 focus:border-slate-450 focus:bg-white focus:ring-1 focus:ring-slate-350' 
                          : 'bg-zinc-855 text-white border border-white/5 focus:border-sky-500/50'
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <label className={`block text-sm font-semibold mb-2 transition-all duration-300 ${isLight ? 'text-slate-700' : 'text-gray-400'}`}>Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Verify new password..."
                      value={profile.confirmPassword}
                      onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                      className={`w-full p-4 rounded-2xl outline-none transition-all duration-300 ${
                        isLight 
                          ? 'bg-slate-100 text-slate-900 border border-slate-200 focus:border-slate-450 focus:bg-white focus:ring-1 focus:ring-slate-350' 
                          : 'bg-zinc-855 text-white border border-white/5 focus:border-sky-500/50'
                      }`}
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* TOGGLES / PREFERENCES */}
            <div className="space-y-6">
              {/* Notifications Settings */}
              <section className={`rounded-4xl border p-6 shadow-md transition-all duration-300 ${
                isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/5 shadow-2xl'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="text-blue-400" size={28} />
                  <h2 className={`text-xl sm:text-2xl font-bold transition-all duration-300 ${isLight ? 'text-slate-900' : 'text-white'}`}>Notifications</h2>
                </div>
                <div className="space-y-4">
                  <SettingToggle
                    icon={Bell}
                    label="Push Notifications"
                    value={settings.notifications}
                    onChange={() => handleToggle('notifications')}
                    description="Receive notifications on your device"
                  />
                  <SettingToggle
                    icon={Mail}
                    label="Email Notifications"
                    value={settings.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                    description="Receive system updates via email alerts"
                  />
                  <SettingToggle
                    icon={Clock}
                    label="Quiz Reminders"
                    value={settings.quizReminders}
                    onChange={() => handleToggle('quizReminders')}
                    description="Get reminded about active learning milestones"
                  />
                  <SettingToggle
                    icon={Smartphone}
                    label="Course Updates"
                    value={settings.courseUpdateNotifications}
                    onChange={() => handleToggle('courseUpdateNotifications')}
                    description="Get notified when new courses are added"
                  />
                </div>
              </section>

              {/* Display & Theme */}
              <section className={`rounded-4xl border p-6 shadow-md transition-all duration-300 ${
                isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/5 shadow-2xl'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="text-purple-400" size={28} />
                  <h2 className={`text-xl sm:text-2xl font-bold transition-all duration-300 ${isLight ? 'text-slate-900' : 'text-white'}`}>Display & Theme</h2>
                </div>
                <div className="space-y-4">
                  <SettingToggle
                    icon={Eye}
                    label="Dark Mode"
                    value={settings.darkMode}
                    onChange={() => handleToggle('darkMode')}
                    description="Use dark theme for reduced eye strain"
                  />
                  <SettingToggle
                    icon={Volume2}
                    label="Sound Effects"
                    value={settings.soundEnabled}
                    onChange={() => handleToggle('soundEnabled')}
                    description="Play sounds on achievements and completions"
                  />
                </div>
              </section>
            </div>

            {/* DANGER ZONE & SAVE BUTTON */}
            <div className="lg:col-span-2 space-y-6">
              {/* Danger Zone */}
              <section className={`rounded-4xl border p-6 shadow-2xl transition-all duration-300 ${
                isLight 
                  ? 'bg-red-50/50 border-red-200 shadow-md shadow-red-100/50' 
                  : 'bg-gradient-to-br from-red-900/20 to-pink-900/20 border-red-500/30'
              }`}>
                <h2 className={`text-2xl font-bold mb-4 transition-all duration-300 ${isLight ? 'text-red-700' : 'text-red-300'}`}>Danger Zone</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button type="button" className={`flex-1 px-6 py-3.5 rounded-2xl font-semibold transition-all hover:scale-[1.01] ${
                    isLight 
                      ? 'bg-red-100/80 border border-red-200 text-red-700 hover:bg-red-200/80 shadow-sm' 
                      : 'bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20'
                  }`}>
                    Reset Progress Data
                  </button>
                  <button type="button" className={`flex-1 px-6 py-3.5 rounded-2xl font-semibold transition-all hover:scale-[1.01] ${
                    isLight 
                      ? 'bg-red-600/10 border border-red-200 text-red-650 hover:bg-red-600/20 shadow-sm' 
                      : 'bg-red-600/10 border border-red-600/30 text-red-300 hover:bg-red-600/20'
                  }`}>
                    Delete Account
                  </button>
                </div>
                <p className={`text-xs mt-3 transition-all duration-300 ${isLight ? 'text-red-700/70' : 'text-red-300/70'}`}>These actions cannot be undone. Please proceed with caution.</p>
              </section>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-4">
                <div className={`h-1 flex-1 rounded-full hidden sm:block ${isLight ? 'bg-slate-200' : 'bg-gradient-to-r from-sky-500/20 to-transparent'}`}></div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {saveStatus && (
                    <p className="text-sky-500 font-semibold animate-pulse text-sm">{saveStatus}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-sky-500/50 transition-all hover:scale-105 disabled:bg-zinc-700 disabled:shadow-none"
                  >
                    {loading ? 'Saving Settings...' : ' Save Changes'}
                  </button>
                </div>
                <div className={`h-1 flex-1 rounded-full hidden sm:block ${isLight ? 'bg-slate-200' : 'bg-gradient-to-l from-sky-500/20 to-transparent'}`}></div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
