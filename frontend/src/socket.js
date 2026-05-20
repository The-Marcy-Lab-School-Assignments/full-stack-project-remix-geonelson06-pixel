import { io } from 'socket.io-client';

const socketUrl =
  import.meta.env.DEV
    ? 'http://localhost:8080'
    : undefined;

const socket = io(socketUrl, {
  withCredentials: true,
});

export default socket;
