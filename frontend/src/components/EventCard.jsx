import {
  joinEvent,
  leaveEvent,
  deleteEvent,
} from '../adapters/event-adapters';

const EventCard = ({
  event,
  loadEvents,
  currentUser,
}) => {
  const handleJoin = async () => {
    const { error } = await joinEvent(event.event_id);

    if (error) {
      return alert(error);
    }

    loadEvents();
  };

  const handleLeave = async () => {
    const { error } = await leaveEvent(event.event_id);

    if (error) {
      return alert(error);
    }

    loadEvents();
  };

  const handleDelete = async () => {
    const { error } = await deleteEvent(event.event_id);

    if (error) {
      return alert(error);
    }

    loadEvents();
  };

  return (
    <div className="event-card">
      <div className="star-badge">⭐</div>

      <h2>{event.title}</h2>

      <p>🎮 {event.game}</p>

      <p>🎲 {event.minigame_type}</p>

      <p>📜 {event.rules}</p>

      <p>
        📅{' '}
        {new Date(event.event_date).toLocaleString()}
      </p>

      <div className="card-buttons">
        <button onClick={handleJoin}>
          Join Event
        </button>

        <button onClick={handleLeave}>
          Leave Event
        </button>

        {currentUser.user_id ===
          event.host_user_id && (
            <button
              className="delete-btn"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
      </div>
    </div>
  );
};

export default EventCard;