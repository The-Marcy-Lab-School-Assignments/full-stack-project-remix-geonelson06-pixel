import { useEffect, useState } from 'react';

import AuthPage from './components/AuthPage';
import EventPage from './components/EventPage';
import ChatPage from './components/ChatPage';
import Navbar from './components/Navbar';

import {
  getMe,
  logout,
} from './adapters/auth-adapters';

import './styles/app.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState('events');

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await getMe();

      setCurrentUser(data);
      setIsLoading(false);
    };

    loadSession();
  }, []);

  const handleLogout = async () => {
    await logout();

    setCurrentUser(null);
    setActiveView('events');
  };

  if (isLoading) {
    return <h1>Loading PartyHub...</h1>;
  }

  return (
    <div className="app">
      {currentUser ? (
        <>
          <Navbar
            currentUser={currentUser}
            handleLogout={handleLogout}
          />

          <header className="hero">
            <p className="eyebrow">Nintendo Switch Matchmaking</p>
            <h1 className="logo">PartyHub</h1>
            <p className="hero-copy">
              Build a lobby, find the right ruleset, and keep the party moving.
            </p>
          </header>

          <div className="view-tabs">
            <button
              className={activeView === 'events' ? 'active' : ''}
              onClick={() => setActiveView('events')}
            >
              Events
            </button>

            <button
              className={activeView === 'chat' ? 'active' : ''}
              onClick={() => setActiveView('chat')}
            >
              Messages
            </button>
          </div>

          {activeView === 'events' ? (
            <EventPage currentUser={currentUser} />
          ) : (
            <ChatPage currentUser={currentUser} />
          )}
        </>
      ) : (
        <>
          <header className="hero auth-hero">
            <p className="eyebrow">Mario Party event coordination</p>
            <h1 className="logo">PartyHub</h1>
            <p className="hero-copy">
              Sign in to create lobbies, join a table, and message your crew.
            </p>
          </header>

          <AuthPage setCurrentUser={setCurrentUser} />
        </>
      )}
    </div>
  );
};

export default App;
