# Implementation Plan

This document defines HOW we are building the Personal Contact Manager Application - the technology choices, architecture, project structure, and development workflow.

---

## Overview

Full-stack web application built with:
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Java 21 + Spring Boot 3.x + Maven
- **Database:** PostgreSQL 15+
- **Infrastructure:** Docker + Docker Compose

All services run locally via Docker, no cloud or CI/CD initially.

---

## 🎯 Technology Stack

### Frontend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Node.js | 20+ | JavaScript runtime |
| **Framework** | React | 18+ | UI components & state |
| **Language** | TypeScript | 5+ | Type safety |
| **Build Tool** | Vite | Latest | Fast bundling & dev server |
| **Styling** | Tailwind CSS | Latest | Utility-first CSS |
| **State** | React Context API | Native | Simple state management |
| **Forms** | React Hook Form | 7+ | Form state & validation |
| **Validation** | Zod | Latest | Schema validation |
| **HTTP** | Axios | Latest | API calls |
| **Testing** | Vitest | Latest | Unit/component tests |
| **Test Utils** | React Testing Library | Latest | Component testing |
| **Linting** | ESLint | 8+ | Code quality |
| **Formatting** | Prettier | Latest | Code formatting |

**Why these choices:**
- React + TypeScript: Industry standard, type-safe, large ecosystem
- Vite: 10x faster than Webpack, instant HMR
- Tailwind CSS: Responsive design fast, utility-first
- React Hook Form + Zod: Lightweight, composable validation
- Axios: Simple API client, better than fetch
- Vitest: Vue team's Vite-native test runner, fast

---

### Backend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Java | 21+ | JVM language |
| **Framework** | Spring Boot | 3.x | Web framework |
| **Build Tool** | Maven | 3.8+ | Dependency management |
| **ORM** | Spring Data JPA | 3.x | Database access |
| **Mapping** | Hibernate | 6+ | ORM implementation |
| **Database** | PostgreSQL | 15+ | SQL database |
| **Validation** | Jakarta Bean Validation | 3+ | Input validation |
| **Testing** | JUnit 5 | 5+ | Unit testing |
| **Containers** | Testcontainers | Latest | DB testing |
| **Logging** | SLF4J + Logback | Latest | Application logging |
| **Utilities** | Lombok | Latest | Boilerplate reduction |
| **Migration** | Flyway | Latest | Database versioning |
| **API Docs** | Springdoc OpenAPI | Latest | Swagger/OpenAPI |

**Why these choices:**
- Java 21 + Spring Boot: Mature, scalable, enterprise-ready
- Maven: Standard JVM build tool, dependency management
- Spring Data JPA: Reduce boilerplate, automatic CRUD
- PostgreSQL: Open-source, reliable, good indexes
- Flyway: Database version control, reproducible migrations
- Testcontainers: Real DB testing, no H2 differences

---

### Infrastructure

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Containerization** | Docker | Latest | Container runtime |
| **Orchestration** | Docker Compose | Latest | Multi-container management |
| **Version Control** | Git | Latest | Source control |

**Why:**
- Docker: Isolate services, consistent across machines
- Docker Compose: Define entire stack in one file
- Git: Track changes, PR workflow

---

## 🏗️ Project Structure

```
personal-contact-manager-application/
│
├── backend/                          # Java 21 + Spring Boot 3.x
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/contactmanager/
│   │   │   │   ├── ContactManagerApplication.java    # Entry point
│   │   │   │   ├── controller/
│   │   │   │   │   ├── ContactController.java        # REST endpoints
│   │   │   │   │   └── ExceptionHandler.java         # Global error handling
│   │   │   │   ├── service/
│   │   │   │   │   └── ContactService.java           # Business logic
│   │   │   │   ├── repository/
│   │   │   │   │   └── ContactRepository.java        # Data access
│   │   │   │   ├── entity/
│   │   │   │   │   └── Contact.java                  # JPA entity
│   │   │   │   ├── dto/
│   │   │   │   │   ├── ContactRequest.java           # Create/update DTO
│   │   │   │   │   └── ContactResponse.java          # Response DTO
│   │   │   │   ├── exception/
│   │   │   │   │   ├── ContactNotFoundException.java
│   │   │   │   │   └── EmailAlreadyExistsException.java
│   │   │   │   └── config/
│   │   │   │       └── AppConfig.java                # Spring config
│   │   │   └── resources/
│   │   │       ├── application.yml                   # Spring config
│   │   │       └── db/migration/
│   │   │           └── V1__init.sql                  # Flyway migration
│   │   └── test/
│   │       └── java/com/contactmanager/
│   │           ├── ContactRepositoryTests.java
│   │           ├── ContactServiceTests.java
│   │           └── ContactControllerTests.java
│   ├── pom.xml                      # Maven config
│   ├── Dockerfile
│   └── README.md
│
├── frontend/                         # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ContactForm/
│   │   │   │   ├── ContactForm.tsx                   # Create/edit form
│   │   │   │   └── ContactForm.test.tsx
│   │   │   ├── ContactList/
│   │   │   │   ├── ContactList.tsx                   # List container
│   │   │   │   └── ContactList.test.tsx
│   │   │   ├── ContactCard/
│   │   │   │   ├── ContactCard.tsx                   # Card display
│   │   │   │   └── ContactCard.test.tsx
│   │   │   ├── Layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Container.tsx
│   │   │   ├── Modal/
│   │   │   │   ├── ConfirmDialog.tsx                 # Delete confirmation
│   │   │   │   └── Toast.tsx                         # Notifications
│   │   │   └── Common/
│   │   │       ├── Button.tsx
│   │   │       ├── Input.tsx
│   │   │       ├── Spinner.tsx
│   │   │       └── Empty.tsx
│   │   ├── hooks/
│   │   │   ├── useContacts.ts                        # Data fetching
│   │   │   ├── useForm.ts                            # Form state
│   │   │   ├── useNotification.ts                    # Toast/notification
│   │   │   └── useDebounce.ts                        # Debounce search
│   │   ├── services/
│   │   │   ├── api.ts                                # Axios instance
│   │   │   └── contactService.ts                     # API calls
│   │   ├── types/
│   │   │   └── index.ts                              # TypeScript types
│   │   ├── utils/
│   │   │   ├── validation.ts                         # Zod schemas
│   │   │   ├── formatters.ts                         # Date/number formatting
│   │   │   └── constants.ts                          # App constants
│   │   ├── App.tsx                                   # Root component
│   │   ├── App.css                                   # Global styles
│   │   └── index.tsx                                 # Entry point
│   ├── public/                      # Static assets
│   │   └── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── .prettierrc
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml               # Multi-container orchestration
├── .dockerignore
├── .gitignore
├── README.md                         # Project root documentation
├── CONSTITUTION.md                  # Principles & standards
├── SPECIFICATION.md                 # What we're building
└── IMPLEMENTATION_PLAN.md           # This file
```

---

## 🗄️ Database Design

### Schema

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  birth_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

-- Performance indexes
CREATE INDEX idx_contacts_email ON contacts(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_name ON contacts(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_birth_date ON contacts(birth_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_deleted_at ON contacts(deleted_at);
```

### Flyway Migrations

File: `backend/src/main/resources/db/migration/V1__init.sql`

Manages all schema changes, version controlled in git.

### ORM Mapping (JPA)

```java
@Entity
@Table(name = "contacts")
public class Contact {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @NotBlank
  @Size(min = 1, max = 255)
  private String name;

  @NotBlank
  @Email
  @Column(unique = true)
  private String email;

  @Pattern(regexp = "^[0-9]{10,20}$")
  private String phone;

  @Past
  @Temporal(TemporalType.DATE)
  private LocalDate birthDate;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  private LocalDateTime deletedAt;
}
```

---

## 🔌 API Architecture

### Layered Design

```
HTTP Request
    ↓
ContactController (REST endpoints, validation, error handling)
    ↓
ContactService (Business logic, search/filter/soft delete rules)
    ↓
ContactRepository (Database queries with indexes)
    ↓
JPA/Hibernate (ORM mapping)
    ↓
PostgreSQL (Data persistence)
    ↓
HTTP Response
```

### Endpoints

All endpoints handled by `ContactController`:

```java
@RestController
@RequestMapping("/api/contacts")
public class ContactController {
  @GetMapping              // GET /api/contacts?page=0&size=10
  @GetMapping("/{id}")     // GET /api/contacts/{id}
  @PostMapping             // POST /api/contacts
  @PutMapping("/{id}")     // PUT /api/contacts/{id}
  @DeleteMapping("/{id}")  // DELETE /api/contacts/{id}
  @GetMapping("/search")   // GET /api/contacts/search?q=john
}
```

### Error Handling

Global exception handler: `ExceptionHandler.java`

Catches all exceptions, returns standardized error response:

```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Email format is invalid"
  },
  "timestamp": "2026-07-09T10:00:00Z"
}
```

---

## 🎨 Frontend Architecture

### Component Hierarchy

```
App
├── Header
├── MainLayout
│   ├── ContactList (container)
│   │   ├── SearchBar
│   │   ├── FilterBar
│   │   ├── SortOptions
│   │   ├── Pagination
│   │   └── ContactCard (reusable)
│   │       ├── Button (edit)
│   │       └── Button (delete)
│   └── ContactForm (modal/page)
│       ├── Input (name)
│       ├── Input (email)
│       ├── Input (phone)
│       ├── Input (birthDate)
│       ├── Button (save)
│       └── Button (cancel)
├── ConfirmDialog (delete confirmation)
├── Toast (notifications)
└── Footer
```

### State Management

**Context API** for global state:

```typescript
// useContacts hook
const { contacts, loading, search, filter, sort, create, update, delete } = useContacts();

// useNotification hook
const { showToast, showError } = useNotification();
```

No Redux/MobX - Context is sufficient for this project size.

### Form Validation

**React Hook Form + Zod:**

```typescript
const schema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().regex(/^[0-9]{10,20}$/).optional(),
  birthDate: z.date().max(new Date()).optional(),
});

const form = useForm({ resolver: zodResolver(schema) });
```

Validation happens both frontend (UX) AND backend (security).

---

## 🐳 Docker Setup

### Services

```yaml
# docker-compose.yml

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: contact_manager
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]

  backend:
    build: ./backend
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/contact_manager
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
    ports:
      - "8080:8080"

  frontend:
    build: ./frontend
    environment:
      REACT_APP_API_URL: http://localhost:8080/api
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Local Development

**With Docker:**
```bash
docker-compose up -d
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
# Database: localhost:5432
```

**Without Docker:**
```bash
# Backend (Java 21 + Maven)
cd backend && mvn spring-boot:run

# Frontend (Node.js 20)
cd frontend && npm install && npm run dev

# Database (PostgreSQL running locally)
```

---

## 🧪 Testing Strategy

### Frontend (Vitest + React Testing Library)

**Unit Tests:**
- Components: ContactForm, ContactCard, ContactList
- Hooks: useContacts, useForm, useNotification
- Utils: validation, formatters

**Integration Tests:**
- Create → List → Edit → Delete workflow
- Error handling & notifications
- Form validation

**Coverage Goal:** 80%+

```bash
npm run test          # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

---

### Backend (JUnit 5 + Testcontainers)

**Unit Tests:**
- Service logic: search, filter, soft delete
- Repository queries
- Validation rules

**Integration Tests:**
- Controller endpoints with real PostgreSQL (Testcontainers)
- Database persistence
- Error handling

**Coverage Goal:** 80%+

```bash
mvn test                    # Run all tests
mvn test -Dtest=ContactControllerTests  # Single test class
mvn jacoco:report           # Coverage report
```

### Testing Pyramid

```
         /\
        /  \     E2E / Manual (UI testing)
       /----\    
      /      \   Integration (API + DB)
     /--------\
    /          \ Unit (Service, Component, Repo)
   /____________\
```

---

## 🔒 Security Implementation

### Input Validation (Both Layers)

**Frontend:**
```typescript
// Zod schema validation before form submit
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  // ... more rules
});
```

**Backend:**
```java
// Jakarta Bean Validation on DTOs
public class ContactRequest {
  @NotBlank @Size(min = 1, max = 255)
  private String name;

  @Email @NotBlank
  private String email;
  // ... more annotations
}
```

### SQL Injection Prevention

**Only use JPA/parameterized queries:**

```java
// ✅ CORRECT
@Query("SELECT c FROM Contact c WHERE c.name LIKE :name")
List<Contact> findByName(@Param("name") String name);

// ❌ NEVER: String concatenation
```

### XSS Protection

**React escapes by default:**

```typescript
// ✅ CORRECT - React escapes automatically
<p>{userInput}</p>

// ❌ NEVER - dangerouslySetInnerHTML without sanitization
<p dangerouslySetInnerHTML={{ __html: userInput }} />
```

---

## ⚡ Performance Optimization

### Frontend

- **Code Splitting:** Lazy load routes with React.lazy()
- **Bundle Size:** Analyze with `npm run build`
- **Minification:** Vite handles automatically
- **Caching:** Leverage browser cache for static assets
- **Debouncing:** Search input with useDebounce

### Backend

- **Database Indexes:** On email, name, birthDate, deletedAt
- **Pagination:** Never return all records, always use LIMIT/OFFSET
- **Lazy Loading:** Avoid N+1 queries
- **Connection Pooling:** HikariCP (Spring default)

### Target Metrics

```
API Response: < 200ms (p95)
Page Load: < 3 seconds
Database Query: < 50ms with indexes
```

---

## 📝 Code Quality

### Frontend

**ESLint + Prettier:**
```bash
npm run lint          # Check code
npm run lint:fix      # Fix issues
npm run format        # Format with Prettier
```

**TypeScript:**
- Strict mode enabled
- No `any`, `Object`, `var`
- All functions typed

### Backend

**Checkstyle:**
```bash
mvn checkstyle:check  # Check style
mvn fmt:format        # Format code
```

**Java:**
- SOLID principles
- Proper exception handling
- Logging with SLF4J (never System.out.println)

### Shared

**No console.log in production:**
- ESLint rule blocks it
- Manual code review catches violations
- Use SLF4J (backend) / console only in dev (frontend)

---

## 📚 Documentation

### Code Level
- Comments explain WHY not WHAT
- Type definitions are self-documenting
- Function names are clear and descriptive

### Project Level
- **README.md:** Setup, commands, architecture
- **SPECIFICATION.md:** What we're building
- **CONSTITUTION.md:** Quality standards
- **IMPLEMENTATION_PLAN.md:** This file (HOW)

### API Level
- **OpenAPI/Swagger:** Auto-generated at `/api/swagger-ui.html`
- **curl/Postman examples:** In SPECIFICATION.md

---

## 🔄 Development Workflow

### Local Development

```bash
# 1. Start all services
docker-compose up -d

# 2. Watch mode (auto-rebuild)
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Backend
cd backend && mvn spring-boot:run

# 3. Test
npm run test (frontend)
mvn test (backend)

# 4. Code formatting
npm run format (frontend)
mvn fmt:format (backend)

# 5. Git workflow
git checkout -b feature/xyz
git add .
git commit -m "feat: add xyz"
git push
# Create PR, code review, merge
```

### Commit Convention

```
feat: add contact search
fix: resolve validation bug
test: add contact service tests
docs: update README
chore: upgrade dependencies
```

---

## 🚀 Deployment (Future)

Currently local development only. For deployment (Phase 2):

1. Push images to Docker registry
2. Deploy to cloud (Heroku, AWS, GCP)
3. Setup CI/CD (GitHub Actions)
4. Add environment-specific configs

---

## 📊 Architecture Decisions (ADRs)

### 1. Why React Context instead of Redux/MobX?
**Decision:** Use React Context API  
**Reason:** Project is small, global state is minimal  
**Trade-off:** Simpler code now, might refactor to Redux if grows

### 2. Why Spring Boot + Java instead of Node.js?
**Decision:** Use Java 21 + Spring Boot  
**Reason:** Robust, production-proven, type-safe  
**Trade-off:** Slightly heavier than Node, but better reliability

### 3. Why PostgreSQL not MongoDB?
**Decision:** Use PostgreSQL  
**Reason:** ACID guarantees, strong schema, excellent for structured data  
**Trade-off:** Less flexible schema changes, but better data integrity

### 4. Why Vite not Webpack?
**Decision:** Use Vite  
**Reason:** 10x faster, Rollup-based, modern dev experience  
**Trade-off:** Smaller ecosystem than Webpack, but rapidly growing

---

## ✅ Implementation Checklist

### Backend Tasks
- [ ] Spring Boot project setup
- [ ] Entity and Repository
- [ ] Service layer (CRUD, search, filter)
- [ ] REST Controller endpoints
- [ ] Validation (Jakarta Bean Validation)
- [ ] Global exception handler
- [ ] Flyway migrations
- [ ] Docker configuration
- [ ] Unit & integration tests (80%+)

### Frontend Tasks
- [ ] Vite + React + TypeScript setup
- [ ] Tailwind CSS + ESLint + Prettier
- [ ] Base components (Form, List, Card, Modal)
- [ ] Hooks (useContacts, useForm, useNotification)
- [ ] API service with Axios
- [ ] Form validation (React Hook Form + Zod)
- [ ] List features (search, filter, sort, pagination)
- [ ] Edit/delete operations
- [ ] Docker configuration
- [ ] Component & integration tests (80%+)

### Integration
- [ ] Backend ↔ Frontend communication
- [ ] Docker Compose setup
- [ ] Start/stop scripts
- [ ] Environment configuration
- [ ] Documentation (README, API docs)

---

**Last Updated:** 2026-07-09  
**Version:** 1.0.0  
**Status:** Ready for Development
