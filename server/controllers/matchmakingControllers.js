const {
  getFilteredEvents,
} = require('../models/eventModel');

// ====================================
// RECOMMENDED EVENTS
// ====================================

const getRecommendedEvents =
  async (req, res) => {
    try {
      const {
        favorite_game,
        preferred_rules,
      } = req.session.currentUser;

      const events =
        await getFilteredEvents(
          favorite_game,
          preferred_rules
        );

      res.json(events);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          'Failed to fetch recommendations',
      });
    }
  };

module.exports = {
  getRecommendedEvents,
};