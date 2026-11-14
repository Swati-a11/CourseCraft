import DashboardLayout from "../layouts/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout>

      <h2 className="text-3xl font-bold text-azure-400 mb-6">
        Welcome to CourseCraft
      </h2>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-zinc-900 border border-azure-900 p-5 rounded-xl">
          <h3 className="text-gray-400">Courses Enrolled</h3>
          <p className="text-3xl text-azure-400 font-bold">5</p>
        </div>

        <div className="bg-zinc-900 border border-azure-900 p-5 rounded-xl">
          <h3 className="text-gray-400">Completed</h3>
          <p className="text-3xl text-azure-400 font-bold">2</p>
        </div>

        <div className="bg-zinc-900 border border-azure-900 p-5 rounded-xl">
          <h3 className="text-gray-400">Streak</h3>
          <p className="text-3xl text-azure-400 font-bold">7 Days</p>
        </div>

      </div>

      {/* COURSE SECTION */}
      <h3 className="text-xl font-semibold mt-10 mb-4 text-white">
        Your Courses
      </h3>

      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-zinc-900 border border-azure-900 p-5 rounded-xl">
          <h4 className="text-azure-400 font-bold">MERN Stack</h4>
          <p className="text-gray-400 text-sm">Full stack development</p>
        </div>

        <div className="bg-zinc-900 border border-azure-900 p-5 rounded-xl">
          <h4 className="text-azure-400 font-bold">AI Basics</h4>
          <p className="text-gray-400 text-sm">Learn AI fundamentals</p>
        </div>

        <div className="bg-zinc-900 border border-azure-900 p-5 rounded-xl">
          <h4 className="text-azure-400 font-bold">React Pro</h4>
          <p className="text-gray-400 text-sm">Advanced React concepts</p>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;