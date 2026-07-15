# Implementation Plan: Togglz Feature Flags System

**Branch**: `005-togglz-feature-flags` | **Date**: 2026-07-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/005-togglz-feature-flags/spec.md`

## Summary

Implement runtime feature flag system using Togglz 4.6.2 in Spring Boot 3.3, enabling non-technical administrators to toggle application features on/off without deployment or restart. Features will be persisted to PostgreSQL, exposed via admin console UI at `/togglz-console` (with production security), and accessible via Actuator API for automation. Initial implementation includes graceful code degradation for disabled features and two example flags (ADVANCED_SEARCH, EXPORT_CONTACTS). Architecture follows hexagonal patterns with clear separation of concerns—flag checks in controllers/services, persistence via JDBC, and admin console provided by Togglz library.

## Technical Context

**Language/Version**: Java 21 (backend) + TypeScript 5+ (frontend)

**Primary Dependencies**: 
- Backend: Spring Boot 3.3, Togglz 4.6.2 (spring-boot-starter + console), Spring Data JPA, Flyway
- Frontend: React 18, TypeScript, Axios

**Storage**: PostgreSQL 15 (TOGGLZ table for flag state persistence)

**Testing**: 
- Backend: JUnit 5 (unit tests), Testcontainers (integration tests, real Postgres)
- Frontend: Vitest + React Testing Library

**Target Platform**: Web service (multi-instance backend) + React browser frontend

**Project Type**: Web service (REST API) + React SPA

**Performance Goals**: Flag state check < 1ms per operation (negligible overhead), console UI toggle < 5s to take effect

**Constraints**: 
- API response time < 200ms p95 (per Constitution Principle IV)
- Flag persistence must survive restarts (100% of the time)
- Graceful degradation when flag disabled (zero unhandled exceptions)
- Production console access restricted to ROLE_ADMIN (per Constitution Principle III)

**Scale/Scope**: 
- Multi-instance backend (all share same Postgres)
- 2–10 flags (initially 2 examples, extensible pattern)
- Admin console accessed by small group (ops/product team)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **All principles satisfied** — no violations detected:

| Principle | Evaluation | Status |
|-----------|-----------|--------|
| **I. Code Quality** | Minimum 80% test coverage required; plan includes unit tests (flag checks), integration tests (persistence), and end-to-end tests (console UI). No console.log() in backend. | ✅ PASS |
| **II. Architecture** | Hexagonal pattern respected: controllers check flags (ports), services use flags, repositories persist state. Clear separation of concerns. Resilience pattern: timeout handling if Postgres unavailable (fallback to cached state). | ✅ PASS |
| **III. Security** | Togglz console secured with Spring Security (ROLE_ADMIN required in production). Input validation on Actuator endpoints (POST requests). No plaintext data exposure. Defense-in-depth: console requires ROLE_ADMIN, Actuator API requires authentication context. | ✅ PASS |
| **IV. Performance** | Flag checks are O(1) in-memory lookups (< 1ms). Console toggle effect < 5s (acceptable for admin workflow). API responses remain < 200ms p95 (feature check overhead negligible). | ✅ PASS |
| **V. User Experience** | Admin console provides single-click toggle (simplest possible UX). Visual feedback: immediate UI state change. Graceful degradation: disabled features show clear feedback (hidden UI or 403 error), not crashes. | ✅ PASS |
| **VI. Maintainability** | Code comments explain WHY features are checked. AppFeatures enum serves as discoverable registry of all toggles. Reusable pattern: `AppFeatures.FEATURE.isActive()` used consistently across codebase. Logging: flag toggles are logged with admin user + timestamp. | ✅ PASS |
| **VII. Documentation** | Plan includes quickstart.md for validation. API documentation in OpenAPI will include `/togglz-console` endpoint and Actuator endpoints. README.md will document how to add new features to AppFeatures enum. | ✅ PASS |

**Verdict**: ✅ GATE PASSED — Feature aligns with all Constitution principles. No complexity justification required.

## Project Structure

### Documentation (this feature)

```text
specs/005-togglz-feature-flags/
├── spec.md              # Feature specification (input to this plan)
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (to be created in Phase 0)
├── data-model.md        # Phase 1 output (to be created in Phase 1)
├── quickstart.md        # Phase 1 output (to be created in Phase 1)
├── contracts/           # Phase 1 output (to be created in Phase 1)
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

**Web Application (Backend + Frontend)**:

```text
backend/
├── src/main/java/com/contactmanager/
│   ├── config/
│   │   ├── AppFeatures.java        # Feature flag enum (NEW)
│   │   └── TogglzConfig.java       # Spring Configuration for Togglz (NEW)
│   ├── controller/
│   │   └── ContactController.java  # Modified: Add flag checks in search() and export()
│   ├── service/
│   │   └── ContactService.java     # Modified: Implement graceful degradation
│   ├── repository/
│   │   └── ContactRepository.java  # Unchanged
│   └── entity/
│       └── Contact.java             # Unchanged
├── src/main/resources/
│   ├── db/migration/
│   │   └── V003__create_togglz_table.sql  # NEW: Togglz state persistence table
│   └── application.yml             # Modified: Add togglz configuration
├── src/test/java/com/contactmanager/
│   ├── config/
│   │   └── TogglzConfigTests.java  # NEW: Test Togglz configuration
│   ├── controller/
│   │   └── ContactControllerTests.java  # Modified: Add tests for flag-gated endpoints
│   └── service/
│       └── ContactServiceTests.java     # Modified: Test graceful degradation
└── pom.xml                         # Modified: Add Togglz dependencies

frontend/
├── src/
│   ├── hooks/
│   │   └── useFeatureFlags.ts      # NEW: Custom hook to fetch flag status
│   ├── components/
│   │   └── ContactCard.tsx         # Modified: Conditionally hide export/search based on flags
│   ├── services/
│   │   └── api.ts                  # Modified: Add /actuator/togglz endpoint
│   └── App.tsx                     # Modified: Initialize feature flag checks on load
├── src/test/
│   ├── hooks/
│   │   └── useFeatureFlags.test.ts # NEW: Test feature flag hook
│   └── components/
│       └── ContactCard.test.tsx    # Modified: Test conditional rendering
└── package.json                    # Unchanged (no new dependencies)
```

**Structure Decision**: 
- **Backend**: Hexagonal architecture maintained with new config layer (AppFeatures enum, TogglzConfig) and modified services/controllers for flag checks
- **Database**: New Flyway migration (V003__create_togglz_table.sql) for JDBC persistence
- **Frontend**: New custom hook (useFeatureFlags) to check flag status from Actuator API; conditional component rendering based on flags
- **Tests**: Unit + integration tests at each layer (config, controller, service, components) following existing patterns (JUnit 5 backend, Vitest frontend)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
