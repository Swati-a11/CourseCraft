export const getGamification = async (req, res) => {
  try {
    const data = {
      streak: 6,
      totalPoints: 450,
      badges: [
        'First Step',
        'Quiz Master',
        'Consistency Champion',
      ],
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch gamification data',
    });
  }
};