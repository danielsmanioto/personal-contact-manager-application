// Reusable API functions for Contact Manager
// Used by all k6 scenarios

import http from 'k6/http';
import { BASE_URL } from './constants.js';

/**
 * List all contacts
 * GET /contacts
 */
export function listContacts(params = {}) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const url = `${BASE_URL}/contacts?page=${page}&limit=${limit}`;

  return http.get(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Get a specific contact by ID
 * GET /contacts/{id}
 */
export function getContact(id) {
  return http.get(`${BASE_URL}/contacts/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create a new contact
 * POST /contacts
 */
export function createContact(name, email, phone, params = {}) {
  const payload = JSON.stringify({
    name: name || `Test User ${Math.random().toString(36).substring(7)}`,
    email: email || `test${Date.now()}${Math.random().toString(36).substring(2)}@example.com`,
    phone: phone || generatePhone(),
    ...params,
  });

  return http.post(`${BASE_URL}/contacts`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Update an existing contact
 * PUT /contacts/{id}
 */
export function updateContact(id, updates) {
  const payload = JSON.stringify(updates);

  return http.put(`${BASE_URL}/contacts/${id}`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Delete a contact
 * DELETE /contacts/{id}
 */
export function deleteContact(id) {
  return http.delete(`${BASE_URL}/contacts/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Search contacts by name
 * GET /contacts/search?q=query
 */
export function searchContacts(query) {
  const url = `${BASE_URL}/contacts/search?q=${encodeURIComponent(query)}`;

  return http.get(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Health check - verify API is responding
 * GET /health
 */
export function healthCheck() {
  return http.get(`${BASE_URL}/../health`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Helper functions

function generatePhone() {
  return `11${Math.random().toString().substring(2, 11)}`;
}

export function generateUniqueEmail() {
  return `perf-test-${Date.now()}-${Math.random().toString(36).substring(2, 8)}@test.local`;
}

export function generateUniqueContactName() {
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}

export default {
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  searchContacts,
  healthCheck,
  generateUniqueEmail,
  generateUniqueContactName,
};
