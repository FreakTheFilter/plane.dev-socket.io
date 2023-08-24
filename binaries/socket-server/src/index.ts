const http = require('node:http');

const cors = require('cors');
const express = require('express');
const socketio = require('socket.io');

const PORT = 8080;

const start = async () => {
  console.log(`Starting at ${new Date()}.`);

  // Create the server.

  const expressApplication = express();
  const httpServer = http.createServer(expressApplication);

  expressApplication.use(cors());

  const socketServer = new socketio.Server(httpServer, {
    serveClient: false,
    path: '/connect',
  });

  socketServer.on('connection', async (socket) => {
    console.log('Connection received.');
    socket.on('disconnect', () => {
      console.log('Client disconnect.');
    });
  });

  // Attach health checking endpoints.

  expressApplication.get('/healthz', (_request, response) => {
    response.status(200);
    response.send('OK');
  });
  expressApplication.get('/livez', (_request, response) => {
    response.status(200);
    response.send('OK');
  });

  // Start the HTTP Server

  await new Promise<void>((resolve) => {
    httpServer.listen({ port: PORT }, () => {
      resolve();
    });
  });

  console.log(`Ready at ${new Date()} on port ${PORT}.`);

  // Listen for the termination signal and trigger a graceful shutdown.

  process.once('SIGTERM', async () => {
    console.log(`Termination started at ${new Date()}.`);

    await new Promise<void>((resolve) => {
      httpServer.close(() => {
        resolve();
      });
    });

    console.log(`Termination completed at ${new Date()}.`);
  });
};

start();
