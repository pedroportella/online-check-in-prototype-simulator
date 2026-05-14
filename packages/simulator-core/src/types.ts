export type SimulatorEngineId = 'simulator-engine-1' | 'simulator-engine-2';

export interface SimulatorFlightTelemetry {
  flightId: string;
  route: string;
  checkedIn: number;
  exceptions: number;
  completionPercent: number;
  queueDepth: number;
  latencyMs: number;
}

export interface SimulatorTelemetryEvent {
  engineId: SimulatorEngineId;
  sequence: number;
  emittedAt: string;
  intervalMs: number;
  flights: SimulatorFlightTelemetry[];
}

export interface EngineConfig {
  engineId: SimulatorEngineId;
  port: number;
  intervalMs: number;
  autoStart: boolean;
}
