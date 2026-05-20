const { Server } = require('socket.io');

const createSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin:
        process.env.CLIENT_URL ||
        'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on(
      'conversation:join',
      (conversationId) => {
        if (!conversationId) {
          return;
        }

        socket.join(
          `conversation:${conversationId}`
        );
      }
    );
  });

  return io;
};

module.exports = createSocketServer;
