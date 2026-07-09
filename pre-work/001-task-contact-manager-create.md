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
- ✅ Front: TypeScript with explicit types
- ✅ Backend: solid principles
- ✅ solid principles
- ✅ backend / performance test

### Architecture
- ✅ backend / use hexagonal
- ✅ backend / resiliente endpoints

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
- ✅ Add logs

### Documentation
- ✅ Good documentation in README.md for developper.
- ✅ api documentation with open api

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

This section describes the step-by-step workflow to implement this project using GitHub's Spec Kit framework with AI-assisted development.

### Step 1: Establish Project Principles

**Command:**
```bash
/speckit.constitution
```

**What it does:**
- Creates or updates `CONSTITUTION.md`
- Defines non-negotiable principles that guide ALL implementation
- Includes: Code Quality (80% coverage), Security (validation), Performance (< 200ms), UX (responsive), Maintainability (clear code)

**Reference:** Apply the 5 core principles above:
- ✅ Code Quality: 80% test coverage, TypeScript, no console.log, lint clean
- ✅ Security: Validate all inputs, no SQL injection, no XSS
- ✅ Performance: API < 200ms, load < 3s, optimize queries
- ✅ User Experience: 3-click navigation, responsive, WCAG 2.1 AA
- ✅ Maintainability: Well-documented, reusable components, clear concerns

---

### Step 2: Define What You're Building

**Command:**
```bash
/speckit.specify
```

**What it does:**
- Creates or updates `SPECIFICATION.md`
- Defines exact features and acceptance criteria
- Describes data models, API endpoints, success metrics
- Non-technical requirements become implementation requirements

**Specification for this project:**
- Create personal contact management system
- Features:
  - Form to create/edit contacts (Name, Email, Phone, Date of Birth)
  - Contact list with search, filters, and pagination
  - Edit and delete contacts with confirmation
  - Data saved in database (PostgreSQL)
  - Real-time validation (Zod + React Hook Form)
  - Responsive and intuitive design (mobile, tablet, desktop)
- Acceptance Criteria: All CRUD operations work, < 200ms search, WCAG accessible

---

### Step 3: Define How You're Building It

**Command:**
```bash
/speckit.plan Full-Stack Application with:
- Backend: Java 21 + Spring Boot 3.x + Maven + Spring Data JPA + Hibernate
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- State Management: React Context API
- Validation: React Hook Form + Zod (frontend), Jakarta Bean Validation (backend)
- Database: PostgreSQL 15+ via Docker
- HTTP Client: Axios (frontend)
- Testing: Vitest + React Testing Library (frontend), JUnit 5 + Testcontainers (backend)
- Infrastructure: Docker + Docker Compose for local development
```

**What it does:**
- Creates or updates `IMPLEMENTATION_PLAN.md`
- Defines complete tech stack (frontend + backend + database)
- Describes project structure, architecture decisions, development workflow
- Outlines testing strategy and tools for both layers

**Resulting Tech Stack:**
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
  - State management: React Context API
  - Validation: React Hook Form + Zod
  - HTTP: Axios
  - Testing: Vitest + React Testing Library
- **Backend:** Java 21 + Spring Boot 3.x + Maven
  - ORM: Spring Data JPA + Hibernate
  - Database: PostgreSQL 15+
  - Validation: Jakarta Bean Validation
  - Testing: JUnit 5 + Testcontainers
  - Logging: SLF4J + Logback
- **Infrastructure:** Docker + Docker Compose (local development)
  - All services orchestrated: PostgreSQL, backend, frontend

---

### Step 4: Break Down Into Actionable Tasks

**Command:**
```bash
/speckit.tasks
```

**What it does:**
- Creates or updates `TASKS.md`
- Breaks down work into 12 manageable tasks
- Each task has: duration, priority, dependencies, acceptance criteria

**Task List for this project (64 hours total):**
- Backend (TASK-001 to 004): 16 hours
  - Project setup, entity/repo, service layer, REST API
- Frontend (TASK-005 to 010): 32 hours
  - Project setup, components, hooks, validation, listing, edit/delete
- Testing & Integration (TASK-011 to 012): 18 hours
  - E2E testing (80%+ coverage), Docker & documentation

---

### Step 5: Generate GitHub Issues (Optional)

**Command:**
```bash
/speckit.taskstoissues
```

**What it does:**
- Converts `TASKS.md` into GitHub Issues
- One issue per task, linked with milestones/labels
- Enables tracking and team collaboration

---

### Step 6: Implement All Tasks with AI Assistance

**Command (per task):**
```bash
/speckit.implement <TASK_ID>
```

**Workflow for each task:**
1. Read task description from `TASKS.md`
2. Reference `SPECIFICATION.md` (what needs to work)
3. Reference `IMPLEMENTATION_PLAN.md` (how to build it)
4. Reference `CONSTITUTION.md` (quality standards)
5. Ask Claude/AI assistant for help (with Spec Kit context)
6. Verify implementation against acceptance criteria
7. Move to next task

**Example: Implementing TASK-001 (Backend Setup)**
```bash
# I'm doing TASK-001: Backend project setup (2h)
# Reference: /spec-kit-files/SPECIFICATION.md (what we're building)
# Reference: /spec-kit-files/IMPLEMENTATION_PLAN.md (tech stack)
# Reference: /spec-kit-files/CONSTITUTION.md (quality standards)

# Requirements:
# - Spring Boot 3.x project with Java 21
# - Maven build tool
# - PostgreSQL connection configured
# - Flyway migrations setup
# - Docker & docker-compose

# Ask Claude: "I'm implementing TASK-001 per my Spec Kit files.
# Create pom.xml, application.yml, Dockerfile, ContactManagerApplication.java
# following CONSTITUTION.md principles (explicit types, SLF4J logging, ready for testing)"
```

---

### Step 7: Converge & Review Against Spec

**Command (after implementation):**
```bash
/speckit.converge
```

**What it does:**
- Assesses built codebase against CONSTITUTION/SPECIFICATION/PLAN/TASKS
- Identifies any gaps or remaining work
- Appends incomplete work as new tasks
- Verifies quality metrics are met

**Verification checklist:**
- ✅ All acceptance criteria from SPECIFICATION.md met
- ✅ 80%+ test coverage (CONSTITUTION.md)
- ✅ No console.log in production (CONSTITUTION.md)
- ✅ API < 200ms performance (CONSTITUTION.md)
- ✅ Responsive design on mobile/tablet/desktop (CONSTITUTION.md)
- ✅ Code is well-documented (CONSTITUTION.md)
- ✅ All 12 tasks completed (TASKS.md)

---

## 💡 How This Workflow Prevents Issues

| Problem | Spec Kit Solution |
|---------|-------------------|
| Vague requirements | SPECIFICATION.md defines exact features |
| Quality degradation | CONSTITUTION.md enforces non-negotiables |
| Architecture confusion | IMPLEMENTATION_PLAN.md defines HOW |
| Scope creep | TASKS.md + SPECIFICATION.md bound the scope |
| Lost context | All docs stay in git, reviewed in PRs |
| Misaligned development | AI knows the spec, implements consistently |

---

## 🚀 Quick Start Command

All-in-one initialization (interactive):
```bash
spec-kit init --here

# Then answer prompts:
# Project name: Personal Contact Manager Application
# Description: Web application for managing personal contacts with persistent data storage
# Your name: Daniel Augusto Smanioto
# Your email: daniel.smanioto@gmail.com

# This creates: CONSTITUTION.md, SPECIFICATION.md, IMPLEMENTATION_PLAN.md, TASKS.md
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

