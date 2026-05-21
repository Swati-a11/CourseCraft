export const getWeakTopics = async (req, res) => {
  try {
    // Later this will come from MongoDB
    const quizResults = [
      { topic: 'React Hooks', score: 55 },
      { topic: 'Node Authentication', score: 62 },
      { topic: 'MongoDB Aggregation', score: 88 },
    ];

    const weakTopics = quizResults.filter(
      (item) => item.score < 70
    );

    res.json({ weakTopics });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch weak topics',
    });
  }
};