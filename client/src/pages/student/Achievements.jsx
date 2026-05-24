// client/src/pages/student/Achievements.jsx

import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';

import DashboardLayout from '../../layouts/DashboardLayout';

import {
  getAchievements,
  getAchievementStats,
} from '../../services/achievementService';
import { Award, Medal, CheckCircle, Star } from 'lucide-react';

const Achievements = () => {
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

    // Background
    doc.setFillColor(5, 45, 35);

    doc.rect(0, 0, width, height, 'F');

    // Border
    doc.setDrawColor(212, 175, 55);

    doc.setLineWidth(4);

    doc.rect(30, 30, width - 60, height - 60);

    // Title
    doc.setTextColor(255, 255, 255);

    doc.setFontSize(34);

    doc.setFont(undefined, 'bold');

    doc.text('CERTIFICATE', width / 2, 120, {
      align: 'center',
    });

    doc.setFontSize(20);

    doc.text('OF APPRECIATION', width / 2, 155, {
      align: 'center',
    });

    // Learner Name
    let learnerName = 'Learner';

    try {
      const userData = localStorage.getItem('user');

      if (userData) {
        const parsedUser = JSON.parse(userData);

        learnerName =
          parsedUser?.name ||
          parsedUser?.username ||
          'Learner';
      }
    } catch (error) {
      learnerName = 'Learner';
    }

    doc.setFont(undefined, 'normal');

    doc.setFontSize(16);

    doc.text(
      'This certificate is proudly presented to',
      width / 2,
      220,
      {
        align: 'center',
      }
    );

    doc.setTextColor(255, 215, 0);

    doc.setFontSize(30);

    doc.setFont(undefined, 'bold');

    doc.text(learnerName, width / 2, 270, {
      align: 'center',
    });

    // Course Title
    doc.setTextColor(255, 255, 255);

    doc.setFontSize(18);

    doc.setFont(undefined, 'normal');

    doc.text(
      'For successfully completing',
      width / 2,
      330,
      {
        align: 'center',
      }
    );

    doc.setFontSize(24);

    doc.setFont(undefined, 'bold');

    doc.text(
      achievement.course?.title ||
        achievement.title,
      width / 2,
      380,
      {
        align: 'center',
      }
    );

    // Date
    const earnedDate = new Date(
      achievement.earnedAt
    ).toLocaleDateString();

    doc.setFont(undefined, 'normal');

    doc.setFontSize(14);

    doc.text(
      `Awarded on ${earnedDate}`,
      width / 2,
      430,
      {
        align: 'center',
      }
    );

    // Signature
    doc.line(120, 500, 250, 500);

    doc.text('AI Learning Mentor', 185, 520, {
      align: 'center',
    });

    doc.line(
      width - 250,
      500,
      width - 120,
      500
    );

    doc.text('CourseCraft Verified', width - 185, 520, {
      align: 'center',
    });

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
          <div className="text-green-400 text-xl font-semibold">
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
          <h1 className="text-4xl font-bold text-white mb-2">
            My Achievements
          </h1>

          <p className="text-gray-400">
            Celebrate your learning milestones
            and earned certificates
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
                ? 'bg-green-600 text-black'
                : 'bg-zinc-900 text-gray-300 hover:text-white'
            }`}
          >
            <Award size={18} /> Completed & Certificates
          </button>

          <button
            onClick={() => setFilterType('badge')}
            className={`px-4 py-2 flex items-center gap-2 rounded-lg font-medium transition ${
              filterType === 'badge'
                ? 'bg-green-600 text-black'
                : 'bg-zinc-900 text-gray-300 hover:text-white'
            }`}
          >
            <Medal size={18} /> Badges
          </button>

          <button
            onClick={() => setFilterType(null)}
            className={`px-4 py-2 flex items-center gap-2 rounded-lg font-medium transition ${
              filterType === null
                ? 'bg-green-600 text-black'
                : 'bg-zinc-900 text-gray-300 hover:text-white'
            }`}
          >
            <Star size={18} /> All
          </button>
        </div>

        {/* Empty */}
        {achievements.length === 0 ? (
          <div className="text-center py-12">

            <div className="flex justify-center mb-4 text-green-500/50">
              <Award size={64} />
            </div>

            <p className="text-gray-400 text-lg">
              No achievements yet
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {achievements.map((achievement) => (
              <div
                key={achievement._id}
                className="bg-gradient-to-br from-green-900/20 to-zinc-900 border border-green-900/30 rounded-xl p-6 hover:border-green-600 transition"
              >

                {/* Icon */}
                <div className="mb-4">
                  {achievement.type ===
                  'certificate'
                    ? <Award size={48} className="text-green-400" />
                    : <Medal size={48} className="text-blue-400" />}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {achievement.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4">
                  {achievement.description}
                </p>

                {/* Course */}
                <div className="mb-4 p-3 bg-zinc-800/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">
                    Course
                  </p>

                  <p className="text-sm font-semibold text-green-400">
                    {achievement.course?.title}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center text-xs text-gray-400">

                  <span>
                    Earned on{' '}
                    {new Date(
                      achievement.earnedAt
                    ).toLocaleDateString()}
                  </span>

                  {achievement.type ===
                    'certificate' && (
                    <div className="flex gap-3">

                      {/* Preview */}
                      <button
                        onClick={() =>
                          setPreviewCertificate(
                            achievement
                          )
                        }
                        className="text-blue-400 hover:text-blue-300 transition"
                      >
                         Preview
                      </button>

                      {/* Download */}
                      <button
                        onClick={() =>
                          downloadCertificatePDF(
                            achievement
                          )
                        }
                        className="text-green-400 hover:text-green-300 transition"
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
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">

            <div className="bg-zinc-900 rounded-2xl w-full max-w-5xl h-[90vh] overflow-hidden border border-green-500 relative">

              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-700">

                <h2 className="text-xl font-bold text-white">
                  Certificate Preview
                </h2>

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      downloadCertificatePDF(
                        previewCertificate
                      )
                    }
                    className="px-4 py-2 bg-green-600 text-black rounded-lg font-semibold hover:bg-green-500"
                  >
                    Download
                  </button>

                  <button
                    onClick={() =>
                      setPreviewCertificate(
                        null
                      )
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                  >
                    Close
                  </button>

                </div>

              </div>

              {/* Certificate */}
              <div className="p-8 overflow-auto h-full bg-zinc-950">

                <div className="bg-[#052d23] border-[10px] border-yellow-500 rounded-xl p-12 text-center min-h-[700px] relative">

                  <h1 className="text-5xl font-bold text-white tracking-widest mb-2">
                    CERTIFICATE
                  </h1>

                  <h2 className="text-xl text-yellow-400 mb-10">
                    OF APPRECIATION
                  </h2>

                  <p className="text-gray-300 text-lg mb-6">
                    This certificate is proudly
                    presented to
                  </p>

                  <h3 className="text-5xl font-bold text-yellow-400 mb-10">
                    {JSON.parse(
                      localStorage.getItem(
                        'user'
                      )
                    )?.name || 'Learner'}
                  </h3>

                  <p className="text-gray-300 text-lg mb-4">
                    For successfully completing
                  </p>

                  <h2 className="text-3xl text-white font-bold mb-8">
                    {previewCertificate.course
                      ?.title ||
                      previewCertificate.title}
                  </h2>

                  <p className="text-gray-400 mb-16">
                    Earned on{' '}
                    {new Date(
                      previewCertificate.earnedAt
                    ).toLocaleDateString()}
                  </p>

                  <div className="flex justify-between items-end mt-24 px-12">

                    <div>
                    

                      <p className="text-white">
                       AI Learning Mentor
                      </p>
                    </div>

                    <div className="text-yellow-500">
                      <Award size={64} />
                    </div>

                    <div>
                      

                      <p className="text-white">
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