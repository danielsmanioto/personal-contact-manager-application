# API Contract: Togglz Actuator Endpoints

**Phase**: Phase 1 (Design & Contracts)  
**Date**: 2026-07-14  
**Scope**: Spring Boot Actuator endpoints for Togglz feature flag management

---

## Overview

Togglz integrates with Spring Boot Actuator to expose feature flag state via REST endpoints. These endpoints enable:
- Reading current flag states (for frontend UI, CI/CD scripts)
- Toggling flags programmatically (for automated deployments)
- Monitoring flag changes (for observability systems)

---

## Endpoints

### 1. GET /actuator/togglz

**Purpose**: Retrieve all feature flags and their current states

**Authentication**: Optional (depends on Actuator security configuration)  
**Response Type**: JSON

#### Request

```http
GET /actuator/togglz HTTP/1.1
Host: localhost:8081
Accept: application/json
```

#### Response (200 OK)

```json
{
  "features": {
    "ADVANCED_SEARCH": {
      "enabled": true,
      "label": "Advanced Contact Search",
      "description": null,
      "groups": []
    },
    "EXPORT_CONTACTS": {
      "enabled": false,
      "label": "Export Contacts (CSV/PDF)",
      "description": null,
      "groups": []
    }
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `features` | Object | Map of feature flags (key = FEATURE_NAME) |
| `{FEATURE_NAME}.enabled` | Boolean | Current state (true = enabled, false = disabled) |
| `{FEATURE_NAME}.label` | String | Human-readable label from `@Label` annotation |
| `{FEATURE_NAME}.description` | String \| null | Description (always null in v1) |
| `{FEATURE_NAME}.groups` | Array | Feature groups (always empty in v1) |

#### Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success — flags returned |
| 401 | Unauthorized (if Actuator requires authentication) |
| 503 | Service Unavailable — Postgres down, Togglz cannot load state |

#### Error Response (503)

```json
{
  "status": 503,
  "error": "Service Unavailable",
  "message": "Failed to load feature flags from database"
}
```

#### Notes

- Response includes all features defined in `AppFeatures` enum
- State reflects current value in PostgreSQL (not cached; always fresh read)
- Safe operation (no side effects); can be called repeatedly

---

### 2. POST /actuator/togglz/{FEATURE_NAME}

**Purpose**: Toggle a feature flag on/off

**Authentication**: Required (Spring Security context must exist)  
**Request Type**: JSON  
**Response Type**: JSON

#### Request

```http
POST /actuator/togglz/ADVANCED_SEARCH HTTP/1.1
Host: localhost:8081
Content-Type: application/json
Authorization: Bearer <token>

{
  "enabled": true
}
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `enabled` | Boolean | Yes | Desired state (true = enable, false = disable) |

#### Response (200 OK)

```json
{
  "name": "ADVANCED_SEARCH",
  "enabled": true,
  "label": "Advanced Contact Search",
  "description": null,
  "groups": []
}
```

#### Response Fields

Same as GET /actuator/togglz endpoint (individual feature object)

#### Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success — flag toggled and new state returned |
| 400 | Bad Request — invalid JSON or unknown feature name |
| 401 | Unauthorized — no authentication context |
| 403 | Forbidden — authenticated but insufficient permissions (not ROLE_ADMIN) |
| 404 | Not Found — feature name not found in AppFeatures enum |
| 503 | Service Unavailable — Postgres down, toggle failed |

#### Error Response (400)

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Feature 'INVALID_FEATURE' not found"
}
```

#### Error Response (403)

```json
{
  "status": 403,
  "error": "Forbidden",
  "message": "User does not have permission to manage feature flags (requires ROLE_ADMIN)"
}
```

#### Notes

- Request body is required; endpoint rejects empty POST with 400
- Feature name is case-sensitive (must match enum name: ADVANCED_SEARCH, not advanced_search)
- Toggle is atomic; no partial updates
- Logging: Toggle recorded with admin user identity and timestamp (application logs, not response)

---

### 3. POST /togglz-console (Console Admin UI)

**Purpose**: Web-based admin console for managing feature flags

**Authentication**: Required (ROLE_ADMIN in production)  
**Response Type**: HTML (interactive web UI)

#### Endpoint

```http
GET /togglz-console HTTP/1.1
Host: localhost:8081
```

#### Response (200 OK)

Rendered HTML page showing:
- Table of all features (name, label, current state)
- Toggle checkbox for each feature
- Real-time state updates on checkbox click
- Clear visual feedback (loading spinner, success message, error message)

#### Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success — console UI rendered |
| 401 | Unauthorized — not authenticated (development only; redirects to login in production) |
| 403 | Forbidden — authenticated but insufficient permissions (production with Spring Security) |

#### Security

- **Development** (`togglz.console.secured: false`): No authentication required
- **Production** (`togglz.console.secured: true`): Requires ROLE_ADMIN via Spring Security

---

## Usage Examples

### Example 1: Frontend Fetching Flag State at App Load

```typescript
// frontend/src/hooks/useFeatureFlags.ts
useEffect(() => {
  fetch('/actuator/togglz')
    .then(res => res.json())
    .then(data => {
      const flags = {};
      Object.entries(data.features).forEach(([name, feature]) => {
        flags[name] = feature.enabled;
      });
      setFlags(flags);
    });
}, []);
```

**Use Case**: Conditionally render UI components based on flags

### Example 2: CI/CD Script Enabling Feature Before Deployment

```bash
#!/bin/bash
# Enable EXPORT_CONTACTS feature before deploy

curl -X POST http://localhost:8081/actuator/togglz/EXPORT_CONTACTS \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{"enabled": true}'

# Verify toggle
curl http://localhost:8081/actuator/togglz/EXPORT_CONTACTS
```

**Use Case**: Automated feature rollout in production deployments

### Example 3: Monitoring Script Checking Flag Health

```bash
#!/bin/bash
# Alert if expected flags are not present

response=$(curl -s http://localhost:8081/actuator/togglz)

# Verify ADVANCED_SEARCH exists and is enabled
if echo "$response" | jq -e '.features.ADVANCED_SEARCH.enabled' > /dev/null; then
  echo "✓ ADVANCED_SEARCH is enabled"
else
  echo "✗ ADVANCED_SEARCH is not enabled - alert ops"
  exit 1
fi
```

**Use Case**: Health checks in monitoring/alerting systems

---

## Rate Limiting & Quotas

**Development**: No rate limiting  
**Production**: Recommended rate limits (not enforced by Togglz, implement via API Gateway or Spring Cloud):
- `GET /actuator/togglz`: 1000 req/min per IP (monitoring/UI polls)
- `POST /actuator/togglz/*`: 10 req/min per user (admin console toggles)

**Rationale**: Flag toggles are infrequent admin operations; monitor/UI polls are polling-based but light

---

## Versioning & Stability

**API Version**: v1 (Togglz 4.6.2)  
**Stability**: Stable (Togglz committed to backward compatibility across minor versions)

**Future Versions** (out of scope for v1):
- Add `strategies` field to support percentage rollouts
- Add `history` endpoint to retrieve recent toggle changes
- Add bulk toggle endpoint for toggling multiple flags

---

## Related Documentation

- **Admin Console**: `/togglz-console` (web UI, see usage in quickstart.md)
- **Data Model**: See data-model.md for TOGGLZ table schema
- **Feature Definitions**: See AppFeatures enum in application code
