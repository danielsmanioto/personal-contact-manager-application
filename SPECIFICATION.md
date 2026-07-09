# Specification

This document defines WHAT we are building for the Personal Contact Manager Application - the features, data model, API, and acceptance criteria.

---

## Overview

Create a web application that allows users to **manage personal contacts**, offering functionality to create, view, edit, delete, search, filter, and sort records with persistent PostgreSQL database storage.

---

## 🎯 Core Features

### 1. Contact Creation

**What:**
- Form with fields: Name, Email, Phone, Date of Birth
- Real-time validation (frontend + backend)
- Clear submit/cancel buttons
- Error and success feedback

**Requirements:**
- Name: 1-255 characters, required
- Email: RFC 5322 format, required, unique per contact
- Phone: 10-20 digits, optional
- Date of Birth: Past dates only, optional
- Validation on both frontend (React Hook Form + Zod) AND backend (Jakarta Bean Validation)

**Success Criteria:**
```
GIVEN a user fills out the contact form
WHEN they submit
THEN the form validates all fields
AND a valid contact is created in the database
AND a success message is displayed
```

---

### 2. Contact Listing & Discovery

**What:**
- Display all contacts in card/table format
- Pagination (10 contacts per page)
- Sort by Name (A-Z) or Creation Date (newest first)
- Search by Name or Email (real-time, < 200ms)
- Filter by Date of Birth (range selection)
- Show empty state when no contacts exist

**Requirements:**
- Fetch contacts from backend via `/api/contacts?page=0&size=10`
- Real-time search must respond in < 200ms
- Filter and sort must be efficient (use database indexes)
- Pagination to prevent large result sets

**Success Criteria:**
```
GIVEN a user wants to find a contact
WHEN they use search by name
THEN results appear in < 200ms
AND matching contacts are displayed
AND non-matching contacts are hidden
```

---

### 3. Contact Editing

**What:**
- Open contact form with pre-filled data
- Maintain all validations from creation
- Update any field
- Track updatedAt timestamp

**Requirements:**
- Form shows current contact data
- Same validation rules as creation
- All fields can be changed
- updatedAt timestamp auto-updated on save

**Success Criteria:**
```
GIVEN a user opens an existing contact
WHEN they edit fields and save
THEN the contact is updated in the database
AND the updatedAt timestamp is refreshed
AND a success message is displayed
```

---

### 4. Contact Deletion

**What:**
- Confirmation dialog before deletion
- Soft delete (mark as deleted, don't remove)
- Visual feedback during delete
- Immediate UI update

**Requirements:**
- Show confirmation modal before deleting
- Set deletedAt timestamp instead of removing record
- Show spinner during API call
- Show success/error message
- Remove contact from UI list immediately

**Success Criteria:**
```
GIVEN a user wants to delete a contact
WHEN they confirm the deletion
THEN the contact is soft-deleted in the database
AND the contact is removed from the UI
AND a success message is displayed
```

---

### 5. Data Persistence

**What:**
- PostgreSQL database stores all contacts
- Automatic timestamps for lifecycle tracking
- Unique email constraint
- Soft delete support

**Requirements:**
- All data saved in PostgreSQL 15+
- createdAt and updatedAt managed automatically
- deletedAt for soft deletes
- Email must be unique
- Never show soft-deleted contacts (WHERE deletedAt IS NULL)

---

## 📊 Data Model

### Contact Entity

```
Table: contacts

Columns:
  id              UUID PRIMARY KEY
  name            VARCHAR(255) NOT NULL
  email           VARCHAR(255) UNIQUE NOT NULL
  phone           VARCHAR(20) NULL
  birthDate       DATE NULL
  createdAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updatedAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  deletedAt       TIMESTAMP NULL

Indexes:
  CREATE INDEX idx_contacts_email ON contacts(email);
  CREATE INDEX idx_contacts_name ON contacts(name);
  CREATE INDEX idx_contacts_birthDate ON contacts(birthDate);
  CREATE INDEX idx_contacts_deletedAt ON contacts(deletedAt);
```

### Constraints

- `email` UNIQUE: No two active contacts with same email
- `name` NOT NULL: Every contact must have a name
- Soft delete: Only show contacts where deletedAt IS NULL

---

## 🔌 API Specification

### Base URL
```
http://localhost:8080/api
```

### 1. List All Contacts (Paginated)

```http
GET /contacts?page=0&size=10

Response: 200 OK
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "birthDate": "1990-01-15",
      "createdAt": "2026-07-09T10:00:00Z",
      "updatedAt": "2026-07-09T10:00:00Z"
    }
  ],
  "totalElements": 25,
  "totalPages": 3,
  "size": 10,
  "number": 0
}
```

---

### 2. Get Single Contact

```http
GET /contacts/{id}

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "birthDate": "1990-01-15",
  "createdAt": "2026-07-09T10:00:00Z",
  "updatedAt": "2026-07-09T10:00:00Z"
}

OR

Response: 404 Not Found
{
  "status": 404,
  "message": "Contact not found"
}
```

---

### 3. Create Contact

```http
POST /contacts
Content-Type: application/json

Request:
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "birthDate": "1995-05-20"
}

Response: 201 Created
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "birthDate": "1995-05-20",
  "createdAt": "2026-07-09T10:05:00Z",
  "updatedAt": "2026-07-09T10:05:00Z"
}

OR

Response: 400 Bad Request
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Email format is invalid",
    "name": "Name must be 1-255 characters"
  }
}

OR

Response: 409 Conflict
{
  "status": 409,
  "message": "Email already exists"
}
```

---

### 4. Update Contact

```http
PUT /contacts/{id}
Content-Type: application/json

Request:
{
  "name": "Jane Smith Updated",
  "email": "jane.smith@example.com",
  "phone": "9876543211",
  "birthDate": "1995-05-21"
}

Response: 200 OK
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Jane Smith Updated",
  "email": "jane.smith@example.com",
  "phone": "9876543211",
  "birthDate": "1995-05-21",
  "createdAt": "2026-07-09T10:05:00Z",
  "updatedAt": "2026-07-09T10:10:00Z"
}

OR

Response: 404 Not Found
```

---

### 5. Delete Contact (Soft Delete)

```http
DELETE /contacts/{id}

Response: 204 No Content
(No body, contact soft-deleted)

OR

Response: 404 Not Found
```

---

### 6. Search Contacts

```http
GET /contacts/search?q=john&page=0&size=10

Response: 200 OK
{
  "content": [
    {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      ...
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

---

## ✅ Acceptance Criteria

### Functional Requirements

- [ ] **Create:** Form creates contact with valid data, validates before submission
- [ ] **Read:** List shows all contacts, single contact endpoint works
- [ ] **Update:** Edit form pre-fills and updates contact successfully
- [ ] **Delete:** Delete with confirmation marks contact as deleted (soft delete)
- [ ] **Search:** Search by name/email returns results in < 200ms
- [ ] **Filter:** Filter by DOB range returns correct subset
- [ ] **Sort:** Sort by name or date works in both directions
- [ ] **Pagination:** List shows 10 items per page, navigation works
- [ ] **Validation:** Invalid data rejected with clear error messages
- [ ] **Persistence:** All data saved in PostgreSQL, survives app restart

### Quality Requirements

- [ ] **Test Coverage:** 80%+ coverage (unit + integration tests)
- [ ] **API Performance:** All endpoints respond in < 200ms (p95)
- [ ] **Security:** No SQL injection, no XSS, input validated both layers
- [ ] **Code Quality:** TypeScript strict mode, no console.log, lint clean

### User Experience Requirements

- [ ] **Responsive:** Works on 375px (mobile), 768px (tablet), 1440px (desktop)
- [ ] **Accessible:** WCAG 2.1 Level AA compliant
- [ ] **Feedback:** Loading spinner, success/error toasts for all actions
- [ ] **Navigation:** Max 3 clicks to any feature
- [ ] **Intuitive:** Clear buttons, helpful error messages
- [ ] **Empty States:** Shows message when no contacts exist

---

## 📈 Success Metrics

```
✅ All CRUD operations work end-to-end
✅ Search/filter/sort all functional
✅ 80%+ test coverage (backend + frontend)
✅ API response time < 200ms (p95)
✅ Initial page load < 3 seconds
✅ Responsive on 375px, 768px, 1440px
✅ WCAG 2.1 AA accessibility
✅ Soft delete preserves data
✅ No console errors in production
✅ All validation rules enforced
```

---

## 🔄 Frontend User Flow

```
1. User opens app → HomePage
2. Click "New Contact" → ContactForm (create)
3. Fill fields → Real-time validation
4. Click "Save" → POST /api/contacts
5. Success toast → Redirected to list
6. List shows new contact
7. Click contact → ContactCard (view/edit)
8. Click "Edit" → ContactForm (edit) pre-filled
9. Change fields → Real-time validation
10. Click "Save" → PUT /api/contacts/{id}
11. Success toast → List updated
12. Click "Delete" → Confirmation modal
13. Confirm → DELETE /api/contacts/{id}
14. Success toast → Contact removed from list
15. Search box → GET /api/contacts/search?q=...
16. Results update in < 200ms
17. Pagination → Click page number → Load more contacts
```

---

## 🏗️ Backend Architecture

```
ContactController (HTTP)
  ↓
ContactService (Business Logic)
  ↓
ContactRepository (Database Access)
  ↓
Contact Entity + JPA (ORM)
  ↓
PostgreSQL Database
```

**Responsibilities:**
- Controller: HTTP handling, validation, error responses
- Service: Business logic, soft delete rules, search/filter
- Repository: Database queries with indexes
- Entity: JPA mapping, constraints

---

## 🧪 Testing Strategy

### Frontend (React Testing Library + Vitest)
- Component tests: ContactForm, ContactList, ContactCard
- Hook tests: useContacts, useForm
- Integration tests: Create → List → Edit → Delete flow

### Backend (JUnit 5 + Testcontainers)
- Unit tests: Service, Repository layers
- Integration tests: Controller endpoints with real PostgreSQL
- Validation tests: All validation rules

### Target Coverage
- **Backend:** 80%+ (service, repository, controller)
- **Frontend:** 80%+ (components, hooks)

---

## 📝 Error Handling

### HTTP Status Codes

| Status | Meaning | When |
|--------|---------|------|
| 200 | OK | GET/PUT successful |
| 201 | Created | POST successful |
| 204 | No Content | DELETE successful |
| 400 | Bad Request | Validation failed |
| 404 | Not Found | Contact not found |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Unexpected error |

### Error Response Format

```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Email format is invalid",
    "name": "Name must be 1-255 characters"
  },
  "timestamp": "2026-07-09T10:00:00Z"
}
```

---

## 🔐 Security & Validation

### Validation Rules

| Field | Rules | Frontend | Backend |
|-------|-------|----------|---------|
| name | 1-255 chars | Zod | @Size, @NotBlank |
| email | RFC 5322, unique | Zod | @Email, @NotBlank, custom |
| phone | 10-20 digits | Zod regex | Custom validator |
| birthDate | Past only | Zod | @Past |

### Security Measures

- **SQL Injection:** JPA parameterized queries only
- **XSS:** React escapes by default, no dangerouslySetInnerHTML
- **Validation:** Both layers validate independently
- **Logging:** No sensitive data (emails, personal info) in logs

---

## 📚 Documentation

### For Users
- UI is intuitive, visual feedback on all actions
- Error messages are specific and helpful
- Responsive design works on all devices

### For Developers
- README.md with setup instructions
- Code comments explain WHY not WHAT
- OpenAPI/Swagger documentation for API
- This SPECIFICATION.md is the source of truth

---

## 🚀 Out of Scope (Phase 2)

- User authentication/login
- Undo/Redo functionality
- Light/Dark theme
- Export data (CSV/PDF)
- Advanced filtering/reporting
- Audit trail of changes

---

**Last Updated:** 2026-07-09  
**Version:** 1.0.0  
**Status:** Ready for Implementation
