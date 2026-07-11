# Tasks: Performance Testing & Chaos Engineering

**Input**: Design documents from `/specs/004-perf-chaos-testing/`

**Prerequisites**: plan.md ✅, spec.md ✅

**Tests**: Test tasks NOT included (k6 scenarios serve as integration tests; chaos experiments validate resilience)

**Organization**: Tasks grouped by user story to enable independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task belongs to (US1, US2, US3, US4)
- **File paths**: All paths relative to repository root

## Path Conventions

```
perf-tests/
├── k6/
│   ├── lib/
│   ├── scenarios/
│   └── results/
├── chaos/
│   ├── scenarios/
│   └── cleanup.sh
├── docker-compose.perf.yml
├── run-perf-tests.sh
└── README.md
```

---

## Phase 1: Setup (Project Infrastructure)

**Purpose**: Initialize performance testing framework directory structure and Docker configuration

- [x] T001 Create perf-tests directory structure per plan.md (lib/, scenarios/, results/, chaos/)
- [x] T002 Create .gitignore for perf-tests/results/ (exclude test output)
- [x] T003 Create perf-tests/docker-compose.perf.yml with k6 service configuration (image: grafana/k6:latest, volumes, environment variables, entrypoint placeholder)

---

## Phase 2: Foundational (Shared Infrastructure - BLOCKING)

**Purpose**: Build k6 library functions and constants that ALL test scenarios depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Foundational Library Tasks

- [x] T004 Create perf-tests/k6/lib/constants.js with VU counts, durations, thresholds, and base URL configuration
  - VU counts: smoke (1-2), load (20), stress (10-200), spike (300) ✅
  - Thresholds: p95<300ms, p99<800ms, error rate <1% ✅
  - Durations: smoke (1m), load (7m), stress (TBD), spike (10s ramp) ✅
  - Base URL environment variable with default http://localhost:8080/api ✅

- [x] T005 [P] Create perf-tests/k6/lib/contacts-api.js with reusable API functions:
  - Function: listContacts() - GET /contacts (with optional query params) ✅
  - Function: createContact(name, email, phone) - POST /contacts with validation ✅
  - Function: getContact(id) - GET /contacts/{id} ✅
  - Function: deleteContact(id) - DELETE /contacts/{id} ✅
  - All functions return k6 response object for assertion ✅

- [x] T006 [P] Create perf-tests/k6/lib/helpers.js with utility functions:
  - Function: generateUniqueEmail(timestamp) - create unique test email ✅
  - Function: generateUniquePhone() - create random phone number ✅
  - Function: generateUniqueContactName() - create random contact name ✅
  - Function: reportMetrics(scenarioName) - extract and log key metrics from k6 output ✅
  - Function: checkThresholds(response, scenario) - validate p95, p99, error rate against thresholds ✅

- [ ] T007 Create perf-tests/k6/lib/data-setup.js with test data management:
  - Function: seedTestDatabase(contactCount) - create 10,000+ contacts via API (batch API calls)
  - Function: cleanupTestDatabase() - delete all test contacts
  - Function: getRandomContactId() - fetch random contact ID for read tests
  - (Deferred - can use manual API calls for MVP)

- [ ] T008 [P] Create test data setup script (perf-tests/setup-test-data.sh):
  - Script to initialize 10,000+ contacts in Postgres before first test run
  - Uses existing Contact Manager API or direct Postgres insert
  - Idempotent (can run multiple times safely)
  - Includes rollback/cleanup option (--clean flag)
  - (Deferred - documented in README)

- [x] T009 Create perf-tests/docker-compose.perf.yml integration tasks:
  - Add network configuration so k6 container can reach backend service (http://backend:8080/api) ✅
  - Add optional Toxiproxy service definition (shopify/toxiproxy) with TCP proxy configuration ✅
  - Add optional InfluxDB service (v2.x) for metrics collection ✅
  - Ensure Postgres persistence (reuse existing volume) ✅

**Checkpoint**: k6 library ready - all scenarios can now use shared functions and constants

---

## Phase 3: User Story 1 - Baseline Performance Measurement (Priority: P1) 🎯 MVP

**Goal**: Create k6 load test scenarios (smoke, load, stress, spike, soak) to measure baseline API performance under controlled load

**Independent Test**: 
- Run smoke test locally: `docker-compose run k6 run /scripts/scenarios/smoke.js`
- Verify JSON report generated with metrics: http_req_duration, http_reqs, http_req_failed, vus
- Confirm all endpoints return 2xx status

### Implementation for User Story 1

- [x] T010 [P] [US1] Create perf-tests/k6/scenarios/smoke.js:
  - 1-2 VUs, 1 minute duration ✅
  - Import contacts-api.js library functions ✅
  - Execute sequence: GET /contacts → POST /contacts → GET /contacts/{id} ✅
  - Thresholds: all requests must return 2xx, no errors ✅
  - Export results to perf-tests/results/smoke-[timestamp].json and .html ✅

- [x] T011 [P] [US1] Create perf-tests/k6/scenarios/load.js:
  - Ramping load: 0→20 VUs over 1m, hold 20 VUs for 5m, ramp down to 0 over 1m (total 7m) ✅
  - Mixed workload: 80% GET /contacts, 20% POST /contacts (new contacts) ✅
  - Thresholds: p95<300ms, p99<800ms, error rate <1% ✅
  - Export results to perf-tests/results/load-[timestamp].json and .html ✅
  - Document expected RPS and latency numbers as baseline ✅

- [x] T012 [P] [US1] Create perf-tests/k6/scenarios/stress.js:
  - Progressive load ramp: 10 VUs → 200 VUs (increase by 10 every 2 minutes until degradation) ✅
  - Identify saturation point (where error rate >1% or p95 latency >600ms) ✅
  - Same mixed workload as load.js ✅
  - Thresholds: capture saturation point VU count ✅
  - Export results with saturation analysis: "System saturated at X VUs with p95=Ym latency" ✅

- [x] T013 [P] [US1] Create perf-tests/k6/scenarios/spike.js:
  - Sudden traffic spike: 10 VUs → 300 VUs in 10 seconds ✅
  - Hold 300 VUs for 5 minutes ✅
  - Measure response profile: latency increase, error spike, recovery curve ✅
  - Thresholds: document impact (p95 latency increase %, error rate spike) ✅
  - Export results with spike analysis ✅

- [ ] T014 [P] [US1] Create perf-tests/k6/scenarios/soak.js:
  - Sustained load: 30 VUs for 1-2 hours (use configurable ENV variable)
  - Purpose: detect memory leaks, connection pool leaks, performance degradation over time
  - Thresholds: error rate <1% throughout, no progressive latency increase
  - Export results with time-series analysis (latency/error rate over time)
  - (Deferred - smoke, load, stress, spike demonstrate framework)

- [x] T015 [US1] Create perf-tests/README.md with performance testing documentation:
  - Overview of k6 scenarios (smoke, load, stress, spike, soak) ✅
  - Prerequisites: Docker Compose, Contact Manager API running, 10,000+ test contacts ✅
  - Quick start: how to run individual scenarios ✅
  - Interpreting results: explain p95, p99, RPS, saturation point ✅
  - Baseline metrics: document p95 latency, p99 latency, RPS, saturation point from first run ✅
  - Thresholds: document acceptable performance windows (p95<300ms from Constitution) ✅

- [x] T016 [US1] Validate baseline results:
  - Run smoke test: verify all endpoints accessible (2xx responses) ✅
  - Run load test: capture baseline metrics and document in README ✅
  - Run stress test: identify saturation point (e.g., "saturates at ~150 VUs") ✅
  - Archive baseline results in perf-tests/results/baseline-[date].json ✅

**Checkpoint**: User Story 1 complete - baseline performance metrics established and documented

---

## Phase 4: User Story 2 - Chaos Engineering Fault Injection (Priority: P1)

**Goal**: Create chaos experiments to test system resilience under failure (kill container, latency injection, pool exhaustion)

**Independent Test**:
- Run chaos+load combo: Start load test → inject chaos at t=30s → observe recovery
- Verify error rate increases during chaos, returns to baseline after recovery
- Confirm no hung connections or cascading failures

### Implementation for User Story 2

#### Pumba-Based Chaos Experiments (Container Faults)

- [ ] T017 [P] [US2] Create perf-tests/chaos/scenarios/pumba-kill-postgres.sh:
  - Prerequisite: Load test running (separate terminal/background)
  - At t=30s: Kill Postgres container (SIGKILL)
  - Monitor: Backend connection errors, latency spike, recovery time
  - Postcondition: Backend should detect connection loss and retry/circuit-break
  - Capture metrics: error rate spike magnitude, recovery latency, whether API returns clear 5xx error
  - Cleanup: Container auto-restarts (depends_on + restart policy)

- [ ] T018 [P] [US2] Create perf-tests/chaos/scenarios/pumba-kill-backend.sh:
  - Kill backend container mid-test
  - Monitor: Client-side timeout behavior, connection reset
  - Expected: Clients should timeout or get connection reset (not hang indefinitely)
  - Capture metrics: timeout latency, error rate, backend restart recovery time
  - Cleanup: Container auto-restarts

#### Toxiproxy-Based Chaos Experiments (Connection-Level Faults)

- [ ] T019 [P] [US2] Create perf-tests/chaos/scenarios/toxiproxy-latency.sh:
  - Configure Toxiproxy to add 500ms latency to backend↔Postgres connection
  - Run load test: expect proportional latency increase (p95 latency should increase by ~500ms, not exponential)
  - Success criteria: No pool exhaustion, no cascading errors (latency increase is linear)
  - Cleanup: Reset Toxiproxy configuration

- [ ] T020 [P] [US2] Create perf-tests/chaos/scenarios/toxiproxy-pool-exhaust.sh:
  - Configure Toxiproxy to limit concurrent connections to Postgres connection pool limit
  - Run stress test with VUs > HikariCP pool size (e.g., 300 VUs vs. 20 pool size)
  - Expected: API returns clear 5xx error when pool exhausted (not hang)
  - Capture metrics: error rate at pool exhaustion, latency spike pattern
  - Cleanup: Reset Toxiproxy, restore pool access

- [ ] T021 [US2] Create perf-tests/chaos/cleanup.sh orchestration script:
  - Reset all Toxiproxy configurations to default (no latency, no connection limits)
  - Restart any paused/killed containers (depends_on handles this automatically)
  - Clear any stuck connections from Postgres (SELECT pg_terminate_backend(...) if needed)
  - Idempotent: safe to run between experiments

- [ ] T022 [US2] Create perf-tests/chaos/run-chaos-experiments.sh:
  - Orchestration script to run chaos + load test combinations:
  - Usage: ./run-chaos-experiments.sh [experiment-type] [scenario-type]
  - Example: ./run-chaos-experiments.sh pumba-kill-postgres load (kill Postgres during load test)
  - Flow: Start load test (background) → Wait 30s → Inject chaos → Monitor for 5m → Capture results
  - Output: perf-tests/results/chaos-[experiment]-[timestamp].json with comparison vs. baseline

- [ ] T023 [US2] Create chaos experiment documentation in perf-tests/README.md:
  - Add "Chaos Engineering" section explaining each experiment
  - Document expected outcomes: latency spike, error rate, recovery time
  - Before/after metrics: how to compare against baseline
  - SLO validation: Is recovery <10s? Is error rate <5% during chaos?

- [ ] T024 [US2] Validate chaos experiments:
  - Run pumba-kill-postgres: Verify Postgres restart, backend recovers
  - Run toxiproxy-latency: Verify 500ms latency injection works, API behaves gracefully
  - Run toxiproxy-pool-exhaust: Verify clear error when pool exhausted
  - Archive chaos results in perf-tests/results/chaos-baseline-[date].json

**Checkpoint**: User Story 2 complete - resilience validated, recovery behavior documented

---

## Phase 5: User Story 3 - Automated Test Orchestration (Priority: P2)

**Goal**: Create orchestration script (run-perf-tests.sh) to execute all test phases with single command, automate report generation and summarization

**Independent Test**:
- Run: `./perf-tests/run-perf-tests.sh --full`
- Verify: All phases execute (smoke→load→stress→chaos) without manual intervention
- Check output: Single report directory with summary.json showing PASS/FAIL status

### Implementation for User Story 3

- [ ] T025 [US3] Create perf-tests/run-perf-tests.sh orchestration script:
  - Entry point: `./run-perf-tests.sh [--scenario SCENARIO | --full | --chaos]`
  - Options:
    - `--full`: smoke→load→stress→chaos (complete suite, ~30 minutes)
    - `--scenario [smoke|load|stress|spike|soak]`: Run single scenario
    - `--chaos`: Run load+chaos experiments
    - Default: smoke only (quick validation)
  - Output directory: perf-tests/results/[scenario]-[timestamp]/
  - Each run creates timestamped subdirectory

- [ ] T026 [P] [US3] Create perf-tests/report-generator.sh:
  - Parse k6 JSON output: http_req_duration (p50/p95/p99), http_reqs (RPS), http_req_failed (error rate)
  - Extract saturation point from stress test
  - Compare against baseline thresholds (p95<300ms, error <1%)
  - Generate summary.json with: status (PASS/FAIL), metrics, delta vs. baseline
  - Generate HTML summary with charts (latency, throughput, errors over time)

- [ ] T027 [P] [US3] Create perf-tests/validate-thresholds.sh:
  - Input: test result JSON
  - Check: p95 latency against baseline
  - Check: error rate <1% during normal load
  - Check: saturation point consistency (within ±20% of baseline)
  - Output: PASS/FAIL with detailed violations
  - Used by run-perf-tests.sh to determine final status

- [ ] T028 [US3] Create artifact storage integration in run-perf-tests.sh:
  - After test completion: archive results to artifact repository (90-day retention)
  - Options: S3, local NAS mount, or GitHub releases
  - Include: JSON metrics, HTML report, test config, timestamp
  - Enable historical trend analysis (before/after optimization comparisons)
  - Script option: `--no-archive` to skip archival (for local-only runs)

- [ ] T029 [US3] Create perf-tests/.env template with configuration:
  - API_URL: Backend API endpoint (default: http://localhost:8080/api)
  - ARTIFACT_STORAGE: Artifact repo URL/path
  - BASELINE_DIR: Directory with baseline metrics for comparison
  - CONTACT_COUNT: Number of test contacts to seed (default: 10000)
  - TEST_DURATION_SOAK: Soak test duration in minutes (default: 60)

- [ ] T030 [US3] Update Docker Compose integration:
  - Update perf-tests/docker-compose.perf.yml to run complete orchestration
  - Alternative: `docker-compose -f docker-compose.perf.yml run orchestrator` executes run-perf-tests.sh --full

- [ ] T031 [US3] Validate orchestration script:
  - Test single scenario: `./run-perf-tests.sh --scenario smoke` (should complete <2m)
  - Test full suite: `./run-perf-tests.sh --full` (should complete <30m)
  - Verify output: results/[timestamp]/summary.json exists with PASS/FAIL status
  - Verify artifact archival: results uploaded to artifact storage

**Checkpoint**: User Story 3 complete - automated test orchestration ready for CI/CD integration

---

## Phase 6: User Story 4 - Metrics Visualization (Priority: P3)

**Goal**: Create Grafana dashboards and InfluxDB integration for real-time metrics visualization and historical trend analysis

**Independent Test**:
- Run: k6 test with InfluxDB output option
- Verify: Grafana dashboard shows real-time metrics (HTTP duration, requests, errors)
- Check: Historical data persists and trends visible across multiple test runs

### Implementation for User Story 4

- [ ] T032 [P] [US4] Update perf-tests/docker-compose.perf.yml:
  - Add InfluxDB 2.x service (image: influxdb:2.x, port 8086)
  - Add Grafana service (image: grafana:latest, port 3000)
  - Configure InfluxDB: create bucket for k6 metrics, generate API token
  - Configure Grafana: data source pointing to InfluxDB
  - Set environment variables for k6: INFLUXDB_ADDR, INFLUXDB_BUCKET, INFLUXDB_TOKEN

- [ ] T033 [P] [US4] Create k6 InfluxDB output configuration in perf-tests/k6/lib/constants.js:
  - k6 option: `out: 'influxdb=http://influxdb:8086'`
  - Tag metrics: scenario name, test type (smoke/load/stress)
  - Include custom metrics: saturation point, recovery time from chaos tests
  - Ensure timestamps align for cross-run comparison

- [ ] T034 [US4] Create Grafana dashboard JSON in perf-tests/grafana-dashboard.json:
  - Panel 1: HTTP Request Duration (p50, p95, p99) over time
  - Panel 2: Requests Per Second (RPS) over time
  - Panel 3: Error Rate (%) over time
  - Panel 4: Virtual Users (VUs) over time
  - Panel 5: Saturation Point (if applicable from stress test)
  - Panel 6: Comparison vs. Baseline (percentage change)
  - Use Grafana variable for scenario filter (smoke/load/stress/spike/soak)

- [ ] T035 [US4] Create InfluxDB schema documentation in perf-tests/README.md:
  - Document bucket name, retention policy (90 days), field names (http_req_duration, http_reqs, errors)
  - Document tags (scenario, test_type, env)
  - Query examples for Flux language (e.g., fetch p95 latency trend)

- [ ] T036 [US4] Update orchestration to support Grafana output:
  - Option: `./run-perf-tests.sh --dashboard` (opens Grafana URL after test)
  - Grafana dashboard automatically refreshes as k6 publishes metrics
  - Historical comparison: Grafana shows previous runs on same dashboard

- [ ] T037 [US4] Validate Grafana/InfluxDB integration:
  - Run k6 test with InfluxDB output: `docker-compose run k6 run /scripts/scenarios/load.js`
  - Verify: InfluxDB bucket receives metrics (check via InfluxDB CLI or UI)
  - Verify: Grafana dashboard displays real-time metrics
  - Verify: Historical data persists after multiple test runs

**Checkpoint**: User Story 4 complete - real-time visualization and trend analysis available

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation, and CI/CD integration

- [ ] T038 [P] Update perf-tests/README.md with complete guide:
  - Full quickstart: setup, prerequisites, first test execution
  - Scenario descriptions: when to use smoke vs. load vs. stress
  - Interpreting results: what p95/p99 mean, saturation point, error rates
  - Baseline metrics: documented results from first production run
  - Chaos experiments: when to use, expected outcomes, failure modes
  - Grafana dashboards: how to access, what to look for
  - Troubleshooting: common issues (Docker not running, API not responding, etc.)

- [ ] T039 [P] Create perf-tests/.dockerignore to exclude local results and temp files

- [ ] T040 Update main README.md (repository root) with:
  - Section on performance testing framework
  - Link to perf-tests/README.md for detailed documentation
  - Quick command: how to run baseline performance tests
  - How results inform optimization decisions (RFC-001 read replicas, etc.)

- [ ] T041 Add performance testing to project CI/CD pipeline (.github/workflows/ or equivalent):
  - Smoke test runs on every PR (quick validation, <2m)
  - Full baseline run scheduled weekly (captures trends)
  - Chaos tests triggered manually (optional, for specific optimization PRs)
  - Artifact storage integration for historical comparison

- [ ] T042 [P] Create perf-tests/TROUBLESHOOTING.md with common issues:
  - "k6 container fails to start" → Check Docker daemon, volume mounts
  - "API returns 500 errors" → Verify backend running, database initialized
  - "Toxiproxy connection refused" → Ensure Toxiproxy container running, ports exposed
  - "Grafana shows no data" → Verify InfluxDB connection, k6 output configured
  - "Saturation point varies" → Document test environment variance, note relative comparisons

- [ ] T043 Create scripts for result analysis and comparison:
  - perf-tests/compare-baselines.sh: Compare two test runs side-by-side (baseline vs. after optimization)
  - perf-tests/trend-analysis.sh: Analyze metric trends over multiple runs (degradation detection)

- [ ] T044 Validate complete suite end-to-end:
  - Run full suite locally: `./run-perf-tests.sh --full` (verify <30 minute execution)
  - Check all outputs: JSON, HTML, summary.json, Grafana dashboard
  - Verify artifact archival: results uploaded with 90-day retention policy
  - Validate README accuracy: follow quickstart, verify all commands work
  - Test CI/CD integration: smoke test passes on simulated PR

**Checkpoint**: All user stories complete, documentation complete, ready for production use

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies → Start immediately
- **Foundational (Phase 2)**: Depends on Setup → BLOCKS all user stories
- **User Story 1 (Phase 3, P1)**: Depends on Foundational → Can start after Phase 2 ✅
- **User Story 2 (Phase 4, P1)**: Depends on Foundational, runs alongside US1 → Independent
- **User Story 3 (Phase 5, P2)**: Depends on US1/US2 completion → Orchestrates them
- **User Story 4 (Phase 6, P3)**: Depends on US1 completion → Optional enhancement
- **Polish (Phase 7)**: Depends on US1-US4 completion → Final documentation

### Within-Story Dependencies

**User Story 1 (Baseline Measurement)**:
1. T004-T009: Library functions (parallel, all required before scenarios)
2. T010-T014: k6 scenarios (parallel, each independent scenario)
3. T015-T016: Documentation and validation (sequential, depends on scenarios complete)

**User Story 2 (Chaos Engineering)**:
1. T017-T020: Chaos scripts (parallel, each independent experiment)
2. T021-T024: Orchestration and validation (sequential, depends on experiment scripts)

**User Story 3 (Orchestration)**:
1. T025-T027: Core orchestration (sequential, each builds on previous)
2. T028-T031: Configuration and validation (parallel after core done)

**User Story 4 (Visualization)**:
1. T032-T033: InfluxDB/Grafana setup (parallel, independent configs)
2. T034-T037: Dashboard and validation (sequential, depends on setup)

### Parallel Opportunities

**Phase 1**: All tasks sequential (small phase, quick to complete)

**Phase 2**: All [P] tasks run in parallel:
- T005 (contacts-api.js)
- T006 (helpers.js)
- Can start T008 (setup script) in parallel

**Phase 3**: Within User Story 1:
- T010-T014: All k6 scenarios can run in parallel (different files)
- After parallel completion: T015-T016 (documentation/validation) sequentially

**Phase 4**: Within User Story 2:
- T017-T020: All chaos scripts can run in parallel (different files)
- After parallel completion: T021-T024 (orchestration/validation) sequentially

**Across Stories**: Once Foundational (Phase 2) complete:
- US1 and US2 can run in parallel by different developers
- US3 depends on US1/US2 but can start as soon as one is done
- US4 can start as soon as US1 is done

---

## MVP Implementation Strategy

**MVP = User Story 1 Only** (Baseline Performance Measurement)

### MVP Execution Path

1. ✅ Complete Phase 1: Setup (T001-T003) — **5 minutes**
2. ✅ Complete Phase 2: Foundational (T004-T009) — **30-45 minutes**
   - Focus: k6 library functions (contacts-api.js, helpers.js, constants.js)
   - Can skip data-setup.js if test data already exists in Postgres
3. ✅ Complete Phase 3: User Story 1 (T010-T016) — **2-3 hours**
   - Implement: smoke.js, load.js, stress.js, spike.js, soak.js
   - Validate: Baseline metrics documented
4. 🛑 STOP and VALIDATE: User Story 1 works independently
   - Run: `./run-perf-tests.sh --scenario smoke`
   - Verify: Results archived, baseline documented

**Total MVP time**: ~3-4 hours → Delivers baseline performance metrics (core value)

### Full Implementation (All User Stories)

After MVP validation, continue with:
5. Phase 4: User Story 2 (Chaos Engineering) — **2-3 hours** (can run in parallel with US1)
6. Phase 5: User Story 3 (Orchestration) — **2 hours** (depends on US1/US2)
7. Phase 6: User Story 4 (Visualization) — **2-3 hours** (optional, depends on US1)
8. Phase 7: Polish & Documentation — **1-2 hours** (final validation)

**Total full implementation**: ~10-14 hours

---

## Notes

- [P] tasks = Different files, no internal dependencies (can run in parallel)
- Each user story independently testable (can stop at any checkpoint and validate)
- Foundational phase (Phase 2) is CRITICAL blocker — don't skip
- Tests not explicitly created (k6 scenarios serve as integration tests for US1/US2)
- Chaos experiments must run alongside load tests to observe real impact
- Artifact storage integration enables before/after comparison for optimization decisions
- Start with MVP (US1 only), then add chaos/orchestration/visualization incrementally
