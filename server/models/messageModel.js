import pool from '../db/pool.js';

export const createMessage = async (
  conversationId,
  senderId,
  content
) => {
  const query = `
    INSERT INTO messages
    (
      conversation_id,
      sender_id,
      content
    )
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const result = await pool.query(query, [
    conversationId,
    senderId,
    content,
  ]);

  return result.rows[0];
};

export const getConversationMessages = async (
  conversationId
) => {
  const query = `
    SELECT *
    FROM messages
    WHERE conversation_id = $1
    ORDER BY created_at ASC
  `;

  const result = await pool.query(query, [
    conversationId,
  ]);

  return result.rows;
};