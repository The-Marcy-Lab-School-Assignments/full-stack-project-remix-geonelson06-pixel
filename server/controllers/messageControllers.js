const {
  createConversation,
  addParticipant,
  findDirectConversation,
  isConversationParticipant,
  getUserConversations,
} = require('../models/conversationModel');

const {
  findUserById,
  findUserByFriendCode,
} = require('../models/userModel');

const {
  createMessage,
  getConversationMessages,
} = require('../models/messageModel');

const broadcastConversationsChanged =
  (req) => {
    req.app.get('io')?.emit(
      'conversations:changed'
    );
  };

// ====================================
// GET CONVERSATIONS
// ====================================

const getConversations = async (
  req,
  res
) => {
  try {
    const userId =
      req.session.currentUser.user_id;

    const conversations =
      await getUserConversations(
        userId
      );

    res.json(conversations);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        'Failed to fetch conversations',
    });
  }
};

// ====================================
// START CONVERSATION
// ====================================

const startConversation =
  async (req, res) => {
    try {
      const currentUserId =
        req.session.currentUser.user_id;

      const {
        participant_id,
        friend_code,
      } =
        req.body;

      let participant;

      if (friend_code?.trim()) {
        participant =
          await findUserByFriendCode(
            friend_code.trim()
          );
      } else if (participant_id) {
        participant =
          await findUserById(
            Number(participant_id)
          );
      }

      if (
        !participant ||
        participant.user_id === currentUserId
      ) {
        return res.status(
          participant ? 400 : 404
        ).json({
          error:
            participant
              ? 'Choose another user to message'
              : 'User not found',
        });
      }

      const participantId =
        participant.user_id;

      const existingConversation =
        await findDirectConversation(
          currentUserId,
          participantId
        );

      if (existingConversation) {
        return res.json(
          existingConversation
        );
      }

      const conversation =
        await createConversation();

      await addParticipant(
        conversation.conversation_id,
        currentUserId
      );

      await addParticipant(
        conversation.conversation_id,
        participantId
      );

      broadcastConversationsChanged(req);

      res.status(201).json(
        conversation
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          'Failed to create conversation',
      });
    }
  };

// ====================================
// GET MESSAGES
// ====================================

const getMessages = async (
  req,
  res
) => {
  try {
    const conversationId =
      req.params.conversation_id;

    const userId =
      req.session.currentUser.user_id;

    const isParticipant =
      await isConversationParticipant(
        conversationId,
        userId
      );

    if (!isParticipant) {
      return res.status(403).json({
        error:
          'You are not in this conversation',
      });
    }

    const messages =
      await getConversationMessages(
        conversationId
      );

    res.json(messages);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        'Failed to fetch messages',
    });
  }
};

// ====================================
// SEND MESSAGE
// ====================================

const sendMessage = async (
  req,
  res
) => {
  try {
    const senderId =
      req.session.currentUser.user_id;

    const conversationId =
      req.params.conversation_id;

    const { content } =
      req.body;

    const isParticipant =
      await isConversationParticipant(
        conversationId,
        senderId
      );

    if (!isParticipant) {
      return res.status(403).json({
        error:
          'You are not in this conversation',
      });
    }

    const trimmedContent =
      content?.trim();

    if (!trimmedContent) {
      return res.status(400).json({
        error:
          'Message content is required',
      });
    }

    const message =
      await createMessage(
        conversationId,
        senderId,
        trimmedContent
      );

    const io = req.app.get('io');

    io?.to(
      `conversation:${conversationId}`
    ).emit('message:new', {
      conversationId:
        Number(conversationId),
      message,
    });

    broadcastConversationsChanged(req);

    res.status(201).json(
      message
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        'Failed to send message',
    });
  }
};

module.exports = {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
};
