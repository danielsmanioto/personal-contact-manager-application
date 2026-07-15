# Quickstart: Validating Togglz Feature Flags

**Phase**: Phase 1 (Design & Contracts)  
**Date**: 2026-07-14  
**Purpose**: End-to-end validation that feature flag system is working correctly

---

## Prerequisites

- Backend running: `mvn spring-boot:run` on port 8081
- Frontend running: `npm run dev` on port 5173 (optional, for testing graceful degradation)
- PostgreSQL running (either local or via docker-compose)
- Java 21, Maven 3.9+, Node.js 18+

---

## Validation Scenarios

### Scenario 1: Admin Console is Accessible (Development)

**Objective**: Verify the Togglz admin console UI loads and displays features

**Steps**:

1. Start backend: `export JAVA_HOME=$(/usr/libexec/java_home) && mvn spring-boot:run`
2. Open browser: `http://localhost:8081/togglz-console`
3. Verify you see a table with:
   - Column headers: Feature Name, Description, Status, Edit
   - Row 1: ADVANCED_SEARCH (enabled/disabled toggle)
   - Row 2: EXPORT_CONTACTS (enabled/disabled toggle)

**Expected Result**: ✅ Console loads, both features visible, toggles clickable

**Troubleshooting**:
- 404 error? → Check `togglz.console.enabled: true` in `application.yml`
- Empty feature list? → Check `feature-enums: com.contactmanager.config.AppFeatures` in `application.yml`
- Toggles not responding? → Check backend logs for exceptions; verify Postgres connection

---

### Scenario 2: Flag State Persists Across Restart

**Objective**: Verify feature flag state survives application restart

**Steps**:

1. Open console: `http://localhost:8081/togglz-console`
2. Toggle ADVANCED_SEARCH to enabled (check the checkbox)
3. Verify checkbox shows checked state
4. Stop backend (Ctrl+C in terminal)
5. Wait 3 seconds
6. Start backend again: `mvn spring-boot:run`
7. Wait for "Started" message in logs (~15 seconds)
8. Open console again: `http://localhost:8081/togglz-console`
9. Verify ADVANCED_SEARCH is still enabled (checkbox still checked)

**Expected Result**: ✅ Flag state persists, no need to re-toggle after restart

**Troubleshooting**:
- Flag is disabled after restart? → Check Postgres connection; verify TOGGLZ table exists and has data
- Run: `docker-compose exec postgres psql -U postgres -d contact_manager -c "SELECT * FROM TOGGLZ;"`

---

### Scenario 3: Actuator API Returns Flag Status

**Objective**: Verify REST API exposes feature flag state for frontend consumption

**Steps**:

1. Open terminal and run:
   ```bash
   curl http://localhost:8081/actuator/togglz
   ```

2. Verify response is valid JSON with:
   ```json
   {
     "features": {
       "ADVANCED_SEARCH": {"enabled": true, "label": "..."},
       "EXPORT_CONTACTS": {"enabled": false, "label": "..."}
     }
   }
   ```

3. Verify both features are present with correct labels

**Expected Result**: ✅ API returns 200 with JSON containing both features

**Troubleshooting**:
- 404 error? → Check Actuator is enabled in `application.yml` under `management.endpoints.web.exposure.include`
- Empty features? → Check backend logs for Togglz initialization errors

---

### Scenario 4: Actuator API Toggles Flag State

**Objective**: Verify admin can toggle flags via REST API (useful for CI/CD automation)

**Steps**:

1. Initial state: Check EXPORT_CONTACTS status:
   ```bash
   curl http://localhost:8081/actuator/togglz | jq '.features.EXPORT_CONTACTS.enabled'
   # Expected: false (default disabled)
   ```

2. Toggle to enabled via API:
   ```bash
   curl -X POST http://localhost:8081/actuator/togglz/EXPORT_CONTACTS \
     -H "Content-Type: application/json" \
     -d '{"enabled": true}'
   ```

3. Verify response:
   ```json
   {"name": "EXPORT_CONTACTS", "enabled": true, ...}
   ```

4. Verify state changed:
   ```bash
   curl http://localhost:8081/actuator/togglz | jq '.features.EXPORT_CONTACTS.enabled'
   # Expected: true
   ```

5. Verify console reflects change:
   - Open `http://localhost:8081/togglz-console`
   - Confirm EXPORT_CONTACTS toggle is now checked

**Expected Result**: ✅ API toggle changes state, console reflects change

**Troubleshooting**:
- 400 error? → Verify feature name is correct (case-sensitive: EXPORT_CONTACTS not export_contacts)
- 503 error? → Postgres connection failed; check Postgres logs

---

### Scenario 5: Graceful Degradation (Search Fallback)

**Objective**: Verify that disabling ADVANCED_SEARCH falls back to basic search gracefully

**Prerequisites**: Frontend running (`npm run dev`)

**Steps**:

1. Console: Disable ADVANCED_SEARCH
   - Open `http://localhost:8081/togglz-console`
   - Uncheck ADVANCED_SEARCH toggle
   - Wait 2 seconds for cache refresh

2. Frontend: Trigger search
   - Open `http://localhost:5173`
   - Type in search box (e.g., "john")
   - Press Enter or wait for debounce

3. Verify behavior:
   - Search results appear (basic search logic runs)
   - No error messages
   - Results are correct (may be basic search results, not advanced)

4. Console: Re-enable ADVANCED_SEARCH
   - Checked the ADVANCED_SEARCH toggle
   - Wait 2 seconds

5. Frontend: Trigger search again
   - Type in search box
   - Verify advanced search features are back (if any—may not be visually different in MVP)

**Expected Result**: ✅ Search works both with flag enabled and disabled (graceful degradation)

**Troubleshooting**:
- 500 server error when flag is disabled? → Bug in controller; verify flag check implementation
- "Feature unavailable" message? → Check if frontend is calling endpoint that returns 403 (acceptable UX)
- Frontend shows "undefined" or blank results? → Check error handling in useFeatureFlags hook

---

### Scenario 6: Graceful Degradation (Export Feature Disabled)

**Objective**: Verify that disabling EXPORT_CONTACTS prevents export without crashing

**Prerequisites**: Frontend running with export UI visible

**Steps**:

1. Console: Disable EXPORT_CONTACTS
   - Open `http://localhost:8081/togglz-console`
   - Uncheck EXPORT_CONTACTS toggle
   - Wait 2 seconds

2. Frontend: Try to export
   - Open `http://localhost:5173`
   - Click "Export" button (if visible) or trigger export via API

3. Verify behavior:
   - Export button is hidden OR
   - Export endpoint returns 403 Forbidden with clear message OR
   - Export is silently unavailable (acceptable, depending on implementation)
   - No 500 error

4. Console: Re-enable EXPORT_CONTACTS
   - Check the EXPORT_CONTACTS toggle
   - Wait 2 seconds

5. Frontend: Try to export again
   - Export button is visible
   - Export succeeds

**Expected Result**: ✅ Export works/unavailable based on flag, no crashes

**Troubleshooting**:
- Export button doesn't hide when flag disabled? → Frontend not calling useFeatureFlags hook; check component logic
- 500 error on export? → Backend not checking flag; verify flag check in controller
- Export succeeds when flag disabled? → Flag check not implemented; verify code

---

### Scenario 7: Database Persistence Verification

**Objective**: Verify TOGGLZ table is created and populated correctly

**Steps**:

1. Connect to Postgres:
   ```bash
   docker-compose exec postgres psql -U postgres -d contact_manager
   ```

2. Query TOGGLZ table:
   ```sql
   SELECT * FROM TOGGLZ;
   ```

3. Verify output:
   ```
    feature_name    | feature_enabled | strategy_id | strategy_params
   -----------------+-----------------+-------------+----------------
    ADVANCED_SEARCH |               1 |             |
    EXPORT_CONTACTS |               0 |             |
   (2 rows)
   ```

4. Toggle a flag via console or API and re-query:
   ```bash
   # Toggle EXPORT_CONTACTS to true via console
   # Then:
   SELECT feature_name, feature_enabled FROM TOGGLZ WHERE feature_name = 'EXPORT_CONTACTS';
   # Should show: EXPORT_CONTACTS | 1
   ```

**Expected Result**: ✅ TOGGLZ table exists with both features, state persists correctly

**Troubleshooting**:
- "TOGGLZ table does not exist"? → Migration V003 didn't run; check Flyway logs
- Feature not in table? → Enum entry not registered; verify AppFeatures enum

---

### Scenario 8: Production Security (ROLE_ADMIN Required)

**Objective**: Verify console access is restricted in production configuration

**Steps**:

1. Modify `application.yml` to enable security:
   ```yaml
   togglz:
     console:
       enabled: true
       path: /togglz-console
       secured: true  # Enable security
       feature-admin-authority: ROLE_ADMIN
   ```

2. Restart backend: `mvn spring-boot:run`

3. Try to access console without authentication:
   ```bash
   curl http://localhost:8081/togglz-console
   ```
   - Expected: 401 Unauthorized or redirect to login

4. Try with valid Spring Security token:
   ```bash
   curl -H "Authorization: Bearer $TOKEN" http://localhost:8081/togglz-console
   ```
   - Expected: 403 Forbidden if user doesn't have ROLE_ADMIN

5. Try with ROLE_ADMIN token:
   ```bash
   curl -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:8081/togglz-console
   ```
   - Expected: 200 OK, console HTML returned

**Expected Result**: ✅ Security layer prevents unauthorized access

**Troubleshooting**:
- Still seeing console without auth? → `secured: true` not applied; restart backend
- Getting 500 error with security enabled? → Spring Security misconfiguration; check ROLE_ADMIN grant logic

---

## Validation Checklist

After running all scenarios, verify:

- [ ] Scenario 1: Admin console loads with both features visible
- [ ] Scenario 2: Flag state persists after restart
- [ ] Scenario 3: Actuator API returns correct JSON with flag states
- [ ] Scenario 4: Actuator API toggles flags correctly
- [ ] Scenario 5: Search gracefully falls back when ADVANCED_SEARCH disabled
- [ ] Scenario 6: Export is unavailable when EXPORT_CONTACTS disabled (no crash)
- [ ] Scenario 7: TOGGLZ database table exists and persists correctly
- [ ] Scenario 8: Security layer restricts console to authenticated ROLE_ADMIN users

**If all pass**: ✅ Feature flag system is ready for integration into development workflow

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "TOGGLZ table does not exist" | Flyway migration didn't run | Check migration file exists in `db/migration/`; check Flyway logs |
| "AppFeatures enum not found" | Classpath scanning failed | Verify `feature-enums: com.contactmanager.config.AppFeatures` in `application.yml` |
| Console shows features but toggles don't work | JDBC repository not configured | Check `TogglzConfig.java` creates JDBCStateRepository bean |
| Feature state doesn't change across instances | Instances not sharing database | Verify all instances point to same Postgres; check datasource config |
| Frontend doesn't react to flag changes | Frontend not polling Actuator API | Verify `useFeatureFlags` hook calls `/actuator/togglz` endpoint |

---

## Next Steps

After validation passes:

1. **Run Tests**: Execute full test suite to verify no regressions
   ```bash
   mvn test                    # Backend
   npm test                    # Frontend
   ```

2. **Review Code**: Check code review checklist
   - Feature checks use consistent `AppFeatures.FEATURE.isActive()` pattern
   - Graceful degradation logic is sound (no exceptions thrown)
   - Tests cover both flag=enabled and flag=disabled code paths

3. **Merge to Main**: Create PR and merge after approval

4. **Monitor Production**: Watch logs for unexpected flag state changes

---

## Documentation References

- **API Contract**: See `contracts/actuator-togglz-api.md` for detailed endpoint specs
- **Data Model**: See `data-model.md` for TOGGLZ table schema
- **Research**: See `research.md` for design rationale and alternatives considered
