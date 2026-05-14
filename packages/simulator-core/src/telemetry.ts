import type { EngineConfig, SimulatorFlightTelemetry, SimulatorTelemetryEvent } from './types.js';

const flightBaseline = [
  { flightId: 'VA938', route: 'BNE to SYD', checkedIn: 140, exceptions: 6, completionPercent: 86, queueDepth: 20, latencyMs: 220 },
  { flightId: 'VA322', route: 'MEL to BNE', checkedIn: 116, exceptions: 14, completionPercent: 80, queueDepth: 32, latencyMs: 410 },
  { flightId: 'VA476', route: 'PER to ADL', checkedIn: 94, exceptions: 5, completionPercent: 91, queueDepth: 12, latencyMs: 190 },
] satisfies SimulatorFlightTelemetry[];

function bounded(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function jitter(seed: number, spread: number): number {
  const wave = Math.sin(seed * 1.618) * spread;
  const noise = (Math.random() - 0.5) * spread;
  return wave + noise;
}

export function buildTelemetryEvent(config: EngineConfig, sequence: number): SimulatorTelemetryEvent {
  const engineOffset = config.engineId === 'simulator-engine-1' ? 0 : 1;
  const flights = flightBaseline
    .filter((_flight, index) => (index + engineOffset) % 2 === 0 || config.engineId === 'simulator-engine-2')
    .map((flight, index) => {
      const seed = sequence + index + engineOffset;
      const checkedIn = Math.round(bounded(flight.checkedIn + sequence * (engineOffset + 1) + jitter(seed, 8), 0, 220));
      const exceptions = Math.round(bounded(flight.exceptions + jitter(seed + 7, 6), 0, 35));
      const completionPercent = Number(bounded(flight.completionPercent + sequence * 0.2 + jitter(seed + 11, 4), 0, 100).toFixed(1));

      return {
        ...flight,
        checkedIn,
        exceptions,
        completionPercent,
        queueDepth: Math.round(bounded(flight.queueDepth + jitter(seed + 17, 10), 0, 80)),
        latencyMs: Math.round(bounded(flight.latencyMs + jitter(seed + 23, 90), 80, 1200)),
      };
    });

  return {
    engineId: config.engineId,
    sequence,
    emittedAt: new Date().toISOString(),
    intervalMs: config.intervalMs,
    flights,
  };
}
