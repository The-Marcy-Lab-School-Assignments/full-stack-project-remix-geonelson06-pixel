import { useEffect, useState } from 'react';

import {
  fetchConversations,
  fetchMessages,
} from '../adapters/message-adapters';

import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatPage = () => {
  const [conversations, setConversations] =
    useState([]);

  const [selectedConversation,
    setSelectedConversation] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  useEffect(() => {
    const loadConversations =
      async () => {
        const { data } =
          await fetchConversations();

        setConversations(data);
      };

    loadConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversation) {
      return;
    }

    const loadMessages =
      async () => {
        const { data } =
          await fetchMessages(
            selectedConversation
          );

        setMessages(data);
      };

    loadMessages();
  }, [selectedConversation]);

  return (
    <div className="chat-page">
      <ConversationList
        conversations={conversations}
        setSelectedConversation={
          setSelectedConversation
        }
      />

      <div className="chat-window">
        <MessageList messages={messages} />

        {selectedConversation && (
          <MessageInput
            conversationId={
              selectedConversation
            }
          />
        )}
      </div>
    </div>
  );
};

export default ChatPage;