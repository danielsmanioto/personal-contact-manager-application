// Load Test Scenario
// Purpose: Measure baseline API performance under normal load
// Load: 0→20 VUs ramp up (1m), hold 20 VUs (5m), ramp down to 0 (1m) = 7 minutes total
// Success: p95<300ms, p99<800ms, error rate <1%

import { check, sleep } from 'k6';
import { listContacts, createContact } from '../lib/contacts-api.js';
import { THRESHOLDS, VU_COUNTS, DURATIONS } from '../lib/constants.js';
import { checkResponse, generateUniqueEmail, generateUniqueContactName, log } from '../lib/helpers.js';

export const options = {
  scenarios: {
    load: {
      executor: 'ramping-vus',
      startVUs: VU_COUNTS.load.start,
      stages: [
        { duration: DURATIONS.load.rampUp, target: VU_COUNTS.load.max },     // Ramp up to 20 VUs
        { duration: DURATIONS.load.hold, target: VU_COUNTS.load.max },       // Hold at 20 VUs
        { duration: DURATIONS.load.rampDown, target: VU_COUNTS.load.start }, // Ramp down to 0
      ],
    },
  },
  thresholds: THRESHOLDS,
};

// Metrics to track
export const customMetrics = {
  readOps: new Map(),
  writeOps: new Map(),
};

export default function () {
  log(`VU ${__VU}: Load test iteration at ${new Date().toISOString()}`, 'debug');

  // Workload: 80% reads, 20% writes
  const random = Math.random();

  if (random < 0.8) {
    // READ operation: GET /contacts
    const listRes = listContacts({ limit: 20 });
    checkResponse(
      listRes,
      {
        'GET /contacts returns 200': (r) => r.status === 200,
        'GET /contacts response time OK': (r) => r.timings.duration < 1000,
      },
      'GET /contacts'
    );
  } else {
    // WRITE operation: POST /contacts (create new contact)
    const createRes = createContact(
      generateUniqueContactName(),
      generateUniqueEmail(),
      '11' + Math.random().toString().substring(2, 11)
    );
    checkResponse(
      createRes,
      {
        'POST /contacts returns 201 or 200': (r) => r.status === 201 || r.status === 200,
        'POST /contacts response time OK': (r) => r.timings.duration < 2000,
      },
      'POST /contacts'
    );
  }

  sleep(Math.random() * 2 + 0.5); // Sleep 0.5-2.5 seconds between requests
}

export function teardown(data) {
  log('Load test complete', 'info');
  log(`Total iterations: ${data?.iterations || 'N/A'}`, 'info');
}
