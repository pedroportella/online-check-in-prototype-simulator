# Simulator Architecture

The simulator is intentionally small and split by operational concern.

`@va/simulator-core` owns the telemetry contract, randomised event generation and a reusable Fastify engine wrapper. `@va/simulator-engine-1` and `@va/simulator-engine-2` configure that wrapper with different engine IDs, ports and refresh intervals.

The engines publish latest telemetry at `/api/v1/telemetry/latest`. The BFF subscribes to both engines by polling those endpoints, keeps the latest event per engine in memory, and merges those values into `/api/v1/check-in/dashboard`.

```txt
simulator-engine-1 --latest telemetry--> online-check-in-prototype-services --dashboard--> UI
simulator-engine-2 --latest telemetry--> online-check-in-prototype-services --dashboard--> UI
```

This keeps the React app simple and mirrors a BFF pattern where upstream volatility stays behind the API boundary.
