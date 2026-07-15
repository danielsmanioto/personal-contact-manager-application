# Research Document: Togglz Feature Flags Implementation

**Date**: 2026-07-14  
**Feature**: Runtime Feature Flags with Togglz  
**Phase**: Phase 0 (Research & Clarification Resolution)

---

## Executive Summary

This research consolidates best practices, architecture patterns, and design decisions for implementing Togglz feature flags in a Spring Boot 3.3 + PostgreSQL environment. All clarifications from the specification have been resolved through industry-standard practices and project-specific context.

---

## Research Topics & Decisions

### 1. Togglz Library Version & Integration Pattern

**Decision**: Use Togglz 4.6.2 via Spring Boot Starter

**Rationale**:
- Togglz 4.6.2 is the latest stable version (as of July 2026)
- Spring Boot Starter (`togglz-spring-boot-starter`) provides automatic configuration and integrates seamlessly with Spring Boot 3.3
- Console library (`togglz-console`) includes built-in admin UI—no need to build custom UI
- JDBC state repository available out-of-the-box, matching existing PostgreSQL infrastructure

**Alternatives Considered**:
- **Custom feature flag system**: Rejected because building + maintaining increases code complexity; Togglz is battle-tested
- **External SaaS (LaunchDarkly, Unleash)**: Rejected because adds dependency on external service; Togglz is self-hosted on existing Postgres
- **Spring Cloud Config Server**: Rejected because overkill for simple on/off toggles; Togglz is purpose-built

**Implementation References**:
- [Togglz Spring Boot Starter Documentation](https://www.togglz.org/documentation/spring-boot-starter)
- Maven: `org.togglz:togglz-spring-boot-starter:4.6.2`

---

### 2. Feature State Persistence Strategy

**Decision**: Use JDBC State Repository with Postgres

**Rationale**:
- In-memory storage (default) loses state on restart—unacceptable for production
- JDBC repository persists to a single `TOGGLZ` table, providing:
  - Durability across restarts
  - Shared state across multiple backend instances (no race conditions)
  - Simple query interface (no new infrastructure)
- PostgreSQL already exists in project; leverages existing Flyway migration system

**Schema**:
```sql
CREATE TABLE TOGGLZ (
  FEATURE_NAME VARCHAR(100) PRIMARY KEY,
  FEATURE_ENABLED INTEGER,      -- 0 = disabled, 1 = enabled
  STRATEGY_ID VARCHAR(200),      -- Future: for percentage rollouts
  STRATEGY_PARAMS VARCHAR(2000)  -- Future: strategy configuration
);
```

**Alternatives Considered**:
- **Redis**: Rejected because adds new infrastructure; Postgres sufficient
- **File-based**: Rejected because doesn't scale to multi-instance backend
- **In-memory cache**: Rejected because state is lost on restart

**Consistency Model**:
- Last-write-wins (acceptable for admin console use case)
- JDBC layer handles isolation; Postgres MVCC prevents race conditions
- Cache layer (if added later) should use short TTL (< 5s) to avoid stale reads

---

### 3. Admin Console Security in Production

**Decision**: Spring Security + ROLE_ADMIN authorization for console access

**Rationale**:
- Development: `togglz.console.secured: false` for fast local iteration
- Production: Require ROLE_ADMIN via Spring Security interceptor
- Actuator API inherits existing authentication (if any)
- Console access logs all toggles (admin + timestamp) for audit trail

**Implementation Pattern**:
```yaml
togglz:
  console:
    enabled: true
    path: /togglz-console
    secured: true  # Production only
    feature-admin-authority: ROLE_ADMIN
```

**Alternatives Considered**:
- **No security**: Rejected—critical admin tool requires access control
- **API key authentication**: Rejected because Spring Security already present; reuse existing auth
- **Disable console entirely, API-only control**: Rejected because console provides better UX for non-technical admins

---

### 4. Graceful Degradation Strategy

**Decision**: Code-level checks with fallback logic in controllers/services

**Rationale**:
- Every feature-specific operation MUST check flag before execution
- Pattern: `if (AppFeatures.FEATURE_NAME.isActive()) { /* feature logic */ } else { /* fallback */ }`
- Fallback options:
  - **Option A** (Hide from UI): Frontend doesn't render button; user never attempts feature
  - **Option B** (Return 403 Forbidden): User sees feature but request rejected with clear message
  - **Option C** (Fallback logic): Different code path (e.g., basic search instead of advanced)
- Choose per-feature based on UX impact:
  - ADVANCED_SEARCH → Option C (fallback to basic search, seamless)
  - EXPORT_CONTACTS → Option B (return 403; rare feature, acceptable UX)

**Exception Policy**:
- Zero unhandled exceptions when flag is disabled (= 100% graceful degradation)
- Test every flag-gated code path with flag=disabled to verify no exceptions
- Log flag state changes for debugging (timestamp, admin user, feature name, old/new state)

**Alternatives Considered**:
- **Aspect-oriented programming (AOP)**: Over-engineered; simple if-statements sufficient
- **Feature-specific exception class**: Rejected because status codes (403) + messages sufficient

---

### 5. Frontend Integration & Actuator API

**Decision**: Consume `/actuator/togglz` API to check flag status at runtime

**Rationale**:
- Frontend needs to know which features are enabled to conditionally render UI
- Togglz Actuator endpoints automatically enabled (Spring Boot Actuator integration)
- Response format:
  ```json
  {
    "features": {
      "ADVANCED_SEARCH": {"enabled": true},
      "EXPORT_CONTACTS": {"enabled": false}
    }
  }
  ```
- Frontend custom hook (`useFeatureFlags`) fetches this on app load, caches in React state
- Polling strategy: Refresh every 30s (admin toggles are infrequent; eventual consistency acceptable)

**Frontend Pattern**:
```typescript
const { flags } = useFeatureFlags(); // Hook caches and polls
if (flags.ADVANCED_SEARCH) {
  return <AdvancedSearchUI />;
} else {
  return <BasicSearchUI />;
}
```

**Alternatives Considered**:
- **GraphQL query**: Rejected; overkill for simple flag list
- **WebSocket subscription**: Rejected; polling sufficient for admin-driven changes (infrequent)
- **Hard-code in frontend**: Rejected because defeats purpose of runtime toggling

---

### 6. Initial Example Features

**Decision**: Implement ADVANCED_SEARCH and EXPORT_CONTACTS as required examples

**Rationale**:
- Provides immediate testing target (admins can toggle and see effect)
- Covers two different graceful degradation patterns:
  - ADVANCED_SEARCH: Fallback logic (basic search)
  - EXPORT_CONTACTS: 403 error response
- Serves as documentation for adding future features (enum pattern + code check pattern)

**Extensibility Pattern** (for future features):
1. Add feature name to `AppFeatures` enum with `@Label` (human-readable description)
2. Update `application.yml` to register feature in `feature-enums` property
3. In controller/service: Check `AppFeatures.NEW_FEATURE.isActive()` and implement fallback
4. Add tests for flag=enabled and flag=disabled code paths
5. Flyway migration auto-creates TOGGLZ row on first startup (Togglz handles initialization)

---

### 7. Multi-Instance Backend Consistency

**Decision**: Shared PostgreSQL backend ensures single source of truth

**Rationale**:
- All backend instances read/write to same TOGGLZ table in Postgres
- No need for distributed cache invalidation or eventual consistency windows
- Toggle latency: < 1 second across all instances (determined by JDBC + Postgres response time)
- Atomic updates: JDBC layer prevents race conditions (Postgres handles concurrent writes)

**Failure Scenario**:
- If Postgres is unreachable: Togglz falls back to in-memory cache of last known state
- Flag toggles fail (returns 503 to console) but existing requests continue using cached state
- Graceful degradation: Application is readable during Postgres outage (acceptable SLA)

---

### 8. Performance Impact Analysis

**Decision**: Flag checks have negligible overhead (< 1ms per check)

**Rationale**:
- `AppFeatures.FEATURE.isActive()` is an O(1) hash map lookup in memory
- JDBC state repository caches flag state in application after first load
- Togglz auto-refreshes cache on toggle (via Actuator endpoint)
- Total overhead per flag check: < 1ms (vs. 150–200ms typical API response)
- Conclusion: Flag checks are NOT the bottleneck; API latency dominated by business logic

**Performance Testing Strategy**:
- Baseline: Measure API p95 latency WITHOUT flag checks
- With flags: Measure API p95 latency WITH flag checks on all contact endpoints
- Threshold: < 5ms regression (negligible, < 3% of 200ms SLA)
- CI/CD: Add performance benchmark tests to catch regressions

---

### 9. Logging & Audit Trail

**Decision**: Log all flag toggles with admin identity and timestamp

**Rationale**:
- Audit requirement: Track WHO changed WHAT flag WHEN
- Pattern: Use SLF4J with structured logging (not System.out)
- Log format: `[FEATURE_FLAG_TOGGLE] feature=FEATURE_NAME admin=user@example.com old_state=false new_state=true timestamp=2026-07-14T10:30:00Z`
- Purpose: Troubleshooting (feature unexpectedly on/off?) and compliance (who enabled risky feature?)

**Implementation**:
- Add logging interceptor to Togglz console (or in TogglzConfig bean)
- Log to application logger with AUDIT level or INFO level
- ELK/Grafana integration (future): Monitor feature toggles in centralized logging

---

### 10. Testing Strategy

**Decision**: Unit + Integration + E2E test coverage (80%+ target per Constitution)

**Rationale**:
- **Unit tests**: AppFeatures enum, flag check logic in services (mock FeatureManager)
- **Integration tests**: Full stack with real Postgres (Testcontainers), verify state persists
- **E2E tests**: Browser-driven console toggle → verify feature behavior changes

**Test Pyramid**:
```
E2E (10%):    Console UI toggle → feature behavior change
Integration (25%): Flag persistence, multi-instance consistency
Unit (65%):   Flag checks, graceful degradation logic
```

**Coverage Targets**:
- TogglzConfig: 100% (all code paths)
- AppFeatures: 100% (all features tested enabled/disabled)
- Controllers: 80%+ (every flag-gated endpoint tested)
- Services: 80%+ (fallback logic tested)

---

## Resolved Clarifications

✅ **No [NEEDS CLARIFICATION] markers in specification** — all design decisions made based on:
1. Industry best practices (feature flag systems)
2. Project constraints (Spring Boot 3.3, Postgres 15)
3. Constitution principles (security, performance, maintainability)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Postgres unavailable | Low | Medium | Fallback to cached flag state; graceful degradation active |
| Admin console compromised | Very Low | High | ROLE_ADMIN + Spring Security; audit logging of toggles |
| Flag check causes latency spike | Very Low | Low | < 1ms overhead per check; negligible vs. business logic |
| Race condition on simultaneous toggles | Very Low | Low | JDBC layer + Postgres MVCC prevent conflicts; last-write-wins acceptable |
| Feature flag left disabled in production | Medium | High | Logging + audit trail; clear console UI; runbook for flag management |

---

## Dependencies & Prerequisites

✅ **All satisfied by existing project**:
- Spring Boot 3.3 ✓
- PostgreSQL 15 ✓
- Flyway migrations ✓
- Spring Security (for console authorization) ✓
- Maven (dependency management) ✓
- React 18 + TypeScript (frontend) ✓

---

## Conclusion

The Togglz feature flag system is well-suited for this project's needs. It provides:
- ✅ Simple admin UI (no custom development)
- ✅ Persistent state (PostgreSQL)
- ✅ Multi-instance consistency (JDBC state repository)
- ✅ Production security (Spring Security integration)
- ✅ Extensible pattern (enum-based feature registry)
- ✅ Minimal performance overhead (< 1ms per check)
- ✅ Graceful degradation support (code-level checks)

**Ready to proceed to Phase 1 (Design & Contracts)**.
