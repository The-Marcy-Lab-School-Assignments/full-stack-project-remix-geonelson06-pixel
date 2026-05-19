import { useState } from 'react';

import { sendMessage }
  from '../adapters/message-adapters';

const MessageInput = ({
  conversationId,
  onMessageSent,
}) => {
  const [content, setContent] =
    useState('');

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    const { error } = await sendMessage(
      conversationId,
      content
    );

    if (error) {
      return alert(error);
    }

    setContent('');
    onMessageSent();
  };

  return (
    <form
      className="message-input"
      onSubmit={handleSubmit}
    >
      <input
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
        placeholder="Send a message..."
      />

      <button>Send</button>
    </form>
  );
};

export default MessageInput;
