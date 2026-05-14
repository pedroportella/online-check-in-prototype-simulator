import Fastify from 'fastify';
import { buildTelemetryEvent } from './telemetry.js';
import type { EngineConfig, SimulatorTelemetryEvent } from './types.js';

export function createTelemetryEngine(config: EngineConfig) {
  const app = Fastify({ logger: true });
  let sequence = 0;
  let timer: NodeJS.Timeout | undefined;
  let latest = buildTelemetryEvent(config, sequence);

  async function tick(): Promise<SimulatorTelemetryEvent> {
    sequence += 1;
    latest = buildTelemetryEvent(config, sequence);
    return latest;
  }

  function startLoop(): void {
    if (timer) return;
    timer = setInterval(() => {
      void tick();
    }, config.intervalMs);
  }

  function stopLoop(): void {
    if (!timer) return;
    clearInterval(timer);
    timer = undefined;
  }

  app.get('/health', async () => ({
    status: 'ok',
    service: config.engineId,
    intervalMs: config.intervalMs,
  }));

  app.get('/api/v1/telemetry/latest', async () => latest);
  app.post('/api/v1/simulation/tick', async () => tick());
  app.post('/api/v1/simulation/start', async () => {
    startLoop();
    return { status: 'running', service: config.engineId };
  });
  app.post('/api/v1/simulation/stop', async () => {
    stopLoop();
    return { status: 'stopped', service: config.engineId };
  });

  return {
    app,
    startLoop,
    stopLoop,
    tick,
  };
}
