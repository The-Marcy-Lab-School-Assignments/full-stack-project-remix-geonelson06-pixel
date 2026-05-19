import EventCard from './EventCard';

const EventList = ({
  events,
  loadEvents,
  currentUser,
}) => {
  if (!events.length) {
    return (
      <div className="empty-state">
        <h2>No lobbies found</h2>
        <p>
          Try a different filter or create the first event for this ruleset.
        </p>
      </div>
    );
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard
          key={event.event_id}
          event={event}
          loadEvents={loadEvents}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

export default EventList;
