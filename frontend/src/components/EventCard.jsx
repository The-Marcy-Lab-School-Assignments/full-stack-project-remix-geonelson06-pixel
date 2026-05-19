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
  const isFull =
    Number(event.player_count) >= 4;

  const isHost =
    currentUser.user_id ===
    event.host_user_id;

  const handleJoin = async () => {
    const { error } =
      await joinEvent(event.event_id);

    if (error) {
      return alert(error);
    }

    loadEvents();
  };

  const handleLeave = async () => {
    const { error } =
      await leaveEvent(event.event_id);

    if (error) {
      return alert(error);
    }

    loadEvents();
  };

  const handleDelete = async () => {
    const { error } =
      await deleteEvent(event.event_id);

    if (error) {
      return alert(error);
    }

    loadEvents();
  };

  return (
    <div className="event-card">
      <div className="card-topline">
        <span className="star-badge">
          Lobby
        </span>

        <span className="player-count">
          {event.player_count || 0}/4 players
        </span>
      </div>

      <h2>{event.title}</h2>

      <p>
        Host: {event.username}
      </p>

      <p>
        Switch Code:
        {' '}
        {event.friend_code}
      </p>

      <p>
        Game: {event.game}
      </p>

      <p>
        Type:
        {' '}
        {event.minigame_type}
      </p>

      <p>
        Rules:
        {' '}
        {event.rules}
      </p>

      {event.turn_count && (
        <p>
          Turns: {event.turn_count}
        </p>
      )}

      <p>
        Starts:
        {' '}
        {new Date(
          event.event_date
        ).toLocaleString()}
      </p>

      <div className="card-buttons">
        {isHost ? (
          <>
            <span className="host-note">
              You host this lobby
            </span>

            <button
              className="delete-btn"
              onClick={handleDelete}
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleJoin}
              disabled={isFull}
            >
              {isFull ? 'Full' : 'Join'}
            </button>

            <button onClick={handleLeave}>
              Leave
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EventCard;
