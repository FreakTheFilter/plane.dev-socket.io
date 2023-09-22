const commander = require('commander');
const socketio = require('socket.io-client');

commander.program
  .name('socket-server client.')
  .argument('<backend>', 'Backend to connect to.')
  .action((backend) => {
    console.log(`Attempting to connection to backend ${backend}.`);

    const socket = socketio.io('ws://localhost:6080', {
      path: `/_plane_backend=${backend}/connect`,
    });

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
  });

commander.program.parse();
