# PartyHub — Full-Stack Case Study

A full-stack Mario Party event coordination app built with React, Express, and Postgres. PartyHub helps Nintendo Switch players organize Mario Party sessions by creating joinable game events with custom rules and player limits.

The application demonstrates session-based authentication, protected API routes, session rehydration, relational database design, and full-stack CRUD functionality using the PERN stack.

---

# Mission Statement

PartyHub is designed for Nintendo Switch players who want an easier way to organize Mario Party game sessions with friends or online players. Instead of coordinating through scattered Discord messages or group chats, users can create structured game lobbies with selected games, rules, and player limits.

---

# User Stories

## Authentication

* A user can register for an account with a username, email, Switch friend code, and password
* A user can log in to an existing account
* A user can log out
* A returning user with an active session is automatically logged in after refreshing the page

---

## Events

* A logged-in user can create a Mario Party event
* A logged-in user can view all available events
* A logged-in user can join an event
* A logged-in user can leave an event
* A logged-in user can delete events they created
* An event can only contain up to 4 total players

---

# Schema

## users

```
users
────────────────────────────────────
user_id         SERIAL PRIMARY KEY
username        TEXT UNIQUE NOT NULL
email           TEXT UNIQUE NOT NULL
friend_code     TEXT NOT NULL
password_hash   TEXT NOT NULL
```

---

## events

```
events
────────────────────────────────────
event_id        SERIAL PRIMARY KEY
title           TEXT NOT NULL
game            TEXT NOT NULL
minigame_type   TEXT
rules           TEXT
event_date      TIMESTAMP
host_user_id    INTEGER REFERENCES users(user_id)
                 ON DELETE CASCADE
```

---

## event_players

```
event_players
────────────────────────────────────
event_player_id SERIAL PRIMARY KEY
event_id        INTEGER REFERENCES events(event_id)
                 ON DELETE CASCADE
user_id         INTEGER REFERENCES users(user_id)
                 ON DELETE CASCADE
```

---

# Relationships

* A user can host many events
* An event belongs to one host user
* A user can join many events
* An event can contain many players
* Deleting a user deletes their hosted events and joined event records

---

# API Contract

# Auth Endpoints

| Method | Endpoint             | Request Body                                 | Response                                              |
| ------ | -------------------- | -------------------------------------------- | ----------------------------------------------------- |
| POST   | `/api/auth/register` | `{ username, email, friend_code, password }` | `{ user_id, username, email, friend_code }`           |
| POST   | `/api/auth/login`    | `{ email, password }`                        | `{ user_id, username, email, friend_code }`           |
| DELETE | `/api/auth/logout`   | —                                            | `{ message }`                                         |
| GET    | `/api/auth/me`       | —                                            | `{ user_id, username, email, friend_code }` or `null` |

---

# Event Endpoints

(All event routes require authentication.)

| Method | Endpoint                | Request Body                                        | Response              |
| ------ | ----------------------- | --------------------------------------------------- | --------------------- |
| GET    | `/api/events`           | —                                                   | `[{ event objects }]` |
| POST   | `/api/events`           | `{ title, game, minigame_type, rules, event_date }` | `{ created event }`   |
| DELETE | `/api/events/:event_id` | —                                                   | `{ deleted event }`   |

---

# Join Event Endpoints

| Method | Endpoint                      | Request Body | Response                      |
| ------ | ----------------------------- | ------------ | ----------------------------- |
| POST   | `/api/events/:event_id/join`  | —            | `{ message: "Joined event" }` |
| DELETE | `/api/events/:event_id/leave` | —            | `{ message: "Left event" }`   |

---

# Example Event Object

```
{
  "event_id": 1,
  "title": "Mario Party Superstars Friday Night",
  "game": "Mario Party Superstars",
  "minigame_type": "Skill-Based",
  "rules": "20 turns, no CPUs",
  "event_date": "2026-05-20T20:00:00.000Z",
  "host_user_id": 3
}
```

---

# Setup

## 1. Database

Create the Postgres database:

```
createdb partyhub_db
```

---

## 2. Server

```
cd server
npm install
cp .env.template .env
```

Fill in the `.env` file with your Postgres credentials and session secret.

Seed the database:

```
npm run db:seed
```

Start the server:

```
npm run dev
```

The server runs on:

```
http://localhost:8080
```

---

## 3. Frontend

In a second terminal:

```
cd frontend
npm install
npm run dev
```

The frontend runs on:

```
http://localhost:5173
```

The Vite proxy forwards `/api` requests to the Express server so session cookies work correctly during development.

---

# Seed Users

After running the seed script, these test accounts are available:

| Username  | Password    |
| --------- | ----------- |
| mariofan  | password123 |
| luigiking | password123 |

---

# Application Structure

```
partyhub/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js
│   │   │   └── event-adapters.js
│   │   └── components/
│   │       ├── AuthPage.jsx
│   │       ├── EventPage.jsx
│   │       ├── CreateEventForm.jsx
│   │       ├── EventList.jsx
│   │       ├── EventCard.jsx
│   │       └── JoinButton.jsx
│   └── vite.config.js
│
└── server/
    ├── index.js
    ├── controllers/
    │   ├── authControllers.js
    │   └── eventControllers.js
    ├── models/
    │   ├── userModel.js
    │   ├── eventModel.js
    │   └── eventPlayerModel.js
    ├── middleware/
    │   ├── checkAuthentication.js
    │   └── logRoutes.js
    └── db/
        ├── pool.js
        └── seed.js
```

---

# MVP Features

* Session-based authentication
* Session rehydration
* Create events
* Join events
* Leave events
* Delete hosted events
* Player cap enforcement
* Protected routes
* Responsive frontend UI

---

# Stretch Features

* Direct messaging between users
* Real-time event updates with Socket.io
* Friend requests
* User profile pages
* Event chat rooms
* Nintendo API integration
* Matchmaking filters
* Mobile responsive redesign

---

# Technical Challenges

One of the primary technical challenges in this project is managing many-to-many relationships between users and events while enforcing a 4-player limit per event. This requires backend validation before allowing users to join a lobby.

Another challenge is maintaining session persistence using cookies and session rehydration so that users remain logged in after refreshing the page.

---

# Future Improvements

Future versions of PartyHub would include:

* real-time lobby updates
* in-app messaging
* Discord integration
* notifications for joined events
* matchmaking by preferred Mario Party game or ruleset
