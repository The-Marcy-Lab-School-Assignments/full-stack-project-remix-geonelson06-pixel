import { useState } from 'react';

import { sendMessage }
  from '../adapters/message-adapters';

const MessageInput = ({
  conversationId,
}) => {
  const [content, setContent] =
    useState('');

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    await sendMessage(
      conversationId,
      content
    );

    setContent('');
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