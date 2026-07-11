# API Contract: POST /api/contacts

**Purpose**: Create a new contact in the contact manager.

**Date**: 2026-07-11

**Endpoint**: `POST /api/contacts`

**Base URL**: `http://localhost:8080` (local development) | Configured via `VITE_API_URL` in frontend

---

## Request

**Content-Type**: `application/json`

**Body** (JSON):
```json
{
  "name": "string (1-255 characters)",
  "email": "string (valid email address)",
  "phone": "string (optional, 10-20 digits) or null",
  "birthDate": "string (optional, ISO 8601 date YYYY-MM-DD) or null"
}
```

### Field Specifications

| Field | Type | Required | Constraints | Example |
|-------|------|----------|-------------|---------|
| `name` | string | Yes | Min 1, max 255 characters | `"João da Silva"` |
| `email` | string | Yes | Valid email format, must be unique | `"joao@example.com"` |
| `phone` | string | No | Exactly 10-20 digits, no spaces/dashes | `"11987654321"` |
| `birthDate` | string | No | ISO 8601 date (YYYY-MM-DD), must be past date | `"1990-05-15"` |

### Validation Rules

- **name**: Required, non-empty, max 255 characters. No format restrictions (can include spaces, accents, special characters).
- **email**: Required, must match standard email pattern (e.g., must contain `@` and a domain). Must be unique across all active contacts (checked at DB level via unique constraint).
- **phone**: Optional (can be omitted or null). If provided, must be exactly 10-20 digits. No spaces, dashes, parentheses, or other characters allowed.
- **birthDate**: Optional (can be omitted or null). If provided, must be a valid date in ISO 8601 format (YYYY-MM-DD) and must be in the past (today or earlier is rejected).

### Example Request (Valid)

```bash
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "phone": "21987654321",
    "birthDate": "1985-08-20"
  }'
```

### Example Request (Minimal)

```bash
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João",
    "email": "joao@example.com"
  }'
```

---

## Response

### Success Response (201 Created)

**Status Code**: `201`

**Content-Type**: `application/json`

**Body**:
```json
{
  "id": "UUID string",
  "name": "string",
  "email": "string",
  "phone": "string or null",
  "birthDate": "ISO 8601 date string or null",
  "createdAt": "ISO 8601 datetime string",
  "updatedAt": "ISO 8601 datetime string"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier assigned by the system |
| `name` | string | The contact's name (echoed from request) |
| `email` | string | The contact's email (echoed from request) |
| `phone` | string \| null | The contact's phone number (null if not provided) |
| `birthDate` | string \| null | The contact's birth date in ISO 8601 format (null if not provided) |
| `createdAt` | ISO 8601 datetime | Timestamp of when the contact was created (system-generated) |
| `updatedAt` | ISO 8601 datetime | Timestamp of the most recent update (initially same as `createdAt`) |

### Example Success Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Maria Silva",
  "email": "maria@example.com",
  "phone": "21987654321",
  "birthDate": "1985-08-20",
  "createdAt": "2026-07-11T14:30:00Z",
  "updatedAt": "2026-07-11T14:30:00Z"
}
```

---

## Error Responses

### 400 Bad Request — Validation Failure

**Status Code**: `400`

**Reason**: One or more required fields are missing, invalid format, or violate constraints (e.g., name is empty, email is not a valid email, phone has non-digit characters, birth date is in the future).

**Body**:
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "name": "Name is required",
    "email": "Please enter a valid email address",
    "phone": "Phone must be 10-20 digits",
    "birthDate": "Birth date must be in the past"
  }
}
```

### Example 400 Response

```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Please enter a valid email address"
  }
}
```

---

### 409 Conflict — Email Already Exists

**Status Code**: `409`

**Reason**: The email address provided is already associated with an existing (non-deleted) contact.

**Body**:
```json
{
  "status": 409,
  "message": "Email already exists"
}
```

### Example 409 Response

```json
{
  "status": 409,
  "message": "Email already exists"
}
```

---

### 500 Internal Server Error

**Status Code**: `500`

**Reason**: An unexpected server error occurred (e.g., database connection failure, server crash).

**Body**:
```json
{
  "status": 500,
  "message": "An unexpected error occurred. Please try again later."
}
```

---

## Frontend Integration Example

**Using axios** (as implemented in `frontend/src/services/contactService.ts`):

```typescript
import api from './api';

const contactService = {
  createContact: (data: ContactRequest) => 
    api.post<Contact>('/contacts', data)
};

// Usage in component:
try {
  const response = await contactService.createContact({
    name: 'Maria Silva',
    email: 'maria@example.com',
    phone: '21987654321',
    birthDate: '1985-08-20'
  });
  console.log('Contact created:', response.data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 409) {
      console.error('Email already exists');
    } else if (error.response?.status === 400) {
      console.error('Validation failed:', error.response.data);
    }
  }
}
```

---

## Notes

- **Idempotency**: This endpoint is NOT idempotent. Calling it twice with the same data will create two separate contacts (with different IDs), unless the second call fails with a 409 error due to the duplicate email.
- **Phone Format**: The API accepts phone numbers as plain digit strings (10-20 digits). No formatting or country-code handling is performed; it's the client's responsibility to format the phone number before sending.
- **Date Format**: All dates are in ISO 8601 format (YYYY-MM-DD). Times are in UTC (Z suffix for ISO 8601 datetime).
- **Soft Delete**: The backend implements soft-delete (contacts are marked with `deletedAt` rather than removed). Deleted contacts cannot be retrieved or searched, but the `deletedAt` field is not exposed in the API response.

---

**Status**: ✅ API contract complete. Matches backend implementation in `ContactController.java`.
