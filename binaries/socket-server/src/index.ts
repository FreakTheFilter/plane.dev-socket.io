const http = require('node:http');

const cors = require('cors');
const express = require('express');
const socketio = require('socket.io');

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

  expressApplication.get('/healthz', (request, response) => {
    response.status(200);
    response.send('OK');
  });
  expressApplication.get('/livez', (_request, response) => {
    response.status(200);
    response.send('OK');
  });

  // Start the HTTP Server

  if (process.env.PORT == null) {
    throw new Error(`Env variable PORT must be defined.`);
  }
  const port = parseInt(process.env.PORT);

  await new Promise<void>((resolve) => {
    httpServer.listen({ port: port }, () => {
      resolve();
    });
  });

  console.log(`Ready at ${new Date()} on port ${port}.`);

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
