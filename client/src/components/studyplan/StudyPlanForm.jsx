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
      <input
        type="text"
        name="goal"
        placeholder="Your Goal (e.g. Learn MERN Stack)"
        value={formData.goal}
        onChange={handleChange}
        className="w-full bg-black border border-green-900 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />

      {/* Level Dropdown with Placeholder */}
      <select
        name="level"
        value={formData.level}
        onChange={handleChange}
        className="w-full bg-black border border-green-900 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
      <input
        type="number"
        name="hoursPerDay"
        placeholder="Hours Per Day (e.g. 2)"
        value={formData.hoursPerDay}
        onChange={handleChange}
        min="1"
        className="w-full bg-black border border-green-900 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />

      {/* Duration */}
      <input
        type="number"
        name="duration"
        placeholder="Total Duration in Days (e.g. 30)"
        value={formData.duration}
        onChange={handleChange}
        min="1"
        className="w-full bg-black border border-green-900 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-black font-bold py-3 rounded-xl transition"
      >
        {loading ? 'Generating...' : 'Generate Study Plan'}
      </button>
    </form>
  );
};

export default StudyPlanForm;