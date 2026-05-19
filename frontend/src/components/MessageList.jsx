const MessageList = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div
          className="message"
          key={message.message_id}
        >
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;