import { useEffect, useState } from 'react';

import {
  fetchEvents,
} from '../adapters/event-adapters';

import { logout } from '../adapters/auth-adapters';

import Navbar from './Navbar';
import CreateEventForm from './CreateEventForm';
import EventList from './EventList';

const EventPage = ({
  currentUser,
  setCurrentUser,
}) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleLogout = async () => {
    await logout();

    setCurrentUser(null);
  };

  return (
    <div>
      <Navbar
        currentUser={currentUser}
        handleLogout={handleLogout}
      />

      <CreateEventForm loadEvents={loadEvents} />

      {isLoading ? (
        <h2>Loading Events...</h2>
      ) : (
        <EventList
          events={events}
          loadEvents={loadEvents}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default EventPage;