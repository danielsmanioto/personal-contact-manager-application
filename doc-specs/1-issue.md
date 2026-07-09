# Task: Personal Contact Manager Application

## 📋 Basic Information

| Field | Value |
|-------|-------|
| **Task ID** | TASK-001 |
| **Title** | Personal Contact Manager Application |
| **Description** | Web application for managing personal contacts and information with persistent data storage |
| **Status** | ⏳ Planning |
| **Priority** | 🔴 High |
| **Created Date** | 2026-07-09 |
| **Estimated Delivery Date** | 2026-07-30 |

---

## 🎯 Constitution (Principles)

Defines the principles that will guide ALL implementation:

### Code Quality
- ✅ Minimum 80% test coverage
- ✅ No console.log in production code
- ✅ Lint clean (ESLint + Prettier)
- ✅ TypeScript with explicit types

### Security
- ✅ Validate ALL user inputs (frontend + backend)
- ✅ Sanitize data before persisting
- ✅ No plaintext password storage
- ✅ Protection against XSS and SQL Injection

### Performance
- ✅ APIs respond in < 200ms (p95)
- ✅ Initial load < 3s
- ✅ Image optimization
- ✅ Lazy loading of components

### User Experience
- ✅ Intuitive navigation (maximum 3 clicks)
- ✅ Visual feedback for each action (loading, error, success)
- ✅ Responsive (mobile, tablet, desktop)
- ✅ WCAG 2.1 Level AA accessibility

### Maintainability
- ✅ Well-documented code with "why" comments
- ✅ Reusable components
- ✅ Clear separation of concerns

---

## 📝 Specification (WHAT)

### Overview

Create a web application that allows users to **manage personal contacts**, offering functionality to create, edit, view, and delete records with local persistence.

### Main Features

#### 1. Contact Creation
- [ ] Form with fields: Name, Email, Phone, Date of Birth
- [ ] Real-time validation for email and phone
- [ ] Clear action buttons (Save, Cancel)
- [ ] Error/success messages

#### 2. Contact Listing
- [ ] Table/Cards displaying all contacts
- [ ] Sorting by Name, Creation Date
- [ ] Search by name or email
- [ ] Filters by date of birth (range)
- [ ] Pagination (10 contacts per page)

#### 3. Contact Editing
- [ ] Open form with pre-filled data
- [ ] Validations maintained
- [ ] Optional change history tracking

#### 4. Delete Contacts
- [ ] Confirmation before deletion
- [ ] Soft delete (mark inactive) or hard delete
- [ ] Undo for recent actions (optional - Phase 2)

#### 5. Data Persistence
- [ ] Data saved locally (localStorage initially)
- [ ] Backend synchronization (Phase 2)
- [ ] Automatic backup

### Acceptance Criteria

```
GIVEN a user accesses the application
WHEN they fill out the contact form
THEN their data is validated and saved successfully

GIVEN a user wants to find a contact
WHEN they use the search
THEN contacts are filtered in real-time < 200ms

GIVEN a user wants to delete a contact
WHEN they confirm the action
THEN the contact is removed and a notification is displayed
```

---

## 🏗️ Plan (HOW - Tech Stack)

### Frontend
```
Runtime: Node.js 20+
Framework: React 18 with TypeScript
Build Tool: Vite
Styling: Tailwind CSS
State Management: React Context API (simple)
Validation: React Hook Form + Zod
HTTP Client: Axios
Testing: Vitest + React Testing Library
```

### Backend
```
Runtime: Java 21
Framework: Spring Boot 3.x
Build Tool: Maven
ORM: Spring Data JPA + Hibernate
Database: PostgreSQL 15+
Validation: Jakarta Bean Validation
Testing: JUnit 5 + Testcontainers
Logging: SLF4J + Logback
```

### Infrastructure
```
Version Control: Git
Containerization: Docker + Docker Compose
Local Development: Full stack via docker-compose
Environment: Local development only (no CI/CD)
```

### Architecture

#### Frontend (React 18 + TypeScript)
```
frontend/
├── src/
│   ├── components/
│   │   ├── ContactForm/
│   │   ├── ContactList/
│   │   ├── ContactCard/
│   │   └── Layout/
│   ├── pages/
│   ├── hooks/
│   │   └── useContacts.ts
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   └── formatters.ts
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── vite.config.ts
├── Dockerfile
└── README.md
```

#### Backend (Java 21 + Spring Boot)
```
backend/
├── src/
│   ├── main/java/com/contactmanager/
│   │   ├── controller/      # REST Endpoints
│   │   ├── service/         # Business Logic
│   │   ├── repository/      # Database Access
│   │   ├── entity/          # JPA Entities
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── exception/       # Custom Exceptions
│   │   └── ContactManagerApplication.java
│   └── resources/
│       ├── application.yml  # Configuration
│       └── db/migration/    # Flyway migrations
├── src/test/java/...        # Tests
├── pom.xml
├── Dockerfile
└── README.md
```

#### Database Schema
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  birthDate DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP NULL
);
```

---

## ✅ Tasks (Broken Down Tasks)

### Phase 1: MVP (Full-Stack)

#### Backend Setup & API
- [ ] **TASK-001**: Backend project setup
  - [ ] Create Spring Boot 3.x project with Maven
  - [ ] Setup Java 21, lombok, Spring Data JPA
  - [ ] Configure PostgreSQL connection
  - [ ] Setup Flyway migrations
  - [ ] Docker & docker-compose configuration

- [ ] **TASK-002**: Create Contact entity & JPA repository
  - [ ] Contact JPA entity (id, name, email, phone, birthDate, createdAt, updatedAt, deletedAt)
  - [ ] ContactRepository interface
  - [ ] Custom queries (search, filter by date range)
  - [ ] Unit tests for repository

- [ ] **TASK-003**: Implement Contact service layer
  - [ ] CRUD operations (create, read, update, delete)
  - [ ] Search and filter logic
  - [ ] Validation rules
  - [ ] Error handling & custom exceptions
  - [ ] Unit tests for service

- [ ] **TASK-004**: Create REST API endpoints
  - [ ] GET /api/contacts (list all, with pagination)
  - [ ] GET /api/contacts/{id} (get one)
  - [ ] POST /api/contacts (create)
  - [ ] PUT /api/contacts/{id} (update)
  - [ ] DELETE /api/contacts/{id} (delete)
  - [ ] GET /api/contacts/search (search by name/email)
  - [ ] Integration tests with Testcontainers

#### Frontend Setup & Components
- [ ] **TASK-005**: Frontend project setup
  - [ ] Create Vite + React + TypeScript project
  - [ ] Setup ESLint + Prettier
  - [ ] Configure Axios for API calls
  - [ ] Setup Tailwind CSS
  - [ ] Docker configuration

- [ ] **TASK-006**: Create base components
  - [ ] Layout/Header
  - [ ] ContactForm (reusable for create/edit)
  - [ ] ContactList container
  - [ ] ContactCard display
  - [ ] Modal for confirmations

- [ ] **TASK-007**: Implement React hooks & state
  - [ ] useContacts hook (fetch from API)
  - [ ] useForm hook (manage form state)
  - [ ] Error/success notification system
  - [ ] Loading states

- [ ] **TASK-008**: Add form validation
  - [ ] React Hook Form + Zod integration
  - [ ] Real-time field validation
  - [ ] Display validation errors
  - [ ] Unit tests

- [ ] **TASK-009**: Implement listing features
  - [ ] Fetch contacts from API
  - [ ] Search by name/email (call backend)
  - [ ] Sort by name/creation date
  - [ ] Filter by DOB range
  - [ ] Pagination (10 per page)

- [ ] **TASK-010**: Add edit/delete operations
  - [ ] Edit button → pre-fill form
  - [ ] Delete button → confirmation modal
  - [ ] API calls for update/delete
  - [ ] Refresh UI after operations

#### Integration & Testing
- [ ] **TASK-011**: E2E testing
  - [ ] Frontend tests (Vitest + React Testing Library)
  - [ ] Backend tests (JUnit 5 + Testcontainers)
  - [ ] API integration tests
  - [ ] Target: 80%+ coverage

- [ ] **TASK-012**: Docker setup & documentation
  - [ ] Docker Compose with PostgreSQL, backend, frontend
  - [ ] Start/stop scripts (start.sh, stop.sh)
  - [ ] Complete README.md with setup instructions
  - [ ] API documentation (endpoints, models)
  - [ ] Environment configuration

### Phase 2: Enhancements (Backlog)

- [ ] User authentication (JWT)
- [ ] Undo/Redo actions
- [ ] Themes (Light/Dark)
- [ ] Export data (CSV/PDF)
- [ ] Advanced filtering
- [ ] Audit trail

---

## 📊 Effort Matrix

| Task | Component | Effort | Duration |
|------|-----------|--------|----------|
| TASK-001 | Backend Setup | S | 2h |
| TASK-002 | Backend Entity & Repo | S | 3h |
| TASK-003 | Backend Service | M | 5h |
| TASK-004 | Backend REST API | M | 6h |
| TASK-005 | Frontend Setup | S | 2h |
| TASK-006 | Frontend Components | M | 8h |
| TASK-007 | Frontend Hooks | M | 5h |
| TASK-008 | Frontend Validation | S | 4h |
| TASK-009 | Frontend Listing | M | 6h |
| TASK-010 | Frontend Edit/Delete | M | 5h |
| TASK-011 | E2E Testing | L | 12h |
| TASK-012 | Docker & Docs | M | 6h |
| **TOTAL** | | | **64h** |

**Legend**: S=Small (1-3h), M=Medium (4-8h), L=Large (10h+)

---

## 🔄 How to Use with Spec Kit

### 1. Constitution
```bash
/speckit.constitution Apply the principles above (Quality, Security, Performance, UX, Maintainability)
```

### 2. Specify
```bash
/speckit.specify Create a personal contact management system with:
- Form to create/edit contacts (Name, Email, Phone, Date of Birth)
- Contact list with search, filters, and pagination
- Edit and delete contacts with confirmation
- Data saved in localStorage
- Real-time validation
- Responsive and intuitive design
```

### 3. Plan
```bash
/speckit.plan Frontend with React 18 + TypeScript + Vite + Tailwind CSS
- State management with React Context
- Validation with React Hook Form + Zod
- localStorage for persistence
- Modular and reusable components
```

### 4. Tasks
```bash
/speckit.tasks
```

### 5. Implement
```bash
/speckit.implement
```

---

## 📈 Success Metrics

- ✅ All acceptance criteria met
- ✅ 80%+ test coverage
- ✅ Response time < 200ms
- ✅ Lighthouse score > 90
- ✅ Zero console errors in production
- ✅ Deployment without issues

---

## 📚 References

- [GitHub Spec Kit](https://github.com/github/spec-kit)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 👤 Team Members

| Role | Person |
|------|--------|
| Product | Daniel |
| Frontend | Daniel |
| Testing | Daniel |

---

## 📝 Additional Notes

- Use semantic commits: `feat:`, `fix:`, `test:`, `docs:`
- Create PR for each task with clear description
- Keep main branch always ready for deployment
- Code review mandatory before merge

