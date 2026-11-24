import { useState } from 'react';

const StudyPlanForm = ({ onGenerate, loading }) => {
  const [formData, setFormData] = useState({
    goal: '',
    level: '',
    hoursPerDay: '',
    duration: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Goal */}
      <label htmlFor="study-goal" className="block text-sm font-semibold">Learning goal</label>
      <input
        id="study-goal"
        type="text"
        name="goal"
        maxLength={300}
        placeholder="Your Goal (e.g. Learn MERN Stack)"
        value={formData.goal}
        onChange={handleChange}
        className="w-full bg-black border border-azure-900 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azure-500"
        required
      />

      {/* Level Dropdown with Placeholder */}
      <label htmlFor="study-level" className="block text-sm font-semibold">Current level</label>
      <select
        id="study-level"
        name="level"
        value={formData.level}
        onChange={handleChange}
        className="w-full bg-black border border-azure-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-azure-500"
        required
      >
        <option value="" disabled className="text-gray-400">
          Select Your Current Level (e.g. Beginner)
        </option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      {/* Hours Per Day */}
      <label htmlFor="study-hours" className="block text-sm font-semibold">Hours per day</label>
      <input
        id="study-hours"
        type="number"
        name="hoursPerDay"
        max="24"
        placeholder="Hours Per Day (e.g. 2)"
        value={formData.hoursPerDay}
        onChange={handleChange}
        min="1"
        className="w-full bg-black border border-azure-900 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azure-500"
        required
      />

      {/* Duration */}
      <label htmlFor="study-duration" className="block text-sm font-semibold">Duration in days</label>
      <input
        id="study-duration"
        type="number"
        name="duration"
        max="90"
        placeholder="Total Duration in Days (e.g. 30)"
        value={formData.duration}
        onChange={handleChange}
        min="1"
        className="w-full bg-black border border-azure-900 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azure-500"
        required
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-azure-600 hover:bg-azure-700 disabled:opacity-60 text-[var(--cc-action-ink)] font-bold py-3 rounded-xl transition"
      >
        {loading ? 'Generating...' : 'Generate Study Plan'}
      </button>
    </form>
  );
};

export default StudyPlanForm;
