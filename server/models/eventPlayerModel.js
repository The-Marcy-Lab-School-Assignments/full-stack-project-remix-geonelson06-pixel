const pool =
  require('../db/pool');

// ====================================
// PLAYER COUNT
// ====================================

const getPlayerCount =
  async (eventId) => {
    const query = `
      SELECT COUNT(*)
      FROM event_players
      WHERE event_id = $1
    `;

    const result =
      await pool.query(
        query,
        [eventId]
      );

    return Number(
      result.rows[0].count
    );
  };

// ====================================
// ADD PLAYER
// ====================================

const addPlayerToEvent =
  async (
    eventId,
    userId
  ) => {
    const query = `
      INSERT INTO event_players
      (
        event_id,
        user_id
      )

      VALUES ($1, $2)

      ON CONFLICT DO NOTHING

      RETURNING *
    `;

    const result =
      await pool.query(
        query,
        [eventId, userId]
      );

    return result.rows[0];
  };

// ====================================
// REMOVE PLAYER
// ====================================

const removePlayerFromEvent =
  async (
    eventId,
    userId
  ) => {
    const query = `
      DELETE FROM event_players
      WHERE event_id = $1
      AND user_id = $2
    `;

    await pool.query(query, [
      eventId,
      userId,
    ]);
  };

module.exports = {
  getPlayerCount,
  addPlayerToEvent,
  removePlayerFromEvent,
};