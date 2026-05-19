const pool =
  require('../db/pool');

// ====================================
// CREATE MESSAGE
// ====================================

const createMessage =
  async (
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

    const result =
      await pool.query(
        query,
        [
          conversationId,
          senderId,
          content,
        ]
      );

    return result.rows[0];
  };

// ====================================
// GET CONVERSATION MESSAGES
// ====================================

const getConversationMessages =
  async (
    conversationId
  ) => {
    const query = `
      SELECT
        messages.*,
        users.username

      FROM messages

      JOIN users
        ON messages.sender_id =
           users.user_id

      WHERE conversation_id = $1
      ORDER BY messages.created_at ASC
    `;

    const result =
      await pool.query(
        query,
        [conversationId]
      );

    return result.rows;
  };

module.exports = {
  createMessage,
  getConversationMessages,
};
