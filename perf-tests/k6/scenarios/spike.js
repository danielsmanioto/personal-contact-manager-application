// Spike Test Scenario
// Purpose: Test system behavior under sudden traffic spike
// Load: Sudden jump 10→300 VUs in 10 seconds, hold 5 minutes, ramp down
// Success: Document latency increase profile and error spike

import { check, sleep } from 'k6';
import { listContacts, createContact } from '../lib/contacts-api.js';
import { STRESS_THRESHOLDS, DURATIONS } from '../lib/constants.js';
import { checkResponse, generateUniqueEmail, generateUniqueContactName, log } from '../lib/helpers.js';

export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '1m', target: 10 },   // Baseline: 10 VUs
        { duration: '10s', target: 300 }, // SPIKE: Jump to 300 VUs in 10 seconds
        { duration: '5m', target: 300 },  // Hold: Maintain 300 VUs for 5 minutes
        { duration: '1m', target: 0 },    // Ramp down: Return to 0
      ],
    },
  },
  thresholds: STRESS_THRESHOLDS,
};

let spikeStartTime = null;

export default function () {
  // Record when spike happens
  if (!spikeStartTime && __VU > 20) {
    spikeStartTime = new Date().getTime();
    log(`🔥 SPIKE DETECTED at ${new Date().toISOString()} with ${__VU} VUs`, 'info');
  }

  log(`VU ${__VU}: Spike test iteration`, 'debug');

  const random = Math.random();

  if (random < 0.8) {
    const listRes = listContacts({ limit: 20 });
    checkResponse(
      listRes,
      {
        'GET /contacts returns 2xx': (r) => r.status >= 200 && r.status < 300,
      },
      'GET /contacts'
    );
  } else {
    const createRes = createContact(
      generateUniqueContactName(),
      generateUniqueEmail(),
      '11' + Math.random().toString().substring(2, 11)
    );
    checkResponse(
      createRes,
      {
        'POST /contacts returns 2xx': (r) => r.status >= 200 && r.status < 300,
      },
      'POST /contacts'
    );
  }

  sleep(Math.random() * 2 + 0.5);
}

export function teardown(data) {
  const duration = spikeStartTime ? new Date().getTime() - spikeStartTime : 0;
  log(`Spike test complete. Duration: ${duration}ms`, 'info');
}
