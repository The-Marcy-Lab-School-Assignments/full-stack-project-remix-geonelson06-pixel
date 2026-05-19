import {
  createConversation,
  addParticipant,
  getUserConversations,
} from '../models/conversationModel.js';

import {
  createMessage,
  getConversationMessages,
} from '../models/messageModel.js';

export const getConversations = async (
  req,
  res
) => {
  const userId = req.session.currentUser.user_id;

  const conversations =
    await getUserConversations(userId);

  res.json(conversations);
};

export const startConversation = async (
  req,
  res
) => {
  const currentUserId =
    req.session.currentUser.user_id;

  const { participant_id } = req.body;

  const conversation =
    await createConversation();

  await addParticipant(
    conversation.conversation_id,
    currentUserId
  );

  await addParticipant(
    conversation.conversation_id,
    participant_id
  );

  res.status(201).json(conversation);
};

export const getMessages = async (
  req,
  res
) => {
  const messages =
    await getConversationMessages(
      req.params.conversation_id
    );

  res.json(messages);
};

export const sendMessage = async (
  req,
  res
) => {
  const senderId =
    req.session.currentUser.user_id;

  const { content } = req.body;

  const message = await createMessage(
    req.params.conversation_id,
    senderId,
    content
  );

  res.status(201).json(message);
};