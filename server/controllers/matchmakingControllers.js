import {
  getFilteredEvents,
} from '../models/eventModel.js';

export const getRecommendedEvents =
  async (req, res) => {
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
  };