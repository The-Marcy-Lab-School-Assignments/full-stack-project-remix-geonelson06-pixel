import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  fetchConversations,
  fetchMessages,
  startConversation,
} from '../adapters/message-adapters';

import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import socket from '../socket';

const ChatPage = ({ currentUser }) => {
  const [conversations, setConversations] =
    useState([]);

  const [selectedConversation,
    setSelectedConversation] =
    useState(null);

  const [messages, setMessages] =
    useState([]);
  const [friendCode, setFriendCode] =
    useState('');

  const loadConversations =
    useCallback(async () => {
      const { data, error } =
        await fetchConversations();

      if (error) {
        return alert(error);
      }

      setConversations(data);
    }, []);

  const loadMessages =
    useCallback(async (conversationId) => {
      const { data, error } =
        await fetchMessages(
          conversationId
        );

      if (error) {
        return alert(error);
      }

      setMessages(data);
    }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedConversation) {
      return;
    }

    loadMessages(selectedConversation);
  }, [loadMessages, selectedConversation]);

  useEffect(() => {
    socket.on(
      'conversations:changed',
      loadConversations
    );

    return () => {
      socket.off(
        'conversations:changed',
        loadConversations
      );
    };
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedConversation) {
      return undefined;
    }

    socket.emit(
      'conversation:join',
      selectedConversation
    );

    const handleNewMessage = ({
      conversationId,
    }) => {
      if (
        Number(conversationId) !==
        Number(selectedConversation)
      ) {
        return;
      }

      loadMessages(selectedConversation);
      loadConversations();
    };

    socket.on(
      'message:new',
      handleNewMessage
    );

    return () => {
      socket.off(
        'message:new',
        handleNewMessage
      );
    };
  }, [
    loadConversations,
    loadMessages,
    selectedConversation,
  ]);

  const handleStartConversation =
    async (event) => {
      event.preventDefault();

      const { data, error } =
        await startConversation(
          friendCode
        );

      if (error) {
        return alert(error);
      }

      setFriendCode('');
      await loadConversations();
      setSelectedConversation(
        data.conversation_id
      );
    };

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        <form
          className="conversation-form"
          onSubmit={handleStartConversation}
        >
          <h2>Start a chat</h2>

          <input
            value={friendCode}
            onChange={(event) =>
              setFriendCode(
                event.target.value
              )
            }
            placeholder="Switch Code"
            required
          />

          <button>Open Conversation</button>
        </form>

        <ConversationList
          conversations={conversations}
          selectedConversation={
            selectedConversation
          }
          setSelectedConversation={
            setSelectedConversation
          }
        />
      </aside>

      <div className="chat-window">
        {selectedConversation ? (
          <>
            <MessageList
              messages={messages}
              currentUser={currentUser}
            />

            <MessageInput
              conversationId={
                selectedConversation
              }
              onMessageSent={() =>
                loadMessages(
                  selectedConversation
                )
              }
            />
          </>
        ) : (
          <div className="empty-state">
            <h2>Select a conversation</h2>
            <p>
              Start with another user's Switch code, then your messages will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
