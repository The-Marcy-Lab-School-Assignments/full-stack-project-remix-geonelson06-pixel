import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  fetchEvents,
} from '../adapters/event-adapters';

import {
  fetchFilteredEvents,
} from '../adapters/matchmaking-adapters';

import CreateEventForm from './CreateEventForm';
import EventList from './EventList';
import MatchmakingFilters from './MatchmakingFilters';
import socket from '../socket';

const EventPage = ({
  currentUser,
}) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] =
    useState('');
  const [selectedType, setSelectedType] =
    useState('');

  const loadEvents =
    useCallback(
      async () => {
        setIsLoading(true);

        const request =
          selectedGame || selectedType
            ? fetchFilteredEvents(
                selectedGame,
                selectedType
              )
            : fetchEvents();

        const { data, error } =
          await request;

        if (error) {
          setIsLoading(false);
          return alert(error);
        }

        setEvents(data);
        setIsLoading(false);
      },
      [selectedGame, selectedType]
    );

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    socket.on(
      'events:changed',
      loadEvents
    );

    return () => {
      socket.off(
        'events:changed',
        loadEvents
      );
    };
  }, [loadEvents]);

  return (
    <main className="event-page">
      <section className="control-panel">
        <CreateEventForm loadEvents={loadEvents} />

        <MatchmakingFilters
          selectedGame={selectedGame}
          setSelectedGame={setSelectedGame}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      </section>

      {isLoading ? (
        <h2 className="loading">Loading events...</h2>
      ) : (
        <EventList
          events={events}
          loadEvents={loadEvents}
          currentUser={currentUser}
        />
      )}
    </main>
  );
};

export default EventPage;
