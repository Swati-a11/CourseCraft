import DashboardLayout from '../../layouts/DashboardLayout';

const Reminders = () => {
  const reminders = [
    {
      title: 'Complete Today’s Study Session',
      message:
        'You have not completed your study session today. Keep your streak alive! ',
    },
    {
      title: 'Review Weak Topics',
      message:
        'Spend 30 minutes revising React Hooks and JWT Authentication.',
    },
    {
      title: 'Take a Quiz',
      message:
        'Attempt a quick quiz to reinforce what you learned today.',
    },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-white mb-6">
        Daily Reminders
      </h1>

      <div className="space-y-4">
        {reminders.map((reminder, index) => (
          <div
            key={index}
            className="bg-zinc-900 border border-azure-900/30 rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-azure-400 mb-2">
              {reminder.title}
            </h2>
            <p className="text-gray-300">{reminder.message}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Reminders;