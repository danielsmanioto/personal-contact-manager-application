# Feature Specification: Runtime Feature Flags with Togglz

**Feature Branch**: `005-togglz-feature-flags`

**Created**: 2026-07-14

**Status**: Draft

**Input**: Implement feature flag system using Togglz in Spring Boot 3.3 to enable runtime enable/disable of application features without restart. Features will be toggled via admin console UI (/togglz-console) with state persisted to Postgres database, surviving restarts and multi-instance deployments. System should include graceful degradation when flags are disabled, accessible Actuator API for script-based control, and production-ready security with role-based access control for the admin console.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Enables/Disables Features via Console (Priority: P1)

Application administrators need a visual interface to toggle application features on/off in real-time without requiring application restarts or deployments. This is the core administrative workflow.

**Why this priority**: Administrators are the primary users of this system—enabling/disabling features is the main value proposition. Without this workflow, the feature flag system has no usability.

**Independent Test**: Can be fully tested by: (1) Starting the application, (2) Navigating to admin console at `/togglz-console`, (3) Toggling a feature checkbox, (4) Verifying the feature state changes immediately in the UI and persists across page refreshes.

**Acceptance Scenarios**:

1. **Given** admin is logged into the system, **When** admin navigates to `/togglz-console`, **Then** a UI displays all available features with current on/off status
2. **Given** a feature is currently disabled, **When** admin clicks the toggle checkbox, **Then** the feature state changes to enabled and persists in the database
3. **Given** a feature is currently enabled, **When** admin clicks the toggle checkbox, **Then** the feature state changes to disabled and persists in the database
4. **Given** admin closes and reopens the browser, **When** navigating back to `/togglz-console`, **Then** the previously toggled feature states are remembered

---

### User Story 2 - Feature State Persists Across Restarts (Priority: P1)

Feature flag states must survive application restarts so that once an administrator toggles a feature, the state persists—even if the backend service is redeployed or crashes.

**Why this priority**: Without persistence, administrators would lose their feature flag settings on every restart—making the system unreliable in production. This is table-stakes for any feature flag system.

**Independent Test**: Can be fully tested by: (1) Setting a feature flag to a known state via console, (2) Stopping the backend application, (3) Starting it again, (4) Verifying the flag state is unchanged.

**Acceptance Scenarios**:

1. **Given** a feature is disabled in the console, **When** the backend application restarts, **Then** the feature remains disabled without requiring re-configuration
2. **Given** a feature is enabled in the console, **When** the backend application restarts, **Then** the feature remains enabled without requiring re-configuration
3. **Given** multiple instances of the backend are running, **When** one instance toggles a flag via console, **Then** all instances immediately see the updated state (shared Postgres backend)

---

### User Story 3 - Graceful Degradation When Features Are Disabled (Priority: P1)

Application code must check feature flag state before executing feature-specific logic. When a flag is disabled, the application should either skip that feature or return a user-friendly message—not crash or throw errors.

**Why this priority**: Graceful degradation is the entire point of feature flags. Without it, disabling a flag could break the application. This ensures reliability and safe feature rollback.

**Independent Test**: Can be fully tested by: (1) Disabling a feature flag (e.g., EXPORT_CONTACTS), (2) Attempting to use that feature, (3) Verifying the application either hides the feature UI or returns a user-friendly error message (not a 500 server error).

**Acceptance Scenarios**:

1. **Given** EXPORT_CONTACTS feature is disabled, **When** user attempts to export contacts, **Then** export button is hidden or export endpoint returns 403 Forbidden with clear message
2. **Given** ADVANCED_SEARCH feature is disabled, **When** user performs a search, **Then** search falls back to basic search without errors
3. **Given** a feature is toggled off while a user is using it, **When** user refreshes the page or makes a new request, **Then** the application gracefully disables the feature without data loss or errors

---

### User Story 4 - Script-Based Flag Control via Actuator API (Priority: P2)

For automation and CI/CD workflows, admins need a REST API to check flag status and toggle flags without using the web console. Togglz exposes this via Spring Boot Actuator endpoints.

**Why this priority**: Automation is essential for production deployments. Admins need to safely enable/disable features during deployments without manual UI interaction. This enables self-service and scripting.

**Independent Test**: Can be fully tested by: (1) Querying `/actuator/togglz` to list all flags and their states, (2) Calling `POST /actuator/togglz/{FEATURE_NAME}` to toggle a flag, (3) Verifying the state changes in both the Actuator API response and the console UI.

**Acceptance Scenarios**:

1. **Given** the backend is running, **When** making GET request to `/actuator/togglz`, **Then** response lists all features with current enabled/disabled state
2. **Given** a feature is currently disabled, **When** POSTing to `/actuator/togglz/FEATURE_NAME` with `{"enabled": true}`, **Then** the feature is enabled and state persists
3. **Given** toggling a flag via API, **When** checking the web console, **Then** the console reflects the API-driven state change

---

### User Story 5 - Production-Ready Security with Role-Based Access (Priority: P2)

Admin console must require authentication and proper authorization (e.g., ROLE_ADMIN) to access feature flags in production. Unauthenticated users should be unable to toggle features.

**Why this priority**: In production, preventing unauthorized access to feature flags is critical to avoid malicious feature disabling or system tampering. Security is non-negotiable for any admin tool.

**Independent Test**: Can be fully tested by: (1) Accessing `/togglz-console` as an unauthenticated user and verifying access is denied, (2) Logging in as a user without ROLE_ADMIN and verifying access is denied, (3) Logging in as a user with ROLE_ADMIN and verifying full console access.

**Acceptance Scenarios**:

1. **Given** user is not authenticated, **When** accessing `/togglz-console`, **Then** request is denied (401 Unauthorized or redirect to login)
2. **Given** user has ROLE_USER but not ROLE_ADMIN, **When** accessing `/togglz-console`, **Then** access is denied (403 Forbidden)
3. **Given** user has ROLE_ADMIN, **When** accessing `/togglz-console`, **Then** full feature flag management is available

---

### User Story 6 - Initial Features for Testing (Priority: P2)

The system ships with at least two example features (ADVANCED_SEARCH, EXPORT_CONTACTS) so administrators can immediately test toggling features without having to add custom features first.

**Why this priority**: Example features make the system immediately testable and demonstrate the pattern for adding new features later. They serve as documentation by example.

**Independent Test**: Can be fully tested by: (1) Starting the application, (2) Viewing `/togglz-console`, (3) Verifying ADVANCED_SEARCH and EXPORT_CONTACTS appear in the feature list, (4) Toggling them on/off and verifying the corresponding features work/don't work in the application.

**Acceptance Scenarios**:

1. **Given** the application starts, **When** viewing `/togglz-console`, **Then** ADVANCED_SEARCH feature is listed
2. **Given** the application starts, **When** viewing `/togglz-console`, **Then** EXPORT_CONTACTS feature is listed
3. **Given** ADVANCED_SEARCH is enabled, **When** searching for contacts, **Then** advanced search logic executes
4. **Given** ADVANCED_SEARCH is disabled, **When** searching for contacts, **Then** basic search logic executes

---

### Edge Cases

- What happens if the Postgres database goes down but the feature flag system is still running? (Flag state reverts to last known state in application cache)
- What happens if an admin disables a feature while another admin is in the middle of using that feature? (Feature degrades gracefully—no data loss, clear user message)
- What happens if multiple backend instances try to toggle the same flag simultaneously? (JDBC state repository ensures atomicity—last write wins)
- What if a new feature is added to the `AppFeatures` enum but the `TOGGLZ` table hasn't been updated? (Togglz auto-initializes new features to disabled by default)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow admins to view all configured feature flags and their current enabled/disabled state via a web UI at `/togglz-console`
- **FR-002**: System MUST allow admins to toggle a feature flag on/off via the web console UI with immediate effect
- **FR-003**: Feature flag state MUST persist to Postgres database and survive application restarts
- **FR-004**: Application code MUST check feature flag status before executing feature-specific logic (e.g., `AppFeatures.ADVANCED_SEARCH.isActive()`)
- **FR-005**: When a feature flag is disabled, the application MUST gracefully degrade—hiding UI elements, skipping logic, or returning a 403 error (not crashing)
- **FR-006**: System MUST expose feature flag state via Spring Boot Actuator endpoints (`GET /actuator/togglz`, `POST /actuator/togglz/{FEATURE_NAME}`)
- **FR-007**: Admin console access MUST require authentication (Spring Security) and authorization (ROLE_ADMIN) in production environments
- **FR-008**: System MUST initialize with at least two example features: `ADVANCED_SEARCH` and `EXPORT_CONTACTS`
- **FR-009**: Feature flag state MUST be consistent across multiple backend instances (all instances read from shared Postgres backend)
- **FR-010**: System MUST log when a feature flag is toggled (timestamp, admin user, flag name, old state, new state)
- **FR-011**: Togglz library version MUST be 4.6.2 (or later stable) and integrated via Spring Boot Starter

### Key Entities

- **Feature Flag**: Represents a toggleable application feature with properties: `name`, `enabled` (boolean), `label` (human-readable description), `strategy_id` (optional, for advanced use cases like percentage rollouts), `strategy_params` (optional)
- **TOGGLZ Table**: Postgres table persisting feature flag state with columns: `FEATURE_NAME` (PK), `FEATURE_ENABLED` (0/1 or boolean), `STRATEGY_ID`, `STRATEGY_PARAMS`

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can toggle a feature flag and see the effect in the application within 5 seconds (no page refresh required)
- **SC-002**: Feature flag state persists across 100% of application restarts (verified via automated testing)
- **SC-003**: All three example feature flags (ADVANCED_SEARCH, EXPORT_CONTACTS, plus one additional) appear and function correctly in the admin console
- **SC-004**: Zero unhandled exceptions thrown when a feature flag is disabled (graceful degradation working 100% of the time)
- **SC-005**: Actuator API endpoints (`/actuator/togglz`, `/actuator/togglz/{FEATURE_NAME}`) return valid JSON responses with correct flag states
- **SC-006**: Production environment console access denied for unauthenticated and non-admin users (verified via security tests)
- **SC-007**: Feature flag system adds < 50ms latency to application startup and < 1ms latency per flag check during runtime
- **SC-008**: At least 3 integration tests verify persistence, graceful degradation, and console functionality
- **SC-009**: Documentation complete describing how to add new features to `AppFeatures` enum and use them in code

## Assumptions

- **Development vs. Production**: Console security (`togglz.console.secured: false`) is acceptable for local development but MUST be secured with Spring Security in production
- **Existing Infrastructure**: Application already uses Spring Boot 3.3, Java 21, Postgres 15, and Flyway migrations (verified present)
- **Feature Check Overhead**: Flag state checks (`AppFeatures.FEATURE.isActive()`) have negligible performance impact (< 1ms per check) and can be called frequently
- **Database Connectivity**: Postgres database is always available in production. If unavailable, Togglz falls back to in-memory cache of last known state
- **Admin Users**: ROLE_ADMIN users already exist in the system and are managed by existing authentication system (Spring Security integration assumed to exist or be added separately)
- **Feature Naming**: Feature names in `AppFeatures` enum follow UPPER_SNAKE_CASE convention (e.g., ADVANCED_SEARCH, EXPORT_CONTACTS)
- **Multi-Instance Deployments**: All backend instances share the same Postgres database and will see consistent flag states
- **Backwards Compatibility**: Adding the Togglz library will not break existing functionality—new library is purely additive
- **Scope**: Advanced Togglz features (percentage rollouts, user targeting strategies) are out of scope for v1; only simple on/off toggles are implemented
