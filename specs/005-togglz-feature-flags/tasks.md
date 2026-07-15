# Tasks: Runtime Feature Flags with Togglz

**Input**: Design documents from `specs/005-togglz-feature-flags/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Format: `[ID] [P?] [Story] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, etc.)
- File paths are exact locations for implementation

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Maven dependency management

**Duration**: ~30 minutes

- [ ] T001 Add Togglz dependencies to backend/pom.xml (togglz-spring-boot-starter:4.6.2 and togglz-console:4.6.2)
- [ ] T002 Verify Maven resolves dependencies: `mvn clean compile` in backend/
- [ ] T003 [P] Create feature directory structure: backend/src/main/java/com/contactmanager/config/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Togglz infrastructure that must be complete before any user story can function

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Duration**: ~1.5 hours

- [ ] T004 Create AppFeatures enum in backend/src/main/java/com/contactmanager/config/AppFeatures.java with ADVANCED_SEARCH and EXPORT_CONTACTS features, each annotated with @Label
- [ ] T005 Create TogglzConfig Spring configuration class in backend/src/main/java/com/contactmanager/config/TogglzConfig.java, implementing JDBCStateRepository bean with DataSource
- [ ] T006 Add Togglz configuration to backend/src/main/resources/application.yml: togglz.enabled, feature-enums, console.enabled, console.path
- [ ] T007 Create Flyway migration V003__create_togglz_features.sql in backend/src/main/resources/db/migration/ to create TOGGLZ table schema
- [ ] T008 [P] Verify Togglz initialization: Run `mvn spring-boot:run` and check logs for "Togglz FeatureManager initialized" message
- [ ] T009 [P] Verify database migration: Check that TOGGLZ table exists in PostgreSQL via `psql` or console query

**Checkpoint**: Foundation ready — Togglz is initialized, database schema exists, AppFeatures enum registered. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Admin Enables/Disables Features via Console (Priority: P1) 🎯 MVP

**Goal**: Provide administrators with a web UI console at /togglz-console to toggle features on/off with immediate effect

**Independent Test**: Navigate to /togglz-console in browser, verify all features are listed, toggle a feature checkbox, verify state changes immediately, refresh page and verify toggle persists

**Acceptance Scenarios**:
1. Admin navigates to /togglz-console → UI displays all features with current state
2. Admin toggles feature checkbox → feature state changes immediately (no page refresh)
3. Admin closes and reopens browser → feature state is remembered (persisted)

### Tests for User Story 1 ⚠️

- [ ] T010 [P] [US1] Unit test for AppFeatures.isActive() method in backend/src/test/java/com/contactmanager/config/AppFeaturesTest.java, verifying FeatureContext.getFeatureManager().isActive() is called correctly
- [ ] T011 [P] [US1] Integration test for console UI accessibility in backend/src/test/java/com/contactmanager/config/TogglzConsoleIT.java: GET /togglz-console returns 200, HTML contains feature names
- [ ] T012 [US1] Integration test for flag state persistence in backend/src/test/java/com/contactmanager/config/TogglzPersistenceIT.java: Toggle flag via console/JDBC, restart application, verify flag state unchanged

### Implementation for User Story 1

- [ ] T013 [US1] Verify Togglz console UI loads at /togglz-console by accessing via browser and checking table of features (Togglz provides UI automatically, no custom code needed)
- [ ] T014 [US1] Verify console displays ADVANCED_SEARCH feature with correct @Label annotation ("Advanced Contact Search")
- [ ] T015 [US1] Verify console displays EXPORT_CONTACTS feature with correct @Label annotation ("Export Contacts (CSV/PDF)")
- [ ] T016 [P] [US1] Add logging to TogglzConfig to log when feature flags are toggled (admin user, timestamp, old/new state) in backend/src/main/java/com/contactmanager/config/TogglzConfig.java (optional interceptor or listener)
- [ ] T017 [US1] Test console toggle functionality end-to-end: Toggle ADVANCED_SEARCH via console UI, verify state persists in TOGGLZ table
- [ ] T018 [US1] Test console toggle functionality end-to-end: Toggle EXPORT_CONTACTS via console UI, verify state persists in TOGGLZ table

**Checkpoint**: Admin console is fully functional. Users can toggle features on/off via web UI with immediate effect. Feature state persists across restarts.

---

## Phase 4: User Story 2 - Feature State Persists Across Restarts (Priority: P1)

**Goal**: Ensure feature flag state survives application restarts and is shared across multiple backend instances

**Independent Test**: Set flag to disabled, restart backend, verify flag is still disabled without re-configuration. Verify multiple backend instances read same state from shared Postgres.

**Acceptance Scenarios**:
1. Feature is disabled, backend restarts, feature remains disabled
2. Feature is enabled, backend restarts, feature remains enabled
3. Multiple instances: One instance toggles flag, other instances immediately see updated state

### Tests for User Story 2 ⚠️

- [ ] T019 [P] [US2] Integration test for restart persistence in backend/src/test/java/com/contactmanager/config/TogglzRestartIT.java using Testcontainers: Set flag, stop/start embedded Postgres, verify flag unchanged
- [ ] T020 [P] [US2] Integration test for multi-instance consistency in backend/src/test/java/com/contactmanager/config/TogglzMultiInstanceIT.java: Simulate two backend instances sharing same DB, toggle in one, verify other sees change

### Implementation for User Story 2

- [ ] T021 [US2] Verify JDBCStateRepository is configured in TogglzConfig to use DataSource (already implemented in T005, verify with unit test)
- [ ] T022 [US2] Verify Flyway migration V003 creates TOGGLZ table with all required columns (FEATURE_NAME, FEATURE_ENABLED, STRATEGY_ID, STRATEGY_PARAMS)
- [ ] T023 [US2] Test persistence: Toggle flag via console, check TOGGLZ table in Postgres, verify row is updated (not inserted)
- [ ] T024 [US2] Test multi-instance: Verify that backend A and backend B both read from same TOGGLZ table (not separate in-memory caches)
- [ ] T025 [P] [US2] Add documentation in FEATURE_FLAGS.md explaining persistence mechanism and how to troubleshoot state mismatches

**Checkpoint**: Feature flag state is reliably persisted to Postgres. Multiple backend instances share consistent state. No data loss on restart.

---

## Phase 5: User Story 3 - Graceful Degradation When Features Are Disabled (Priority: P1)

**Goal**: Application code checks feature flags and gracefully handles disabled features without crashing or throwing unhandled exceptions

**Independent Test**: Disable ADVANCED_SEARCH, trigger search via API, verify basic search logic runs (or returns graceful error). Disable EXPORT_CONTACTS, trigger export, verify 403 Forbidden (no 500 error).

**Acceptance Scenarios**:
1. ADVANCED_SEARCH disabled: Search endpoint falls back to basic search logic
2. EXPORT_CONTACTS disabled: Export endpoint returns 403 Forbidden with clear message
3. Feature disabled while in use: New requests gracefully degrade (no data loss)
4. Zero unhandled exceptions when feature is disabled

### Tests for User Story 3 ⚠️

- [ ] T026 [P] [US3] Unit test for graceful degradation in backend/src/test/java/com/contactmanager/controller/ContactControllerSearchIT.java: ADVANCED_SEARCH disabled → basicSearchService.search() called (not advancedSearchService)
- [ ] T027 [P] [US3] Unit test for export graceful degradation in backend/src/test/java/com/contactmanager/controller/ContactControllerExportIT.java: EXPORT_CONTACTS disabled → endpoint returns 403 Forbidden with message "Export feature is not available"
- [ ] T028 [US3] Integration test for no exceptions when disabled in backend/src/test/java/com/contactmanager/integration/GracefulDegradationIT.java: Disable all flags, make requests, verify 0 500 errors in logs

### Implementation for User Story 3

- [ ] T029 [US3] Modify ContactController.search() method in backend/src/main/java/com/contactmanager/controller/ContactController.java: Check `AppFeatures.ADVANCED_SEARCH.isActive()`, if false call basicSearchService instead of advancedSearchService
- [ ] T030 [US3] Add graceful degradation for search in ContactService or repository: Implement basicSearchService.search() method that uses simple database query without advanced ranking/filtering
- [ ] T031 [US3] Modify ContactController to add export endpoint (if not present) in backend/src/main/java/com/contactmanager/controller/ContactController.java, check `AppFeatures.EXPORT_CONTACTS.isActive()`, if false return ResponseEntity.status(403).body("Export feature is not available")
- [ ] T032 [P] [US3] Implement ExportService in backend/src/main/java/com/contactmanager/service/ExportService.java with CSV/PDF export methods (called only if flag enabled)
- [ ] T033 [US3] Add unit tests for fallback logic: Verify basicSearchService is called when flag disabled
- [ ] T034 [US3] Add error handling: Ensure no unhandled exceptions are thrown when AppFeatures.isActive() is false
- [ ] T035 [P] [US3] Frontend: Modify ContactCard.tsx to conditionally hide export button if EXPORT_CONTACTS flag is disabled (call useFeatureFlags hook to check status)
- [ ] T036 [P] [US3] Frontend: Modify SearchBar.tsx to show basic vs. advanced search UI based on ADVANCED_SEARCH flag status

**Checkpoint**: All feature-gated code gracefully handles disabled flags. No crashes, no 500 errors. Frontend UI adapts based on flag state. Users experience clear feedback (hidden buttons or 403 messages) when features are disabled.

---

## Phase 6: User Story 4 - Script-Based Flag Control via Actuator API (Priority: P2)

**Goal**: Expose Togglz feature flag state via Spring Boot Actuator REST endpoints for automation and CI/CD workflows

**Independent Test**: Call GET /actuator/togglz to list all flags, call POST /actuator/togglz/FEATURE_NAME to toggle flag, verify state changes in both Actuator response and console UI

**Acceptance Scenarios**:
1. GET /actuator/togglz returns JSON with all features and enabled/disabled state
2. POST /actuator/togglz/ADVANCED_SEARCH with {"enabled": true} toggles flag and returns updated state
3. Actuator API changes are reflected in console UI and database immediately
4. CI/CD script can enable feature before deployment: `curl -X POST http://localhost:8081/actuator/togglz/FEATURE_NAME -d '{"enabled": true}'`

### Tests for User Story 4 ⚠️

- [ ] T037 [P] [US4] Contract test for GET /actuator/togglz endpoint in backend/src/test/java/com/contactmanager/actuator/TogglzActuatorIT.java: Verify response contains "features" JSON object with all flags
- [ ] T038 [P] [US4] Contract test for POST /actuator/togglz/{FEATURE_NAME} endpoint: Verify endpoint accepts JSON body with "enabled" field, returns 200 with updated flag state
- [ ] T039 [US4] Integration test for Actuator persistence in backend/src/test/java/com/contactmanager/actuator/TogglzActuatorPersistenceIT.java: Toggle via Actuator, verify TOGGLZ table is updated, verify console UI reflects change

### Implementation for User Story 4

- [ ] T040 [US4] Verify Togglz Actuator endpoints are automatically exposed in Spring Boot (no custom code needed, Togglz starter handles it)
- [ ] T041 [US4] Test Actuator endpoint: `curl http://localhost:8081/actuator/togglz` and verify JSON response with feature states
- [ ] T042 [US4] Test Actuator toggle: `curl -X POST http://localhost:8081/actuator/togglz/ADVANCED_SEARCH -H "Content-Type: application/json" -d '{"enabled": true}'` and verify flag is toggled
- [ ] T043 [P] [US4] Add configuration in backend/src/main/resources/application.yml to expose togglz endpoint: `management.endpoints.web.exposure.include: togglz`
- [ ] T044 [US4] Verify Actuator changes are persisted: Toggle via Actuator, check database, verify TOGGLZ row is updated
- [ ] T045 [US4] Create CI/CD script example in docs/ or README.md showing how to toggle flag via Actuator API before deployment
- [ ] T046 [P] [US4] Frontend: Create useFeatureFlags hook in frontend/src/hooks/useFeatureFlags.ts to call GET /actuator/togglz, cache result, poll every 30s for updates
- [ ] T047 [US4] Frontend: Test useFeatureFlags hook in frontend/src/hooks/useFeatureFlags.test.tsx, verify it fetches from Actuator API and updates state on changes

**Checkpoint**: Actuator API fully functional. Automation/CI-CD workflows can toggle flags without manual console access. Frontend can check flag status via API.

---

## Phase 7: User Story 5 - Production-Ready Security with Role-Based Access (Priority: P2)

**Goal**: Restrict access to admin console and Actuator endpoints to authenticated administrators (ROLE_ADMIN) in production environments

**Independent Test**: Unauthenticated user → 401 Unauthorized. User without ROLE_ADMIN → 403 Forbidden. User with ROLE_ADMIN → 200 OK, console accessible.

**Acceptance Scenarios**:
1. Console secured: togglz.console.secured: true in production, requires ROLE_ADMIN
2. Unauthenticated access denied: No auth token → 401 Unauthorized
3. Non-admin access denied: User with ROLE_USER → 403 Forbidden
4. Admin access granted: User with ROLE_ADMIN → console fully accessible
5. Audit trail: All flag toggles logged with admin user identity and timestamp

### Tests for User Story 5 ⚠️

- [ ] T048 [P] [US5] Security test for console access in backend/src/test/java/com/contactmanager/security/TogglzSecurityIT.java: Unauthenticated user → 401, ROLE_USER → 403, ROLE_ADMIN → 200
- [ ] T049 [P] [US5] Security test for Actuator API access: Verify POST /actuator/togglz/* requires ROLE_ADMIN (or at least authentication)
- [ ] T050 [US5] Audit test: Verify all console/API toggles are logged with admin user identity, timestamp, feature name, old state, new state

### Implementation for User Story 5

- [ ] T051 [US5] Configure Togglz console security in backend/src/main/resources/application.yml: Set `togglz.console.secured: true` and `togglz.console.feature-admin-authority: ROLE_ADMIN` for production profile
- [ ] T052 [US5] Verify Spring Security configuration in backend/src/main/java/com/contactmanager/config/SecurityConfig.java allows ROLE_ADMIN access to /togglz-console
- [ ] T053 [P] [US5] Add logging interceptor or aspect in backend/src/main/java/com/contactmanager/config/TogglzConfig.java to log all flag toggles with admin user from SecurityContext
- [ ] T054 [US5] Test security: Disable flag authentication locally, access console (should work), enable security, verify 401/403 responses
- [ ] T055 [P] [US5] Document security configuration in FEATURE_FLAGS.md: Explain togglz.console.secured, feature-admin-authority, Spring Security integration
- [ ] T056 [US5] Add production deployment instructions in docs/DEPLOYMENT.md: How to configure console access with Spring Security and ROLE_ADMIN
- [ ] T057 [US5] Verify audit logging is working: Toggle flag, check application logs for structured log entry with admin user and timestamp

**Checkpoint**: Console and API are secured in production. Only ROLE_ADMIN users can toggle flags. All changes are audited. Development environments can use unsecured console for faster iteration.

---

## Phase 8: User Story 6 - Initial Features for Testing (Priority: P2)

**Goal**: Ship application with two example features (ADVANCED_SEARCH, EXPORT_CONTACTS) so administrators can immediately test feature flag system without adding custom features

**Independent Test**: Console displays ADVANCED_SEARCH and EXPORT_CONTACTS, toggle each, verify corresponding application behavior changes (search changes, export becomes available/unavailable)

**Acceptance Scenarios**:
1. ADVANCED_SEARCH appears in console with label "Advanced Contact Search"
2. EXPORT_CONTACTS appears in console with label "Export Contacts (CSV/PDF)"
3. Toggling ADVANCED_SEARCH changes search behavior in application
4. Toggling EXPORT_CONTACTS changes export feature availability
5. Example features serve as documentation pattern for adding new features

### Tests for User Story 6 ⚠️

- [ ] T058 [P] [US6] End-to-end test for feature examples in backend/src/test/java/com/contactmanager/feature/ExampleFeaturesE2EIT.java: Toggle ADVANCED_SEARCH, make search request, verify behavior. Toggle EXPORT_CONTACTS, make export request, verify behavior.

### Implementation for User Story 6

- [ ] T059 [US6] Verify AppFeatures enum contains ADVANCED_SEARCH and EXPORT_CONTACTS entries (implemented in T004)
- [ ] T059 [US6] Verify ADVANCED_SEARCH is annotated with @Label("Advanced Contact Search") in AppFeatures enum
- [ ] T060 [US6] Verify EXPORT_CONTACTS is annotated with @Label("Export Contacts (CSV/PDF)") in AppFeatures enum
- [ ] T061 [US6] Verify ContactController implements search behavior based on ADVANCED_SEARCH flag (T029-T030)
- [ ] T062 [US6] Verify ContactController implements export behavior based on EXPORT_CONTACTS flag (T031-T032)
- [ ] T063 [P] [US6] Create documentation example in FEATURE_FLAGS.md showing how to add a new feature to AppFeatures enum and implement flag checks in code
- [ ] T064 [US6] Create example deployment script in docs/examples/toggle-feature-example.sh showing how to toggle features via Actuator API
- [ ] T065 [US6] Verify both example features work end-to-end: Toggle via console, verify application behavior changes, verify persists across restart

**Checkpoint**: Two example features are fully functional and documented as pattern for future features. Administrators can test feature flag system immediately upon deployment. Documentation enables easy addition of new toggleable features.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements, documentation, and final validation across all user stories

**Duration**: ~1 hour

- [ ] T066 [P] Documentation: Create or update FEATURE_FLAGS.md in project root with: architecture overview, adding new features guide, CLI examples, troubleshooting
- [ ] T067 [P] Documentation: Update README.md to mention feature flags system and link to FEATURE_FLAGS.md
- [ ] T068 [P] Testing: Run all integration tests and verify 80%+ test coverage for Togglz-related code via JaCoCo: `mvn jacoco:report`
- [ ] T069 [P] Performance: Verify flag check adds < 5ms latency per API call via load test (existing performance tests)
- [ ] T070 Testing: Execute quickstart.md validation scenarios (scenarios 1-8) and document pass/fail results
- [ ] T071 [P] Security hardening: Run security linter (if present) on new Togglz-related code
- [ ] T072 [P] Code cleanup: Run `mvn spotless:apply` (backend) and `npm run format` (frontend) to ensure code style compliance
- [ ] T073 [P] Linting: Run `mvn checkstyle:check` (backend) and `npm run lint` (frontend) and fix any violations
- [ ] T074 Update CLAUDE.md: Add Togglz-related configuration details and file locations to project documentation
- [ ] T075 [P] Frontend: Verify all feature-gated UI components conditionally render based on useFeatureFlags hook
- [ ] T076 [P] Frontend: Run `npm run test:coverage` and verify 80%+ coverage for feature flag-related tests
- [ ] T077 Create PR: Review all changes, ensure Constitution compliance, create PR for merge to main
- [ ] T078 Final validation: Run full test suite (`mvn test` + `npm test`) and deploy to staging for final verification

**Checkpoint**: Feature flag system is production-ready. Documentation complete. All tests pass with 80%+ coverage. Code style compliant. Ready for merge and production deployment.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately (~30 min)
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories** (~1.5 hours)
- **User Stories (Phases 3-8)**: All depend on Foundational phase completion
  - P1 stories (US1, US2, US3) can proceed in parallel OR sequentially (~3 hours)
  - P2 stories (US4, US5, US6) can proceed in parallel after P1 OR sequentially (~2 hours)
- **Polish (Phase 9)**: Depends on all desired user stories being complete (~1 hour)

### User Story Dependencies

- **US1 (Admin Console)**: Depends on Foundational (Phase 2) - No dependencies on other stories
- **US2 (Persistence)**: Depends on Foundational - No dependencies on other stories (actually prerequisite for US1/US3 to work correctly)
- **US3 (Graceful Degradation)**: Depends on US2 (persistence must work) - Depends on Foundational
- **US4 (Actuator API)**: Depends on Foundational - No dependencies on US1/US2/US3 (parallel possible)
- **US5 (Security)**: Depends on Foundational and US1 (needs console to secure) - Can be done after US1
- **US6 (Example Features)**: Depends on US3 (needs graceful degradation implemented for examples to work)

### Recommended Execution Order

**For MVP (fastest path to deployable product)**:
1. Phase 1: Setup (30 min)
2. Phase 2: Foundational (1.5 hours) ← **Critical blocker**
3. Phase 3: US1 Admin Console (1 hour)
4. Phase 4: US2 Persistence (1 hour) ← Validates US1 works after restart
5. **STOP and VALIDATE** - At this point, core feature flag system works end-to-end
6. Phase 9: Polish (1 hour) - Documentation, testing, code quality
7. **DEPLOY MVP** 🚀

**For full feature (all user stories)**:
1. Phases 1-2: Setup + Foundational
2. Phase 3-5: US1, US2, US3 (can do in parallel or sequence)
3. Phase 6-8: US4, US5, US6 (can do in parallel)
4. Phase 9: Polish
5. **DEPLOY FULL FEATURE** 🚀

### Parallel Opportunities

**Within Phase 1 (Setup)**:
- T003: Create directories (can happen anytime)

**Within Phase 2 (Foundational)**:
- T004, T005: AppFeatures enum and TogglzConfig (different files, no dependencies - can parallelize)
- T008, T009: Verification tasks (can run together after T006)

**Within Phase 3 (US1 Admin Console)**:
- No tasks marked [P] (console is provided by Togglz, minimal custom code)
- T010-T012: Tests can run in parallel with each other

**Within Phase 4 (US2 Persistence)**:
- T019, T020: Persistence tests can run in parallel
- T021-T022: Verification tasks can run in parallel

**Within Phase 5 (US3 Graceful Degradation)**:
- T026-T027: Unit tests can run in parallel
- T029-T030: Search implementation tasks can run in parallel (different files)
- T031-T032: Export implementation can run in parallel (different from search)
- T035-T036: Frontend modifications can run in parallel

**Within Phase 4 (US4 Actuator API)**:
- T037-T038: Contract tests can run in parallel

**Within Phase 6 (US5 Security)**:
- T048-T049: Security tests can run in parallel

**Between Phases (After Foundational)**:
- Once Phase 2 completes, Phases 3-4 (US1, US2) can run in parallel
- Once US1-US3 complete, Phases 6-8 (US4, US5, US6) can run in parallel
- With sufficient team capacity: Could have 3 developers work on US1, US2, US3 simultaneously after Phase 2

---

## Parallel Example: User Story 3 (Graceful Degradation)

```bash
# After Phase 2 (Foundational) is complete:

# Launch tests first (can run together):
Task T026: Unit test graceful degradation (search)
Task T027: Unit test graceful degradation (export)
Task T028: Integration test no exceptions

# Once tests are written and failing:
Task T029: Modify ContactController.search()
Task T030: Implement basicSearchService (depends on T029)
Task T031: Modify ContactController export endpoint
Task T032: Implement ExportService (depends on T031)
Task T035: Frontend: Hide export button if flag disabled
Task T036: Frontend: Show basic/advanced search UI

# Validation:
Task T033: Verify fallback logic
Task T034: Verify no unhandled exceptions
```

---

## Implementation Strategy

### MVP First (User Stories 1-3)

**Delivers**: Core feature flag functionality (admin console, persistence, graceful degradation)

1. Complete Phase 1: Setup (~30 min)
2. Complete Phase 2: Foundational (~1.5 hours) ← **Critical**
3. Complete Phase 3: User Story 1 Admin Console (~1 hour)
4. Complete Phase 4: User Story 2 Persistence (~1 hour)
5. Complete Phase 5: User Story 3 Graceful Degradation (~1 hour)
6. **STOP and VALIDATE**: Execute Scenario 1-5 from quickstart.md
7. Complete Phase 9: Polish (~1 hour)
8. **Deploy MVP** to production

**Time to MVP**: ~6 hours

**Value delivered**: Admins can toggle features on/off via web console. Features degrade gracefully when disabled. State persists across restarts.

### Incremental Delivery (All Features)

1. Complete MVP first (above)
2. Add Phase 6: US4 Actuator API (~1.5 hours) - Automation, CI/CD script control
3. Deploy 2nd increment
4. Add Phase 7: US5 Security (~1.5 hours) - Production security with ROLE_ADMIN
5. Deploy 3rd increment
6. Add Phase 8: US6 Example Features (~1 hour) - Fully documented examples
7. Deploy final feature set

**Time to full feature**: ~12 hours total

### Parallel Team Strategy (3 Developers)

With sufficient team:

```
Developer A:           Developer B:           Developer C:
Phase 1, 2 (setup)     Phase 1, 2 (setup)     Phase 1, 2 (setup)
Wait for Phase 2 → ✓   Wait for Phase 2 → ✓   Wait for Phase 2 → ✓
  |                      |                      |
Phase 3: US1           Phase 4: US2           Phase 5: US3
(Admin Console)        (Persistence)          (Graceful Degradation)
  |                      |                      |
  ✓ Complete in ~1h      ✓ Complete in ~1h      ✓ Complete in ~1h
  |                      |                      |
Phase 6: US4           Phase 7: US5           Phase 8: US6
(Actuator API)         (Security)             (Example Features)
  |                      |                      |
  ✓ Complete in ~1.5h    ✓ Complete in ~1.5h    ✓ Complete in ~1h
     |__________________|__________________|
                    |
              All tasks complete
              Phase 9: Polish (final hour)
              Deploy to production
```

**Total time with 3 developers**: ~5 hours (2 hours sequential setup, 2-3 hours parallel implementation + Polish)

---

## Notes

- **[P] tasks**: Different files, no dependencies on incomplete tasks — can parallelize
- **[Story] label**: Maps task to specific user story for traceability and independent testing
- **Each user story**: Should be independently completable and testable (can deploy just one story if needed)
- **Test-first**: Write tests and verify they FAIL before implementing
- **Commit strategy**: Commit after each task or logical group (T001, T002-T003, T004-T005, etc.)
- **Validation**: Stop at any checkpoint to independently validate and test that story
- **Avoid**: Vague tasks, same file conflicts, cross-story dependencies that break independence
- **MVP definition**: Phases 1-5 only (Setup + Foundational + US1 + US2 + US3) = 6 hours = feature flag system is functional
- **Full feature**: Phases 1-9 (all user stories + polish) = 12 hours = production-ready with all bells and whistles

---

## Quick Links

- **Quickstart Validation**: specs/005-togglz-feature-flags/quickstart.md (8 scenarios to validate implementation)
- **API Contracts**: specs/005-togglz-feature-flags/contracts/actuator-togglz-api.md (Actuator endpoint specs)
- **Data Model**: specs/005-togglz-feature-flags/data-model.md (TOGGLZ table schema, AppFeatures enum)
- **Research**: specs/005-togglz-feature-flags/research.md (Design decisions and alternatives)
- **Plan**: specs/005-togglz-feature-flags/plan.md (Technical architecture and Constitution check)
