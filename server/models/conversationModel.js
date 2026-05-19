import pool from '../db/pool.js';

export const createConversation = async () => {
  const query = `
    INSERT INTO conversations
    DEFAULT VALUES
    RETURNING *
  `;

  const result = await pool.query(query);

  return result.rows[0];
};

export const addParticipant = async (
  conversationId,
  userId
) => {
  const query = `
    INSERT INTO conversation_participants
    (
      conversation_id,
      user_id
    )
    VALUES ($1, $2)
  `;

  await pool.query(query, [
    conversationId,
    userId,
  ]);
};

export const getUserConversations = async (
  userId
) => {
  const query = `
    SELECT *
    FROM conversations c
    JOIN conversation_participants cp
      ON c.conversation_id = cp.conversation_id
    WHERE cp.user_id = $1
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};