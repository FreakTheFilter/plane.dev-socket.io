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

## Start plane

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
curl localhost:6090/service/socket-server/spawn \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"grace_period_seconds": 60, "port": 8080, "env": {"PORT": "8080"}}'
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
