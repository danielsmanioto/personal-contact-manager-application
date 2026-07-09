# Backend: Personal Contact Manager API

Java 21 + Spring Boot 3.x + Maven + PostgreSQL backend for the Personal Contact Manager Application.

---

## 🚀 Quick Start

### Prerequisites

- Java 21 JDK
- Maven 3.8+
- PostgreSQL 15+ (local or Docker)

### Setup

```bash
# 1. Start PostgreSQL (if using Docker)
docker run -d \
  -e POSTGRES_DB=contact_manager \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# 2. Build project
mvn clean install

# 3. Run application
mvn spring-boot:run

# 4. Access API
# - REST API: http://localhost:8080/api
# - Swagger UI: http://localhost:8080/swagger-ui.html
# - Health: http://localhost:8080/actuator/health
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/contactmanager/
│   │   │   ├── controller/         # REST endpoints
│   │   │   ├── service/            # Business logic
│   │   │   ├── repository/         # Data access (JPA)
│   │   │   ├── entity/             # JPA entities
│   │   │   ├── dto/                # Data transfer objects
│   │   │   ├── exception/          # Custom exceptions
│   │   │   ├── config/             # Spring configuration
│   │   │   └── ContactManagerApplication.java
│   │   └── resources/
│   │       ├── application.yml     # Spring config
│   │       └── db/migration/       # Flyway migrations
│   └── test/
│       └── java/com/contactmanager/
│           ├── repository/         # Repository tests
│           ├── service/            # Service tests
│           └── controller/         # Controller tests
├── pom.xml                         # Maven configuration
└── Dockerfile
```

---

## 🔧 Maven Commands

```bash
# Clean build
mvn clean install

# Run application
mvn spring-boot:run

# Run tests
mvn test

# Run specific test class
mvn test -Dtest=ContactControllerTests

# Generate coverage report
mvn jacoco:report
open target/site/jacoco/index.html

# Check code style
mvn checkstyle:check

# Format code
mvn spotless:apply

# Build Docker image
mvn clean package
docker build -t contact-manager-backend:latest .
```

---

## 🧪 Testing

### Run All Tests

```bash
mvn test
```

### Run Tests with Coverage

```bash
mvn test jacoco:report
# Coverage report: target/site/jacoco/index.html
```

### Test Categories

- **Repository Tests:** Database access layer (with Testcontainers)
- **Service Tests:** Business logic layer
- **Controller Tests:** API endpoints layer (integration tests)

### Coverage Target

- **Minimum:** 80%
- **Target:** 90%+

---

## 📊 Database

### PostgreSQL Connection

```yaml
# Default (application.yml)
datasource:
  url: jdbc:postgresql://localhost:5432/contact_manager
  username: postgres
  password: postgres
```

### Flyway Migrations

Migrations are in `src/main/resources/db/migration/`

```bash
# V1__init.sql - Initial schema creation with indexes
```

Run automatically on application startup.

### Database Schema

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

-- Indexes
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_name ON contacts(name);
CREATE INDEX idx_contacts_birth_date ON contacts(birth_date);
CREATE INDEX idx_contacts_deleted_at ON contacts(deleted_at);
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts` | List all contacts (paginated) |
| GET | `/contacts/{id}` | Get single contact |
| POST | `/contacts` | Create new contact |
| PUT | `/contacts/{id}` | Update contact |
| DELETE | `/contacts/{id}` | Delete (soft delete) contact |
| GET | `/contacts/search` | Search by name/email |

### Example Requests

**List Contacts**
```bash
curl -X GET "http://localhost:8080/api/contacts?page=0&size=10"
```

**Create Contact**
```bash
curl -X POST "http://localhost:8080/api/contacts" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "birthDate": "1990-01-15"
  }'
```

**Search**
```bash
curl -X GET "http://localhost:8080/api/contacts/search?q=john&page=0&size=10"
```

See SPECIFICATION.md for full API documentation.

---

## 🔒 Security

### Input Validation

- **Frontend:** React Hook Form + Zod
- **Backend:** Jakarta Bean Validation (@NotBlank, @Email, @Size, etc.)

### SQL Injection Prevention

- Uses JPA with parameterized queries
- Never concatenates SQL strings

### Example (Correct)

```java
@Query("SELECT c FROM Contact c WHERE c.name LIKE :name")
List<Contact> findByName(@Param("name") String name);
```

### Logging

Uses SLF4J + Logback (never System.out.println):

```java
private static final Logger logger = LoggerFactory.getLogger(ContactService.class);
logger.info("Creating contact: {}", name);
```

No sensitive data (emails, personal info) in logs.

---

## ⚡ Performance

### Database Optimization

- Indexes on frequently queried columns (email, name, birthDate)
- Soft delete filters (WHERE deleted_at IS NULL)
- Pagination to prevent large result sets
- JPA lazy loading and fetch strategies

### Targets

- API response time: **< 200ms** (p95)
- Database query: **< 50ms** with indexes

---

## 📚 Code Quality

### Code Style

```bash
# Check
mvn checkstyle:check

# Fix
mvn spotless:apply
```

### Testing

- Unit tests for service layer
- Integration tests with Testcontainers for real PostgreSQL
- Target: 80%+ coverage

### Type Safety

- Java 21 (modern language features)
- Explicit types (no raw types)
- Compiler warnings treated as errors

---

## 🐳 Docker

### Build Image

```bash
# Option 1: Using Maven plugin
mvn spring-boot:build-image

# Option 2: Using Dockerfile
mvn clean package
docker build -t contact-manager-backend:latest .
```

### Run Container

```bash
docker run -d \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/contact_manager \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=postgres \
  -p 8080:8080 \
  --name contact-manager-backend \
  contact-manager-backend:latest
```

### Docker Compose

See root `docker-compose.yml` for full stack setup.

---

## 🛠️ Development

### IDE Setup

**IntelliJ IDEA**
1. Open project: File → Open → select pom.xml
2. Maven should auto-import
3. Enable annotation processing: Settings → Compiler → Annotation Processors → Enable

**VS Code**
1. Install "Extension Pack for Java"
2. Maven extension auto-detects pom.xml
3. Run/Debug from VS Code

### Debugging

```bash
# Run in debug mode
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005"
```

---

## 📖 Documentation

- **API Docs:** Swagger UI at `/swagger-ui.html`
- **SPECIFICATION.md:** Full API specification
- **CONSTITUTION.md:** Development principles
- **IMPLEMENTATION_PLAN.md:** Architecture

---

## ✅ Checklist for TASK-001 Completion

- [ ] Maven build succeeds: `mvn clean install`
- [ ] Spring Boot app starts: `mvn spring-boot:run`
- [ ] Application listens on port 8080
- [ ] All dependencies compile without errors
- [ ] Dockerfile builds successfully
- [ ] Logger configured (SLF4J working)
- [ ] No console.log/System.out.println (use SLF4J)
- [ ] All Java code has explicit types

---

**Last Updated:** 2026-07-09  
**Status:** ✅ TASK-001 Setup Complete
