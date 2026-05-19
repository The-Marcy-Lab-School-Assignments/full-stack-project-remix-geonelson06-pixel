const MessageList = ({
  messages,
  currentUser,
}) => {
  return (
    <div className="message-list">
      {!messages.length && (
        <div className="empty-state">
          <h2>No messages yet</h2>
          <p>
            Send the first message to get the lobby chat started.
          </p>
        </div>
      )}

      {messages.map((message) => (
        <div
          className={
            message.sender_id ===
            currentUser.user_id
              ? 'message mine'
              : 'message'
          }
          key={message.message_id}
        >
          <span>{message.username}</span>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
