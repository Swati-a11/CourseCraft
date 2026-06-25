import { useState, useEffect } from 'react';
import { Bell, Shield, Palette, Volume2, Eye, Clock, Mail, Smartphone, User, Lock } from 'lucide-react';
import api from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import { toast } from 'react-toastify';

const Settings = () => {
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

  const handleToggle = (key) => {
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
    <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white/5 to-white/0 border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-emerald-500/20 p-2">
          <Icon className="text-emerald-400" size={20} />
        </div>
        <div>
          <p className="text-white font-semibold">{label}</p>
          {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        type="button"
        className={`relative w-12 h-7 rounded-full transition-all ${
          value ? 'bg-emerald-500' : 'bg-gray-600'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${
            value ? 'right-1' : 'left-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <section className="rounded-4xl bg-gradient-to-br from-emerald-900/20 via-zinc-950/80 to-cyan-900/20 border border-emerald-500/40 p-6 sm:p-8 shadow-2xl shadow-emerald-900/20 backdrop-blur-xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">Customize your learning experience and profile preferences</p>
        </section>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* PROFILE CARD */}
          <div className="space-y-6">
            <section className="rounded-4xl bg-zinc-950/80 border border-white/10 p-6 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <User className="text-emerald-400" size={28} />
                <h2 className="text-xl sm:text-2xl font-bold text-white">Profile Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                    className="w-full p-4 rounded-2xl bg-zinc-900 text-white border border-white/5 focus:border-emerald-500/50 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                    className="w-full p-4 rounded-2xl bg-zinc-900 text-white border border-white/5 focus:border-emerald-500/50 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-4xl bg-zinc-950/80 border border-white/10 p-6 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Lock className="text-emerald-400" size={28} />
                <h2 className="text-xl sm:text-2xl font-bold text-white">Security Credentials</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">New Password (optional)</label>
                  <input
                    type="password"
                    placeholder="Enter new password to change..."
                    value={profile.password}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-zinc-900 text-white border border-white/5 focus:border-emerald-500/50 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Verify new password..."
                    value={profile.confirmPassword}
                    onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-zinc-900 text-white border border-white/5 focus:border-emerald-500/50 outline-none transition-all"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* TOGGLES / PREFERENCES */}
          <div className="space-y-6">
            {/* Notifications Settings */}
            <section className="rounded-4xl bg-zinc-950/80 border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="text-blue-400" size={28} />
                <h2 className="text-xl sm:text-2xl font-bold text-white">Notifications</h2>
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
            <section className="rounded-4xl bg-zinc-950/80 border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="text-purple-400" size={28} />
                <h2 className="text-xl sm:text-2xl font-bold text-white">Display & Theme</h2>
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
            <section className="rounded-4xl bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/30 p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-red-300 mb-4">Danger Zone</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button type="button" className="flex-1 px-6 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 font-semibold hover:bg-red-500/20 hover:border-red-500/50 transition-all">
                  Reset Progress Data
                </button>
                <button type="button" className="flex-1 px-6 py-3.5 rounded-2xl bg-red-600/10 border border-red-600/30 text-red-300 font-semibold hover:bg-red-600/20 hover:border-red-600/50 transition-all">
                  Delete Account
                </button>
              </div>
              <p className="text-xs text-red-300/70 mt-3">These actions cannot be undone. Please proceed with caution.</p>
            </section>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-4">
              <div className="h-1 flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-full hidden sm:block"></div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {saveStatus && (
                  <p className="text-emerald-400 font-semibold animate-pulse text-sm">{saveStatus}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/50 transition-all hover:scale-105 disabled:bg-zinc-700 disabled:shadow-none"
                >
                  {loading ? 'Saving Settings...' : '💾 Save Changes'}
                </button>
              </div>
              <div className="h-1 flex-1 bg-gradient-to-l from-emerald-500/20 to-transparent rounded-full hidden sm:block"></div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
