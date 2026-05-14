# Online Check-in Prototype Simulator

Telemetry simulator monorepo for the Virgin Australia online check-in prototype.

The simulator extends the `tracking-demo-simulation` idea into two independent engines that publish their latest telemetry through HTTP endpoints. Engine 1 refreshes its data every 1 minute. Engine 2 refreshes its data every 30 seconds. The Node.js BFF subscribes to those endpoints.

## What It Demonstrates

- pnpm monorepo with shared simulator core and two runtime apps.
- Two independent telemetry engines with different cadences.
- Randomised but bounded flight telemetry for demo-safe data variation.
- Pull-based service subscription from `online-check-in-prototype-services`.
- HTTP controls for health, latest telemetry, manual ticks, start and stop.
- Docker build support for each engine.
- GitHub Actions validation for typecheck, tests, build and engine image builds.

## Repository Structure

```txt
apps/engine-1/              Simulator engine refreshing every 60000 ms
apps/engine-2/              Simulator engine refreshing every 30000 ms
packages/simulator-core/    Shared telemetry generation and Fastify engine wrapper
```

## Runtime Requirements

- Node.js 20.19+.
- pnpm 9.15.4 via Corepack.
- `online-check-in-prototype-services` on `http://127.0.0.1:7003` to receive telemetry.

## Local Setup

```bash
corepack enable
pnpm install
pnpm dev:engine-1
```

In another terminal:

```bash
pnpm dev:engine-2
```

Local endpoints:

| Engine | URL | Cadence |
| --- | --- | --- |
| Engine 1 | `http://127.0.0.1:7011` | 60000 ms |
| Engine 2 | `http://127.0.0.1:7012` | 30000 ms |

## API Endpoints

Each engine exposes the same API:

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/health` | GET | Engine health and configured interval |
| `/api/v1/telemetry/latest` | GET | Latest generated telemetry event |
| `/api/v1/simulation/tick` | POST | Generate one event immediately |
| `/api/v1/simulation/start` | POST | Start the interval loop |
| `/api/v1/simulation/stop` | POST | Stop the interval loop |

## Configuration

| Variable | Engine 1 Default | Engine 2 Default | Description |
| --- | --- | --- | --- |
| `PORT` | `7011` | `7012` | HTTP port |
| `HOST` | `0.0.0.0` | `0.0.0.0` | HTTP host |
| `SIMULATION_INTERVAL_MS` | `60000` | `30000` | Publish interval |
| `SIMULATION_AUTOSTART` | `true` | `true` | Starts the refresh loop on boot |

## Verification

```bash
pnpm typecheck
pnpm test
pnpm build
```

## Docker

```bash
docker compose up --build
```

The compose file starts both engines and points them at the host BFF on port `7003`.

## CI/CD

`.github/workflows/ci.yml` runs on pushes, pull requests and manual dispatch. It verifies TypeScript, tests, production build and Docker builds for both engine images.
