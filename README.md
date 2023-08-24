# plane.dev + socket.io test

This repo contains a few components:

1. `binaries/socket-server` ~ A minimal "Hello World" socket.io server.
2. `binaries/socket-client` ~ A minimal client for connecting to `socket-server`.
3. `tests/nginx-only/...` ~ A docker compose setup for starting a network which proxies `socket-server` through a nginx server.
4. `tests/plane/...` ~ A docker compose setup for starting plane.dev locally.

This enables us to run two tests (detailed below).

## Setup

1. Install docker.
2. Install nvm and `nvm use` in this repo to ensure you're using the right version of npm and node.
3. Run `npm install` in `binaries/socket-client` and `binaries/socket-server`.

## Test 1: nginx-only proxy

This test is designed to give us confidence that our nginx config for proxying a
socket.io server is correct. To test do the following:

Start the nginx proxy:

```sh
cd tests/nginx-only
docker compose up
```

and then separately attempt to connect to the socket server:

```sh
cd binaries/socket-client
npm start foo
```

Note that foo here can be any string. The client accepts a backend which when
used with plane will select which backend to connect to. For the nginx-only test
regardless of backend we always route to the same `socket-server` instance.

You should observe that the socket client logs just "Connected". This means the
test succeeded. The socket client has successfully handshaken with the server.

Finally, cleanup resources.

```sh
cd tests/nginx-only
docker compose down
```

## Test 2: plane.dev

This test is designed to identify if plane.dev is working locally. To test do
the following:

Package the `socket-server`:

```sh
cd binaries/socket-server
npm run package
```

start plane:

```sh
cd tests/plane
docker compose up
```

spawn a `socket-server` backend

```sh
docker run --init --network plane_plane plane/cli --nats=nats://nats spawn \
  plane.test socket-server:latest --port 8080
```

Ensure you see a "state=Ready backend\_id=" log indicating that your backend
started successfully.

Now you can test your ability to connect via plane.dev:

```sh
cd binaries/socket-client
npm start $BACKEND_ID
```

You should observe that the socket client logs just "Connected". This means the
test succeeded. The socket client has successfully handshaken with the server.

Finally, cleanup resources.

```sh
cd tests/plane
docker compose down
```

## Findings

The `nginx-only` test succeeds and the `plane` test fails. Something unique to
the plane.dev ecosystem is likely the culprit given that we're using almost the
exact same nginx config (the only change is that we rewrite the host in addition
to the path). I've identified a few things which seem to indicate a problem
unique to the websocket:

1. `curl localhost:6080/${BACKEND_ID}/healthz` returns `OK` indicating that our healthcheck is accessible.
2. `curl 'localhost:6080/${BACKEND_ID}/connect/?EIO=4&transport=polling'` returns `0{"sid":"KI5Ae8QJbf8_yjZkAAAB","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}` indicating that the socket.io endpoint is available over HTTP.
