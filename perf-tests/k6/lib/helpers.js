// Helper utilities for k6 performance testing

import { check } from 'k6';
import { LOG_LEVEL, SATURATION_THRESHOLDS } from './constants.js';

/**
 * Log messages with configurable verbosity
 */
export function log(message, level = 'info') {
  const levels = { debug: 0, info: 1, warn: 2, error: 3 };
  const currentLevel = levels[LOG_LEVEL] || 1;
  const messageLevel = levels[level] || 1;

  if (messageLevel >= currentLevel) {
    console.log(`[${level.toUpperCase()}] ${new Date().toISOString()} - ${message}`);
  }
}

/**
 * Perform k6 check with automatic logging
 */
export function checkResponse(response, checks, scenarioName = '') {
  const result = check(response, checks);
  if (!result) {
    log(`❌ Check failed for ${scenarioName}: ${JSON.stringify(checks)}`, 'warn');
  }
  return result;
}

/**
 * Parse and extract key metrics from response
 */
export function extractMetrics(response) {
  try {
    const body = JSON.parse(response.body);
    return {
      statusCode: response.status,
      contentLength: response.body.length,
      timings: response.timings,
      body: body,
    };
  } catch (e) {
    return {
      statusCode: response.status,
      contentLength: response.body.length,
      timings: response.timings,
      body: null,
      error: 'Failed to parse JSON',
    };
  }
}

/**
 * Generate unique test email
 */
export function generateUniqueEmail(prefix = 'test') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}@perf-test.local`;
}

/**
 * Generate random phone number
 */
export function generateUniquePhone() {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const exchange = Math.floor(Math.random() * 900) + 100;
  const lineNumber = Math.floor(Math.random() * 9000) + 1000;
  return `+55${areaCode}${exchange}${lineNumber}`;
}

/**
 * Generate random contact name
 */
export function generateUniqueContactName() {
  const firstNames = [
    'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry',
    'Iris', 'Jack', 'Karen', 'Leo', 'Mia', 'Nathan', 'Olivia', 'Peter',
  ];
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Taylor',
  ];
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}

/**
 * Sleep for a specified duration
 */
export function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

/**
 * Format duration from seconds to human-readable format
 */
export function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.join(' ') || '0s';
}

/**
 * Parse latency from metrics and check against thresholds
 */
export function isSystemSaturated(latencyMs, errorRate) {
  const latencySaturated = latencyMs > SATURATION_THRESHOLDS.p95LatencyMax;
  const errorSaturated = errorRate > SATURATION_THRESHOLDS.errorRateMax;

  return {
    saturated: latencySaturated || errorSaturated,
    reasons: [
      latencySaturated && `p95 latency (${latencyMs}ms) exceeds threshold (${SATURATION_THRESHOLDS.p95LatencyMax}ms)`,
      errorSaturated && `error rate (${(errorRate * 100).toFixed(2)}%) exceeds threshold (${(SATURATION_THRESHOLDS.errorRateMax * 100).toFixed(2)}%)`,
    ].filter(Boolean),
  };
}

/**
 * Create a report section for test results
 */
export function reportSectionStart(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60));
}

export function reportSectionEnd() {
  console.log('='.repeat(60) + '\n');
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Calculate percentile from array of values
 */
export function calculatePercentile(values, percentile) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

export default {
  log,
  checkResponse,
  extractMetrics,
  generateUniqueEmail,
  generateUniquePhone,
  generateUniqueContactName,
  sleep,
  formatDuration,
  isSystemSaturated,
  reportSectionStart,
  reportSectionEnd,
  formatBytes,
  calculatePercentile,
};
