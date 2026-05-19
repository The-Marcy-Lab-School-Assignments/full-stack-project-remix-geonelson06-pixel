const pool =
  require('../db/pool');

const eventSelect = `
  SELECT
    events.*,
    users.username,
    users.friend_code,
    COALESCE(player_counts.player_count, 0)::INTEGER
      AS player_count

  FROM events

  JOIN users
    ON events.host_user_id = users.user_id

  LEFT JOIN (
    SELECT event_id, COUNT(*) AS player_count
    FROM event_players
    GROUP BY event_id
  ) player_counts
    ON events.event_id = player_counts.event_id
`;

// ====================================
// GET ALL EVENTS
// ====================================

const getAllEvents =
  async () => {
    const query = `
      ${eventSelect}
      ORDER BY event_date ASC
    `;

    const result =
      await pool.query(query);

    return result.rows;
  };

// ====================================
// CREATE EVENT
// ====================================

const createNewEvent =
  async (
    title,
    game,
    minigameType,
    rules,
    turnCount,
    eventDate,
    hostUserId
  ) => {
    const query = `
      INSERT INTO events
      (
        title,
        game,
        minigame_type,
        rules,
        turn_count,
        event_date,
        host_user_id
      )

      VALUES ($1, $2, $3, $4, $5, $6, $7)

      RETURNING *
    `;

    const values = [
      title,
      game,
      minigameType,
      rules,
      turnCount,
      eventDate,
      hostUserId,
    ];

    const result =
      await pool.query(
        query,
        values
      );

    return result.rows[0];
  };

// ====================================
// DELETE EVENT
// ====================================

const removeEvent = async (
  eventId,
  hostUserId
) => {
  const query = `
    DELETE FROM events
    WHERE event_id = $1
    AND host_user_id = $2
    RETURNING *
  `;

  const result =
    await pool.query(
      query,
      [eventId, hostUserId]
    );

  return result.rows[0];
};

// ====================================
// FILTER EVENTS
// ====================================

const getFilteredEvents =
  async (
    game,
    minigameType
  ) => {
    let query = `
      ${eventSelect}
      WHERE 1=1
    `;

    const values = [];

    if (game) {
      values.push(game);

      query += `
        AND events.game = $${values.length}
      `;
    }

    if (minigameType) {
      values.push(
        minigameType
      );

      query += `
        AND events.minigame_type = $${values.length}
      `;
    }

    query += `
      ORDER BY event_date ASC
    `;

    const result =
      await pool.query(
        query,
        values
      );

    return result.rows;
  };

module.exports = {
  getAllEvents,
  createNewEvent,
  removeEvent,
  getFilteredEvents,
};
