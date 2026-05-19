import { useEffect, useState } from 'react';

import AuthPage from './components/AuthPage';
import EventPage from './components/EventPage';

import { getMe } from './adapters/auth-adapters';

import './styles/app.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await getMe();

      setCurrentUser(data);
      setIsLoading(false);
    };

    loadSession();
  }, []);

  if (isLoading) {
    return <h1>Loading PartyHub...</h1>;
  }

  return (
    <div className="app">
      <h1 className="logo">🎲 PartyHub ⭐</h1>

      {currentUser ? (
        <EventPage
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      ) : (
        <AuthPage setCurrentUser={setCurrentUser} />
      )}
    </div>
  );
};

export default App;