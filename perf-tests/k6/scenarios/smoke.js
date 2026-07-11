// Smoke Test Scenario
// Purpose: Quick validation that API endpoints are responding
// Load: 1-2 VUs, 1 minute duration
// Success: All endpoints return 2xx status

import { check, sleep } from 'k6';
import http from 'k6/http';
import { listContacts, createContact, getContact } from '../lib/contacts-api.js';
import { THRESHOLDS, VU_COUNTS, DURATIONS } from '../lib/constants.js';
import { checkResponse, generateUniqueEmail, log } from '../lib/helpers.js';

export const options = {
  vus: VU_COUNTS.smoke.max,
  duration: DURATIONS.smoke,
  thresholds: THRESHOLDS,
};

export default function () {
  log(`VU ${__VU}: Starting smoke test iteration`, 'debug');

  // Test 1: GET /contacts (list contacts)
  const listRes = listContacts({ limit: 10 });
  checkResponse(
    listRes,
    {
      'GET /contacts returns 200': (r) => r.status === 200,
      'GET /contacts has data': (r) => r.body.length > 0,
    },
    'GET /contacts'
  );
  sleep(1);

  // Test 2: POST /contacts (create contact)
  const email = generateUniqueEmail();
  const createRes = createContact(
    'Smoke Test User',
    email,
    '11999999999'
  );
  checkResponse(
    createRes,
    {
      'POST /contacts returns 201': (r) => r.status === 201 || r.status === 200,
      'POST /contacts creates contact': (r) => r.body.length > 0,
    },
    'POST /contacts'
  );

  // Extract contact ID from response
  let contactId = null;
  try {
    const createdContact = JSON.parse(createRes.body);
    contactId = createdContact.id || createdContact.ID;
  } catch (e) {
    log(`Failed to parse contact ID from POST response: ${e.message}`, 'warn');
  }

  sleep(1);

  // Test 3: GET /contacts/{id} (get specific contact)
  if (contactId) {
    const getRes = getContact(contactId);
    checkResponse(
      getRes,
      {
        'GET /contacts/{id} returns 200': (r) => r.status === 200,
        'GET /contacts/{id} has data': (r) => r.body.length > 0,
      },
      `GET /contacts/${contactId}`
    );
  }

  sleep(1);
}

export function teardown(data) {
  log('Smoke test complete', 'info');
}
