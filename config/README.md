# plane.dev

We use [jamsocket] to support session-lived backends in prod. Fortunately for
us, the core technology used by jamsocket is [plane.dev] which they open source.
We use the open source plane.dev tools to support session-lived backends locally
while using the managed jamsocket service in production.

To bring up plane.dev locally, we need to start a number of binaries (all
configured in this folder and brought online by the docker compose file).

1. controller ~ The controller manages scheduling of session-lived backends.
   Because we only have a single machine in our local cluster (the host machine)
   it has very little work to do, but we need to start it nonetheless.
2. drone ~ The drone actually runs backends. It's started on each machine in our
   plane cluster and collaborated with the controller to schedule and manage
   backends on a single machine.
3. nats ~ [nats] is a technology for communicating between machines in a cluster
   without vendor lock in. Plane uses it to communicate between the controller
   and drones as well as an API interface.
4. dnsmasq ~ A lightweight DNS server used as the controller's persistence
   layer. The controller stores routing tables for each backend it schedules
   here.

From our setup we expose 2 ports:

1. `6090` ~ For parity between [jamsocket's HTTP API] and plane.dev's NAT API,
   the controller is configured to support an HTTP API. We expose that on port
   6090.
2. `6080` ~ In production, backends are accessible via custom hosts managed by a
   custom DNS server (locally this would be the dnsmasq instance). For example,
   `${BACKEND_ID}.jamsocket.live/...`. However, locally host routing is very
   impractical since we want to serve our session-lived backends well...
   locally! From localhost. Fortunately the drone has a special flag we can set
   to enable path based routing in the form `/_plane_backend=${BACKEND_ID}/...`.
   We expose that proxy here on port `6080`.

[jamsocket's HTTP API]: https://docs.jamsocket.com/api-docs/
[jamsocket]: https://jamsocket.com/
[plane.dev]: https://plane.dev/
[nats]: https://nats.io/
