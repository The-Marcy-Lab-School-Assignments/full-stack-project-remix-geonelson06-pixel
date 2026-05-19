const pool =
  require('../db/pool');

// ====================================
// CREATE CONVERSATION
// ====================================

const createConversation =
  async () => {
    const query = `
      INSERT INTO conversations
      DEFAULT VALUES
      RETURNING *
    `;

    const result =
      await pool.query(query);

    return result.rows[0];
  };

// ====================================
// ADD PARTICIPANT
// ====================================

const addParticipant =
  async (
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

      ON CONFLICT DO NOTHING
    `;

    await pool.query(query, [
      conversationId,
      userId,
    ]);
  };

// ====================================
// FIND DIRECT CONVERSATION
// ====================================

const findDirectConversation =
  async (
    currentUserId,
    participantId
  ) => {
    const query = `
      SELECT c.*
      FROM conversations c

      JOIN conversation_participants cp1
        ON c.conversation_id =
           cp1.conversation_id

      JOIN conversation_participants cp2
        ON c.conversation_id =
           cp2.conversation_id

      WHERE cp1.user_id = $1
      AND cp2.user_id = $2

      LIMIT 1
    `;

    const result =
      await pool.query(query, [
        currentUserId,
        participantId,
      ]);

    return result.rows[0];
  };

// ====================================
// PARTICIPANT CHECK
// ====================================

const isConversationParticipant =
  async (
    conversationId,
    userId
  ) => {
    const query = `
      SELECT 1
      FROM conversation_participants
      WHERE conversation_id = $1
      AND user_id = $2
    `;

    const result =
      await pool.query(query, [
        conversationId,
        userId,
      ]);

    return result.rowCount > 0;
  };

// ====================================
// GET USER CONVERSATIONS
// ====================================

const getUserConversations =
  async (userId) => {
    const query = `
      SELECT
        c.conversation_id,
        c.created_at,
        other_user.user_id AS other_user_id,
        other_user.username AS other_username,
        other_user.friend_code AS other_friend_code,
        latest.content AS last_message,
        latest.created_at AS last_message_at

      FROM conversations c

      JOIN conversation_participants cp
        ON c.conversation_id =
           cp.conversation_id

      LEFT JOIN conversation_participants other_cp
        ON c.conversation_id =
           other_cp.conversation_id
        AND other_cp.user_id != $1

      LEFT JOIN users other_user
        ON other_cp.user_id =
           other_user.user_id

      LEFT JOIN LATERAL (
        SELECT content, created_at
        FROM messages
        WHERE messages.conversation_id =
          c.conversation_id
        ORDER BY created_at DESC
        LIMIT 1
      ) latest ON TRUE

      WHERE cp.user_id = $1

      ORDER BY
        COALESCE(latest.created_at, c.created_at)
        DESC
    `;

    const result =
      await pool.query(
        query,
        [userId]
      );

    return result.rows;
  };

module.exports = {
  createConversation,
  addParticipant,
  findDirectConversation,
  isConversationParticipant,
  getUserConversations,
};
