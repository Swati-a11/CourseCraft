import { useState } from 'react';
import { Bell, Shield, Palette, Volume2, Eye, Clock, Mail, Smartphone } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

const Settings = () => {
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

  const [saveStatus, setSaveStatus] = useState('');

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    // Save to localStorage or API
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setSaveStatus('✓ Settings saved successfully!');
    setTimeout(() => setSaveStatus(''), 2000);
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
      <div className="space-y-8 p-6 max-w-6xl">
        {/* Header */}
        <section className="rounded-4xl bg-gradient-to-br from-emerald-900/20 via-zinc-950/80 to-cyan-900/20 border border-emerald-500/40 p-8 shadow-2xl shadow-emerald-900/20 backdrop-blur-xl">
          <h1 className="text-4xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">Customize your learning experience and preferences</p>
        </section>

        {/* Notifications Settings */}
        <section className="rounded-4xl bg-zinc-950/80 border border-white/10 p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-blue-400" size={28} />
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <SettingToggle
              icon={Bell}
              label="Push Notifications"
              value={settings.notifications}
              onChange={(val) => handleToggle('notifications')}
              description="Receive notifications on your device"
            />
            <SettingToggle
              icon={Mail}
              label="Email Notifications"
              value={settings.emailNotifications}
              onChange={(val) => handleToggle('emailNotifications')}
              description="Receive updates via email"
            />
            <SettingToggle
              icon={Clock}
              label="Quiz Reminders"
              value={settings.quizReminders}
              onChange={(val) => handleToggle('quizReminders')}
              description="Get reminded about upcoming quizzes"
            />
            <SettingToggle
              icon={Smartphone}
              label="Course Updates"
              value={settings.courseUpdateNotifications}
              onChange={(val) => handleToggle('courseUpdateNotifications')}
              description="Get notified when new courses are added"
            />
          </div>
        </section>

        {/* Display & Theme */}
        <section className="rounded-4xl bg-zinc-950/80 border border-white/10 p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="text-purple-400" size={28} />
            <h2 className="text-2xl font-bold text-white">Display & Theme</h2>
          </div>
          <div className="space-y-4">
            <SettingToggle
              icon={Eye}
              label="Dark Mode"
              value={settings.darkMode}
              onChange={(val) => handleToggle('darkMode')}
              description="Use dark theme for reduced eye strain"
            />
            <SettingToggle
              icon={Volume2}
              label="Sound Effects"
              value={settings.soundEnabled}
              onChange={(val) => handleToggle('soundEnabled')}
              description="Play sounds on achievements and completions"
            />
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="rounded-4xl bg-zinc-950/80 border border-white/10 p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-red-400" size={28} />
            <h2 className="text-2xl font-bold text-white">Privacy & Security</h2>
          </div>
          <div className="space-y-4">
            <SettingToggle
              icon={Eye}
              label="Private Profile"
              value={settings.privateProfile}
              onChange={(val) => handleToggle('privateProfile')}
              description="Only you can see your progress and achievements"
            />
            <SettingToggle
              icon={Shield}
              label="Two-Factor Authentication"
              value={settings.twoFactorAuth}
              onChange={(val) => handleToggle('twoFactorAuth')}
              description="Add extra security to your account"
            />
            <SettingToggle
              icon={Eye}
              label="Display Streak Publicly"
              value={settings.displayStreak}
              onChange={(val) => handleToggle('displayStreak')}
              description="Show your learning streak on your profile"
            />
            <SettingToggle
              icon={Mail}
              label="Allow Comments"
              value={settings.allowComments}
              onChange={(val) => handleToggle('allowComments')}
              description="Allow others to comment on your posts"
            />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-4xl bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/30 p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-red-300 mb-4">Danger Zone</h2>
          <div className="space-y-3">
            <button className="w-full px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 font-semibold hover:bg-red-500/20 hover:border-red-500/50 transition-all">
              Reset Progress Data
            </button>
            <button className="w-full px-6 py-3 rounded-2xl bg-red-600/10 border border-red-600/30 text-red-300 font-semibold hover:bg-red-600/20 hover:border-red-600/50 transition-all">
              Delete Account
            </button>
          </div>
          <p className="text-xs text-red-300/70 mt-3">These actions cannot be undone. Please proceed with caution.</p>
        </section>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div className="h-1 flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-full"></div>
          <div className="flex items-center gap-4">
            {saveStatus && (
              <p className="text-emerald-400 font-semibold animate-pulse">{saveStatus}</p>
            )}
            <button
              onClick={handleSave}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all hover:scale-105"
            >
              💾 Save Changes
            </button>
          </div>
          <div className="h-1 flex-1 bg-gradient-to-l from-emerald-500/20 to-transparent rounded-full"></div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
