const ConversationList = ({
  conversations,
  setSelectedConversation,
}) => {
  return (
    <div className="conversation-list">
      <h2>Messages</h2>

      {conversations.map(
        (conversation) => (
          <button
            key={
              conversation.conversation_id
            }
            onClick={() =>
              setSelectedConversation(
                conversation.conversation_id
              )
            }
          >
            Conversation #
            {conversation.conversation_id}
          </button>
        )
      )}
    </div>
  );
};

export default ConversationList;