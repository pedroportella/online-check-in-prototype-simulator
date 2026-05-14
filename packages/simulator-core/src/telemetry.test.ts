import { describe, expect, it } from 'vitest';
import { buildTelemetryEvent } from './telemetry.js';

describe('buildTelemetryEvent', () => {
  it('builds engine telemetry with the configured cadence', () => {
    const event = buildTelemetryEvent({
      engineId: 'simulator-engine-1',
      port: 7011,
      intervalMs: 60000,
      autoStart: false,
    }, 3);

    expect(event.engineId).toBe('simulator-engine-1');
    expect(event.intervalMs).toBe(60000);
    expect(event.flights.length).toBeGreaterThan(0);
  });
});
