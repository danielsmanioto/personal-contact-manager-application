# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🎯 Project Overview

**Personal Contact Manager** is a full-stack web application for managing personal contacts with search, filtering, sorting, and pagination. The project uses **trunk-based development** on the `main` branch with feature branches for discrete work.

- **Status:** MVP Complete (12/12 tasks finished)
- **Tech Stack:** Java 21 + Spring Boot 3.3 | React 18 + TypeScript | PostgreSQL 15 | Docker
- **API Version:** REST with OpenAPI/Swagger
- **Test Coverage:** 80%+ target (backend + frontend)

---

## 🏗️ Architecture

### High-Level Design

```
Frontend (React 18 + TypeScript)
    ↓ (REST API via axios)
Backend (Spring Boot 3.3 + Java 21)
    ↓ (JPA Queries)
PostgreSQL 15 Database
    └─ Flyway migrations (db/migration/)
```

### Backend Layer Stack (Java)

1. **Controller** (`src/main/java/.../controller/`)
   - `ContactController` - REST endpoints for CRUD operations
   - `GlobalExceptionHandler` - Centralized error handling
   - Maps HTTP requests → Service calls → DTOs

2. **Service** (`src/main/java/.../service/`)
   - `ContactService` - Business logic, validation, transactions
   - Orchestrates Repository and Entity operations
   - Handles soft deletes (marks `deleted_at` instead of removing)

3. **Repository** (`src/main/java/.../repository/`)
   - `ContactRepository` extends JpaRepository
   - Custom queries for search, filter, and pagination
   - Queries ignore soft-deleted contacts (WHERE deleted_at IS NULL)

4. **Entity** (`src/main/java/.../entity/`)
   - `Contact` - JPA entity mapped to `contacts` table
   - Uses UUID for primary key
   - Tracks timestamps: `createdAt`, `updatedAt`, `deletedAt`

5. **DTO** (`src/main/java/.../dto/`)
   - `ContactRequest` - Input validation with Jakarta Bean Validation
   - `ContactResponse` - JSON response structure
   - `PaginatedResponse` - Wraps paginated results
   - `ErrorResponse` - Standardized error format

6. **Database**
   - **Migrations:** `src/main/resources/db/migration/` (Flyway)
   - **Schema:** Single `contacts` table with soft-delete support
   - **Indexes:** On email, name, birth_date, deleted_at for query optimization

### Frontend Component Architecture (React)

```
App (src/App.tsx)
  ├── NotificationContext (for toast notifications)
  ├── HomePage (main page with all features)
  │   ├── ContactForm (create/edit contacts)
  │   ├── SearchBar (debounced search)
  │   ├── FilterBar (date range filtering)
  │   ├── SortOptions (name/creation date)
  │   ├── ContactList (paginated grid)
  │   │   └── ContactCard[] (individual contacts)
  │   └── Pagination (page navigation)
  └── Design System (shared components, colors, typography)
```

**Key Patterns:**
- Custom hooks: `useContacts()`, `useForm()`, `useNotification()`, `useDebounce()`, `useDesignTokens()`
- Validation: Zod schemas + React Hook Form
- State: Context API for notifications, hooks for contact data
- Styling: Tailwind CSS with design tokens (colors, typography, spacing, animations)
- API Client: Axios with centralized base URL via `services/api.ts`

---

## 🔧 Essential Commands

### Backend (Java 21 + Maven)

```bash
export JAVA_HOME=$(/usr/libexec/java_home)  # Required on macOS

# Build & Test
mvn clean compile                           # Compile only
mvn clean test                              # Run all tests
mvn test -Dtest=ContactServiceTests        # Run single test class
mvn test -Dtest=ContactServiceTests#testSave  # Run single test method

# Run Application
mvn spring-boot:run                         # Start on http://localhost:8081
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8082"  # Custom port

# Code Quality
mvn checkstyle:check                        # Check code style
mvn spotless:apply                          # Auto-format code
mvn jacoco:report                           # Generate coverage report (target/site/jacoco/)

# Database
mvn flyway:info                             # Check migration status
mvn flyway:validate                         # Validate migrations

# Docker
mvn clean package                           # Build JAR for Docker
```

### Frontend (React 18 + Node.js)

```bash
cd frontend

# Installation & Build
npm install                                  # Install dependencies
npm run build                               # Production build (dist/)

# Development
npm run dev                                 # Development server (http://localhost:5173)
npm run dev -- --port 3000                # Custom port

# Testing
npm run test                                # Run all tests (watch mode)
npm run test:ui                            # Interactive test UI
npm run test:coverage                      # Coverage report

# Code Quality
npm run lint                               # ESLint check
npm run lint:fix                           # Auto-fix linting
npm run format                             # Prettier formatting
```

### Docker & Deployment

```bash
# Run all services
./scripts/start.sh                         # Start frontend + backend + postgres
./scripts/stop.sh                          # Stop all services
./scripts/reset.sh                         # Full reset (drop volumes)

# Manual Docker commands
docker-compose build                       # Build all images
docker-compose up -d                       # Start in background
docker-compose logs -f backend             # View backend logs
docker-compose exec postgres psql -U postgres -d contact_manager  # Database shell
```

### Development Workflow

```bash
# 1. Start feature branch (from main)
git checkout main
git pull origin main
git checkout -b feature/TASK-XXX-short-description

# 2. Make changes, test locally
export JAVA_HOME=$(/usr/libexec/java_home)
mvn clean test                    # Backend
cd frontend && npm test           # Frontend

# 3. Commit with semantic convention
git commit -m "feat: add search functionality"
git commit -m "fix: handle null birthDate in API response"
git commit -m "test: add ContactService unit tests"
git commit -m "docs: update README with new endpoints"

# 4. Create Pull Request
git push origin feature/TASK-XXX-short-description
# Then create PR via GitHub with title: "TASK-XXX: Short description"
```

---

## 📁 Key File Locations & Patterns

### Backend

| Layer | Location | Pattern |
|-------|----------|---------|
| REST Endpoints | `backend/src/main/java/.../controller/ContactController.java` | `@RestController`, `@PostMapping`, `@GetMapping` |
| Business Logic | `backend/src/main/java/.../service/ContactService.java` | `@Service`, `@Transactional` |
| Data Access | `backend/src/main/java/.../repository/ContactRepository.java` | `extends JpaRepository` |
| JPA Entity | `backend/src/main/java/.../entity/Contact.java` | `@Entity`, `@Table(name="contacts")` |
| DTOs | `backend/src/main/java/.../dto/*.java` | Request/Response validation |
| Migrations | `backend/src/main/resources/db/migration/` | `V001__*.sql`, `V002__*.sql` |
| Configuration | `backend/src/main/resources/application.yml` | Spring Boot settings |
| Tests | `backend/src/test/java/com/contactmanager/**/*Tests.java` | JUnit 5, Testcontainers |

### Frontend

| Layer | Location | Purpose |
|-------|----------|---------|
| Entry Point | `frontend/src/main.tsx` | App initialization |
| Main Component | `frontend/src/App.tsx` | App layout + routing context |
| Pages | `frontend/src/pages/HomePageNew.tsx` | Main contact management page |
| Components | `frontend/src/components/` | Reusable UI components |
| Custom Hooks | `frontend/src/hooks/` | `useContacts`, `useForm`, `useNotification` |
| Context | `frontend/src/context/NotificationContext.tsx` | Global notification state |
| Types | `frontend/src/types/index.ts` | TypeScript interfaces |
| API Client | `frontend/src/services/api.ts` | Axios configuration |
| Validation | `frontend/src/utils/validation.ts` | Zod schemas |
| Design Tokens | `frontend/src/design-tokens/` | Colors, typography, spacing |
| Tests | `frontend/src/**/*.test.tsx` | Vitest + React Testing Library |

---

## 🗄️ Database & Flyway

### Understanding Soft Deletes

Contacts are **not** physically deleted from the database. Instead, the `deleted_at` timestamp is set:

```sql
-- In ContactService.deleteContact(id):
-- Updates: DELETE FROM contacts WHERE id = ? AND deleted_at IS NULL
-- Actually: UPDATE contacts SET deleted_at = NOW() WHERE id = ?

-- All queries filter out soft-deleted:
-- SELECT * FROM contacts WHERE deleted_at IS NULL
```

### Adding Database Changes

1. **Create a migration file** in `backend/src/main/resources/db/migration/`:
   ```sql
   -- V004__add_phone_country_code.sql
   ALTER TABLE contacts ADD COLUMN phone_country_code VARCHAR(5);
   ```

2. **Migration naming convention:** `V{version}__description.sql`
   - `V001__initial_schema.sql` (already exists)
   - `V002__add_status_column.sql` (already exists)
   - Next: `V003__your_new_change.sql`

3. **Flyway runs migrations automatically** on application startup
   - Check status: `mvn flyway:info`
   - Validate: `mvn flyway:validate`

### Database Connection (Development)

**Local PostgreSQL:**
```bash
export JAVA_HOME=$(/usr/libexec/java_home)
mvn spring-boot:run
# Expects: postgresql://localhost:5432/contact_manager (user: postgres, password: postgres)
```

**Docker PostgreSQL (via docker-compose):**
```bash
./scripts/start.sh
# Backend connects to: postgresql://postgres:5432/contact_manager
```

---

## 🧪 Testing Strategy

### Backend (JUnit 5 + Testcontainers)

**Test Pyramid:**
- **Unit Tests** (70%): Service layer logic, validation
- **Integration Tests** (25%): Controller + Repository with real PostgreSQL (Testcontainers)
- **End-to-End** (5%): Full request cycle

**Test Location:** `backend/src/test/java/com/contactmanager/`

**Example Test Pattern:**
```java
@SpringBootTest
class ContactServiceTests {
    @Autowired private ContactService service;
    @Autowired private ContactRepository repository;
    
    @Test
    void testSaveContact() { /* ... */ }
    
    @Test
    void testSearchContacts() { /* ... */ }
}
```

**Run Tests:**
```bash
mvn test                          # All tests
mvn test -Dtest=ContactServiceTests
mvn test -Dtest=ContactServiceTests#testSaveContact
```

### Frontend (Vitest + React Testing Library)

**Test Focus:**
- Component rendering and interactions
- Form validation (Zod schemas)
- API calls via axios mocks
- Accessibility (WCAG AA compliance)

**Test Location:** `frontend/src/**/*.test.tsx`

**Example Test Pattern:**
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ContactForm } from './ContactForm';

describe('ContactForm', () => {
  it('should render form fields', () => { /* ... */ });
  it('should validate email format', async () => { /* ... */ });
  it('should call onSubmit with form data', async () => { /* ... */ });
});
```

**Run Tests:**
```bash
npm run test              # Watch mode
npm run test:ui          # Interactive UI
npm run test:coverage    # Coverage report (coverage/)
```

### Test Coverage Target

- **Backend:** 80%+ line coverage (enforced by Jacoco)
- **Frontend:** 80%+ component coverage (all major flows)
- **Rule:** Do NOT commit code without corresponding tests

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8081/api  (development)
http://localhost:8081      (production)
```

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts?page=0&size=10` | List all (paginated) |
| GET | `/contacts/{id}` | Get single contact |
| POST | `/contacts` | Create contact |
| PUT | `/contacts/{id}` | Update contact |
| DELETE | `/contacts/{id}` | Soft delete |
| GET | `/contacts/search?q=john` | Search by name/email |
| GET | `/contacts/filter?fromDate=1990-01-01&toDate=2000-12-31` | Filter by date |

### Documentation

- **Swagger UI:** http://localhost:8081/swagger-ui.html
- **Health Check:** http://localhost:8081/actuator/health
- **Full API Spec:** See README.md for request/response examples

---

## 🎨 Frontend Component Patterns

### Creating a New Component

```tsx
// src/components/MyComponent/MyComponent.tsx
import React from 'react';
import { cn } from '@/utils/cn';

interface MyComponentProps {
  title: string;
  isLoading?: boolean;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  isLoading = false,
  onAction,
}) => {
  return (
    <div className={cn('flex flex-col gap-4', isLoading && 'opacity-50')}>
      <h2>{title}</h2>
      <button onClick={onAction} disabled={isLoading}>
        Click me
      </button>
    </div>
  );
};
```

### Using Custom Hooks

```tsx
// In a component:
import { useContacts } from '@/hooks/useContacts';
import { useNotification } from '@/hooks/useNotification';

export const ContactList = () => {
  const { contacts, loading, error, fetchContacts } = useContacts();
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchContacts().catch(() => {
      showNotification('Failed to load contacts', 'error');
    });
  }, []);

  return <div>{/* render contacts */}</div>;
};
```

### Validation with Zod

```tsx
import { z } from 'zod';
import { useForm } from '@/hooks/useForm';

const contactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
});

export const ContactForm = () => {
  const { register, errors, handleSubmit } = useForm(contactSchema);

  return (
    <form onSubmit={handleSubmit(async (data) => {
      // API call
    })}>
      {/* fields */}
    </form>
  );
};
```

---

## ⚙️ Configuration & Environment

### Backend Configuration (application.yml)

```yaml
server:
  port: 8081
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/contact_manager
    username: postgres
    password: postgres
  jpa:
    hibernate.ddl-auto: validate
  flyway:
    enabled: true
    baselineOnMigrate: true
```

### Frontend Environment Variables

```bash
# frontend/.env.local (development)
VITE_API_BASE_URL=http://localhost:8081/api

# frontend/.env.production
VITE_API_BASE_URL=/api  # Relative path for Docker
```

### CORS Configuration

Configured in `backend/src/main/java/.../config/CorsConfig.java` to allow frontend requests:
- Local development: http://localhost:5173, http://localhost:3000
- Production: Configured in docker-compose.yml

---

## 📊 Performance & Optimization

### Backend Optimizations

- **Database Indexes:** `idx_contacts_email`, `idx_contacts_name`, `idx_contacts_birth_date`, `idx_contacts_deleted_at`
- **Query Optimization:** Custom `@Query` annotations for complex searches
- **Pagination:** Enforced at repository level (limit 10 items/page)
- **Connection Pooling:** HikariCP (Spring Boot default)
- **Target:** < 200ms p95 response time

### Frontend Optimizations

- **Code Splitting:** Components lazy-loaded with React.lazy()
- **Memoization:** useMemo, useCallback for expensive operations
- **Debouncing:** Search input debounced (300ms)
- **Bundle Size:** ~350KB gzipped (Vite optimized)
- **Target:** < 3s initial page load

### Stress Test Results

Last test (2026-07-11): **621K requests, 470 req/s sustained, 22.3ms p95 latency, 0% error rate**
- See: [Stress Test Report](stress-report.html) for details

---

## 🐛 Debugging & Troubleshooting

### Backend Logging

```java
// Use SLF4J (never System.out.println)
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

private static final Logger log = LoggerFactory.getLogger(MyClass.class);
log.info("Contact created: {}", contactId);
log.error("Failed to process request", exception);
```

### Frontend Debugging

```tsx
// Use browser DevTools (never console.log in production)
import { useEffect } from 'react';

export const MyComponent = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('Component mounted', props);
    }
  }, []);
};
```

### Common Issues

| Issue | Solution |
|-------|----------|
| `JAVA_HOME not set` | Run `export JAVA_HOME=$(/usr/libexec/java_home)` |
| Port 8081 in use | `lsof -i :8081` then `kill -9 <PID>` |
| Tests fail randomly | Check database connections, use Testcontainers |
| API not found | Check `application.yml` port, verify backend running |
| CORS errors | Check `CorsConfig.java` and frontend environment variables |
| Database locked | Stop all services: `./scripts/stop.sh` |

---

## 📋 Git Workflow

### Branch Naming
```
feature/TASK-XXX-short-description
```

### Commit Convention
```bash
feat:  Add new feature
fix:   Bug fix
test:  Add/update tests
docs:  Documentation changes
chore: Dependencies, refactoring (non-feature)
```

### Before Pushing

1. **Ensure tests pass:**
   ```bash
   export JAVA_HOME=$(/usr/libexec/java_home)
   mvn clean test                 # Backend
   cd frontend && npm test        # Frontend
   ```

2. **Code quality:**
   ```bash
   mvn checkstyle:check          # Backend style
   cd frontend && npm run lint    # Frontend linting
   ```

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: description"
   git push origin feature/TASK-XXX-description
   ```

---

## 🚀 Deployment

### Docker Compose (All Services)

```bash
./scripts/start.sh
# Access:
# - Frontend: http://localhost
# - Backend API: http://localhost:8081/api
# - Swagger: http://localhost:8081/swagger-ui.html
# - Database: localhost:5432
```

### Production Build

```bash
# Backend
mvn clean package               # Creates backend/target/*.jar
docker build -t contact-manager-backend:latest backend/

# Frontend  
npm run build                   # Creates frontend/dist/
docker build -t contact-manager-frontend:latest frontend/
```

---

## 📚 Documentation Files

- `README.md` - Project overview, features, setup
- `QUICKSTART.md` - Quick start guide
- `DATABASE_SETUP.md` - Database configuration details
- `frontend/README.md` - Frontend-specific setup
- `backend/README.md` - Backend-specific setup
- `frontend/DESIGN_SYSTEM.md` - Design tokens and components
- `frontend/INTEGRATION_GUIDE.md` - API integration patterns

---

## ✅ Code Style & Standards

### Java (Backend)

- **JDK:** Java 21+
- **Style:** Google Java Style Guide (via Checkstyle)
- **Format:** `mvn spotless:apply`
- **Naming:** camelCase for variables/methods, PascalCase for classes
- **No:** `System.out.println()`, use SLF4J instead

### TypeScript/React (Frontend)

- **Version:** TypeScript 5+
- **Linter:** ESLint
- **Formatter:** Prettier
- **Style:** `npm run lint:fix && npm run format`
- **Naming:** camelCase for variables/functions, PascalCase for components
- **Imports:** Organize using path aliases (`@/components`, `@/utils`, etc.)
- **No:** `console.log()` in production code

---

## 🎯 Quick Reference Checklist

- [ ] Running backend: `export JAVA_HOME=$(/usr/libexec/java_home) && mvn spring-boot:run`
- [ ] Running frontend: `cd frontend && npm run dev`
- [ ] Running all services: `./scripts/start.sh`
- [ ] Tests passing: `mvn test && npm test`
- [ ] Code quality: `mvn checkstyle:check && npm run lint`
- [ ] Creating PR: Title format `TASK-XXX: Description`
- [ ] Migrations: Place in `backend/src/main/resources/db/migration/`
- [ ] Feature branch: `git checkout -b feature/TASK-XXX-description`

---

<!-- SPECKIT START -->
**Current Feature Plan**: [specs/003-create-contact/plan.md](specs/003-create-contact/plan.md) — Create Contact with Validated Form (in-progress)
<!-- SPECKIT END -->
