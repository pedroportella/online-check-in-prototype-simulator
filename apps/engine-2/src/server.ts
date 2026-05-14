import cors from '@fastify/cors';
import { createTelemetryEngine } from '@va/simulator-core';

const engine = createTelemetryEngine({
  engineId: 'simulator-engine-2',
  port: Number(process.env.PORT ?? 7012),
  intervalMs: Number(process.env.SIMULATION_INTERVAL_MS ?? 30000),
  autoStart: `${process.env.SIMULATION_AUTOSTART ?? 'true'}` !== 'false',
});

await engine.app.register(cors, { origin: true });

if (`${process.env.SIMULATION_AUTOSTART ?? 'true'}` !== 'false') {
  engine.startLoop();
  await engine.tick();
}

await engine.app.listen({
  port: Number(process.env.PORT ?? 7012),
  host: process.env.HOST ?? '0.0.0.0',
});
