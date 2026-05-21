import DashboardLayout from '../../layouts/DashboardLayout';

const WeakTopics = () => {
  const weakTopics = [
    {
      topic: 'React Hooks',
      score: 55,
      recommendation: 'Revise useState, useEffect, and custom hooks.',
    },
    {
      topic: 'Node Authentication',
      score: 62,
      recommendation: 'Practice JWT authentication and middleware.',
    },
    {
      topic: 'MongoDB Aggregation',
      score: 68,
      recommendation: 'Review aggregation pipeline and $group stages.',
    },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-white mb-6">
        Weak Topic Prediction
      </h1>

      <p className="text-gray-400 mb-8">
        Topics where your quiz performance is below 70%.
      </p>

      <div className="space-y-4">
        {weakTopics.map((item, index) => (
          <div
            key={index}
            className="bg-zinc-900 border border-red-900/30 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-white">
                {item.topic}
              </h2>
              <span className="text-red-400 font-bold">
                {item.score}%
              </span>
            </div>

            <p className="text-gray-400">{item.recommendation}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default WeakTopics;