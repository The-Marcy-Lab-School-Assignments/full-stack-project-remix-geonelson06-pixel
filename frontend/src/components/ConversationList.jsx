const ConversationList = ({
  conversations,
  selectedConversation,
  setSelectedConversation,
}) => {
  return (
    <div className="conversation-list">
      <h2>Conversations</h2>

      {!conversations.length && (
        <p className="muted">
          No conversations yet.
        </p>
      )}

      {conversations.map(
        (conversation) => (
          <button
            className={
              selectedConversation ===
              conversation.conversation_id
                ? 'active'
                : ''
            }
            key={
              conversation.conversation_id
            }
            onClick={() =>
              setSelectedConversation(
                conversation.conversation_id
              )
            }
          >
            <span>
              {conversation.other_username ||
                `Conversation #${conversation.conversation_id}`}
            </span>

            {conversation.last_message && (
              <small>
                {conversation.last_message}
              </small>
            )}
          </button>
        )
      )}
    </div>
  );
};

export default ConversationList;
