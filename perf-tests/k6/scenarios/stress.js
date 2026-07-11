// Stress Test Scenario
// Purpose: Find system saturation point by progressively increasing load
// Load: Progressive ramp 10→200 VUs (increase by 10 every 2 minutes)
// Success: Identify VU count where error rate >1% or p95 latency >600ms

import { check, sleep } from 'k6';
import { listContacts, createContact } from '../lib/contacts-api.js';
import { STRESS_THRESHOLDS, DURATIONS } from '../lib/constants.js';
import { checkResponse, generateUniqueEmail, generateUniqueContactName, log, isSystemSaturated } from '../lib/helpers.js';

export const options = {
  scenarios: {
    stress: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '2m', target: 10 },   // Start at 10 VUs
        { duration: '2m', target: 20 },   // Increase to 20
        { duration: '2m', target: 30 },   // Increase to 30
        { duration: '2m', target: 40 },   // Increase to 40
        { duration: '2m', target: 50 },   // Increase to 50
        { duration: '2m', target: 75 },   // Increase to 75
        { duration: '2m', target: 100 },  // Increase to 100
        { duration: '2m', target: 150 },  // Increase to 150
        { duration: '2m', target: 200 },  // Increase to 200 (max)
        { duration: '2m', target: 200 },  // Hold at 200
        { duration: '2m', target: 0 },    // Ramp down
      ],
    },
  },
  thresholds: STRESS_THRESHOLDS,
};

let saturationPoint = null;
let saturationVUs = null;

export default function () {
  log(`VU ${__VU}: Stress test iteration`, 'debug');

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
  log('Stress test complete', 'info');
  if (saturationPoint) {
    log(`Saturation detected at ${saturationVUs} VUs: ${saturationPoint}`, 'info');
  }
}
