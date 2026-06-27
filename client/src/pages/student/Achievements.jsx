// client/src/pages/student/Achievements.jsx

import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';

import DashboardLayout from '../../layouts/DashboardLayout';

import {
  getAchievements,
  getAchievementStats,
} from '../../services/achievementService';
import { Award, Medal, CheckCircle, Star } from 'lucide-react';

const Achievements = () => {
  const reduxUser = useSelector((state) => state.auth.user);
  const user = reduxUser || (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (_) {
      return null;
    }
  })();
  const { isLight } = useTheme();

  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] =
    useState('certificate');

  const [previewCertificate, setPreviewCertificate] =
    useState(null);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const achievementsResponse =
          await getAchievements(filterType);

        const resData = achievementsResponse.data;
        const finalAchievements = Array.isArray(resData) ? resData : (resData?.data || []);

        setAchievements(finalAchievements);

        const statsResponse =
          await getAchievementStats();

        setStats(statsResponse.data);
      } catch (error) {
        console.error(
          'Error fetching achievements:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterType]);

  // ================= DOWNLOAD PDF =================
  const downloadCertificatePDF = (achievement) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Dynamically check light theme for PDF styling
    if (isLight) {
      // White Background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, width, height, 'F');

      // Emerald green border border-green-600 (#16a34a)
      doc.setDrawColor(22, 163, 74);
      doc.setLineWidth(4);
      doc.rect(30, 30, width - 60, height - 60);

      // Title
      doc.setTextColor(2, 6, 23); // text-slate-950
      doc.setFontSize(34);
      doc.setFont(undefined, 'bold');
      doc.text('CERTIFICATE', width / 2, 120, { align: 'center' });

      doc.setTextColor(22, 163, 74); // text-green-600
      doc.setFontSize(20);
      doc.text('OF APPRECIATION', width / 2, 155, { align: 'center' });

      // Transition label
      doc.setTextColor(71, 85, 105); // text-slate-600
      doc.setFont(undefined, 'normal');
      doc.setFontSize(16);
      doc.text('This certificate is proudly presented to', width / 2, 220, { align: 'center' });

      // Recipient Name
      const nameText = user?.name || user?.displayName || user?.fullName || "Authenticated User";
      doc.setTextColor(0, 0, 0); // text-black
      doc.setFontSize(30);
      doc.setFont(undefined, 'bold');
      doc.text(nameText, width / 2, 270, { align: 'center' });

      // Course text
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(18);
      doc.setFont(undefined, 'normal');
      doc.text('For successfully completing', width / 2, 330, { align: 'center' });

      // Course Title
      doc.setTextColor(2, 6, 23);
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text(achievement.course?.title || achievement.title, width / 2, 380, { align: 'center' });

      // Date
      const earnedDate = new Date(achievement.earnedAt).toLocaleDateString();
      doc.setFont(undefined, 'normal');
      doc.setFontSize(14);
      doc.text(`Earned on ${earnedDate}`, width / 2, 430, { align: 'center' });

      // Bottom elements / signature
      doc.setDrawColor(22, 163, 74);
      doc.line(120, 500, 250, 500);
      doc.setTextColor(2, 6, 23);
      doc.text('AI Learning Mentor', 185, 520, { align: 'center' });

      doc.line(width - 250, 500, width - 120, 500);
      doc.text('CourseCraft Verified', width - 185, 520, { align: 'center' });
    } else {
      // Dark Theme - Retained exactly as originally written
      doc.setFillColor(5, 45, 35);
      doc.rect(0, 0, width, height, 'F');

      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(4);
      doc.rect(30, 30, width - 60, height - 60);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(34);
      doc.setFont(undefined, 'bold');
      doc.text('CERTIFICATE', width / 2, 120, { align: 'center' });

      doc.setFontSize(20);
      doc.text('OF APPRECIATION', width / 2, 155, { align: 'center' });

      doc.setFont(undefined, 'normal');
      doc.setFontSize(16);
      doc.text('This certificate is proudly presented to', width / 2, 220, { align: 'center' });

      const nameText = user?.name || user?.displayName || user?.fullName || "Authenticated User";
      doc.setTextColor(255, 215, 0);
      doc.setFontSize(30);
      doc.setFont(undefined, 'bold');
      doc.text(nameText, width / 2, 270, { align: 'center' });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont(undefined, 'normal');
      doc.text('For successfully completing', width / 2, 330, { align: 'center' });

      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text(achievement.course?.title || achievement.title, width / 2, 380, { align: 'center' });

      const earnedDate = new Date(achievement.earnedAt).toLocaleDateString();
      doc.setFont(undefined, 'normal');
      doc.setFontSize(14);
      doc.text(`Earned on ${earnedDate}`, width / 2, 430, { align: 'center' });

      doc.line(120, 500, 250, 500);
      doc.text('AI Learning Mentor', 185, 520, { align: 'center' });

      doc.line(width - 250, 500, width - 120, 500);
      doc.text('CourseCraft Verified', width - 185, 520, { align: 'center' });
    }

    // Save PDF
    const safeTitle = (
      achievement.course?.title ||
      achievement.title ||
      'certificate'
    ).replace(/[/\\?%*:|"<>]/g, '-');

    doc.save(`${safeTitle}-certificate.pdf`);
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-green-400 text-xl font-semibold animate-pulse">
            Loading your achievements...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ================= UI =================
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
            My Achievements
          </h1>

          <p className={isLight ? 'text-slate-900/80 font-medium' : 'text-gray-400'}>
            Celebrate your learning milestones and earned certificates
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() =>
              setFilterType('certificate')
            }
            className={`px-4 py-2 flex items-center gap-2 rounded-lg font-medium transition ${
              filterType === 'certificate'
                ? 'bg-green-600 text-black font-bold shadow-md shadow-green-600/10'
                : (isLight ? 'bg-white border border-green-500/20 text-slate-950 hover:bg-green-50/50' : 'bg-zinc-900 text-gray-300 hover:text-white')
            }`}
          >
            <Award size={18} /> Completed & Certificates
          </button>

          <button
            onClick={() => setFilterType('badge')}
            className={`px-4 py-2 flex items-center gap-2 rounded-lg font-medium transition ${
              filterType === 'badge'
                ? 'bg-green-600 text-black font-bold shadow-md shadow-green-600/10'
                : (isLight ? 'bg-white border border-green-500/20 text-slate-950 hover:bg-green-50/50' : 'bg-zinc-900 text-gray-300 hover:text-white')
            }`}
          >
            <Medal size={18} /> Badges
          </button>

          <button
            onClick={() => setFilterType(null)}
            className={`px-4 py-2 flex items-center gap-2 rounded-lg font-medium transition ${
              filterType === null
                ? 'bg-green-600 text-black font-bold shadow-md shadow-green-600/10'
                : (isLight ? 'bg-white border border-green-500/20 text-slate-950 hover:bg-green-50/50' : 'bg-zinc-900 text-gray-300 hover:text-white')
            }`}
          >
            <Star size={18} /> All
          </button>
        </div>

        {/* Empty */}
        {achievements.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl border ${
            isLight ? 'bg-white border-green-500/10' : 'bg-zinc-900/30 border-white/5'
          }`}>
            <div className="flex justify-center mb-4 text-green-500/50">
              <Award size={64} className="animate-bounce" />
            </div>
            <p className={isLight ? 'text-slate-950 font-semibold text-lg' : 'text-gray-400 text-lg'}>
              No achievements yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement._id}
                className={`border rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] ${
                  isLight 
                    ? 'bg-white border-green-500/20 hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]' 
                    : 'bg-gradient-to-br from-green-900/20 to-zinc-900 border border-green-900/30 hover:border-green-600'
                }`}
              >
                {/* Icon */}
                <div className="mb-4">
                  {achievement.type === 'certificate'
                    ? <Award size={48} className="text-green-500" />
                    : <Medal size={48} className="text-blue-500" />}
                </div>

                {/* Title */}
                <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  {achievement.title}
                </h3>

                {/* Description */}
                <p className={`text-sm mb-4 ${isLight ? 'text-slate-900/70 font-medium' : 'text-gray-400'}`}>
                  {achievement.description}
                </p>

                {/* Course */}
                <div className={`mb-4 p-3 rounded-lg ${isLight ? 'bg-green-50/50 border border-green-500/10' : 'bg-zinc-800/50'}`}>
                  <p className={`text-xs mb-1 ${isLight ? 'text-slate-900/50 font-bold' : 'text-gray-400'}`}>
                    Course
                  </p>
                  <p className={`text-sm font-semibold ${isLight ? 'text-green-600' : 'text-green-400'}`}>
                    {achievement.course?.title}
                  </p>
                </div>

                {/* Footer */}
                <div className={`flex justify-between items-center text-xs ${isLight ? 'text-slate-900/60 font-semibold' : 'text-gray-400'}`}>
                  <span>
                    Earned on{' '}
                    {new Date(achievement.earnedAt).toLocaleDateString()}
                  </span>

                  {achievement.type === 'certificate' && (
                    <div className="flex gap-3 font-bold">
                      <button
                        onClick={() => setPreviewCertificate(achievement)}
                        className="text-blue-600 hover:text-blue-700 transition"
                      >
                         Preview
                      </button>

                      <button
                        onClick={() => downloadCertificatePDF(achievement)}
                        className="text-green-600 hover:text-green-700 transition"
                      >
                         Download
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        {previewCertificate && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className={`rounded-2xl w-full max-w-5xl h-[90vh] overflow-hidden border relative transition-colors duration-300 ${
              isLight ? 'bg-white border-green-500/20' : 'bg-zinc-900 border-green-500'
            }`}>

              {/* Header */}
              <div className={`flex items-center justify-between p-4 border-b ${isLight ? 'border-green-500/10 bg-slate-50' : 'border-zinc-700 bg-zinc-900/50'}`}>
                <h2 className={`text-xl font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Certificate Preview
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => downloadCertificatePDF(previewCertificate)}
                    className="px-4 py-2 bg-green-600 text-black rounded-lg font-bold hover:bg-green-500 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setPreviewCertificate(null)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Certificate Canvas Block */}
              <div className={`p-8 overflow-auto h-[calc(90vh-73px)] ${isLight ? 'bg-slate-100' : 'bg-zinc-950'}`}>
                <div className={`rounded-xl p-12 text-center min-h-[580px] relative transition-all border-[10px] duration-300 ${
                  isLight 
                    ? 'bg-white border-green-600 shadow-xl' 
                    : 'bg-[#052d23] border-yellow-500'
                }`}>
                  {/* Header text layout */}
                  <h1 className={`text-5xl font-bold tracking-widest mb-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    CERTIFICATE
                  </h1>
                  <h2 className={`text-xl font-semibold mb-10 ${isLight ? 'text-green-600' : 'text-yellow-400'}`}>
                    OF APPRECIATION
                  </h2>

                  {/* Recipient transition label */}
                  <p className={`text-lg mb-6 ${isLight ? 'text-slate-900/80 font-medium' : 'text-gray-300'}`}>
                    This certificate is proudly presented to
                  </p>

                  {/* Dynamic Name */}
                  <h3 className={isLight ? "text-black font-bold text-2xl mb-10" : "text-5xl font-extrabold text-yellow-400 mb-10"}>
                    {user?.name || user?.displayName || user?.fullName || "Authenticated User"}
                  </h3>

                  <p className={`text-lg mb-4 ${isLight ? 'text-slate-900/80 font-medium' : 'text-gray-300'}`}>
                    For successfully completing
                  </p>

                  {/* Achievement track title */}
                  <h2 className={`text-3xl font-bold mb-8 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    {previewCertificate.course?.title || previewCertificate.title}
                  </h2>

                  <p className={`mb-16 font-semibold ${isLight ? 'text-slate-900/60' : 'text-gray-400'}`}>
                    Earned on{' '}
                    {new Date(previewCertificate.earnedAt).toLocaleDateString()}
                  </p>

                  <div className="flex justify-between items-end mt-16 px-12">
                    <div className="text-left">
                      <div className={`w-36 h-0.5 mb-2 ${isLight ? 'bg-green-600' : 'bg-white'}`} />
                      <p className={`text-sm font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                        AI Learning Mentor
                      </p>
                    </div>

                    <div className={isLight ? 'text-green-600' : 'text-yellow-500'}>
                      <Award size={64} />
                    </div>

                    <div className="text-right">
                      <div className={`w-36 h-0.5 mb-2 ${isLight ? 'bg-green-600' : 'bg-white'}`} />
                      <p className={`text-sm font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                        CourseCraft Verified
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Achievements;