# BACKLOG-004: Feature Flags (Togglz) — TODO List

**Status**: In Progress  
**Feature**: Implement Togglz feature flags for runtime feature toggle (enable/disable without restart)  
**Reference**: BACKLOG-004-FEATURE_FLAGS_GUIDE.md

---

## Phase 1: Dependencies & Configuration

- [ ] **Task 001**: Add Togglz dependencies to `backend/pom.xml`
  - [ ] Add `togglz-spring-boot-starter:4.6.2`
  - [ ] Add `togglz-console:4.6.2`
  - [ ] Verify Maven resolves without conflicts

- [ ] **Task 002**: Create `AppFeatures` enum in `backend/src/main/java/com/contactmanager/config/AppFeatures.java`
  - [ ] Define initial features (ADVANCED_SEARCH, EXPORT_CONTACTS)
  - [ ] Add `@Label` annotations for UI display
  - [ ] Implement `isActive()` convenience method

- [ ] **Task 003**: Add Togglz configuration to `backend/src/main/resources/application.yml`
  - [ ] Set `togglz.enabled: true`
  - [ ] Register `feature-enums: com.contactmanager.config.AppFeatures`

---

## Phase 2: Database Persistence

- [ ] **Task 004**: Create Flyway migration for Togglz state table
  - [ ] Create `backend/src/main/resources/db/migration/V003__create_togglz_features.sql`
  - [ ] Define TOGGLZ table schema (FEATURE_NAME, FEATURE_ENABLED, STRATEGY_ID, STRATEGY_PARAMS)
  - [ ] Test migration runs without errors

- [ ] **Task 005**: Create `TogglzConfig.java` configuration class
  - [ ] Implement `@Configuration` class in `backend/src/main/java/com/contactmanager/config/`
  - [ ] Register `JDBCStateRepository` bean with DataSource
  - [ ] Verify bean wiring works on startup

- [ ] **Task 006**: Test database persistence
  - [ ] Unit test: Verify flag state persists across application restarts
  - [ ] Integration test: Verify multiple instances read same state from Postgres

---

## Phase 3: Admin Console (UI)

- [ ] **Task 007**: Enable Togglz console in application configuration
  - [ ] Set `togglz.console.enabled: true` in `application.yml`
  - [ ] Set `togglz.console.path: /togglz-console`
  - [ ] Set `togglz.console.secured: false` (development only)

- [ ] **Task 008**: Verify console UI is accessible
  - [ ] Start backend: `mvn spring-boot:run`
  - [ ] Navigate to `http://localhost:8081/togglz-console`
  - [ ] Verify all features from `AppFeatures` enum appear in the UI
  - [ ] Test toggle checkbox — verify feature state changes in real-time

- [ ] **Task 009**: Add admin role-based access control
  - [ ] Document security requirement: `togglz.console.feature-admin-authority: ROLE_ADMIN`
  - [ ] Mark as TODO for later Spring Security integration

---

## Phase 4: Feature Implementation

- [ ] **Task 010**: Implement ADVANCED_SEARCH conditional logic
  - [ ] Modify `ContactController.search()` endpoint
  - [ ] If `AppFeatures.ADVANCED_SEARCH.isActive()` → use advanced search service
  - [ ] Else → use basic search service
  - [ ] Add unit tests for both code paths

- [ ] **Task 011**: Implement EXPORT_CONTACTS conditional logic
  - [ ] Create export endpoint (or modify existing if present)
  - [ ] If `AppFeatures.EXPORT_CONTACTS.isActive()` → enable CSV/PDF export
  - [ ] Else → return 403 Forbidden or hide feature in response
  - [ ] Add unit tests for both code paths

- [ ] **Task 012**: Frontend integration (optional phase)
  - [ ] [ ] Call `/actuator/togglz` API to check feature status
  - [ ] [ ] Hide/show UI elements based on feature flags (search, export buttons)
  - [ ] [ ] Add frontend tests for feature-gated components

---

## Phase 5: Actuator API Alternative (No UI)

- [ ] **Task 013**: Verify Togglz Actuator endpoints are exposed
  - [ ] Test: `curl http://localhost:8081/actuator/togglz`
  - [ ] Verify response lists all features and their current state
  - [ ] Document endpoint for script/CLI usage

- [ ] **Task 014**: Test flag toggle via API (script-based control)
  - [ ] Test: Enable feature via `POST /actuator/togglz/{FEATURE_NAME}`
  - [ ] Test: Disable feature via `POST /actuator/togglz/{FEATURE_NAME}`
  - [ ] Verify state persists to database
  - [ ] Document for CI/CD automation use cases

---

## Phase 6: Testing & Documentation

- [ ] **Task 015**: Write unit tests for feature flag behavior
  - [ ] Test each feature's `isActive()` method returns correct state
  - [ ] Test flag toggle changes code path execution
  - [ ] Test soft-fail scenarios (flag disabled = graceful degradation)
  - [ ] Target: 80%+ test coverage for flag-related code

- [ ] **Task 016**: Write integration tests
  - [ ] Test flag state persists across application restart
  - [ ] Test multiple endpoints respect flag state
  - [ ] Test console UI correctly reflects database state

- [ ] **Task 017**: Create implementation documentation
  - [ ] Document how to add new features to `AppFeatures` enum
  - [ ] Document usage pattern in code (`AppFeatures.X.isActive()` vs `featureManager.isActive()`)
  - [ ] Document admin console access and usage
  - [ ] Document Actuator API for automation
  - [ ] Create FEATURE_FLAGS.md in project root or docs/

---

## Phase 7: Production Security & Monitoring

- [ ] **Task 018**: Implement console security for production
  - [ ] Configure Spring Security integration
  - [ ] Set `togglz.console.feature-admin-authority: ROLE_ADMIN`
  - [ ] Restrict console access to authenticated admins only

- [ ] **Task 019**: Add monitoring/logging for flag changes
  - [ ] Log when a feature flag is toggled (admin user, timestamp, old/new state)
  - [ ] Expose metrics for flag usage (optional: track toggle count)
  - [ ] Add alerts for unexpected flag state changes

- [ ] **Task 020**: Document runbook for production flag management
  - [ ] "How to safely enable/disable a feature in production"
  - [ ] "How to troubleshoot flag state mismatch across instances"
  - [ ] "How to roll back a flag if feature causes issues"

---

## Acceptance Criteria

- [x] Feature flag system deployed and operational
- [x] Admin console accessible at `/togglz-console` (dev) or authenticated endpoint (prod)
- [x] Flag state persisted to Postgres and survives restarts
- [x] At least 2 example features (ADVANCED_SEARCH, EXPORT_CONTACTS) working
- [x] Code conditionally behaves based on flag state (graceful degradation)
- [x] Unit + integration tests cover all flag behavior
- [x] Actuator API available for script-based flag control
- [x] Production security implemented (RBAC for console)
- [x] Documentation complete

---

## Blocking Issues / Dependencies

- Requires existing Spring Boot 3.3 + Postgres setup (✓ Already present)
- Requires Flyway migrations enabled (✓ Already present)
- Spring Security integration optional but recommended for production

---

## Notes

- Togglz 4.6.2 is latest stable version as of guide creation
- JDBC storage means all instances of backend share same flag state (ideal for clustered deployments)
- Console UI requires no additional frontend work—Togglz provides built-in HTML UI
- Can add more sophisticated strategies later (user targeting, percentage rollouts) if needed
