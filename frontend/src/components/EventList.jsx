import EventCard from './EventCard';

const EventList = ({
  events,
  loadEvents,
  currentUser,
}) => {
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