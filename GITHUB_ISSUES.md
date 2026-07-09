# GitHub Issues Template

This document contains issue templates for all 12 tasks. You can either:

1. **Manual:** Copy-paste each issue into GitHub UI
2. **CLI:** Install `gh` and use the create script
3. **API:** Use GitHub API to bulk create

---

## How to Create Issues Manually

1. Go to: https://github.com/your-username/personal-contact-manager-application/issues
2. Click "New issue"
3. Copy-paste the content below for each task
4. Assign to yourself
5. Add label: `type:task`
6. Click "Create issue"

---

## TASK-001: Backend Project Setup

**Title:** TASK-001: Backend Project Setup

**Description:**

### Duration: 2 hours | Effort: Small | Priority: 🔴 High

### Description
Initialize a Spring Boot 3.x project with Java 21, Maven build tool, PostgreSQL connection, Flyway migrations, and Docker configuration.

### What to Do

1. Create Spring Boot project (Maven archetype)
2. Add core dependencies (PostgreSQL, Flyway, Lombok, JUnit 5, SLF4J)
3. Configure application.yml for PostgreSQL
4. Setup Flyway migration folder
5. Create main application class (ContactManagerApplication.java)
6. Create Dockerfile
7. Create backend/README.md

### Acceptance Criteria

- [ ] Maven build succeeds: `mvn clean install`
- [ ] Spring Boot app starts: `mvn spring-boot:run`
- [ ] Application listens on port 8080
- [ ] All dependencies compile without errors
- [ ] Dockerfile builds successfully
- [ ] Logger configured (SLF4J working)
- [ ] No console.log/System.out.println (use SLF4J)
- [ ] All Java code has explicit types

### References
- SPECIFICATION.md: Data model
- CONSTITUTION.md: Code Quality
- IMPLEMENTATION_PLAN.md: Backend tech stack

**Labels:** `type:task`, `phase:backend`, `priority:high`  
**Milestone:** MVP Phase 1

---

## TASK-002: Contact Entity & JPA Repository

**Title:** TASK-002: Contact Entity & JPA Repository

**Description:**

### Duration: 3 hours | Effort: Small | Priority: 🔴 High

### Description
Create the Contact JPA entity with validation annotations and the ContactRepository interface with custom query methods for search and filtering.

### What to Do

1. Create Contact.java entity with Jakarta Bean Validation
2. Add validation annotations (@NotBlank, @Email, @Size, @Pattern, @Past)
3. Create ContactRepository interface with custom queries
4. Create Flyway migration V1__init.sql
5. Write unit tests (Repository tests with Testcontainers)

### Acceptance Criteria

- [ ] Contact entity compiles without errors
- [ ] All validation annotations present
- [ ] ContactRepository interface defined
- [ ] Flyway migration V1__init.sql created
- [ ] Database schema matches SPECIFICATION.md
- [ ] Unit tests for repository: 80%+ coverage
- [ ] Tests pass: `mvn test -Dtest=ContactRepositoryTests`

### References
- SPECIFICATION.md: Contact data model
- CONSTITUTION.md: Code Quality, Security
- IMPLEMENTATION_PLAN.md: Database schema

**Labels:** `type:task`, `phase:backend`, `priority:high`  
**Milestone:** MVP Phase 1

---

## TASK-003: Contact Service Layer

**Title:** TASK-003: Contact Service Layer

**Description:**

### Duration: 5 hours | Effort: Medium | Priority: 🔴 High

### Description
Implement the ContactService with CRUD operations, search/filter logic, soft delete rules, validation, and error handling.

### What to Do

1. Create ContactService class with CRUD operations
2. Implement search & filter logic
3. Handle validation (Jakarta Bean Validation)
4. Create custom exceptions (ContactNotFoundException, EmailAlreadyExistsException)
5. Create DTOs (ContactRequest, ContactResponse)
6. Write unit tests (80%+ coverage)

### Acceptance Criteria

- [ ] ContactService class compiles
- [ ] All CRUD operations implemented
- [ ] Search and filter methods implemented
- [ ] Soft delete works
- [ ] Validation errors throw appropriate exceptions
- [ ] DTOs created
- [ ] Custom exceptions defined
- [ ] Unit tests: 80%+ coverage
- [ ] Tests pass: `mvn test -Dtest=ContactServiceTests`

### References
- SPECIFICATION.md: CRUD operations, search < 200ms
- CONSTITUTION.md: Code Quality, Security
- IMPLEMENTATION_PLAN.md: Service layer architecture

**Labels:** `type:task`, `phase:backend`, `priority:high`  
**Milestone:** MVP Phase 1

---

## TASK-004: REST API Endpoints

**Title:** TASK-004: REST API Endpoints

**Description:**

### Duration: 6 hours | Effort: Medium | Priority: 🔴 High

### Description
Create the ContactController with REST endpoints for CRUD operations, search, and error handling. Implement global exception handler for consistent error responses.

### What to Do

1. Create ContactController class with all 6 endpoints
2. Implement HTTP status codes (200, 201, 204, 400, 404, 409, 500)
3. Create global exception handler
4. Create error response DTO
5. Enable CORS for local frontend
6. Add Swagger/OpenAPI documentation
7. Write integration tests (with Testcontainers)

### Acceptance Criteria

- [ ] All 6 endpoints implemented
- [ ] Correct HTTP status codes returned
- [ ] Global exception handler catches errors
- [ ] Error responses formatted consistently
- [ ] CORS configured for frontend
- [ ] Swagger documentation generated
- [ ] Integration tests: 80%+ coverage
- [ ] Tests pass: `mvn test -Dtest=ContactControllerTests`
- [ ] API responses < 200ms

### References
- SPECIFICATION.md: API endpoints, HTTP codes
- CONSTITUTION.md: Performance, Security
- IMPLEMENTATION_PLAN.md: API architecture

**Labels:** `type:task`, `phase:backend`, `priority:high`  
**Milestone:** MVP Phase 1

---

## TASK-005: Frontend Project Setup

**Title:** TASK-005: Frontend Project Setup

**Description:**

### Duration: 2 hours | Effort: Small | Priority: 🔴 High

### Description
Initialize a Vite + React 18 + TypeScript project with Tailwind CSS, ESLint, Prettier, Axios, and Docker configuration.

### What to Do

1. Create Vite project with React + TypeScript
2. Install dependencies (axios, tailwindcss, react-hook-form, zod, vitest)
3. Setup Tailwind CSS
4. Configure TypeScript (strict mode)
5. Setup ESLint + Prettier
6. Setup Vitest
7. Create environment files
8. Create Dockerfile
9. Create frontend/README.md

### Acceptance Criteria

- [ ] Vite project initializes: `npm install`
- [ ] Dev server starts: `npm run dev`
- [ ] Build succeeds: `npm run build`
- [ ] Tests run: `npm run test`
- [ ] Linting passes: `npm run lint`
- [ ] TypeScript strict mode enabled
- [ ] Tailwind CSS compiles
- [ ] Dockerfile builds successfully

### References
- IMPLEMENTATION_PLAN.md: Frontend tech stack
- CONSTITUTION.md: Code Quality

**Labels:** `type:task`, `phase:frontend`, `priority:high`  
**Milestone:** MVP Phase 2

---

## TASK-006: Base Components

**Title:** TASK-006: Base Components

**Description:**

### Duration: 8 hours | Effort: Medium | Priority: 🔴 High

### Description
Create reusable React components for the application: Layout, ContactForm, ContactList, ContactCard, Modal, Toast, and common UI elements.

### What to Do

1. Create Layout Components (Header, Footer, Container)
2. Create ContactForm component
3. Create ContactList component
4. Create ContactCard component
5. Create Modal (ConfirmDialog)
6. Create Toast/Notification component
7. Create Common UI components (Button, Input, Spinner, Empty)
8. Write component tests (80%+ coverage)

### Acceptance Criteria

- [ ] All 8+ components created
- [ ] Components are reusable
- [ ] Responsive design (375px, 768px, 1440px)
- [ ] Tailwind CSS used for styling
- [ ] Accessibility: ARIA labels, keyboard nav
- [ ] Component tests: 80%+ coverage
- [ ] Tests pass: `npm run test`
- [ ] TypeScript strict mode compliant

### References
- SPECIFICATION.md: UI requirements
- CONSTITUTION.md: Code Quality, Accessibility
- IMPLEMENTATION_PLAN.md: Component hierarchy

**Labels:** `type:task`, `phase:frontend`, `priority:high`  
**Milestone:** MVP Phase 2

---

## TASK-007: React Hooks & State Management

**Title:** TASK-007: React Hooks & State Management

**Description:**

### Duration: 5 hours | Effort: Medium | Priority: 🔴 High

### Description
Implement custom React hooks for data fetching, form state, and notifications. Use Context API for global state.

### What to Do

1. Create useContacts hook (fetch from API)
2. Create useForm hook (manage form state)
3. Create useNotification hook (show toasts)
4. Create useDebounce hook (debounce search)
5. Setup Context API for notifications
6. Create API service (contactService.ts)
7. Write hook tests (80%+ coverage)

### Acceptance Criteria

- [ ] useContacts hook fetches from API correctly
- [ ] useForm hook manages form state
- [ ] useNotification hook displays toasts
- [ ] useDebounce delays input correctly
- [ ] Context API setup for notifications
- [ ] API service has all 6 endpoint wrappers
- [ ] Hooks handle loading/error states
- [ ] Hook tests: 80%+ coverage
- [ ] Tests pass: `npm run test`

### References
- SPECIFICATION.md: API endpoints
- CONSTITUTION.md: Code Quality
- IMPLEMENTATION_PLAN.md: State management

**Labels:** `type:task`, `phase:frontend`, `priority:high`  
**Milestone:** MVP Phase 2

---

## TASK-008: Form Validation

**Title:** TASK-008: Form Validation

**Description:**

### Duration: 4 hours | Effort: Small | Priority: 🟡 Medium

### Description
Integrate React Hook Form + Zod for real-time form validation on the frontend.

### What to Do

1. Create Zod validation schema
2. Integrate React Hook Form in ContactForm
3. Add field-level validation display
4. Implement real-time validation
5. Test validation (80%+ coverage)

### Acceptance Criteria

- [ ] Zod schema defined
- [ ] React Hook Form integrated
- [ ] Email validation works (RFC 5322)
- [ ] Name validation: 1-255 chars
- [ ] Phone validation: 10-20 digits (optional)
- [ ] BirthDate validation: past only (optional)
- [ ] Error messages displayed inline
- [ ] Submit button disabled when invalid
- [ ] Tests: 80%+ coverage
- [ ] Tests pass: `npm run test`

### References
- SPECIFICATION.md: Validation rules
- CONSTITUTION.md: Security, Code Quality

**Labels:** `type:task`, `phase:frontend`, `priority:medium`  
**Milestone:** MVP Phase 2

---

## TASK-009: Listing Features

**Title:** TASK-009: Listing Features (Search, Filter, Sort, Pagination)

**Description:**

### Duration: 6 hours | Effort: Medium | Priority: 🔴 High

### Description
Implement ContactList with search, filter, sort, and pagination capabilities calling the backend API.

### What to Do

1. Implement search by name/email (< 200ms)
2. Implement filter by date of birth
3. Implement sort (by name or date)
4. Implement pagination (10 per page)
5. Combine all features
6. Add UX improvements (loading, empty state, error handling)
7. Write component tests (80%+ coverage)

### Acceptance Criteria

- [ ] Search works in < 200ms
- [ ] Filter by DOB range works
- [ ] Sort by name/date works
- [ ] Pagination displays 10 per page
- [ ] Combines all filters correctly
- [ ] Empty state displayed
- [ ] Error handling for API failures
- [ ] Loading spinners show
- [ ] Tests: 80%+ coverage
- [ ] Tests pass: `npm run test`

### References
- SPECIFICATION.md: Listing features
- CONSTITUTION.md: Performance, UX

**Labels:** `type:task`, `phase:frontend`, `priority:high`  
**Milestone:** MVP Phase 2

---

## TASK-010: Edit & Delete Operations

**Title:** TASK-010: Edit & Delete Operations

**Description:**

### Duration: 5 hours | Effort: Medium | Priority: 🔴 High

### Description
Implement edit and delete functionality with form pre-filling, confirmation dialogs, and API integration.

### What to Do

1. Implement edit operation (pre-fill form, submit PUT)
2. Implement delete operation (confirm, call DELETE)
3. Handle edge cases (404, 409)
4. Add UX improvements (disable buttons, spinners)
5. Write integration tests (80%+ coverage)

### Acceptance Criteria

- [ ] Edit button opens form with pre-filled data
- [ ] Form validation still works on edit
- [ ] Submit calls PUT /api/contacts/{id}
- [ ] Success message shows
- [ ] Contact list updates
- [ ] Delete button shows confirmation
- [ ] Delete calls DELETE /api/contacts/{id}
- [ ] Contact removed from list
- [ ] Error handling for 404, 409
- [ ] Tests: 80%+ coverage
- [ ] Tests pass: `npm run test`

### References
- SPECIFICATION.md: Edit & delete operations
- CONSTITUTION.md: UX, Security

**Labels:** `type:task`, `phase:frontend`, `priority:high`  
**Milestone:** MVP Phase 2

---

## TASK-011: E2E Testing & Coverage

**Title:** TASK-011: E2E Testing & Coverage

**Description:**

### Duration: 12 hours | Effort: Large | Priority: 🟡 Medium

### Description
Write comprehensive tests for frontend and backend targeting 80%+ code coverage. Test CRUD operations, search, filtering, error handling, and integration.

### What to Do

**Frontend:**
1. Component tests (ContactForm, List, Card, Modal, etc.)
2. Hook tests (useContacts, useForm, useNotification)
3. Integration tests (CRUD flows)
4. Mock API responses

**Backend:**
1. Repository tests (custom queries)
2. Service tests (CRUD, validation)
3. Controller tests (all endpoints)
4. End-to-end scenarios

### Acceptance Criteria

- [ ] Frontend: 80%+ code coverage
- [ ] Backend: 80%+ code coverage
- [ ] All components tested
- [ ] All services tested
- [ ] All endpoints tested
- [ ] All hooks tested
- [ ] Integration tests pass
- [ ] Error cases handled
- [ ] Frontend: `npm run test` passes
- [ ] Backend: `mvn test` passes
- [ ] Coverage reports generated

### References
- CONSTITUTION.md: Code Quality (80% mandatory)
- SPECIFICATION.md: Acceptance criteria
- IMPLEMENTATION_PLAN.md: Testing strategy

**Labels:** `type:task`, `phase:testing`, `priority:medium`  
**Milestone:** MVP Phase 3

---

## TASK-012: Docker Setup & Documentation

**Title:** TASK-012: Docker Setup & Documentation

**Description:**

### Duration: 6 hours | Effort: Medium | Priority: 🟡 Medium

### Description
Setup Docker Compose for complete stack, create start/stop/reset scripts, and write comprehensive documentation.

### What to Do

1. Create docker-compose.yml
2. Create shell scripts (start.sh, stop.sh, reset.sh)
3. Create .dockerignore files
4. Write comprehensive README.md
5. Create API documentation
6. Create DEPLOYMENT.md
7. Update root README.md

### Acceptance Criteria

- [ ] docker-compose.yml works
- [ ] All services start successfully
- [ ] Frontend accessible at http://localhost:5173
- [ ] Backend accessible at http://localhost:8080
- [ ] Database accessible at localhost:5432
- [ ] Services communicate correctly
- [ ] start.sh, stop.sh, reset.sh work
- [ ] README.md complete
- [ ] API documentation complete
- [ ] Success criteria checklist included

### References
- IMPLEMENTATION_PLAN.md: Docker setup
- SPECIFICATION.md: API documentation

**Labels:** `type:task`, `phase:integration`, `priority:medium`  
**Milestone:** MVP Phase 3

---

## 📊 How to Create Issues via CLI

### Option 1: GitHub CLI (Recommended)

```bash
# Install GitHub CLI
brew install gh  # macOS
# or: sudo apt install gh  # Linux

# Authenticate
gh auth login

# Create issue for TASK-001
gh issue create \
  --title "TASK-001: Backend Project Setup" \
  --body "$(cat << 'EOF'
### Duration: 2 hours | Effort: Small | Priority: 🔴 High

Initialize a Spring Boot 3.x project...
[copy body from above]
EOF
)" \
  --label "type:task" \
  --label "phase:backend" \
  --milestone "MVP Phase 1"
```

### Option 2: Bulk Create Script

Create `create_issues.sh`:

```bash
#!/bin/bash

# TASK-001
gh issue create --title "TASK-001: Backend Project Setup" ...

# TASK-002
gh issue create --title "TASK-002: Contact Entity & JPA Repository" ...

# ... repeat for all 12 tasks
```

Then run:
```bash
chmod +x create_issues.sh
./create_issues.sh
```

---

## 🎯 Milestones

Create 3 milestones in GitHub:
1. **MVP Phase 1:** TASK-001 to TASK-004 (Backend)
2. **MVP Phase 2:** TASK-005 to TASK-010 (Frontend)
3. **MVP Phase 3:** TASK-011 to TASK-012 (Testing & Integration)

---

**Last Updated:** 2026-07-09
