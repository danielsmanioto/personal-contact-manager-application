# Implementation Plan: Performance Testing & Chaos Engineering

**Branch**: `feature/TASK-004-perf-chaos-testing` | **Date**: 2026-07-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-perf-chaos-testing/spec.md`

## Summary

Establish a performance baseline and resilience testing infrastructure for the Contact Manager API using k6 load testing and chaos engineering (Pumba + Toxiproxy). This framework will provide objective metrics on system throughput, latency (p95/p99), saturation point, and recovery behavior under failure conditions. Results are stored in artifact repository (90-day retention) to support data-driven decisions on future optimizations like read replicas or connection pooling.

**Primary Goals**:
- Measure baseline API performance (throughput, latency, error rates) under controlled load (20-50 VUs)
- Identify system saturation point (concurrent user threshold before degradation)
- Validate resilience under 3 prioritized chaos scenarios: container kill, latency injection, pool exhaustion
- Establish repeatable test suite with <10% variance across runs
- Store results for historical trend analysis supporting before/after optimization comparisons

## Technical Context

**Language/Version**: JavaScript (k6 2.x via Docker), Bash 5.x (orchestration scripts), YAML (Docker Compose configs)

**Primary Dependencies**:
- `grafana/k6:latest` (containerized load testing)
- `gaiaadm/pumba` (Docker container fault injection)
- `shopify/toxiproxy` (TCP proxy for connection-level faults)
- Docker Compose 2.x (test environment orchestration)
- InfluxDB 2.x (optional, for metrics streaming in v2)
- Grafana 10.x (optional, for dashboards in v2)

**Storage**: PostgreSQL 15+ (existing, used via Contact Manager API)

**Testing**: k6 scenarios as primary test mechanism; validated against API endpoints defined in backend spec

**Target Platform**: Local Docker Compose environment (developer machines + CI/CD); not production

**Project Type**: Performance Testing Framework + Infrastructure

**Performance Goals**:
- Establish baseline: measure throughput (RPS), latencies (p50/p95/p99), error rates, saturation point
- Repeatability: <10% variance in key metrics across consecutive runs
- Execution time: full smoke→load→stress→chaos cycle <30 minutes on standard developer machine

**Constraints**:
- p95 latency baseline target: <300ms (from RFC + Constitution)
- Error rate threshold: <1% under normal load (20-50 VUs)
- System recovery: graceful degradation or recovery within 10s after chaos event
- Test data: 10,000+ contacts to stress sorting/filtering at near-production scale
- Report storage: 90-day retention in artifact repository

**Scale/Scope**:
- Load testing: ramp from 0 to 300 VUs across scenarios (smoke=1-2, load=20, stress=10-200, spike=300)
- Test duration: smoke (1m), load (7m), stress (TBD based on saturation point), spike (short burst)
- Soak test: 30 VUs sustained for 1-2 hours to detect leaks
- Chaos scenarios: 3 prioritized for v1 (container kill, latency 500ms, pool exhaustion)
- Database size: 10,000+ contacts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle Alignment Review

✅ **Code Quality** (Section I)
- Testing in CI/CD pipeline: ALIGNED — k6 scenarios serve as performance tests; smoke test can run on every PR
- Performance testing: ALIGNED — explicit requirement in Constitution to track performance benchmarks
- Status: PASS — no violations

✅ **Architecture** (Section II)
- Resilience patterns: ALIGNED — chaos engineering validates circuit breakers, timeouts, retries
- Clear separation: ALIGNED — test framework isolated in `perf-tests/` directory, no production code changes
- Status: PASS — no violations

✅ **Security** (Section III)
- Input validation: N/A — this is a testing framework, not user-facing feature
- Status: PASS — not applicable; no violations

✅ **Performance** (Section IV)
- API responses <200ms (p95 baseline): CRITICAL — this plan establishes baseline to validate/refine SLO
- Status: PASS — plan directly supports performance baseline requirements

✅ **User Experience, Maintainability, Documentation** (Sections V-VII)
- N/A for testing framework or already aligned
- Status: PASS — no violations

### Gate Result: ✅ PASS — All principles either aligned or not applicable. No violations detected.

## Project Structure

### Documentation (this feature)

```text
specs/004-perf-chaos-testing/
├── spec.md              # Feature specification (DONE)
├── plan.md              # This file
├── research.md          # Phase 0 output (in progress)
├── data-model.md        # Phase 1 output (in progress)
├── quickstart.md        # Phase 1 output (in progress)
├── contracts/           # Phase 1 output (in progress)
│   └── k6-scenarios.md  # Contract for k6 scenario structure & outputs
├── checklists/
│   └── requirements.md  # Quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
perf-tests/
├── k6/                              # k6 load testing scripts
│   ├── lib/
│   │   ├── contacts-api.js          # Reusable API functions
│   │   ├── constants.js             # Shared VU counts, durations, thresholds
│   │   └── helpers.js               # Utility functions (report generation, etc.)
│   ├── scenarios/
│   │   ├── smoke.js                 # Smoke test (1-2 VUs, 1m)
│   │   ├── load.js                  # Load test (0→20→0 VUs, 7m)
│   │   ├── stress.js                # Stress test (10→200 VUs, progressive)
│   │   ├── spike.js                 # Spike test (10→300 in 10s)
│   │   └── soak.js                  # Soak test (30 VUs, 1-2h)
│   └── results/                     # Test output (gitignored)
│       └── .gitkeep
├── chaos/
│   ├── scenarios/
│   │   ├── pumba-kill-postgres.sh   # Kill Postgres container
│   │   ├── pumba-kill-backend.sh    # Kill backend container
│   │   ├── toxiproxy-latency.sh     # Inject 500ms latency
│   │   └── toxiproxy-pool-exhaust.sh # Connection pool exhaustion
│   └── cleanup.sh                   # Reset network/containers after chaos
├── docker-compose.perf.yml          # Additional services for perf testing
├── run-perf-tests.sh                # Orchestration script
└── README.md                        # Performance testing documentation
```

**Structure Decision**: 
- Placed `perf-tests/` at repository root for clear separation from product code (backend/, frontend/)
- k6 scripts organized by scenario type with shared library functions for code reuse
- Chaos experiments in separate directory with cleanup utilities to ensure test isolation
- Docker Compose overlay file to add perf-specific services without modifying main stack
- Single orchestration script provides unified entry point for all test phases

## Complexity Tracking

No Constitution violations detected. No complexity justifications needed.

---

## Phase 0: Research & Unknowns Resolution

### Research Tasks

1. **k6 Scenario Structure & Best Practices** → Research VU ramping strategies, cleanup between phases
2. **Toxiproxy Configuration** → Research connection pool exhaustion simulation approach
3. **Artifact Storage Implementation** → Research storage system choice & 90-day retention automation
4. **Metrics Collection Strategy** → Research report formats & system metric capture during chaos

**Output**: `research.md` with all findings and decision rationale

---

## Phase 1: Design & Contracts

### 1.1 Data Model (`data-model.md`)
- k6 Scenario entity with VU ramp specs, thresholds, durations
- Chaos Experiment entity with fault injection details
- Test Result and Baseline Metrics entities for tracking

### 1.2 Interface Contracts (`contracts/`)
- **k6 Scenarios**: Input/output structure, required fields, threshold behavior
- **Orchestration**: Script input/output, sequencing, report format

### 1.3 Quickstart Guide (`quickstart.md`)
- Setup, smoke test, full suite execution, result inspection
- Baseline validation against Constitution SLOs

### 1.4 Agent Context Update
Update `CLAUDE.md` with feature plan references and source code location

---

## Next Steps

1. **Phase 0 (Research)**: Resolve unknowns on k6, Toxiproxy, artifact storage
2. **Phase 1 (Design)**: Generate data-model.md, contracts/, quickstart.md
3. **Phase 2 (Tasks)**: Run `/speckit-tasks` to create actionable development tasks
4. **Implementation**: Execute tasks in dependency order

**Status**: Ready for Phase 0 research ✅
