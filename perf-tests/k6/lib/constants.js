// Performance testing constants and configuration
// Used by all k6 scenarios

export const BASE_URL = __ENV.API_URL || 'http://localhost:8080/api';
export const CONTACT_COUNT = parseInt(__ENV.CONTACT_COUNT || '10000', 10);
export const TEST_DURATION_SOAK = parseInt(__ENV.TEST_DURATION_SOAK || '60', 10); // minutes

// VU counts for different scenario types
export const VU_COUNTS = {
  smoke: { start: 1, max: 2 },
  load: { start: 0, max: 20 },
  stress: { start: 10, max: 200 },
  spike: { start: 10, max: 300 },
  soak: { start: 0, max: 30 },
};

// Duration configurations (in seconds, minutes, or hours)
export const DURATIONS = {
  smoke: '1m',
  load: {
    rampUp: '1m',
    hold: '5m',
    rampDown: '1m',
  },
  stress: {
    // Progressive ramp: 10→200 VUs, increase by 10 every 2 minutes
    step: 10,
    stepDuration: '2m',
  },
  spike: {
    beforeSpike: '1m',
    spike: '10s', // 10→300 VUs in 10 seconds
    hold: '5m',
    rampDown: '1m',
  },
  soak: {
    // Configurable via ENV, default 60 minutes
    duration: `${TEST_DURATION_SOAK}m`,
  },
};

// Performance thresholds
export const THRESHOLDS = {
  http_req_duration: ['p(95)<300', 'p(99)<800'], // ms
  http_req_failed: ['rate<0.01'], // <1% error rate
};

// Stress test and spike test specific thresholds
export const STRESS_THRESHOLDS = {
  http_req_duration: ['p(95)<600'], // More lenient for stress
  http_req_failed: ['rate<0.05'], // Allow up to 5% during stress
};

// Saturation thresholds (for detecting when system degrades)
export const SATURATION_THRESHOLDS = {
  errorRateMax: 0.01, // 1% error rate indicates saturation
  p95LatencyMax: 600, // 600ms p95 latency indicates saturation
};

// Test data configuration
export const TEST_DATA = {
  contactCount: CONTACT_COUNT,
  batchSize: 100, // Insert contacts in batches during setup
};

// Chaos engineering configuration (v1 focuses on these 3)
export const CHAOS_EXPERIMENTS = {
  killPostgres: {
    name: 'kill-postgres',
    duration: '1m',
    triggerAt: '30s', // Trigger 30 seconds into load test
  },
  latencyInjection: {
    name: 'latency-injection',
    duration: '1m',
    latencyMs: 500,
    triggerAt: '30s',
  },
  poolExhaustion: {
    name: 'pool-exhaustion',
    duration: '1m',
    triggerAt: '30s',
  },
};

// Logging levels
export const LOG_LEVEL = __ENV.LOG_LEVEL || 'info'; // 'debug', 'info', 'warn', 'error'

// Export for convenience
export default {
  BASE_URL,
  CONTACT_COUNT,
  TEST_DURATION_SOAK,
  VU_COUNTS,
  DURATIONS,
  THRESHOLDS,
  STRESS_THRESHOLDS,
  SATURATION_THRESHOLDS,
  TEST_DATA,
  CHAOS_EXPERIMENTS,
  LOG_LEVEL,
};
