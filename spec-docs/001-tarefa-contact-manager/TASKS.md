# Tasks

This document breaks down the project into 12 actionable tasks for implementation. Each task is self-contained, has clear acceptance criteria, and references the SPECIFICATION and CONSTITUTION documents.

---

## 📊 Task Overview

| Task ID | Title | Component | Effort | Duration | Status |
|---------|-------|-----------|--------|----------|--------|
| TASK-001 | Backend project setup | Backend Setup | S | 2h | ⏳ Todo |
| TASK-002 | Contact entity & JPA repository | Backend Data | S | 3h | ⏳ Todo |
| TASK-003 | Contact service layer | Backend Logic | M | 5h | ⏳ Todo |
| TASK-004 | REST API endpoints | Backend API | M | 6h | ⏳ Todo |
| TASK-005 | Frontend project setup | Frontend Setup | S | 2h | ⏳ Todo |
| TASK-006 | Base components | Frontend Components | M | 8h | ⏳ Todo |
| TASK-007 | React hooks & state | Frontend Hooks | M | 5h | ⏳ Todo |
| TASK-008 | Form validation | Frontend Validation | S | 4h | ⏳ Todo |
| TASK-009 | Listing features | Frontend Listing | M | 6h | ⏳ Todo |
| TASK-010 | Edit & delete operations | Frontend Operations | M | 5h | ⏳ Todo |
| TASK-011 | E2E testing & coverage | Testing | L | 12h | ⏳ Todo |
| TASK-012 | Docker & documentation | Integration & Docs | M | 6h | ⏳ Todo |
| | **TOTAL** | | | **64h** | |

**Legend:** S=Small (1-3h), M=Medium (4-8h), L=Large (10h+)

---

## Phase 1: Backend Setup & API (TASK-001 to TASK-004)

---

## TASK-001: Backend Project Setup

**Duration:** 2 hours  
**Effort:** Small  
**Priority:** 🔴 High (Blocker for all backend tasks)  
**Dependencies:** None

### Description

Initialize a Spring Boot 3.x project with Java 21, Maven build tool, PostgreSQL connection, Flyway migrations, and Docker configuration.

### What to Do

1. **Create Spring Boot project** (Maven archetype)
   - Java 21 compatibility
   - Spring Boot 3.x latest
   - Add starters: spring-boot-starter-web, spring-boot-starter-data-jpa
   - Setup Maven pom.xml with dependencies

2. **Add core dependencies**
   - PostgreSQL JDBC driver
   - Flyway for migrations
   - Lombok for boilerplate reduction
   - JUnit 5 for testing
   - Testcontainers for integration tests
   - SLF4J + Logback for logging
   - Springdoc OpenAPI for Swagger

3. **Configure application.yml**
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/contact_manager
       username: postgres
       password: postgres
     jpa:
       hibernate.ddl-auto: validate
       show-sql: false
   ```

4. **Setup Flyway migration folder**
   - Create `src/main/resources/db/migration/`
   - Prepare for V1__init.sql (database schema)

5. **Create main application class**
   - `ContactManagerApplication.java`
   - Add @SpringBootApplication annotation
   - Configure CORS for local development

6. **Create Dockerfile**
   - Multi-stage build
   - Use `eclipse-temurin:21-jdk` base image
   - Expose port 8080

7. **Create backend/README.md**
   - Setup instructions
   - Build commands
   - Run commands

### Acceptance Criteria

- [ ] Maven build succeeds: `mvn clean install`
- [ ] Spring Boot app starts: `mvn spring-boot:run`
- [ ] Application listens on port 8080
- [ ] All dependencies compile without errors
- [ ] Dockerfile builds successfully: `docker build .`
- [ ] Logger configured (SLF4J working)
- [ ] No console.log/System.out.println (use SLF4J)
- [ ] TypeScript: All Java code has explicit types (no raw types)

### References

- **SPECIFICATION.md:** Data model (Contact entity structure)
- **CONSTITUTION.md:** Code Quality (80% coverage, explicit types, no console.log, lint clean)
- **IMPLEMENTATION_PLAN.md:** Backend tech stack, pom.xml dependencies

### Files to Create

```
backend/
├── pom.xml
├── src/main/java/com/contactmanager/ContactManagerApplication.java
├── src/main/resources/application.yml
├── src/main/resources/db/migration/ (folder, migration files in TASK-002)
├── src/test/ (folder for tests in later tasks)
├── Dockerfile
└── README.md
```

---

## TASK-002: Contact Entity & JPA Repository

**Duration:** 3 hours  
**Effort:** Small  
**Priority:** 🔴 High (Blocker for service layer)  
**Dependencies:** TASK-001 completed

### Description

Create the Contact JPA entity with validation annotations and the ContactRepository interface with custom query methods for search and filtering.

### What to Do

1. **Create Contact.java entity**
   ```java
   @Entity
   @Table(name = "contacts")
   public class Contact {
     @Id @GeneratedValue(strategy = GenerationType.UUID)
     private UUID id;

     @NotBlank @Size(min = 1, max = 255)
     private String name;

     @Email @NotBlank
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

2. **Add Jakarta Bean Validation annotations**
   - @NotBlank for name, email
   - @Email for email format
   - @Size(1-255) for name
   - @Pattern for phone (10-20 digits)
   - @Past for birthDate

3. **Create ContactRepository interface**
   ```java
   @Repository
   public interface ContactRepository 
       extends JpaRepository<Contact, UUID> {
     
     // Custom queries for search and filter
     List<Contact> findByNameContainingIgnoreCaseAndDeletedAtIsNull(String name);
     List<Contact> findByEmailContainingIgnoreCaseAndDeletedAtIsNull(String email);
     List<Contact> findByBirthDateBetweenAndDeletedAtIsNull(
       LocalDate from, LocalDate to
     );
     List<Contact> findByDeletedAtIsNullOrderByNameAsc();
   }
   ```

4. **Create Flyway migration V1__init.sql**
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

   CREATE INDEX idx_contacts_email 
     ON contacts(email) 
     WHERE deleted_at IS NULL;
   CREATE INDEX idx_contacts_name 
     ON contacts(name) 
     WHERE deleted_at IS NULL;
   CREATE INDEX idx_contacts_birth_date 
     ON contacts(birth_date) 
     WHERE deleted_at IS NULL;
   CREATE INDEX idx_contacts_deleted_at 
     ON contacts(deleted_at);
   ```

5. **Write unit tests** (Repository tests with Testcontainers)
   - Test custom queries
   - Test soft delete (deleted_at filtering)
   - Test indexes on performance-critical fields

### Acceptance Criteria

- [ ] Contact entity compiles without errors
- [ ] All validation annotations present
- [ ] ContactRepository interface defined with custom queries
- [ ] Flyway migration V1__init.sql created and valid
- [ ] Database schema matches SPECIFICATION.md
- [ ] Unit tests for repository: 80%+ coverage
- [ ] Tests pass: `mvn test -Dtest=ContactRepositoryTests`
- [ ] No console output (use SLF4J logging)

### References

- **SPECIFICATION.md:** Contact data model (id, name, email, phone, birthDate, timestamps)
- **CONSTITUTION.md:** Code Quality (80% coverage, explicit types)
- **IMPLEMENTATION_PLAN.md:** Database schema, JPA mapping

### Files to Create/Modify

```
backend/
├── src/main/java/com/contactmanager/entity/Contact.java
├── src/main/java/com/contactmanager/repository/ContactRepository.java
├── src/main/resources/db/migration/V1__init.sql
└── src/test/java/com/contactmanager/repository/
    └── ContactRepositoryTests.java
```

---

## TASK-003: Contact Service Layer

**Duration:** 5 hours  
**Effort:** Medium  
**Priority:** 🔴 High (Core business logic)  
**Dependencies:** TASK-002 completed

### Description

Implement the ContactService with CRUD operations, search/filter logic, soft delete rules, validation, and error handling.

### What to Do

1. **Create ContactService class**
   ```java
   @Service
   @Transactional
   public class ContactService {
     private final ContactRepository repository;
     private final ValidatorFactory factory;

     // CRUD operations
     public ContactResponse create(ContactRequest request) { }
     public ContactResponse getById(UUID id) { }
     public List<ContactResponse> getAll(int page, int size) { }
     public ContactResponse update(UUID id, ContactRequest request) { }
     public void delete(UUID id) { }

     // Search & Filter
     public List<ContactResponse> search(String query, int page, int size) { }
     public List<ContactResponse> filterByBirthDate(LocalDate from, LocalDate to) { }
     public List<ContactResponse> sortByName(boolean ascending) { }
   }
   ```

2. **Implement CRUD operations**
   - Create: Validate input, save to DB, return response
   - Read: Fetch by ID, check if not deleted, return response
   - Update: Validate input, update timestamps, save
   - Delete: Soft delete (set deletedAt timestamp)
   - List: Pagination (skip deleted records)

3. **Implement search & filter logic**
   - Search by name: Case-insensitive LIKE query
   - Search by email: Case-insensitive LIKE query
   - Filter by DOB: Date range between query
   - Sort by name: Order by clause
   - All queries exclude soft-deleted records (WHERE deletedAt IS NULL)

4. **Handle validation**
   - Use Jakarta Bean Validation
   - Throw exceptions for validation errors
   - Let controller handle error response formatting

5. **Create custom exceptions**
   - `ContactNotFoundException` - when contact not found
   - `EmailAlreadyExistsException` - when email already exists
   - Extend RuntimeException for unchecked exceptions

6. **Create DTOs** (Data Transfer Objects)
   ```java
   // ContactRequest - for create/update
   public class ContactRequest {
     @NotBlank
     private String name;
     @Email @NotBlank
     private String email;
     private String phone;
     private LocalDate birthDate;
   }

   // ContactResponse - for API responses
   public class ContactResponse {
     private UUID id;
     private String name;
     private String email;
     private String phone;
     private LocalDate birthDate;
     private LocalDateTime createdAt;
     private LocalDateTime updatedAt;
   }
   ```

7. **Write unit tests** (80%+ coverage)
   - Test CRUD operations
   - Test search/filter logic
   - Test validation errors
   - Test soft delete behavior
   - Mock repository in unit tests

### Acceptance Criteria

- [ ] ContactService class compiles and runs
- [ ] All CRUD operations implemented
- [ ] Search and filter methods implemented
- [ ] Soft delete works (deletedAt set, not removed)
- [ ] Validation errors throw appropriate exceptions
- [ ] DTOs created (Request, Response)
- [ ] Custom exceptions defined
- [ ] Unit tests: 80%+ coverage
- [ ] Tests pass: `mvn test -Dtest=ContactServiceTests`
- [ ] No sensitive data logged (passwords, emails)

### References

- **SPECIFICATION.md:** CRUD operations, search < 200ms, soft delete
- **CONSTITUTION.md:** Code Quality (80% coverage), Security (validation)
- **IMPLEMENTATION_PLAN.md:** Service layer architecture, soft delete rules

### Files to Create/Modify

```
backend/
├── src/main/java/com/contactmanager/service/ContactService.java
├── src/main/java/com/contactmanager/dto/
│   ├── ContactRequest.java
│   └── ContactResponse.java
├── src/main/java/com/contactmanager/exception/
│   ├── ContactNotFoundException.java
│   └── EmailAlreadyExistsException.java
└── src/test/java/com/contactmanager/service/
    └── ContactServiceTests.java
```

---

## TASK-004: REST API Endpoints

**Duration:** 6 hours  
**Effort:** Medium  
**Priority:** 🔴 High (Frontend depends on this)  
**Dependencies:** TASK-003 completed

### Description

Create the ContactController with REST endpoints for CRUD operations, search, and error handling. Implement global exception handler for consistent error responses.

### What to Do

1. **Create ContactController class**
   ```java
   @RestController
   @RequestMapping("/api/contacts")
   @Slf4j
   public class ContactController {
     private final ContactService service;

     @GetMapping
     public Page<ContactResponse> list(
       @RequestParam(defaultValue = "0") int page,
       @RequestParam(defaultValue = "10") int size
     ) { }

     @GetMapping("/{id}")
     public ResponseEntity<ContactResponse> getById(@PathVariable UUID id) { }

     @PostMapping
     public ResponseEntity<ContactResponse> create(
       @Valid @RequestBody ContactRequest request
     ) { }

     @PutMapping("/{id}")
     public ResponseEntity<ContactResponse> update(
       @PathVariable UUID id,
       @Valid @RequestBody ContactRequest request
     ) { }

     @DeleteMapping("/{id}")
     public ResponseEntity<Void> delete(@PathVariable UUID id) { }

     @GetMapping("/search")
     public Page<ContactResponse> search(
       @RequestParam String q,
       @RequestParam(defaultValue = "0") int page,
       @RequestParam(defaultValue = "10") int size
     ) { }
   }
   ```

2. **Implement endpoints**
   - GET /api/contacts (paginated list, 10 per page)
   - GET /api/contacts/{id} (single contact)
   - POST /api/contacts (create new, return 201)
   - PUT /api/contacts/{id} (update, return 200)
   - DELETE /api/contacts/{id} (soft delete, return 204)
   - GET /api/contacts/search?q=... (search by name/email)

3. **Handle HTTP status codes**
   - 200 OK: GET, PUT successful
   - 201 Created: POST successful
   - 204 No Content: DELETE successful
   - 400 Bad Request: Validation failed
   - 404 Not Found: Contact not found
   - 409 Conflict: Email already exists
   - 500 Internal Server Error: Unexpected error

4. **Create global exception handler**
   ```java
   @ControllerAdvice
   public class GlobalExceptionHandler {
     @ExceptionHandler(MethodArgumentNotValidException.class)
     public ResponseEntity<ErrorResponse> handleValidation(...) { }

     @ExceptionHandler(ContactNotFoundException.class)
     public ResponseEntity<ErrorResponse> handleNotFound(...) { }

     @ExceptionHandler(EmailAlreadyExistsException.class)
     public ResponseEntity<ErrorResponse> handleConflict(...) { }

     @ExceptionHandler(Exception.class)
     public ResponseEntity<ErrorResponse> handleGeneral(...) { }
   }
   ```

5. **Create error response DTO**
   ```java
   public class ErrorResponse {
     private int status;
     private String message;
     private Map<String, String> errors;
     private LocalDateTime timestamp;
   }
   ```

6. **Enable CORS** (for local frontend development)
   ```java
   @Configuration
   public class CorsConfig implements WebMvcConfigurer {
     @Override
     public void addCorsMappings(CorsRegistry registry) {
       registry.addMapping("/api/**")
         .allowedOrigins("http://localhost:5173")
         .allowedMethods("GET", "POST", "PUT", "DELETE");
     }
   }
   ```

7. **Add Swagger/OpenAPI documentation**
   - @Operation, @ApiResponse annotations on endpoints
   - Auto-generated at `/api/swagger-ui.html`

8. **Write integration tests** (with Testcontainers)
   - Test all endpoints with real PostgreSQL
   - Test validation error responses
   - Test soft delete behavior
   - Test search functionality

### Acceptance Criteria

- [ ] All 6 endpoints implemented
- [ ] Correct HTTP status codes returned
- [ ] Global exception handler catches all errors
- [ ] Error responses formatted consistently
- [ ] CORS configured for frontend
- [ ] Swagger documentation generated
- [ ] Integration tests: 80%+ coverage
- [ ] Tests pass: `mvn test -Dtest=ContactControllerTests`
- [ ] API responses < 200ms (tested locally)
- [ ] No sensitive data in error messages (log errors but don't expose internals)

### References

- **SPECIFICATION.md:** API endpoints, HTTP status codes, error responses
- **CONSTITUTION.md:** Performance (< 200ms), Security (validation), Code Quality (80%)
- **IMPLEMENTATION_PLAN.md:** API architecture, layered design

### Files to Create/Modify

```
backend/
├── src/main/java/com/contactmanager/controller/
│   ├── ContactController.java
│   └── GlobalExceptionHandler.java
├── src/main/java/com/contactmanager/dto/
│   └── ErrorResponse.java
├── src/main/java/com/contactmanager/config/
│   └── CorsConfig.java
└── src/test/java/com/contactmanager/controller/
    └── ContactControllerTests.java
```

---

## Phase 2: Frontend Setup & Components (TASK-005 to TASK-010)

---

## TASK-005: Frontend Project Setup

**Duration:** 2 hours  
**Effort:** Small  
**Priority:** 🔴 High (Blocker for all frontend tasks)  
**Dependencies:** None (parallel with backend)

### Description

Initialize a Vite + React 18 + TypeScript project with Tailwind CSS, ESLint, Prettier, Axios, and Docker configuration.

### What to Do

1. **Create Vite project**
   ```bash
   npm create vite@latest frontend -- --template react-ts
   ```

2. **Install dependencies**
   - react, react-dom
   - typescript
   - axios (API client)
   - tailwindcss, postcss, autoprefixer (styling)
   - react-hook-form (form management)
   - zod (validation)
   - vitest, @testing-library/react (testing)
   - eslint, prettier (linting/formatting)

3. **Setup Tailwind CSS**
   - tailwind.config.js
   - postcss.config.js
   - src/App.css with @tailwind directives

4. **Configure TypeScript**
   - tsconfig.json with strict mode enabled
   - No `any`, `Object`, `var` allowed

5. **Setup ESLint + Prettier**
   - .eslintrc.cjs with rules
   - .prettierrc with formatting rules
   - Pre-commit hooks (optional)

6. **Create Vite config**
   - vite.config.ts
   - API proxy (VITE_API_URL)

7. **Setup Vitest**
   - vitest.config.ts
   - @testing-library/react for component testing

8. **Create environment files**
   - .env.local: VITE_API_URL=http://localhost:8080/api
   - .env.production: VITE_API_URL=<production-url>

9. **Create Dockerfile**
   - Multi-stage build
   - Build stage: node:20-alpine
   - Serve stage: nginx:alpine
   - Expose port 5173 (dev) or 80 (prod)

10. **Create frontend/README.md**
    - Setup instructions
    - npm scripts
    - Development commands

### Acceptance Criteria

- [ ] Vite project initializes: `npm install`
- [ ] Dev server starts: `npm run dev`
- [ ] Build succeeds: `npm run build`
- [ ] Tests run: `npm run test`
- [ ] Linting passes: `npm run lint`
- [ ] Formatting works: `npm run format`
- [ ] TypeScript strict mode enabled
- [ ] Tailwind CSS compiles
- [ ] Dockerfile builds successfully
- [ ] No console.log (ESLint rule blocks it)

### References

- **IMPLEMENTATION_PLAN.md:** Frontend tech stack, structure
- **CONSTITUTION.md:** Code Quality (TypeScript, no console.log, lint clean)

### Files to Create

```
frontend/
├── src/
│   ├── components/ (folder for TASK-006)
│   ├── hooks/ (folder for TASK-007)
│   ├── services/ (folder for TASK-007)
│   ├── types/index.ts
│   ├── utils/
│   │   └── constants.ts
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc
├── .env.local
├── .env.production
├── Dockerfile
└── README.md
```

---

## TASK-006: Base Components

**Duration:** 8 hours  
**Effort:** Medium  
**Priority:** 🔴 High (Foundation for all UI)  
**Dependencies:** TASK-005 completed

### Description

Create reusable React components for the application: Layout (Header/Footer), ContactForm, ContactList, ContactCard, Modal, Toast, and common UI elements (Button, Input, Spinner).

### What to Do

1. **Create Layout Components**
   - **Header.tsx:** Logo, title, navigation
   - **Footer.tsx:** Copyright, links
   - **Container.tsx:** Max-width wrapper, responsive padding

2. **Create ContactForm Component**
   - Fields: name, email, phone, birthDate
   - Props: `initialValues?`, `onSubmit`, `onCancel`
   - Responsive form (mobile, tablet, desktop)
   - Clear labels and help text
   - Example:
     ```typescript
     interface ContactFormProps {
       initialValues?: Contact;
       onSubmit: (data: ContactRequest) => void;
       onCancel: () => void;
       isLoading?: boolean;
     }
     ```

3. **Create ContactList Component**
   - Container for displaying contacts
   - Props: `contacts`, `onEdit`, `onDelete`, `isLoading`
   - Shows empty state if no contacts
   - Responsive grid/table layout

4. **Create ContactCard Component**
   - Display single contact info
   - Props: `contact`, `onEdit`, `onDelete`
   - Edit and delete buttons
   - Responsive card design

5. **Create Modal Component**
   - ConfirmDialog.tsx for delete confirmation
   - Props: `title`, `message`, `onConfirm`, `onCancel`, `isLoading`
   - Overlay + dialog box
   - Accessible (focus management, keyboard nav)

6. **Create Toast/Notification Component**
   - Toast.tsx for success/error messages
   - Props: `type`, `message`, `onClose`
   - Auto-dismiss after 3 seconds
   - Stack multiple toasts

7. **Create Common UI Components**
   - **Button.tsx:** Primary, secondary, danger variants
   - **Input.tsx:** Text input with error display
   - **Spinner.tsx:** Loading indicator
   - **Empty.tsx:** Empty state message

8. **Setup component directory structure**
   ```
   components/
   ├── ContactForm/
   │   ├── ContactForm.tsx
   │   ├── ContactForm.module.css (optional)
   │   └── ContactForm.test.tsx
   ├── ContactList/
   ├── ContactCard/
   ├── Layout/
   │   ├── Header.tsx
   │   ├── Footer.tsx
   │   └── Container.tsx
   ├── Modal/
   │   └── ConfirmDialog.tsx
   ├── Toast/
   │   └── Toast.tsx
   └── Common/
       ├── Button.tsx
       ├── Input.tsx
       ├── Spinner.tsx
       └── Empty.tsx
   ```

9. **Write component tests**
   - Test rendering
   - Test props
   - Test user interactions
   - Accessibility tests (keyboard nav, ARIA labels)

### Acceptance Criteria

- [ ] All 8+ components created and exported
- [ ] Components are reusable (accept props for customization)
- [ ] Responsive design (mobile 375px, tablet 768px, desktop 1440px)
- [ ] Tailwind CSS used for styling (no inline styles)
- [ ] Accessibility: ARIA labels, semantic HTML, keyboard nav
- [ ] Component tests: 80%+ coverage
- [ ] Tests pass: `npm run test`
- [ ] No console.log in production code
- [ ] TypeScript strict mode compliant (no `any`)

### References

- **SPECIFICATION.md:** UI requirements (responsive, WCAG AA, 3-click navigation)
- **CONSTITUTION.md:** Code Quality (TypeScript, 80% coverage, accessibility)
- **IMPLEMENTATION_PLAN.md:** Component hierarchy, folder structure

### Files to Create

```
frontend/src/components/
├── ContactForm/ContactForm.tsx
├── ContactList/ContactList.tsx
├── ContactCard/ContactCard.tsx
├── Layout/Header.tsx
├── Layout/Footer.tsx
├── Layout/Container.tsx
├── Modal/ConfirmDialog.tsx
├── Toast/Toast.tsx
└── Common/
    ├── Button.tsx
    ├── Input.tsx
    ├── Spinner.tsx
    └── Empty.tsx
```

---

## TASK-007: React Hooks & State Management

**Duration:** 5 hours  
**Effort:** Medium  
**Priority:** 🔴 High (Core app logic)  
**Dependencies:** TASK-005, TASK-006 completed, backend API ready

### Description

Implement custom React hooks for data fetching, form state, and notifications. Use Context API for global state.

### What to Do

1. **Create useContacts hook**
   - Fetch contacts from API
   - Handle loading, error, success states
   - Return: `{ contacts, loading, error, refetch }`
   - Example:
     ```typescript
     const useContacts = (page = 0, size = 10) => {
       const [contacts, setContacts] = useState<Contact[]>([]);
       const [loading, setLoading] = useState(false);
       const [error, setError] = useState<string | null>(null);

       useEffect(() => {
         // Fetch from /api/contacts?page=0&size=10
       }, [page, size]);

       return { contacts, loading, error, refetch: () => {} };
     };
     ```

2. **Create useForm hook**
   - Manage form state (values, errors, touched)
   - Handle submit, reset
   - Return: `{ values, errors, setField, submit, reset }`

3. **Create useNotification hook**
   - Show toast messages
   - Success, error, info types
   - Auto-dismiss
   - Return: `{ showToast, showError, showSuccess, notifications }`

4. **Create useDebounce hook**
   - Debounce search input
   - Delay: 300ms
   - Return debounced value

5. **Setup Context API**
   - Create NotificationContext for global toast state
   - Provide in App.tsx
   - Consume with useNotification hook

6. **Create API service**
   - **services/api.ts:** Axios instance with base URL
   - **services/contactService.ts:** API call functions
   - Example:
     ```typescript
     export const contactService = {
       listContacts: (page, size) => api.get('/contacts', { params: { page, size } }),
       getContact: (id) => api.get(`/contacts/${id}`),
       createContact: (data) => api.post('/contacts', data),
       updateContact: (id, data) => api.put(`/contacts/${id}`, data),
       deleteContact: (id) => api.delete(`/contacts/${id}`),
       searchContacts: (q, page, size) => api.get('/contacts/search', { params: { q, page, size } }),
     };
     ```

7. **Write hook tests**
   - Test hook behavior
   - Mock API responses
   - Test error handling

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
- [ ] No sensitive data logged

### References

- **SPECIFICATION.md:** API endpoints, pagination, search < 200ms
- **CONSTITUTION.md:** Code Quality (80% coverage)
- **IMPLEMENTATION_PLAN.md:** Frontend state management (Context API)

### Files to Create

```
frontend/src/
├── hooks/
│   ├── useContacts.ts
│   ├── useForm.ts
│   ├── useNotification.ts
│   ├── useDebounce.ts
│   └── *.test.ts
├── services/
│   ├── api.ts
│   └── contactService.ts
└── context/
    └── NotificationContext.tsx
```

---

## TASK-008: Form Validation

**Duration:** 4 hours  
**Effort:** Small  
**Priority:** 🟡 Medium (Quality gates input)  
**Dependencies:** TASK-005, TASK-007 completed

### Description

Integrate React Hook Form + Zod for real-time form validation on the frontend.

### What to Do

1. **Create Zod validation schema**
   ```typescript
   import { z } from 'zod';

   export const contactSchema = z.object({
     name: z.string().min(1).max(255),
     email: z.string().email(),
     phone: z.string().regex(/^[0-9]{10,20}$/).optional(),
     birthDate: z.date().max(new Date()).optional(),
   });

   export type ContactFormData = z.infer<typeof contactSchema>;
   ```

2. **Integrate React Hook Form in ContactForm**
   ```typescript
   const { register, handleSubmit, formState: { errors } } = useForm({
     resolver: zodResolver(contactSchema),
   });
   ```

3. **Add field-level validation display**
   - Show error message below each field
   - Highlight field with error
   - Clear error when user starts typing

4. **Implement real-time validation**
   - Validate on blur (not on every keystroke)
   - Show inline error messages
   - Disable submit button while invalid

5. **Test validation**
   - Valid data: form submits
   - Invalid email: error shows
   - Name too long: error shows
   - Phone format wrong: error shows
   - All optional fields can be empty

### Acceptance Criteria

- [ ] Zod schema defined with all validation rules
- [ ] React Hook Form integrated in ContactForm
- [ ] Email validation works (RFC 5322)
- [ ] Name validation: 1-255 chars
- [ ] Phone validation: 10-20 digits (optional)
- [ ] BirthDate validation: past only (optional)
- [ ] Error messages displayed inline
- [ ] Submit button disabled when invalid
- [ ] Tests for validation rules: 80%+
- [ ] Tests pass: `npm run test`

### References

- **SPECIFICATION.md:** Validation rules (name 1-255, email RFC 5322, phone 10-20, past dates)
- **CONSTITUTION.md:** Security (validate all inputs), Code Quality (80%)

### Files to Create/Modify

```
frontend/src/
├── utils/
│   └── validation.ts (Zod schemas)
└── components/
    └── ContactForm/ContactForm.tsx (updated)
```

---

## TASK-009: Listing Features (Search, Filter, Sort, Pagination)

**Duration:** 6 hours  
**Effort:** Medium  
**Priority:** 🔴 High (Core feature)  
**Dependencies:** TASK-005, TASK-006, TASK-007 completed

### Description

Implement ContactList with search, filter, sort, and pagination capabilities calling the backend API.

### What to Do

1. **Implement search by name/email**
   - Text input with debounce (300ms)
   - Call `/api/contacts/search?q=...`
   - Results appear in < 200ms
   - Show "No results" if empty
   - Example:
     ```typescript
     const [searchQuery, setSearchQuery] = useState('');
     const debouncedQuery = useDebounce(searchQuery, 300);
     
     useEffect(() => {
       if (debouncedQuery) {
         // Fetch from /api/contacts/search?q=...
       }
     }, [debouncedQuery]);
     ```

2. **Implement filter by date of birth**
   - Date range picker (from/to)
   - Call backend with date range
   - Filter button to apply
   - Show matching contacts

3. **Implement sort**
   - Radio buttons: Name (A-Z), Date (newest first)
   - Re-fetch with sort parameter
   - Update UI immediately

4. **Implement pagination**
   - Show contacts 10 per page
   - Previous/Next buttons
   - Page numbers (1, 2, 3...)
   - Jump to page input
   - Show "1-10 of 25 contacts"

5. **Combine all features**
   - Search → Filter → Sort → Paginate
   - State management for all filters
   - Clear filters button
   - Reset to page 1 when filters change

6. **UX improvements**
   - Loading spinner while fetching
   - Empty state message
   - Error handling (network errors)
   - Success message "Found X contacts"

7. **Write component tests**
   - Test search interaction
   - Test filter interaction
   - Test pagination
   - Mock API responses

### Acceptance Criteria

- [ ] Search works in < 200ms
- [ ] Filter by DOB range works
- [ ] Sort by name/date works
- [ ] Pagination displays 10 per page
- [ ] Combines all filters correctly
- [ ] Empty state displayed
- [ ] Error handling for API failures
- [ ] Loading spinners show during fetch
- [ ] Tests: 80%+ coverage
- [ ] Tests pass: `npm run test`

### References

- **SPECIFICATION.md:** Listing features, pagination 10/page, search < 200ms, filter, sort
- **CONSTITUTION.md:** Performance (< 200ms), UX (visual feedback)

### Files to Create/Modify

```
frontend/src/
├── components/ContactList/ContactList.tsx (updated)
├── components/SearchBar.tsx
├── components/FilterBar.tsx
├── components/SortOptions.tsx
├── components/Pagination.tsx
└── hooks/useDebounce.ts (already in TASK-007)
```

---

## TASK-010: Edit & Delete Operations

**Duration:** 5 hours  
**Effort:** Medium  
**Priority:** 🔴 High (Complete CRUD)  
**Dependencies:** TASK-006, TASK-007, TASK-008 completed

### Description

Implement edit and delete functionality with form pre-filling, confirmation dialogs, and API integration.

### What to Do

1. **Implement Edit operation**
   - Edit button on each ContactCard
   - Click → Open ContactForm with pre-filled data
   - Fetch contact: `GET /api/contacts/{id}`
   - Pre-fill form fields
   - User edits fields
   - Submit → `PUT /api/contacts/{id}`
   - Show success toast
   - Refresh contact list
   - Show error toast on failure

2. **Implement Delete operation**
   - Delete button on each ContactCard
   - Click → Show ConfirmDialog
   - Confirm → Call `DELETE /api/contacts/{id}`
   - Show spinner during delete
   - Show success toast
   - Remove from UI
   - Show error toast on failure

3. **Handle edge cases**
   - What if contact deleted by another user? (404 → show error)
   - What if email already taken during edit? (409 → show error)
   - Network timeout? (retry button)

4. **UX improvements**
   - Disable edit/delete buttons while loading
   - Show spinner in buttons
   - Keyboard shortcuts (Esc to cancel)
   - Confirm with keyboard (Enter)

5. **Write integration tests**
   - Test edit flow end-to-end
   - Test delete flow end-to-end
   - Test error cases (404, 409)
   - Mock API responses

### Acceptance Criteria

- [ ] Edit button opens form with pre-filled data
- [ ] Form validation still works on edit
- [ ] Submit calls PUT /api/contacts/{id}
- [ ] Success message shows after edit
- [ ] Contact list updates after edit
- [ ] Delete button shows confirmation
- [ ] Confirmation dialog has confirm/cancel
- [ ] Delete calls DELETE /api/contacts/{id}
- [ ] Contact removed from list after delete
- [ ] Success message shows after delete
- [ ] Error handling for 404, 409
- [ ] Tests: 80%+ coverage
- [ ] Tests pass: `npm run test`

### References

- **SPECIFICATION.md:** Edit & delete operations, confirmation, feedback
- **CONSTITUTION.md:** UX (visual feedback, confirmation), Security (validation)

### Files to Create/Modify

```
frontend/src/
├── components/ContactCard/ContactCard.tsx (updated)
├── components/ContactForm/ContactForm.tsx (updated for edit mode)
└── hooks/useContacts.ts (add update, delete methods)
```

---

## Phase 3: Testing & Integration (TASK-011 to TASK-012)

---

## TASK-011: E2E Testing & Coverage

**Duration:** 12 hours  
**Effort:** Large  
**Priority:** 🟡 Medium (Quality gates)  
**Dependencies:** TASK-004, TASK-010 completed (entire app done)

### Description

Write comprehensive tests for frontend and backend targeting 80%+ code coverage. Test CRUD operations, search, filtering, error handling, and integration between layers.

### What to Do

**Frontend Tests (Vitest + React Testing Library):**

1. **Component tests**
   - ContactForm: render, fill, submit, validation errors
   - ContactList: render, pagination, empty state
   - ContactCard: render, edit click, delete click
   - Modal, Toast, Header, Footer

2. **Hook tests**
   - useContacts: fetch, error, loading states
   - useForm: state management, submit
   - useNotification: show/hide toasts
   - useDebounce: delay and return debounced value

3. **Integration tests**
   - Create contact: form → submit → API → list updates
   - Edit contact: list → click edit → form → submit → API → list updates
   - Delete contact: list → delete button → confirm → API → removed
   - Search: input → debounce → API → results
   - Filter: select dates → API → filtered results

4. **Mock API responses**
   - Mock axios for API calls
   - Simulate success, error, loading states
   - Test error boundaries

**Backend Tests (JUnit 5 + Testcontainers):**

1. **Repository tests**
   - Custom queries: findByName, findByEmail, findByDateRange
   - Soft delete: exclude deleted_at IS NOT NULL
   - Indexes working

2. **Service tests**
   - CRUD operations
   - Validation errors
   - Search/filter/sort logic
   - Soft delete behavior
   - Custom exceptions

3. **Controller/Integration tests**
   - All endpoints (GET, POST, PUT, DELETE)
   - Request validation
   - Response format
   - Error responses (400, 404, 409)
   - HTTP status codes
   - With real PostgreSQL (Testcontainers)

4. **End-to-end scenarios**
   - Create → Read → Update → Delete flow
   - Search returns correct results
   - Filter by date range works
   - Soft delete preserves data
   - Email uniqueness constraint

### Acceptance Criteria

- [ ] Frontend: 80%+ code coverage
- [ ] Backend: 80%+ code coverage
- [ ] All components tested
- [ ] All services tested
- [ ] All endpoints tested
- [ ] All hooks tested
- [ ] Integration tests pass
- [ ] Error cases handled and tested
- [ ] Frontend: `npm run test` passes, all tests green
- [ ] Backend: `mvn test` passes, all tests green
- [ ] Coverage reports generated

### References

- **CONSTITUTION.md:** Code Quality (80% coverage mandatory)
- **SPECIFICATION.md:** Acceptance criteria for features
- **IMPLEMENTATION_PLAN.md:** Testing strategy, testing pyramid

### Files to Create/Modify

```
frontend/src/
├── components/**/*.test.tsx
├── hooks/**/*.test.ts
└── services/**/*.test.ts

backend/src/test/java/com/contactmanager/
├── repository/*Tests.java
├── service/*Tests.java
└── controller/*Tests.java
```

---

## TASK-012: Docker Setup & Documentation

**Duration:** 6 hours  
**Effort:** Medium  
**Priority:** 🟡 Medium (Deployment + docs)  
**Dependencies:** TASK-004, TASK-010, TASK-011 completed

### Description

Setup Docker Compose for complete stack, create start/stop/reset scripts, and write comprehensive documentation.

### What to Do

1. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
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
       ports:
         - "8080:8080"

     frontend:
       build: ./frontend
       environment:
         VITE_API_URL: http://localhost:8080/api
       ports:
         - "5173:5173"
       depends_on:
         - backend

   volumes:
     postgres_data:
   ```

2. **Create shell scripts**
   - **scripts/start.sh:** Start all services
     ```bash
     docker-compose up -d
     echo "Frontend: http://localhost:5173"
     echo "Backend: http://localhost:8080"
     ```
   - **scripts/stop.sh:** Stop all services
     ```bash
     docker-compose down
     ```
   - **scripts/reset.sh:** Reset database
     ```bash
     docker-compose down -v
     docker-compose up -d
     ```

3. **Create .dockerignore files**
   - Exclude node_modules, .git, etc.

4. **Write comprehensive README.md**
   - **Quick Start:** 5-minute setup
   - **Architecture:** Diagram, components
   - **Tech Stack:** Table of technologies
   - **Project Structure:** Folder layout
   - **Development:** Local setup
   - **Testing:** How to run tests
   - **API Documentation:** Endpoints, examples
   - **Troubleshooting:** Common issues
   - **Commands:** Build, run, test, lint

5. **Create API documentation**
   - Document all endpoints
   - Include curl examples
   - Show request/response examples
   - Error codes and meanings

6. **Create DEPLOYMENT.md** (for future)
   - How to deploy to production
   - Environment variables
   - Database backups

7. **Update root README.md**
   - Quick links to all documentation
   - Success criteria checklist
   - Features list

### Acceptance Criteria

- [ ] docker-compose.yml works: `docker-compose up -d`
- [ ] All services start successfully
- [ ] Frontend accessible at http://localhost:5173
- [ ] Backend accessible at http://localhost:8080
- [ ] Database accessible at localhost:5432
- [ ] Services communicate correctly
- [ ] start.sh script works
- [ ] stop.sh script works
- [ ] reset.sh script works
- [ ] README.md complete and accurate
- [ ] API documentation complete
- [ ] All 12 tasks documented in README
- [ ] Success criteria checklist included

### References

- **IMPLEMENTATION_PLAN.md:** Docker setup, project structure, scripts
- **README.md template:** Quick start, architecture, troubleshooting

### Files to Create/Modify

```
project-root/
├── docker-compose.yml
├── .dockerignore
├── scripts/
│   ├── start.sh
│   ├── stop.sh
│   └── reset.sh
├── README.md (updated)
├── DEPLOYMENT.md (new)
├── backend/README.md
└── frontend/README.md
```

---

## 📊 Task Dependencies

```
TASK-001 (Backend Setup)
  ↓
TASK-002 (Entity & Repo)
  ↓
TASK-003 (Service)
  ↓
TASK-004 (API Endpoints)
  ↓
TASK-011 (Backend Tests)

TASK-005 (Frontend Setup)
  ↓
TASK-006 (Components)
  ↓
TASK-007 (Hooks)
  ↓
TASK-008 (Validation)
  ↓
TASK-009 (Listing)
  ↓
TASK-010 (Edit/Delete)
  ↓
TASK-011 (Frontend Tests)

TASK-011 (All Tests Complete)
  ↓
TASK-012 (Docker & Docs)
```

---

## 🎯 Success Criteria (All Tasks)

```
✅ All 12 tasks completed
✅ 80%+ test coverage (backend + frontend)
✅ All CRUD operations working
✅ Search & filtering functional (< 200ms)
✅ Pagination working (10 per page)
✅ Responsive design (375px, 768px, 1440px)
✅ API response time < 200ms
✅ Page load time < 3s
✅ WCAG 2.1 AA accessibility
✅ Docker setup working
✅ All documentation complete
✅ No console.log in production
✅ TypeScript strict mode
✅ Code formatted (ESLint + Prettier)
```

---

**Last Updated:** 2026-07-09  
**Version:** 1.0.0  
**Status:** Ready for Implementation
