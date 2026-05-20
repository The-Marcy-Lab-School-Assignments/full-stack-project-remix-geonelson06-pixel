const path = require('path');

const http = require('http');

const express = require('express');

const cookieSession =
  require('cookie-session');

require('dotenv').config();

const logRoutes =
  require('./middleware/logRoutes');

const checkAuthentication =
  require('./middleware/checkAuthentication');

const authControllers =
  require('./controllers/authControllers');

const eventControllers =
  require('./controllers/eventControllers');

const messageControllers =
  require('./controllers/messageControllers');

const matchmakingControllers =
  require('./controllers/matchmakingControllers');

const createSocketServer =
  require('./socket');

const app = express();

const server =
  http.createServer(app);

const io =
  createSocketServer(server);

app.set('io', io);

const PORT =
  process.env.PORT || 8080;

// ====================================
// Middleware
// ====================================

app.use(logRoutes);

app.use(
  cookieSession({
    name: 'session',

    secret:
      process.env.SESSION_SECRET,
  })
);

app.use(express.json());

// Serve frontend build in production

app.use(
  express.static(
    path.join(
      __dirname,
      '../frontend/dist'
    )
  )
);

// ====================================
// Auth Routes
// ====================================

app.post(
  '/api/auth/register',
  authControllers.register
);

app.post(
  '/api/auth/login',
  authControllers.login
);

app.get(
  '/api/auth/me',
  authControllers.getMe
);

app.delete(
  '/api/auth/logout',
  authControllers.logout
);

// ====================================
// Event Routes
// ====================================

app.get(
  '/api/events',
  checkAuthentication,
  eventControllers.getEvents
);

app.post(
  '/api/events',
  checkAuthentication,
  eventControllers.createEvent
);

app.post(
  '/api/events/:event_id/join',
  checkAuthentication,
  eventControllers.joinEvent
);

app.delete(
  '/api/events/:event_id/leave',
  checkAuthentication,
  eventControllers.leaveEvent
);

app.delete(
  '/api/events/:event_id',
  checkAuthentication,
  eventControllers.deleteEvent
);

// ====================================
// Matchmaking Routes
// ====================================

app.get(
  '/api/matchmaking/recommended',
  checkAuthentication,
  matchmakingControllers.getRecommendedEvents
);

// ====================================
// Messaging Routes
// ====================================

app.get(
  '/api/conversations',
  checkAuthentication,
  messageControllers.getConversations
);

app.post(
  '/api/conversations',
  checkAuthentication,
  messageControllers.startConversation
);

app.get(
  '/api/conversations/:conversation_id/messages',
  checkAuthentication,
  messageControllers.getMessages
);

app.post(
  '/api/conversations/:conversation_id/messages',
  checkAuthentication,
  messageControllers.sendMessage
);

// ====================================
// Global Error Handler
// ====================================

const handleError = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  res.status(500).send({
    message:
      'Internal Server Error',
  });
};

app.use(handleError);

// ====================================
// Listen
// ====================================

server.listen(PORT, () =>
  console.log(
    `Server running at http://localhost:${PORT}`
  )
);
