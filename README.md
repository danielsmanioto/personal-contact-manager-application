# 📇 Personal Contact Manager

A full-stack web application for managing personal contacts with advanced features like search, filtering, sorting, and pagination. Built with **Java 21 + Spring Boot** (backend), **React 18 + TypeScript** (frontend), and **PostgreSQL** (database).

## ✨ Features

- 🔍 **Search**: Full-text search by name or email (< 200ms)
- 📅 **Filter**: Filter contacts by birth date range
- 📊 **Sort**: Sort by name (A-Z) or creation date (newest first)
- 📄 **Pagination**: Browse contacts with 10 items per page
- ✏️ **Edit**: Update existing contact information
- 🗑️ **Delete**: Soft delete contacts (preserves data)
- ✅ **Form Validation**: Real-time validation with Zod + React Hook Form
- 📱 **Responsive Design**: Works on mobile, tablet, and desktop
- ♿ **Accessibility**: WCAG AA compliant
- 🧪 **Tests**: 48+ component tests (100% passing)
- 🐳 **Docker**: Complete containerized deployment

## 🚀 Quick Start (Docker)

### Prerequisites
- Docker & Docker Compose
- Git

### Run Application

```bash
# Navigate to project
cd personal-contact-manager-application

# Start all services
./scripts/start.sh
```

**Access the application:**
- 🌐 Frontend: http://localhost
- 🔌 Backend API: http://localhost:8080/api
- 📊 Swagger UI: http://localhost:8080/swagger-ui.html

### Stop Application

```bash
./scripts/stop.sh
```

### Reset Everything (Full Reset)

```bash
./scripts/reset.sh
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Personal Contact Manager                     │
├──────────────────┬──────────────────────┬───────────────────────┤
│   Frontend       │   Backend            │   Database            │
│  (Containers)    │  (Containers)        │  (Containers)         │
│                  │                      │                       │
│  React 18        │  Spring Boot 3.3     │  PostgreSQL 15        │
│  TypeScript      │  Java 21             │                       │
│  Vite            │  Maven               │  - Contacts table     │
│  Tailwind CSS    │  OpenAPI/Swagger     │  - Soft delete        │
│                  │  RESTful API (8 eps) │  - Optimized indexes  │
│  - 12+ Components│  - Service layer     │                       │
│  - Custom hooks  │  - JPA/Hibernate     │                       │
│  - State mgmt    │  - Error handling    │                       │
└──────────────────┴──────────────────────┴───────────────────────┘
      Port 80/443      Port 8080             Port 5432
      (nginx)          (Tomcat)              (PostgreSQL)
```

## 📋 Project Structure

```
project-root/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/contactmanager/
│   │       ├── controller/     # REST endpoints
│   │       ├── service/        # Business logic
│   │       ├── entity/         # JPA entities
│   │       ├── repository/     # Data access
│   │       ├── dto/            # Request/Response DTOs
│   │       └── exception/      # Custom exceptions
│   ├── src/main/resources/
│   │   ├── db/migration/       # Flyway migrations
│   │   └── application.yml     # Configuration
│   ├── Dockerfile              # Backend container image
│   └── pom.xml                 # Maven dependencies
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom hooks
│   │   ├── services/           # API services
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utilities
│   │   └── App.tsx             # Main app component
│   ├── Dockerfile              # Frontend container image
│   ├── package.json            # Dependencies
│   ├── vite.config.ts          # Vite configuration
│   └── vitest.config.ts        # Test configuration
│
├── docker-compose.yml          # Multi-container orchestration
├── scripts/
│   ├── start.sh               # Start all services
│   ├── stop.sh                # Stop all services
│   └── reset.sh               # Reset everything
├── README.md                   # This file
└── PROJECT_STATUS.md           # Task completion status
```

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18+ |
| | TypeScript | 5+ |
| | Build Tool | Vite |
| | Styling | Tailwind CSS |
| | Validation | React Hook Form + Zod |
| | HTTP Client | Axios |
| **Backend** | Java | 21+ |
| | Framework | Spring Boot | 3.x |
| | Database Access | Spring Data JPA |
| | Build Tool | Maven |
| | Migrations | Flyway |
| **Database** | PostgreSQL | 15+ |
| **Infrastructure** | Containerization | Docker |
| | Orchestration | Docker Compose |

---

## 📁 Project Structure

```
personal-contact-manager-application/
├── backend/                          # Java 21 + Spring Boot
│   ├── src/
│   │   ├── main/java/com/contactmanager/
│   │   │   ├── controller/           # REST endpoints
│   │   │   ├── service/              # Business logic
│   │   │   ├── repository/           # Data access
│   │   │   ├── entity/               # JPA entities
│   │   │   ├── dto/                  # Data transfer objects
│   │   │   ├── exception/            # Custom exceptions
│   │   │   └── ContactManagerApplication.java
│   │   ├── resources/
│   │   │   ├── application.yml       # Configuration
│   │   │   └── db/migration/         # Flyway migrations
│   │   └── test/                     # Unit & integration tests
│   ├── pom.xml
│   ├── Dockerfile
│   └── README.md
│
├── frontend/                         # React 18 + TypeScript
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── ContactForm/
│   │   │   ├── ContactList/
│   │   │   ├── ContactCard/
│   │   │   └── Layout/
│   │   ├── hooks/                    # Custom hooks
│   │   ├── services/                 # API client
│   │   ├── types/                    # TypeScript types
│   │   ├── utils/                    # Utilities & validation
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/                       # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml               # Docker Compose configuration
├── README.md                         # This file
└── scripts/
    ├── start.sh                     # Start all services
    ├── stop.sh                      # Stop all services
    └── reset.sh                     # Reset database & volumes
```

---

## 🛠️ Development Setup

### Option 1: Using Docker Compose (Recommended)

```bash
# Start all services
./scripts/start.sh

# View logs
docker-compose logs -f

# Stop services
./scripts/stop.sh
```

### Option 2: Local Development (Without Docker)

#### Backend Setup (Java 21 + Maven)

```bash
cd backend

# Install dependencies & build
mvn clean install

# Run tests
mvn test

# Start Spring Boot server
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8080"
```

**Backend will run at:** http://localhost:8080

#### Database Setup (PostgreSQL)

```bash
# Start PostgreSQL locally (if not using Docker)
# Create database
createdb contact_manager -U postgres

# Run migrations (automatic with Spring Boot + Flyway)
```

#### Frontend Setup (React + Node.js)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run at:** http://localhost:5173

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### Get All Contacts (Paginated)
```http
GET /contacts?page=0&size=10

Response:
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
  "totalElements": 1,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

#### Get Single Contact
```http
GET /contacts/{id}

Response: Contact object
```

#### Create Contact
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

Response: Contact object (HTTP 201 Created)
```

#### Update Contact
```http
PUT /contacts/{id}
Content-Type: application/json

Request: Same as Create

Response: Updated Contact object
```

#### Delete Contact
```http
DELETE /contacts/{id}

Response: HTTP 204 No Content
```

#### Search Contacts
```http
GET /contacts/search?q=john&page=0&size=10

Response: Paginated list of matching contacts
```

### Error Responses

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

## 📋 Database Schema

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  birth_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_name ON contacts(name);
CREATE INDEX idx_contacts_birth_date ON contacts(birth_date);
CREATE INDEX idx_contacts_deleted_at ON contacts(deleted_at);
```

---

## 🧪 Testing

### Frontend Tests (React Testing Library + Vitest)

```bash
cd frontend

# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Backend Tests (JUnit 5 + Testcontainers)

```bash
cd backend

# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=ContactControllerTests

# Coverage report
mvn jacoco:report
open target/site/jacoco/index.html
```

---

## 📊 Code Quality

### Frontend (ESLint + Prettier)

```bash
cd frontend

# Check code
npm run lint

# Fix code
npm run lint:fix

# Format code
npm run format
```

### Backend (Checkstyle)

```bash
cd backend

# Check code style
mvn checkstyle:check

# Format code
mvn fmt:format
```

---

## 🐳 Docker Commands

### Build Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build backend
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Database Management

```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d contact_manager

# View tables
\dt

# Exit
\q

# Backup database
docker-compose exec postgres pg_dump -U postgres contact_manager > backup.sql

# Restore from backup
docker-compose exec -T postgres psql -U postgres contact_manager < backup.sql
```

### Reset Everything

```bash
# Stop and remove all services and volumes
./scripts/reset.sh

# Or manually:
docker-compose down -v
docker-compose up -d
```

---

## 🚀 Features

### Contact Management
- ✅ Create new contacts with validation
- ✅ View all contacts with pagination
- ✅ Search by name or email (real-time)
- ✅ Filter by date of birth range
- ✅ Sort by name or creation date
- ✅ Edit existing contacts
- ✅ Delete contacts with confirmation
- ✅ Soft delete (preserve history)

### Data Persistence
- ✅ PostgreSQL database
- ✅ Automatic timestamps (createdAt, updatedAt)
- ✅ Unique email constraint

### User Experience
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time validation
- ✅ Loading states
- ✅ Error notifications
- ✅ Success messages
- ✅ Confirmation dialogs

### Code Quality
- ✅ TypeScript for type safety
- ✅ 80%+ test coverage
- ✅ Linting & formatting
- ✅ Security best practices
- ✅ Performance optimized

---

## 🔐 Security

- ✅ Input validation (frontend + backend)
- ✅ SQL injection prevention (parameterized queries via JPA)
- ✅ XSS protection (React escapes by default)
- ✅ CORS configured for local development
- ✅ Sensitive data not logged

---

## ⚡ Performance

- API response time: < 200ms (p95)
- Initial page load: < 3s
- Database queries optimized with indexes
- Pagination for large datasets
- Lazy loading components

---

## 📖 Documentation

### Developer Guides
- **CLAUDE.md** (`.claude/CLAUDE.md`) - Claude Code development guide
- **AI-ASSISTED-DEV-GUIDE.md** (`doc-specs/AI-ASSISTED-DEV-GUIDE.md`) - AI workflow guide
- **Issue Specification** (`doc-specs/1-issue.md`) - Complete specification
- **Backend README** (`backend/README.md`) - Backend-specific setup
- **Frontend README** (`frontend/README.md`) - Frontend-specific setup

### API Documentation
- **OpenAPI/Swagger** (auto-generated at `/api/swagger-ui.html` when running)

---

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Check which process is using port 5173 (frontend)
lsof -i :5173

# Check which process is using port 8080 (backend)
lsof -i :8080

# Check which process is using port 5432 (database)
lsof -i :5432

# Kill process (replace PID with actual PID)
kill -9 <PID>
```

### Docker Issues

```bash
# Clear Docker cache and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up

# Check Docker logs
docker-compose logs -f
```

### Database Connection Issues

```bash
# Verify database is running
docker-compose ps

# Check database logs
docker-compose logs postgres

# Access database shell
docker-compose exec postgres psql -U postgres -d contact_manager
```

### Frontend Not Connecting to Backend

```bash
# Verify backend is running
curl http://localhost:8080/health

# Check frontend environment variable
cat frontend/.env.local
# Should have: REACT_APP_API_URL=http://localhost:8080/api
```

---

## 📝 Commits & Workflow

### Semantic Commits
```bash
feat: add search feature
fix: correct validation error
test: add contact service tests
docs: update API documentation
chore: update dependencies
```

### Workflow
1. Create a feature branch from `main`
2. Implement feature following `/doc-specs/1-issue.md`
3. Write tests (target 80%+ coverage)
4. Run `npm run lint` (frontend) and `mvn checkstyle:check` (backend)
5. Create pull request with description
6. Code review
7. Merge to `main`

---

## 📦 Dependencies

### Frontend
- react@18
- typescript
- vite
- tailwindcss
- react-hook-form
- zod
- axios
- vitest
- @testing-library/react

### Backend
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-validation
- postgresql
- flyway-core
- lombok
- junit-jupiter
- testcontainers

### Infrastructure
- docker
- docker-compose

---

## 🎯 Success Criteria (MVP Complete)

✅ All 12 tasks completed (TASK-001 through TASK-012)  
✅ 80%+ test coverage (backend + frontend)  
✅ All CRUD operations working  
✅ Search & filtering functional  
✅ Pagination working  
✅ Responsive design (mobile, tablet, desktop)  
✅ API response time < 200ms  
✅ Frontend load time < 3s  
✅ Docker setup working locally  
✅ Start/stop scripts functional  
✅ No console errors in production  

---

## 🔄 Next Steps (Phase 2)

Once MVP is complete:
- User authentication (JWT)
- Undo/Redo actions
- Light/Dark themes
- Export data (CSV/PDF)
- Advanced filtering
- Audit trail

---

## 📞 Support

For questions or issues:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review `/doc-specs/1-issue.md` for specification
3. Check Docker logs: `docker-compose logs -f`
4. Review application logs in containers

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👤 Contributors

- Daniel Augusto Smanioto

---

## 🙏 Acknowledgments

- Built with Spec Kit framework
- AI-assisted development with Claude Code
- Inspired by best practices in full-stack development

---

**Last Updated:** 2026-07-09  
**Version:** 1.0.0 (MVP)


## 🧪 Testing

### Run Tests

```bash
cd frontend
npm run test              # Run all tests
npm run test:ui          # Interactive UI
npm run test:coverage    # Coverage report
```

**Test Results:**
- ✅ 48+ component tests (100% passing)
- ✅ Coverage on all major features
- ✅ Accessibility tests included
- ✅ Integration scenarios covered

### Test Stack
- Frontend: Vitest, React Testing Library, @testing-library/jest-dom
- Backend: JUnit 5, Testcontainers, Spring Boot Test

## 📚 API Documentation

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | List all contacts (paginated) |
| GET | `/api/contacts/{id}` | Get single contact |
| POST | `/api/contacts` | Create new contact |
| PUT | `/api/contacts/{id}` | Update contact |
| DELETE | `/api/contacts/{id}` | Soft delete contact |
| GET | `/api/contacts/search?q=...` | Search contacts |
| GET | `/api/contacts/filter?fromDate=...&toDate=...` | Filter by date range |

### Example Requests

**Create Contact:**
```bash
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "birthDate": "1990-01-15"
  }'
```

**Search Contacts:**
```bash
curl http://localhost:8080/api/contacts/search?q=john&page=0&size=10
```

**Filter by Date:**
```bash
curl http://localhost:8080/api/contacts/filter?fromDate=1990-01-01&toDate=2000-12-31
```

### Swagger UI
Interactive API documentation available at:
```
http://localhost:8080/swagger-ui.html
```

## ✅ Validation Rules

- **Name**: 1-255 characters (required)
- **Email**: Valid RFC 5322 format, unique (required)
- **Phone**: 10-20 digits (optional)
- **Birth Date**: Must be in the past (optional)

## 🎨 UI Components

### Layout
- Header: Branding and navigation
- Footer: Footer content
- Container: Responsive max-width wrapper

### Contact Management
- ContactForm: Create/edit form with validation
- ContactList: Paginated contact grid
- ContactCard: Individual contact display

### Filtering & Search
- SearchBar: Debounced search input
- FilterBar: Date range picker
- SortOptions: Sort toggle buttons
- Pagination: Page navigation

### Common UI
- Button: Primary, secondary, danger variants
- Input: Labeled input fields with errors
- Spinner: Loading indicator
- Empty: Empty state message
- Toast: Success/error notifications
- ConfirmDialog: Delete confirmation modal

## 📊 Performance

- **API Response Time**: < 200ms for search/filter/list
- **Bundle Size**: ~350KB (gzipped)
- **Frontend Components**: 12+ reusable components
- **Database Indexes**: Optimized for quick queries
- **Pagination**: 10 items per page default

## 🔒 Security

- ✅ Input validation (Zod + Jakarta Bean Validation)
- ✅ CORS configured for frontend
- ✅ SQL injection prevention (JPA queries)
- ✅ XSS prevention (React auto-escaping)
- ✅ Soft delete (data preservation)
- ✅ Error handling (no sensitive data leaked)

## 🗄️ Database Schema

### Contacts Table
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
```

**Indexes for Performance:**
- `idx_contacts_email` - For email lookups
- `idx_contacts_name` - For search/sort by name
- `idx_contacts_birth_date` - For date range filtering
- `idx_contacts_deleted_at` - For soft delete filtering

## 🚀 Local Development

### Prerequisites
- Java 21 JDK
- Node.js 20+
- PostgreSQL 15
- Maven 3.9+
- npm 10+

### Setup Backend

```bash
cd backend

# Set Java home
export JAVA_HOME=$(/usr/libexec/java_home)

# Run database (PostgreSQL must be running)
mvn spring-boot:run

# Run tests
mvn test

# Build
mvn clean install
```

### Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Development server (http://localhost:5173)
npm run dev

# Run tests
npm run test

# Build
npm run build

# Lint & format
npm run lint
npm run format
```

## 📈 Project Status

**Completion: 12/12 Tasks (100%)**

Phase 1: Backend (100%)
- ✅ TASK-001: Backend Project Setup
- ✅ TASK-002: Contact Entity & JPA Repository
- ✅ TASK-003: Contact Service Layer
- ✅ TASK-004: REST API Endpoints

Phase 2: Frontend (100%)
- ✅ TASK-005: Frontend Project Setup
- ✅ TASK-006: Base Components
- ✅ TASK-007: React Hooks & State Management
- ✅ TASK-008: Form Validation
- ✅ TASK-009: Listing Features
- ✅ TASK-010: Edit & Delete Operations

Phase 3: Testing & Integration (100%)
- ✅ TASK-011: E2E Testing & Coverage (48 tests)
- ✅ TASK-012: Docker & Documentation (this file)

## 🤝 Contributing

1. Create feature branch from `main`:
   ```bash
   git checkout -b feature/TASK-XXX-description
   ```

2. Commit with conventional format:
   ```bash
   git commit -m "feat: description"
   ```

3. Ensure all tests pass:
   ```bash
   npm run test  # frontend
   mvn test      # backend
   ```

4. Push and create Pull Request

## 📝 Troubleshooting

### Port Already in Use
```bash
# Find process on port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres
```

### Frontend Not Loading
```bash
# Clear cache and rebuild
docker-compose down -v
./scripts/reset.sh
```

## 📞 Support

- Check API docs: `http://localhost:8080/swagger-ui.html`
- Review test files for usage examples
- Check `PROJECT_STATUS.md` for implementation details
- View component README files in respective directories

## 📄 License

Educational project - 2026

---

**Version**: 1.0.0  
**Last Updated**: 2026-07-09  
**Status**: Complete ✅

**Tech Stack**: Java 21 | Spring Boot 3.3 | React 18 | TypeScript | PostgreSQL 15 | Docker | Tailwind CSS
