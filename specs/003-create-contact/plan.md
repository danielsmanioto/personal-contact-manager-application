# Implementation Plan: Create Contact with Validated Form

**Branch**: `main` | **Date**: 2026-07-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-create-contact/spec.md`

**Note**: This plan documents the implementation of a validated contact creation form with real-time field validation and submit-button state management, posting to the existing backend API endpoint.

## Summary

Implement a validated contact creation form component that enables the submit button only when all required fields (name, email) are correctly filled, with optional phone and birth date fields. The form uses react-hook-form with Zod for real-time validation, and submits to the existing `POST /api/contacts` backend endpoint. The bug fix (incorrect manual validity check replaced with react-hook-form's canonical `formState.isValid`) has already been applied to the codebase; this plan documents the design decisions and generates associated artifacts (data model, API contracts, validation quickstart).

## Technical Context

**Frontend Language/Version**: TypeScript 5.2, React 18

**Frontend Dependencies**: react-hook-form 7.x, @hookform/resolvers 5.x, zod 4.x, axios 1.x, lucide-react (icons)

**Backend Language/Version**: Java 21, Spring Boot 3.3

**Backend Dependencies**: Spring Data JPA, Bean Validation (Jakarta), Flyway, springdoc-openapi (auto-generated Swagger UI)

**Storage**: PostgreSQL 15+ (existing Flyway migrations, table `contacts` with unique email constraint)

**Frontend Testing**: Vitest, @testing-library/react, @testing-library/user-event

**Backend Testing**: JUnit 5, Mockito (existing test patterns)

**Target Platform**: Web application (desktop, tablet, mobile via responsive design)

**Project Type**: Full-stack web application (existing `backend/` Java + `frontend/` React monorepo layout)

**Performance Goals**: Form validation feedback < 500ms (p95), contact creation API response < 200ms (p95)

**Constraints**: Responsive design (mobile-first), WCAG 2.1 Level AA accessibility, XSS and SQL injection protection via input validation (frontend + backend)

**Scale/Scope**: Single-user contact management app, ~50 contacts per user, no concurrent editing conflicts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**✅ PASS** — No violations identified:

- **Code Quality**: Frontend validation uses Zod with strict type inference; backend uses Bean Validation annotations. Both enforce 80%+ test coverage via existing test suite patterns. No console.log in production code.
- **Architecture**: Follows separation of concerns — Form component → validation layer (Zod schema) → API service (axios) → backend controller/service stack. No circular dependencies.
- **Security**: Dual-layer input validation (frontend Zod + backend Bean Validation) + unique email constraint at DB level prevents duplicate entries (409 error). XSS mitigated via React's auto-escaping; SQL injection prevented by JPA parameterization.
- **Performance**: Form validation happens on keystroke via `mode: 'onChange'` (< 500ms) + debounced through React's re-render; API call is to existing endpoint (< 200ms target already enforced). No new N+1 queries introduced.
- **UX**: Real-time validation feedback (error messages appear inline), submit button state toggles immediately based on form validity, success toast on creation, contact list refreshes automatically.
- **Maintainability**: Validation logic centralized in one schema (`specs/003-create-contact/data-model.md`), reused by both form and service layer tests.
- **Documentation**: OpenAPI specs auto-generated from existing Spring annotations; quickstart.md covers manual validation flow.

No complexity violations requiring justification. The Complexity Tracking table is omitted.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
backend/
├── src/main/java/com/contactmanager/
│   ├── entity/Contact.java                    # ✓ Already exists (no changes)
│   ├── dto/ContactRequest.java                # ✓ Already exists (no changes)
│   ├── dto/ContactResponse.java               # ✓ Already exists (no changes)
│   ├── controller/ContactController.java      # ✓ Already exists, POST /api/contacts
│   ├── service/ContactService.java            # ✓ Already exists, create() method
│   ├── exception/EmailAlreadyExistsException.java  # ✓ Already exists
│   └── repository/ContactRepository.java      # ✓ Already exists
├── src/main/resources/db/migration/
│   └── V1__init.sql                           # ✓ Already exists, contacts table
└── tests/                                      # ✓ Existing test patterns (unit + integration)

frontend/
├── src/
│   ├── components/
│   │   └── ContactForm/
│   │       └── ContactForm.tsx                # ✅ MODIFIED: Added mode: 'onChange', isValid gate
│   ├── utils/
│   │   └── validation.ts                      # ✅ MODIFIED: Fixed phone/birthDate optional handling
│   ├── services/
│   │   ├── contactService.ts                  # ✓ Already exists (no changes)
│   │   └── api.ts                             # ✓ Already exists (no changes)
│   └── types/
│       └── index.ts                           # ✓ Contact type definitions (no changes)
└── tests/
    ├── unit/
    │   └── ContactForm.test.tsx               # NEW: Validation state machine tests
    └── integration/
        └── contactCreation.test.tsx           # NEW: End-to-end form submission tests
```

**Structure Decision**: Web application with existing monorepo layout (`backend/` + `frontend/`). Feature changes are minimal and focused: 2 existing frontend files modified (fixes already applied), 2 new test files added. Backend requires no changes (API endpoint and persistence already complete). This follows the existing project structure without introducing new directories or architectural patterns.

## Phase 0: Research (Validation Approach)

**Decision**: Use `formState.isValid` from react-hook-form as the canonical source of truth for submit-button disabled state, coupled with `mode: 'onChange'` for real-time validation.

**Rationale**: 
- `formState.isValid` is the official react-hook-form API for form validity — it correctly accounts for untouched fields, optional fields, and async validation state.
- Manual derivation from `watch()` values + `Object.keys(errors).length` (the original bug) is stale and misses edge cases: empty optional fields can trigger validation errors if not handled carefully, and the errors object may not reflect the actual submit-time validity state.
- `mode: 'onChange'` triggers validation on every keystroke, enabling instant feedback that drives the button state toggle.

**Alternatives Considered**:
1. **Debounced manual validation** — Re-implement Zod validation on every keystroke with debounce. Rejected: reinvents what the resolver already provides, risks drift from actual submit validation, and adds complexity.
2. **Ad-hoc `zod.safeParse()` on form object** — Validate the entire form manually before enabling button. Rejected: same as above, plus introduces performance overhead and duplicates schema logic.
3. **Disable button until first submit attempt, then enable based on errors** — User experience anti-pattern (form feels "broken" until first submit), violates Constitution Check UX principle.

**Validation Layer Stack**:
- **Frontend (Zod)**: Validates structure, types, formats at runtime. Provides error messages for user feedback.
- **Backend (Bean Validation)**: Re-validates request DTO with `@NotBlank`, `@Email`, `@Pattern`, etc. Prevents bypassing frontend.
- **Database**: Unique constraint on email, NOT NULL on name/email. Final safety gate.

This layering satisfies the Security principle (defense-in-depth input validation) and prevents inconsistent state.
