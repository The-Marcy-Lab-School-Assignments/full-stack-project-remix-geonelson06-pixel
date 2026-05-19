import pool from '../db/pool.js';

export const getAllEvents = async () => {
  const query = `
    SELECT *
    FROM events
    ORDER BY event_date ASC
  `;

  const result = await pool.query(query);

  return result.rows;
};

export const createNewEvent = async (
  title,
  game,
  minigameType,
  rules,
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
      event_date,
      host_user_id
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    title,
    game,
    minigameType,
    rules,
    eventDate,
    hostUserId,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const removeEvent = async (eventId) => {
  const query = `
    DELETE FROM events
    WHERE event_id = $1
    RETURNING *
  `;

  const result = await pool.query(query, [eventId]);

  return result.rows[0];
};

export const getFilteredEvents = async (
  game,
  minigameType
) => {
  let query = `
    SELECT *
    FROM events
    WHERE 1=1
  `;

  const values = [];

  if (game) {
    values.push(game);

    query += `
      AND game = $${values.length}
    `;
  }

  if (minigameType) {
    values.push(minigameType);

    query += `
      AND minigame_type = $${values.length}
    `;
  }

  query += `
    ORDER BY event_date ASC
  `;

  const result = await pool.query(query, values);

  return result.rows;
};