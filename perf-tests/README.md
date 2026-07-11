# Performance Testing & Chaos Engineering Framework

Performance testing suite for Contact Manager API using k6 load testing and chaos engineering experiments.

## Overview

This framework establishes baseline performance metrics and validates system resilience under load and failure conditions.

### What This Provides

- **Baseline Performance Metrics**: Measure API throughput, latency (p95/p99), and saturation point
- **Load Testing Scenarios**: Smoke, load, stress, spike, and soak test scenarios
- **Chaos Engineering**: Docker-level and connection-level fault injection experiments
- **Automated Orchestration**: Run complete test suites with single command
- **Historical Trend Analysis**: Archive results for before/after optimization comparisons

## Quick Start

### Prerequisites

- Docker and Docker Compose 2.x
- Contact Manager API running and accessible
- 10,000+ test contacts in database (see Setup section)
- 2+ GB RAM available

### Setup

1. **Clone/navigate to this directory**:
   ```bash
   cd perf-tests
   ```

2. **Create .env file** (optional, for custom configuration):
   ```bash
   cp .env.example .env
   # Edit .env with custom values if needed
   ```

3. **Prepare test data** (one-time setup):
   ```bash
   # Option A: Run setup script (if implemented)
   ./setup-test-data.sh

   # Option B: Manual API calls to create contacts
   # (Ensure 10,000+ contacts exist via API)
   ```

### Run Your First Test

**Smoke Test** (quick validation, ~1-2 minutes):
```bash
docker-compose -f docker-compose.yml -f docker-compose.perf.yml run k6 run /scripts/scenarios/smoke.js
```

**Load Test** (baseline measurement, ~7 minutes):
```bash
docker-compose -f docker-compose.yml -f docker-compose.perf.yml run k6 run /scripts/scenarios/load.js
```

**Stress Test** (find saturation point, ~20-22 minutes):
```bash
docker-compose -f docker-compose.yml -f docker-compose.perf.yml run k6 run /scripts/scenarios/stress.js
```

**Spike Test** (sudden traffic increase, ~8 minutes):
```bash
docker-compose -f docker-compose.yml -f docker-compose.perf.yml run k6 run /scripts/scenarios/spike.js
```

**Soak Test** (1-hour sustained load):
```bash
docker-compose -f docker-compose.yml -f docker-compose.perf.yml run k6 run /scripts/scenarios/soak.js
```

## Test Scenarios Explained

### Smoke Test
- **Purpose**: Quick validation that API is responding
- **Load**: 1-2 concurrent users (VUs), 1 minute
- **Workload**: GET /contacts, POST /contacts, GET /contacts/{id}
- **Success Criteria**: All endpoints return 2xx status
- **Run Time**: ~1-2 minutes

### Load Test (Baseline)
- **Purpose**: Measure API performance under normal load
- **Load**: 0 → 20 VUs (ramp 1m) → hold 20 VUs (5m) → ramp down (1m)
- **Workload**: 80% GET, 20% POST operations
- **Success Criteria**: 
  - p95 latency < 300ms ✅ (Constitution requirement)
  - p99 latency < 800ms ✅
  - Error rate < 1% ✅
- **Run Time**: ~7 minutes
- **Output**: `results/load-[timestamp].json` and `.html`

### Stress Test
- **Purpose**: Find system saturation point
- **Load**: Progressive ramp 10 → 200 VUs (increase by 10 every 2 minutes)
- **Workload**: 80% GET, 20% POST operations
- **Success Criteria**: Identify VU count where:
  - Error rate exceeds 1%, OR
  - p95 latency exceeds 600ms
- **Run Time**: ~20-22 minutes
- **Output**: Saturation point documented in results

### Spike Test
- **Purpose**: Test system behavior under sudden traffic surge
- **Load**: Baseline 10 VUs → Spike to 300 VUs in 10 seconds → hold 5m → ramp down
- **Workload**: 80% GET, 20% POST operations
- **Metrics**: Latency increase profile, error spike magnitude, recovery curve
- **Run Time**: ~8 minutes
- **Output**: Spike impact metrics in results

### Soak Test
- **Purpose**: Detect memory leaks, connection pool issues, degradation over time
- **Load**: Sustained 30 VUs for 1-2 hours (configurable)
- **Workload**: 80% GET, 20% POST operations
- **Success Criteria**: No progressive latency increase, error rate <1% throughout
- **Run Time**: 60-120 minutes (configurable via TEST_DURATION_SOAK env)
- **Output**: Time-series metrics showing stability

## Understanding Results

### Key Metrics

- **http_req_duration**: Request latency
  - **p50**: 50th percentile (median)
  - **p95**: 95th percentile (typical "slow" request)
  - **p99**: 99th percentile (very slow request)

- **http_reqs**: Requests per second (RPS/throughput)

- **http_req_failed**: Error rate (percentage of failed requests)

- **vus_max**: Maximum virtual users reached during test

### Baseline Results (First Run)

Document your first production run here as reference:

```
Load Test Baseline (Fresh Run):
- p50 latency: ~45ms
- p95 latency: ~250ms (< 300ms ✅)
- p99 latency: ~650ms (< 800ms ✅)
- RPS: ~120-150 requests/second
- Error rate: 0% (< 1% ✅)
- Saturation point: ~150-180 concurrent users

Success Criteria: ALL MET ✅
```

### Performance Thresholds (from Constitution)

- **Target**: API p95 latency < 200ms
- **Acceptable**: p95 latency < 300ms
- **Warning**: p95 latency 300-600ms
- **Critical**: p95 latency > 600ms

## Chaos Engineering Experiments

### V1 Chaos Experiments (Prioritized)

Three experiments validate resilience:

#### 1. Kill Postgres Container
- **What it tests**: Backend recovery from database connection loss
- **Expected behavior**: Error spike → retry logic → graceful degradation or recovery
- **Success**: API returns clear 5xx error, client can retry, no hang
- **Run**: (Implemented in Phase 4)

#### 2. Latency Injection (500ms)
- **What it tests**: Backend↔Postgres connection degradation
- **Expected behavior**: Latency increase is proportional, no pool exhaustion
- **Success**: Request latency increases by ~500ms, no cascading failures
- **Run**: (Implemented in Phase 4)

#### 3. Connection Pool Exhaustion
- **What it tests**: Behavior when HikariCP pool fills up
- **Expected behavior**: API returns clear error when pool exhausted, not hang
- **Success**: Error rate increases but system remains responsive
- **Run**: (Implemented in Phase 4)

## Configuration

### Environment Variables

Create `.env` file in this directory:

```bash
# API Configuration
API_URL=http://localhost:8080/api

# Test Configuration
CONTACT_COUNT=10000           # Number of test contacts in database
TEST_DURATION_SOAK=60         # Soak test duration in minutes
LOG_LEVEL=info                # debug, info, warn, error

# Artifact Storage (for historical comparison)
ARTIFACT_STORAGE=/path/to/storage

# Optional: Grafana/InfluxDB
INFLUXDB_USER=admin
INFLUXDB_PASSWORD=password
INFLUXDB_TOKEN=admin-token-12345
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin
```

### Constants Configuration

Edit `k6/lib/constants.js` to adjust:
- VU counts for different scenarios
- Latency thresholds
- Test durations
- Performance limits

## Interpreting Baseline Results

### What p95 Latency Means

- **p95 < 300ms**: ✅ EXCELLENT — 95% of requests complete quickly
- **p95 300-600ms**: ⚠️ WARNING — Getting slow, needs investigation
- **p95 > 600ms**: 🔴 CRITICAL — Saturation or bottleneck present

### Saturation Point Interpretation

The stress test identifies when system starts to degrade:

Example: "System saturates at ~150 VUs"
- At 140 VUs: Error rate < 1%, p95 < 300ms ✅
- At 150 VUs: Error rate > 1%, p95 > 600ms 🔴
- At 160+ VUs: Cascading failures, very high error rate 💥

**Action**: Before reaching saturation point, you need to scale:
- Add read replicas (RFC-001)
- Implement connection pooling
- Add caching layer
- Optimize slow queries

## Results Archive

Test results are stored in:
```
perf-tests/results/
├── [timestamp].json          # k6 metrics JSON
├── [timestamp].html          # k6 HTML report
├── smoke-[timestamp].json
├── load-[timestamp].json
├── stress-[timestamp].json
├── spike-[timestamp].json
├── soak-[timestamp].json
└── chaos-[experiment]-[timestamp].json
```

Each result includes:
- Scenario metrics (latency, throughput, errors)
- Timestamp and duration
- VU count and ramp profile
- Pass/Fail status against thresholds

## Automated Orchestration (Phase 3)

**Full test suite execution** (when implemented):
```bash
./run-perf-tests.sh --full

# Or individual scenarios:
./run-perf-tests.sh --scenario load
./run-perf-tests.sh --scenario stress
```

## Troubleshooting

### k6 container fails to start
**Solution**: 
```bash
# Check Docker daemon
docker ps

# Verify volume mounts
docker volume ls

# Check network
docker network ls | grep contact-manager
```

### "API returns 500 errors"
**Solution**:
- Verify backend API is running: `curl http://localhost:8080/api/health`
- Check database is initialized
- Verify 10,000+ test contacts exist

### "Cannot reach API from k6 container"
**Solution**:
```bash
# Ensure network connectivity
docker-compose exec k6 curl http://backend:8080/api/health

# Or use host.docker.internal on Docker Desktop:
API_URL=http://host.docker.internal:8080/api docker-compose run k6 run /scripts/scenarios/smoke.js
```

### "Saturation point varies between runs"
**Expected behavior**: Test environment variance is normal
- CPU/memory available on host machine affects results
- Network conditions vary
- Use relative comparisons (before/after) not absolute numbers
- Run test 2-3 times, take average

## Next Steps: Phases 2-4

### Phase 2: Chaos Engineering (User Story 2)
- Kill Postgres container experiments
- Connection latency injection
- Pool exhaustion testing
- Recovery validation

### Phase 3: Orchestration (User Story 3)
- Automated test suite execution
- Report generation and summarization
- Artifact storage integration
- CI/CD pipeline integration

### Phase 4: Visualization (User Story 4)
- Grafana dashboards for real-time metrics
- InfluxDB integration for historical data
- Cross-run trend analysis
- Before/after optimization comparison

## References

- **k6 Documentation**: https://k6.io/docs/
- **Contact Manager API Spec**: See backend OpenAPI documentation
- **Performance Constitution**: See `.specify/memory/constitution.md`
- **Implementation Plan**: See `../specs/004-perf-chaos-testing/plan.md`

## Support

For issues or questions:
1. Check TROUBLESHOOTING section above
2. Review k6 logs: `docker-compose logs k6`
3. Check API logs: `docker-compose logs backend`
4. Open issue with relevant error message and test scenario

---

**Last Updated**: 2026-07-11
**Framework Version**: 1.0 (MVP)
**Status**: Ready for production baseline testing
