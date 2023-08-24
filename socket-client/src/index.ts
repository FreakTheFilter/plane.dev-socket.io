const socketio = require('socket.io-client');

const socket = socketio.io('ws://localhost:6080', { path: '/foo/connect' });

socket.on('connect', () => {
  console.info('Connected!');
});

socket.on('connect_error', (error) => {
  console.warn('Experienced connection error', error);
});

socket.on('connect_failed', (error) => {
  console.warn('Failed to connect with error', error);
});

socket.on('disconnect', () => {
  console.info('Disconnected');
});
