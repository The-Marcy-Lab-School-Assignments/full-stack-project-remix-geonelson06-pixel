import { useEffect, useState } from 'react';

import {
  fetchEvents,
} from '../adapters/event-adapters';

import {
  fetchFilteredEvents,
} from '../adapters/matchmaking-adapters';

import CreateEventForm from './CreateEventForm';
import EventList from './EventList';
import MatchmakingFilters from './MatchmakingFilters';

const EventPage = ({
  currentUser,
}) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] =
    useState('');
  const [selectedType, setSelectedType] =
    useState('');

  const loadEvents = async () => {
    const { data, error } = await fetchEvents();

    if (error) {
      return alert(error);
    }

    setEvents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const loadFilteredEvents = async () => {
      setIsLoading(true);

      const { data, error } =
        await fetchFilteredEvents(
          selectedGame,
          selectedType
        );

      if (error) {
        setIsLoading(false);
        return alert(error);
      }

      setEvents(data);
      setIsLoading(false);
    };

    loadFilteredEvents();
  }, [selectedGame, selectedType]);

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
