# Project Guidelines

## 📊 Project Status

**Always check the current project status before starting work:**
- 📈 **Progress:** See `PROJECT_STATUS.md` for task checklist and completion status
- 🎯 **Current Task:** Check which TASK is marked as "In Progress"
- ✅ **Completed:** Tasks marked as COMPLETED can be referenced in new work

---

## Git Workflow: Trunk-Based Development

This project uses **trunk-based development** with the following conventions:

### Branch Strategy

- **Main Branch:** `main` is the trunk - always stable and deployable
- **Feature Branches:** All work branches follow the pattern: `feature/TASK-XXX-short-description`
  - Example: `feature/TASK-003-contact-service-layer`
  - Example: `feature/TASK-004-rest-api-endpoints`

### Workflow Steps

1. **Create a new feature branch from main:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/TASK-XXX-short-description
   ```

2. **Work on the feature**
   - Commit regularly with clear messages: `feat: add contact service`, `test: add service tests`
   - Keep commits small and focused

3. **Before pushing, verify:**
   ```bash
   export JAVA_HOME=$(/usr/libexec/java_home)
   mvn clean compile test  # Backend
   npm run test            # Frontend (when ready)
   ```

4. **Create a pull request:**
   - Title: `TASK-XXX: Short description`
   - Description: Explain what was done and why
   - Link to spec-docs/001-tarefa-contact-manager files

5. **Code review and merge to main:**
   - Once approved, merge and delete the feature branch
   - All merges go to `main`

### Commit Message Convention

```
feat: description        # New feature
fix: description         # Bug fix
test: description        # Tests
docs: description        # Documentation
chore: description       # Refactoring, dependencies
```

## Project Structure

- **Backend:** Java 21 + Spring Boot 3.x (folder: `backend/`)
- **Frontend:** React 18 + TypeScript + Vite (folder: `frontend/` - when created)
- **Specs:** All specifications in `spec-docs/001-tarefa-contact-manager/`

## Tech Stack Reference

- **Backend:** Java 21, Spring Boot 3.3, Maven, PostgreSQL, Flyway
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Database:** PostgreSQL 15+
- **Infrastructure:** Docker + Docker Compose

## Build Commands

### Backend
```bash
export JAVA_HOME=$(/usr/libexec/java_home)
mvn clean compile       # Compile only
mvn clean test          # Run tests
mvn spring-boot:run     # Run locally (needs PostgreSQL)
```

### Frontend (when ready)
```bash
npm install
npm run dev             # Development server
npm run test            # Run tests
npm run build           # Production build
```

## Important Notes

- All database changes must go through Flyway migrations
- Both frontend and backend validation required
- Target 80%+ test coverage for both layers
- No console.log in production code
- Use SLF4J for backend logging

<!-- SPECKIT START -->
**Current Feature Plan**: [specs/003-create-contact/plan.md](specs/003-create-contact/plan.md) — Create Contact with Validated Form (in-progress)
<!-- SPECKIT END -->
