# Data Model: Togglz Feature Flags

**Phase**: Phase 1 (Design & Contracts)  
**Date**: 2026-07-14

---

## Overview

The Togglz feature flag system introduces a single persistent entity for runtime feature toggling. This model maps to the TOGGLZ table in PostgreSQL and is managed by Togglz library (not direct application code).

---

## Entity: Feature Flag

**Represents**: A toggleable application feature with runtime state

**Persistence**: PostgreSQL table `TOGGLZ` (managed by Togglz library)

### Schema Definition

```sql
CREATE TABLE TOGGLZ (
  FEATURE_NAME VARCHAR(100) PRIMARY KEY,
  FEATURE_ENABLED INTEGER,        -- 0 = disabled, 1 = enabled
  STRATEGY_ID VARCHAR(200),       -- NULL for simple on/off, contains strategy name for advanced features
  STRATEGY_PARAMS VARCHAR(2000)   -- Null for simple on/off, contains strategy-specific parameters (JSON)
);
```

### Field Definitions

| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| `FEATURE_NAME` | VARCHAR(100) | No | Primary key; matches enum name in `AppFeatures.java` (e.g., "ADVANCED_SEARCH") |
| `FEATURE_ENABLED` | INTEGER | No | 0 = disabled, 1 = enabled (JDBC prefers INTEGER over BOOLEAN for portability) |
| `STRATEGY_ID` | VARCHAR(200) | Yes | For advanced use (v2+): rollout strategies (e.g., "percentage", "time-based"). NULL for simple on/off toggles. |
| `STRATEGY_PARAMS` | VARCHAR(2000) | Yes | Strategy-specific JSON config (e.g., `{"percentage": 50}` for 50% rollout). NULL for simple toggles. |

### Constraints & Validation

1. **Primary Key**: `FEATURE_NAME` is unique (one row per feature)
2. **Enum Consistency**: Feature name MUST correspond to an entry in `AppFeatures` enum (enforced at application layer, not DB)
3. **State Values**: `FEATURE_ENABLED` is always 0 or 1 (enforced by Togglz library)
4. **Strategy Dependencies**: If `STRATEGY_ID` is non-null, `STRATEGY_PARAMS` should contain valid JSON (not enforced at DB layer; validation in Togglz library)

---

## Entity: AppFeatures (In-Memory Enum)

**Represents**: The application's feature registry

**Location**: `backend/src/main/java/com/contactmanager/config/AppFeatures.java`

**Scope**: Application-scoped (loaded at startup, defines all toggleable features)

### Definition

```java
public enum AppFeatures implements Feature {
  @Label("Advanced Contact Search")
  ADVANCED_SEARCH,

  @Label("Export Contacts (CSV/PDF)")
  EXPORT_CONTACTS;

  public boolean isActive() {
    return FeatureContext.getFeatureManager().isActive(this);
  }
}
```

### Notes

- Enum entries map 1:1 to rows in TOGGLZ table
- `@Label` annotations provide human-readable UI labels in console
- `isActive()` convenience method avoids boilerplate in application code
- Adding new features: Add enum entry, annotate with `@Label`, restart application (Togglz auto-initializes TOGGLZ table row on startup)

---

## Relationship: Feature → Database State

```
AppFeatures.ADVANCED_SEARCH (enum)
  ↓
  Togglz FeatureManager (in-memory cache)
  ↓
  TOGGLZ table (PostgreSQL) ← source of truth
```

**Flow**:
1. Application starts → AppFeatures enum is scanned
2. Togglz initializes JDBCStateRepository → queries TOGGLZ table
3. In-memory cache populated with flag states
4. Code calls `AppFeatures.ADVANCED_SEARCH.isActive()` → checks in-memory cache (O(1) lookup)
5. Admin toggles flag in console → updates TOGGLZ row → Togglz invalidates in-memory cache → next check reads updated state

**Consistency**: Strong consistency via single Postgres backend; no distributed coordination needed.

---

## State Transitions

```
Feature State Lifecycle:

[Enum Entry Added] → [Togglz Scans] → [Auto-Initialized in DB: disabled]
                          ↓
                    [Admin Toggles in Console]
                          ↓
                    [TOGGLZ row updated]
                          ↓
                    [In-Memory Cache Invalidated]
                          ↓
                    [Next Check Reads New State]
```

**Notes**:
- Initialization: New features default to DISABLED (safe default)
- Atomicity: Toggle operation is atomic at JDBC level (JDBC transaction)
- Propagation: State change visible to all backend instances within 1 second (next cache refresh)

---

## Validation Rules

| Rule | Applied At | Consequence |
|------|------------|-------------|
| `FEATURE_ENABLED` ∈ {0, 1} | Togglz Library | Invalid values rejected (no stored procedures for validation) |
| `FEATURE_NAME` matches AppFeatures enum | Application Layer | Unknown features cannot be toggled (Togglz only recognizes registered features) |
| New features start disabled | Togglz Library | Safe default prevents accidental feature exposure |
| No circular feature dependencies | Application Logic | Documented in feature flag runbook (no enforcement at DB level) |

---

## Relationships to Other Entities

### Feature → Contact (Implicit)

Features like `ADVANCED_SEARCH` and `EXPORT_CONTACTS` affect how contacts are retrieved/processed:

- **ADVANCED_SEARCH** enabled: `ContactRepository.searchAdvanced()` is called
- **ADVANCED_SEARCH** disabled: `ContactRepository.searchBasic()` is called
- Same contact data; different query strategy

**No direct FK constraint** (contact table unchanged; logic in application layer)

### Feature → User (Audit Trail)

When a feature is toggled via console:
- `admin_user` (authenticated Spring Security user) is logged
- `timestamp` of toggle is recorded
- Stored in application logs (ELK/file appender), not in TOGGLZ table

**No direct FK constraint** (audit maintained in logging layer, not DB schema)

---

## Data Size & Performance

### TOGGLZ Table Size

- **Row count**: Number of features (initially 2, expected < 100 in typical projects)
- **Row size**: ~400 bytes (FEATURE_NAME 100B + FEATURE_ENABLED 8B + STRATEGY_ID 200B + STRATEGY_PARAMS 2000B)
- **Total size**: ~40KB for 100 features (negligible)
- **Growth**: Minimal; features added during development, not at runtime based on data

### Query Performance

| Operation | Query | Rows | Index | Latency |
|-----------|-------|------|-------|---------|
| Read feature state | `SELECT FEATURE_ENABLED FROM TOGGLZ WHERE FEATURE_NAME = ?` | 1 | PK | < 1ms |
| Read all features (console UI) | `SELECT * FROM TOGGLZ` | ~10-100 | Full scan | < 5ms |
| Toggle feature | `UPDATE TOGGLZ SET FEATURE_ENABLED = ? WHERE FEATURE_NAME = ?` | 1 | PK | < 2ms |

**Index Strategy**:
- Primary key index on `FEATURE_NAME` (automatic)
- No additional indexes needed (small table, primary key access pattern)

---

## Migration Strategy

### Initial Setup (V003__create_togglz_features.sql)

```sql
CREATE TABLE IF NOT EXISTS TOGGLZ (
  FEATURE_NAME VARCHAR(100) PRIMARY KEY,
  FEATURE_ENABLED INTEGER NOT NULL DEFAULT 0,
  STRATEGY_ID VARCHAR(200),
  STRATEGY_PARAMS VARCHAR(2000)
);
```

**Flyway Version**: V003 (follows existing V001, V002 migrations)

### Adding New Features (Future)

1. Add enum entry to `AppFeatures.java`
2. Restart application (Togglz auto-creates TOGGLZ row if missing)
3. No migration needed (schema unchanged)

### Removing Features (Future)

1. Remove enum entry from `AppFeatures.java`
2. Delete from codebase all `AppFeatures.FEATURE.isActive()` checks
3. Optionally: Delete row from TOGGLZ table (manual cleanup, not required)

---

## Access Patterns

### Read Access

- **By Application Code**: `AppFeatures.FEATURE.isActive()` → cache lookup (O(1))
- **By Admin Console**: UI queries all flags → reads TOGGLZ table → displays checkboxes
- **By Frontend**: `GET /actuator/togglz` API → returns flag states as JSON

### Write Access

- **By Admin Console**: Toggle checkbox → `POST /togglz-console/toggleFeature` (Togglz endpoint) → updates TOGGLZ row
- **By Actuator API**: `POST /actuator/togglz/FEATURE_NAME` → updates TOGGLZ row
- **By Application Code**: Never (flags are read-only from app perspective; only admins write)

---

## Example Data

```sql
-- Initial state after application startup
INSERT INTO TOGGLZ (FEATURE_NAME, FEATURE_ENABLED, STRATEGY_ID, STRATEGY_PARAMS) VALUES
('ADVANCED_SEARCH', 1, NULL, NULL),
('EXPORT_CONTACTS', 0, NULL, NULL);

-- After admin disables ADVANCED_SEARCH
UPDATE TOGGLZ SET FEATURE_ENABLED = 0 WHERE FEATURE_NAME = 'ADVANCED_SEARCH';

-- After admin enables EXPORT_CONTACTS
UPDATE TOGGLZ SET FEATURE_ENABLED = 1 WHERE FEATURE_NAME = 'EXPORT_CONTACTS';
```

---

## Summary

The TOGGLZ table provides minimal, durable storage for feature flag state. The data model is simple by design—Togglz library handles all persistence, caching, and consistency logic. Application code interacts only via the `AppFeatures` enum; infrastructure code (console, Actuator API) manages the table directly through Togglz abstraction.

**Key Properties**:
- ✅ Single source of truth (PostgreSQL)
- ✅ Multi-instance consistency (shared backend)
- ✅ High performance (O(1) checks, minimal table size)
- ✅ Simple schema (no complex relationships or constraints)
- ✅ Extensible pattern (enum-based feature registry)
