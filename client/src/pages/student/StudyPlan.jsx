import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StudyPlanForm from "../../components/studyplan/StudyPlanForm";
import StudyPlanResult from "../../components/studyplan/StudyPlanResult";
import { generateStudyPlan } from "../../services/studyPlanServices";
import toast from "react-hot-toast";

const StudyPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (formData) => {
    try {
      setLoading(true);
      setError("");
      setPlan(null);

      const response = await generateStudyPlan(formData);

      // Backend returns:
      // {
      //   success: true,
      //   studyPlan: "long text..."
      // }

      if (response?.success && response?.studyPlan) {
        setPlan(response.studyPlan);
        toast.success("AI Study Plan generated successfully!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Error generating study plan:", err);
      setError("Failed to generate study plan. Please try again.");
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white mb-2">
          AI Study Plan Generator
        </h1>

        <p className="text-gray-400 mb-6">
          Generate a personalized AI-powered learning roadmap.
        </p>

        {/* Main Card */}
        <div className="bg-zinc-900 border border-azure-900/30 rounded-2xl p-6 shadow-lg">
          {/* Form */}
          <StudyPlanForm
            onGenerate={handleGenerate}
            loading={loading}
          />

          {/* Loading */}
          {loading && (
            <div className="mt-6 flex items-center gap-3 bg-zinc-800 border border-azure-500/20 rounded-xl p-4">
              <div className="w-5 h-5 border-2 border-azure-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-azure-400">
                Generating your AI study plan...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {/* Result */}
          {!loading && plan && (
            <div className="mt-6">
              <StudyPlanResult plan={plan} />
            </div>
          )}

          {/* Empty State */}
          {!loading && !plan && !error && (
            <div className="mt-6 text-gray-500 text-center">
              Your AI-generated study plan will appear here after submission.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudyPlan;