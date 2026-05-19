import bcrypt from 'bcrypt';

import pool from './pool.js';

const SALT_ROUNDS = 10;

const seed = async () => {
  await pool.query(`
    DROP TABLE IF EXISTS messages;
    DROP TABLE IF EXISTS conversation_participants;
    DROP TABLE IF EXISTS conversations;
    DROP TABLE IF EXISTS event_players;
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS users;
  `);

  await pool.query(`
    CREATE TABLE users (
      user_id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      friend_code TEXT NOT NULL,
      favorite_game TEXT,
      preferred_rules TEXT,
      password_hash TEXT NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE events (
      event_id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      game TEXT NOT NULL,
      minigame_type TEXT,
      rules TEXT,
      event_date TIMESTAMP,
      host_user_id INTEGER REFERENCES users(user_id)
      ON DELETE CASCADE
    );
  `);

  await pool.query(`
    CREATE TABLE event_players (
      event_player_id SERIAL PRIMARY KEY,
      event_id INTEGER REFERENCES events(event_id)
      ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(user_id)
      ON DELETE CASCADE,
      UNIQUE(event_id, user_id)
    );
  `);

  await pool.query(`
    CREATE TABLE conversations (
      conversation_id SERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE conversation_participants (
      participant_id SERIAL PRIMARY KEY,
      conversation_id INTEGER REFERENCES conversations(conversation_id)
      ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(user_id)
      ON DELETE CASCADE
    );
  `);

  await pool.query(`
    CREATE TABLE messages (
      message_id SERIAL PRIMARY KEY,
      conversation_id INTEGER REFERENCES conversations(conversation_id)
      ON DELETE CASCADE,
      sender_id INTEGER REFERENCES users(user_id)
      ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // HASH PASSWORDS
  const passwordHash =
    await bcrypt.hash(
      'password123',
      SALT_ROUNDS
    );

  // SEED USERS
  await pool.query(`
    INSERT INTO users
    (
      username,
      email,
      friend_code,
      favorite_game,
      preferred_rules,
      password_hash
    )
    VALUES
    (
      'mariofan',
      'mario@example.com',
      'SW-1111-2222-3333',
      'Mario Party Superstars',
      'Skill-Based',
      '${passwordHash}'
    ),
    (
      'luigiking',
      'luigi@example.com',
      'SW-4444-5555-6666',
      'Super Mario Party',
      'Mixed',
      '${passwordHash}'
    );
  `);

  console.log('Database seeded');

  process.exit();
};

seed();