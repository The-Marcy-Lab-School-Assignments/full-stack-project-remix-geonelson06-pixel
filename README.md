# PartyHub — Full-Stack PERN Application

PartyHub is a full-stack Mario Party matchmaking and event coordination platform built with React, Express, PostgreSQL, and Node.js.

The application allows Nintendo Switch players to organize Mario Party sessions, create joinable lobbies, manage player limits, discover events that match their preferred game/ruleset, and communicate with other players.

PartyHub demonstrates session-based authentication, relational database design, protected routes, session rehydration, conditional rendering, many-to-many relationships, and modular PERN architecture.

---

# Mission Statement

PartyHub is designed for Nintendo Switch players who want a centralized place to organize Mario Party sessions with friends and online players.

Instead of coordinating through scattered Discord messages or social media posts, users can:

* create structured Mario Party events
* filter events by game and rules
* join public lobbies
* communicate with other players
* build consistent groups for future sessions

The goal of PartyHub is to make organizing multiplayer Mario Party games easier, faster, and more social.

---

# User Stories

# Authentication

* A user can register for an account with a username, email, Switch friend code, and password
* A user can log in to an existing account
* A user can log out
* A returning user with an active session is automatically logged in after refreshing the page

---

# Events

* A logged-in user can create a Mario Party event
* A logged-in user can view all available events
* A logged-in user can join an event
* A logged-in user can leave an event
* A logged-in user can delete events they created
* An event can only contain up to 4 players

---

# Matchmaking

* A user can filter events by Mario Party game
* A user can filter events by minigame preference
* A user can save their favorite Mario Party game
* A user can receive recommended events based on their preferences

---

# Messaging

* A user can send messages to another user
* A user can view conversation history
* A user can participate in private conversations

---

# Schema

# users

```sql
users
────────────────────────────────────
user_id         SERIAL PRIMARY KEY
username        TEXT UNIQUE NOT NULL
email           TEXT UNIQUE NOT NULL
friend_code     TEXT NOT NULL
favorite_game   TEXT
preferred_rules TEXT
password_hash   TEXT NOT NULL
```

---

# events

```sql
events
────────────────────────────────────
event_id        SERIAL PRIMARY KEY
title           TEXT NOT NULL
game            TEXT NOT NULL
minigame_type   TEXT
rules           TEXT
turn_count      INTEGER
event_date      TIMESTAMP
host_user_id    INTEGER REFERENCES users(user_id)
                 ON DELETE CASCADE
```

---

# event_players

```sql
event_players
────────────────────────────────────
event_player_id SERIAL PRIMARY KEY
event_id        INTEGER REFERENCES events(event_id)
                 ON DELETE CASCADE
user_id         INTEGER REFERENCES users(user_id)
                 ON DELETE CASCADE
```

---

# conversations

```sql
conversations
────────────────────────────────────
conversation_id SERIAL PRIMARY KEY
created_at      TIMESTAMP DEFAULT NOW()
```

---

# conversation_participants

```sql
conversation_participants
────────────────────────────────────
participant_id  SERIAL PRIMARY KEY
conversation_id INTEGER REFERENCES conversations(conversation_id)
                 ON DELETE CASCADE
user_id         INTEGER REFERENCES users(user_id)
                 ON DELETE CASCADE
```

---

# messages

```sql
messages
────────────────────────────────────
message_id      SERIAL PRIMARY KEY
conversation_id INTEGER REFERENCES conversations(conversation_id)
                 ON DELETE CASCADE
sender_id       INTEGER REFERENCES users(user_id)
                 ON DELETE CASCADE
content         TEXT NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
```

---

# Relationships

* A user can host many events
* An event belongs to one host user
* A user can join many events
* An event can contain many players
* A conversation can contain multiple participants
* A conversation can contain many messages
* A user can participate in many conversations
* Deleting a user removes hosted events and related participation records

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

| Method | Endpoint                | Request Body                                                    | Response              |
| ------ | ----------------------- | --------------------------------------------------------------- | --------------------- |
| GET    | `/api/events`           | —                                                               | `[{ event objects }]` |
| POST   | `/api/events`           | `{ title, game, minigame_type, rules, turn_count, event_date }` | `{ created event }`   |
| DELETE | `/api/events/:event_id` | —                                                               | `{ deleted event }`   |

---

# Event Participation Endpoints

| Method | Endpoint                      | Request Body | Response                      |
| ------ | ----------------------------- | ------------ | ----------------------------- |
| POST   | `/api/events/:event_id/join`  | —            | `{ message: "Joined event" }` |
| DELETE | `/api/events/:event_id/leave` | —            | `{ message: "Left event" }`   |

---

# Matchmaking Endpoints

| Method | Endpoint                                | Request Body | Response                   |
| ------ | --------------------------------------- | ------------ | -------------------------- |
| GET    | `/api/events?game=SuperMarioParty`      | —            | `[{ filtered events }]`    |
| GET    | `/api/events?minigame_type=Skill-Based` | —            | `[{ filtered events }]`    |
| GET    | `/api/matchmaking/recommended`          | —            | `[{ recommended events }]` |

---

# Messaging Endpoints

| Method | Endpoint                                       | Request Body         | Response                   |
| ------ | ---------------------------------------------- | -------------------- | -------------------------- |
| GET    | `/api/conversations`                           | —                    | `[{ conversations }]`      |
| POST   | `/api/conversations`                           | `{ participant_id }` | `{ created conversation }` |
| GET    | `/api/conversations/:conversation_id/messages` | —                    | `[{ messages }]`           |
| POST   | `/api/conversations/:conversation_id/messages` | `{ content }`        | `{ created message }`      |

---

# Example Event Object

```json
{
  "event_id": 1,
  "title": "Mario Party Superstars Friday Night",
  "game": "Mario Party Superstars",
  "minigame_type": "Skill-Based",
  "rules": "20 turns, no CPUs",
  "turn_count": 20,
  "event_date": "2026-05-20T20:00:00.000Z",
  "host_user_id": 3
}
```

---

# Setup Instructions

# 1. Create Database

```bash
createdb partyhub_db
```

---

# 2. Server Setup

```bash
cd server
npm install
cp .env.template .env
```

Fill in the `.env` file with:

* PostgreSQL credentials
* database name
* session secret

Seed the database:

```bash
npm run db:seed
```

Start the backend server:

```bash
npm run dev
```

The server runs on:

```plaintext
http://localhost:8080
```

---

# 3. Frontend Setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```plaintext
http://localhost:5173
```

The Vite proxy forwards `/api` requests to the Express backend so session cookies work correctly during development.

---

# Seed Users

After seeding the database:

| Username  | Password    |
| --------- | ----------- |
| mariofan  | password123 |
| luigiking | password123 |

---

# Application Structure

```plaintext
partyhub/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   │
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js
│   │   │   ├── event-adapters.js
│   │   │   ├── matchmaking-adapters.js
│   │   │   └── message-adapters.js
│   │   │
│   │   ├── components/
│   │   │   ├── AuthPage.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── EventPage.jsx
│   │   │   ├── EventList.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── CreateEventForm.jsx
│   │   │   ├── MatchmakingFilters.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── ConversationList.jsx
│   │   │   ├── MessageList.jsx
│   │   │   └── MessageInput.jsx
│   │   │
│   │   ├── context/
│   │   │   └── CurrentUserContext.jsx
│   │   │
│   │   └── styles/
│   │       └── app.css
│   │
│   └── vite.config.js
│
└── server/
    ├── index.js
    │
    ├── controllers/
    │   ├── authControllers.js
    │   ├── eventControllers.js
    │   ├── matchmakingControllers.js
    │   └── messageControllers.js
    │
    ├── models/
    │   ├── userModel.js
    │   ├── eventModel.js
    │   ├── eventPlayerModel.js
    │   ├── conversationModel.js
    │   └── messageModel.js
    │
    ├── middleware/
    │   ├── checkAuthentication.js
    │   └── logRoutes.js
    │
    └── db/
        ├── pool.js
        └── seed.js
```

---

# MVP Features

* Session-based authentication
* Session rehydration
* Create Mario Party events
* Join and leave events
* 4-player event limit
* Matchmaking filters
* Event ownership validation
* Protected routes
* Responsive Mario Party styled UI

---

# Stretch Features

* Real-time chat with Socket.io
* Real-time lobby updates
* Friend requests
* Profile customization
* Discord integration
* Notifications
* Event invite links
* Ranking/reputation system
* Nintendo API integration

---

# Technical Challenges

One of the primary technical challenges in PartyHub is managing many-to-many relationships between users and events while enforcing strict player limits.

Another challenge is ensuring conversation security so users can only access conversations they participate in.

The application also demonstrates session persistence and session rehydration using cookies and protected API routes.

---

# Presentation Talking Points

* Why the project was created
* Relational database design
* Event matchmaking logic
* Player limit validation
* Session authentication flow
* Messaging system architecture
* Future real-time multiplayer/social features

---

# Future Improvements

Future versions of PartyHub could include:

* live lobby updates
* WebSocket-based messaging
* matchmaking algorithms
* integrated voice channels
* event recommendation systems
* user profile statistics
* achievement systems
* mobile optimization

---

# Screenshots

(Add screenshots after frontend completion.)
