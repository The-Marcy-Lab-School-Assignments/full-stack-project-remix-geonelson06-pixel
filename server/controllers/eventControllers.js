const {
  getAllEvents,
  createNewEvent,
  removeEvent,
  getFilteredEvents,
} = require('../models/eventModel');

const {
  getPlayerCount,
  addPlayerToEvent,
  removePlayerFromEvent,
} = require('../models/eventPlayerModel');

// ====================================
// GET EVENTS
// ====================================

const getEvents = async (req, res) => {
  try {
    const { game, minigame_type } =
      req.query;

    let events;

    if (game || minigame_type) {
      events =
        await getFilteredEvents(
          game,
          minigame_type
        );
    } else {
      events = await getAllEvents();
    }

    res.json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch events',
    });
  }
};

// ====================================
// CREATE EVENT
// ====================================

const createEvent = async (
  req,
  res
) => {
  try {
    const {
      title,
      game,
      minigame_type,
      rules,
      event_date,
    } = req.body;

    const hostUserId =
      req.session.currentUser.user_id;

    const event =
      await createNewEvent(
        title,
        game,
        minigame_type,
        rules,
        event_date,
        hostUserId
      );

    // host automatically joins event

    await addPlayerToEvent(
      event.event_id,
      hostUserId
    );

    res.status(201).json(event);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to create event',
    });
  }
};

// ====================================
// JOIN EVENT
// ====================================

const joinEvent = async (
  req,
  res
) => {
  try {
    const eventId =
      req.params.event_id;

    const userId =
      req.session.currentUser.user_id;

    const playerCount =
      await getPlayerCount(eventId);

    if (playerCount >= 4) {
      return res.status(400).json({
        error: 'Event is full',
      });
    }

    await addPlayerToEvent(
      eventId,
      userId
    );

    res.json({
      message: 'Joined event',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to join event',
    });
  }
};

// ====================================
// LEAVE EVENT
// ====================================

const leaveEvent = async (
  req,
  res
) => {
  try {
    const eventId =
      req.params.event_id;

    const userId =
      req.session.currentUser.user_id;

    await removePlayerFromEvent(
      eventId,
      userId
    );

    res.json({
      message: 'Left event',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to leave event',
    });
  }
};

// ====================================
// DELETE EVENT
// ====================================

const deleteEvent = async (
  req,
  res
) => {
  try {
    const eventId =
      req.params.event_id;

    const deletedEvent =
      await removeEvent(eventId);

    res.json(deletedEvent);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to delete event',
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  joinEvent,
  leaveEvent,
  deleteEvent,
};