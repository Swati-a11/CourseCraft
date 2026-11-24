export const getDailyReminder = async (req, res) => {
  try {
    res.json({
      reminder:
        'You have not completed your study session today. Keep your streak alive!',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch reminder',
    });
  }
};
