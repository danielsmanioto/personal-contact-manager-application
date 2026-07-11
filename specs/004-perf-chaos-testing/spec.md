# Feature Specification: Performance Testing & Chaos Engineering

**Feature Branch**: `feature/TASK-004-perf-chaos-testing`

**Created**: 2026-07-11

**Status**: Draft

**Input**: User description: "dado uma rfc poderia criar especificacao pra implementar? spec-docs/001-tarefa-contact-manager/NFCs/RFC-002-performance-chaos-testing.md"

**Related RFC**: [RFC-002-performance-chaos-testing](../../spec-docs/001-tarefa-contact-manager/NFCs/RFC-002-performance-chaos-testing.md)

## User Scenarios & Testing

### User Story 1 - Baseline Performance Measurement (Priority: P1)

As a **DevOps/Performance Engineer**, I need to establish a performance baseline for the Contact Manager API so that we have objective metrics to measure against before implementing optimizations like read replicas or caching.

**Why this priority**: Without baseline metrics, we cannot make data-driven decisions about optimizations. This is foundational.

**Independent Test**: Execute smoke, load, stress, and spike test scenarios locally using k6 scripts against a fresh Docker Compose environment and capture baseline metrics in JSON/HTML reports.

**Acceptance Scenarios**:

1. **Given** a healthy API running in Docker Compose, **When** a smoke test (1-2 VUs, 1 minute) is executed, **Then** k6 reports all endpoints responding with 2xx status and script errors are zero.
2. **Given** baseline load conditions (20-50 VUs, 5-10 minutes), **When** the load test scenario runs, **Then** metrics show p95 latency, p99 latency, throughput (RPS), and error rate for export to a JSON report.
3. **Given** progressively increasing load (stress test, 10-200 VUs), **When** the API degrades under load, **Then** the point of saturation is identified and documented (e.g., "system saturates at ~150 concurrent users").
4. **Given** a sudden traffic spike (300 VUs in 10s), **When** the spike test runs, **Then** the response profile (latency increase, errors, recovery time) is captured.

---

### User Story 2 - Chaos Engineering Fault Injection (Priority: P1)

As a **DevOps/Performance Engineer**, I need to inject failures (killed containers, network latency, connection pool exhaustion) while load is running so that we understand system resilience and identify graceful degradation vs. cascading failures.

**Why this priority**: Performance only matters if the system is resilient. Chaos tests reveal how the system behaves under partial failure, which is essential before considering the system production-ready.

**Independent Test**: Execute a chaos experiment (e.g., kill Postgres mid-load-test) and capture metrics showing system behavior during and after the failure (recovery time, error rates, connection pool state).

**Acceptance Scenarios**:

1. **Given** a load test running with 20 VUs, **When** the Postgres container is killed at minute 3 of 5, **Then** the backend either gracefully degrades or recovers, and metrics show latency spike, error spike, and recovery time.
2. **Given** a load test running, **When** 500ms of latency is injected into the backend↔Postgres connection (via Toxiproxy), **Then** latency metrics increase proportionally (no pool exhaustion or complete outage).
3. **Given** a load test running, **When** the backend container is paused for 30s, **Then** client-side timeouts are recorded and the backend resumes cleanly without hung connections.
4. **Given** more concurrent users than the connection pool size, **When** the HikariCP pool is exhausted, **Then** the API returns a clear 5xx error (not a hang) and metrics show the exact moment of pool exhaustion.

---

### User Story 3 - Automated Test Orchestration (Priority: P2)

As a **Developer**, I need to run all performance and chaos tests with a single command so that we can integrate these tests into CI/CD and ensure every commit doesn't regress performance or resilience.

**Why this priority**: Repeatability and CI/CD integration prevent regressions. This is valuable once baseline and chaos scenarios are stable, but less critical than establishing the tests themselves.

**Independent Test**: Execute a shell script or Docker Compose orchestration that spins up services, runs smoke test, load test, and one chaos scenario in sequence, then produces a summary report.

**Acceptance Scenarios**:

1. **Given** a fresh Docker environment, **When** a script (`run-perf-tests.sh`) is executed, **Then** all test phases complete (smoke, load, stress, chaos) without manual intervention and produce a timestamped report.
2. **Given** test execution completes, **When** the summary report is generated, **Then** it clearly indicates PASS/FAIL based on predefined thresholds (p95<300ms, error rate <1%).

---

### User Story 4 - Metrics Visualization (Priority: P3)

As a **DevOps/Performance Engineer**, I want to visualize k6 metrics in Grafana dashboards so that I can quickly spot trends and anomalies across multiple test runs.

**Why this priority**: Nice-to-have for deeper analysis and cross-run comparison. Initial JSON/HTML reports from k6 are sufficient for P1/P2. InfluxDB + Grafana can be added later if repeated testing reveals the need.

**Independent Test**: k6 streams metrics to InfluxDB, and a pre-built Grafana dashboard displays them during and after test execution.

**Acceptance Scenarios**:

1. **Given** InfluxDB and Grafana are running (via docker-compose.perf.yml), **When** k6 executes and emits metrics to InfluxDB, **Then** Grafana dashboard updates in real-time showing HTTP duration, requests, and errors.
2. **Given** multiple test runs over days/weeks, **When** Grafana dashboard is viewed, **Then** historical trends (improvement/degradation over time) are visible.

---

### Edge Cases

- What happens if a chaos experiment fails to inject (e.g., Pumba cannot access Docker daemon)? Error handling should be clear and the test should fail visibly, not silently.
- How do we handle data cleanup after chaos tests that kill containers or inject delays? Automated rollback via restart policies or explicit cleanup scripts.
- What if local machine resources (CPU, memory) are saturated, masking true system bottlenecks? Document that test results are relative comparisons, not absolute values.

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide k6 smoke test scenario that validates basic connectivity and endpoint availability with 1-2 VUs and 1-minute duration.
- **FR-002**: System MUST provide k6 load test scenario with ramping load (0→20 VUs over 1m, hold 20 VUs for 5m, ramp down to 0 over 1m) and configurable thresholds (p95<300ms, error rate <1%).
- **FR-003**: System MUST provide k6 stress test scenario with progressive load ramp (10→200 VUs) to identify saturation point and document max safe concurrent user count.
- **FR-004**: System MUST provide k6 spike test scenario (sudden jump 10→300 VUs in 10s) to test burst traffic handling.
- **FR-005**: System MUST provide k6 soak test scenario (moderate load 30 VUs for 1-2 hours) to detect connection leaks or memory degradation over time.
- **FR-006**: System MUST support k6 scripts with reusable library functions (contacts-api.js) for common API operations (list, create, get contacts).
- **FR-007**: System MUST run k6 within Docker Compose without requiring local k6 installation (via `grafana/k6:latest` image).
- **FR-008**: System MUST export k6 results to JSON and HTML formats with automated storage to artifact repository (90-day retention) for historical trend analysis and before/after optimization comparisons.
- **FR-009**: System MUST provide Pumba-based chaos experiments to inject container faults (v1 focus: kill container to test availability impact).
- **FR-010**: System MUST provide Toxiproxy-based chaos experiments to inject connection-level faults (v1 focus: latency injection and connection pool exhaustion testing).
- **FR-011**: System MUST allow chaos experiments to run concurrently with k6 load tests (coordinated start/stop for reproducible results).
- **FR-012**: System MUST capture and report system metrics during chaos tests (Postgres connection count, backend error rates, recovery time).
- **FR-013**: System MUST provide a shell script or Docker Compose file to orchestrate multi-phase test execution (smoke → load → stress → chaos combinations).
- **FR-014**: System MUST produce a summary report after test suite completion indicating PASS/FAIL based on configurable SLOs.
- **FR-015** (optional): System SHOULD stream k6 metrics to InfluxDB for real-time Grafana visualization (can be added in secondary implementation).

### Key Entities

- **k6 Scenario**: A named test configuration (e.g., `load.js`, `stress.js`) specifying VU ramping stages and thresholds.
- **Chaos Experiment**: A named fault injection (e.g., "kill postgres", "inject 500ms latency") with duration and expected effect.
- **Baseline Metrics**: Recorded performance snapshot (throughput, latencies p50/p95/p99, error rate, saturation point) from healthy system to serve as reference.
- **SLO (Service Level Objective)**: Threshold for acceptance (e.g., p95 latency <300ms, error rate <1%) used to evaluate test results.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Baseline performance metrics are established and documented: p95 latency, p99 latency, throughput (RPS), error rate, and saturation point (max concurrent users before degradation).
- **SC-002**: At least 3 chaos scenarios (container kill, network latency injection, connection pool exhaustion) execute successfully and produce comparable metrics before/during/after failure.
- **SC-003**: System recovers gracefully after chaos experiments: no hung connections, no memory leaks detectable after soak test recovery phase.
- **SC-004**: Performance baseline is repeatable: running the same test scenario twice produces <10% variance in key metrics (p95 latency, RPS).
- **SC-005**: All k6 tests run in Docker without local tool installation, and results export to shareable JSON/HTML formats.
- **SC-006**: Test suite execution time is reasonable for local development (full smoke→load→stress→chaos cycle completes in <30 minutes).

## Clarifications

### Session 2026-07-11

- Q: How many contacts should exist in the database during performance tests? → A: 10,000+ contacts for maximum stress and production-scale validation
- Q: Which 3 chaos experiments should be prioritized for v1? → A: Kill container + latency injection + pool exhaustion (covers availability, degradation, saturation)
- Q: Where should performance test reports be stored and for how long? → A: Separate artifact storage with 90-day retention for historical trend analysis and before/after optimization comparisons

## Assumptions

- **Environment**: Tests run against local Docker Compose environment (not production). Postgres data is ephemeral and safe to reset between test runs.
- **Load Profile**: "Normal load" is assumed to be 20-50 concurrent users based on contact-manager's anticipated usage pattern (not validated yet; first test run will either confirm or refine this).
- **Saturation Threshold**: "System saturation" is defined as the point where error rate exceeds 1% or p95 latency exceeds 600ms (baseline SLOs to be refined after first run).
- **Chaos Scope**: Chaos experiments focus on Docker-level failures (container restart, network conditions) rather than Kubernetes or advanced scenarios. Toxiproxy is used for connection-level faults; Pumba for container-level.
- **Metrics Sufficiency**: JSON/HTML reports from k6 are sufficient for v1; InfluxDB + Grafana integration is optional and deferred to v2. Reports are archived in separate artifact storage (90-day retention) to enable cross-run trend analysis and before/after optimization comparisons.
- **Test Data**: Test scenarios create lightweight synthetic contacts (no heavy payloads) with 10,000+ contacts in the database to stress sort/filter operations and approach production scale. Database is reset between test phases or uses ephemeral volume.
- **CI/CD Integration**: Initial implementation is manual/local execution. CI/CD integration (smoke test on every PR, full suite weekly) is a future enhancement.
