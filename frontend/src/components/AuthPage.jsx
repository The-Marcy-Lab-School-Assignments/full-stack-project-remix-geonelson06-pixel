import { useState } from 'react';

import {
  login,
  register,
} from '../adapters/auth-adapters';

const AuthPage = ({ setCurrentUser }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;

    const body = {
      username: form.username?.value,
      email: form.email.value,
      friend_code: form.friend_code?.value,
      password: form.password.value,
    };

    const action = isRegistering ? register : login;

    const { data, error } = await action(body);

    if (error) {
      return alert(error);
    }

    setCurrentUser(data);
  };

  return (
    <div className="auth-card">
      <h2>
        {isRegistering ? 'Create Account' : 'Login'}
      </h2>

      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <>
            <input
              name="username"
              placeholder="Username"
              required
            />

            <input
              name="friend_code"
              placeholder="Switch Friend Code"
              required
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />

        <button>
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      <button
        className="switch-auth"
        onClick={() =>
          setIsRegistering(!isRegistering)
        }
      >
        {isRegistering
          ? 'Already have an account? Login'
          : 'Need an account? Register'}
      </button>
    </div>
  );
};

export default AuthPage;