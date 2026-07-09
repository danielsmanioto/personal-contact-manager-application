# Personal Contact Manager Application — Constitution

<!--
SYNC IMPACT REPORT
==================
Version Change: N/A → 1.0.0 (Initial Adoption)
Ratification Date: 2026-07-09
Last Amended: 2026-07-09

Principles Formalized (7 sections, 27 requirements):
✅ Code Quality — testing, linting, type safety
✅ Architecture — hexagonal backend, resilience
✅ Security — input validation, no plaintext passwords
✅ Performance — sub-200ms APIs, <3s initial load
✅ User Experience — intuitive navigation, responsive, accessible
✅ Maintainability — documented code, reusable components
✅ Documentation — README, OpenAPI specs

Templates Reviewed:
✅ spec-template.md — aligned (user stories, acceptance criteria)
✅ plan-template.md — aligned (Constitution Check gate present)
✅ tasks-template.md — aligned (test-driven, infrastructure-first)

Dependent Artifacts Status:
✅ CLAUDE.md — requires update to reference this constitution
⚠ README.md — quality standards already present, reference added below
✅ No deprecations or removals
-->

## Core Principles

### I. Code Quality

**Non-Negotiable Standards:**
- Minimum 80% test coverage (unit + integration combined)
- Zero console.log() in production code
- Lint clean per ESLint + Prettier standards
- Frontend: TypeScript with explicit types (no `any` without justification)
- Backend: SOLID principles (Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion)
- Performance testing in CI/CD pipeline (benchmarks tracked)

**Rationale**: Quality gates prevent bugs, enable refactoring confidence, and reduce maintenance debt early.

### II. Architecture

**Non-Negotiable Standards:**
- Backend: Hexagonal (Ports & Adapters) architecture for domain isolation
- All endpoints must implement resilience patterns (timeouts, retries, circuit breakers where applicable)
- Clear separation: Controllers → Services → Repositories → Domain logic

**Rationale**: Hexagonal architecture decouples business logic from infrastructure, enabling independent testing and technology swaps. Resilience prevents cascading failures.

### III. Security

**Non-Negotiable Standards:**
- Validate ALL user inputs at frontend AND backend (defense in depth)
- Sanitize all data before persisting to database
- Never store plaintext passwords (use bcrypt or equivalent)
- Implement protection against XSS (HTML escaping, CSP headers) and SQL Injection (parameterized queries, ORM safeguards)

**Rationale**: Layered validation catches both malformed and malicious input. Multiple attack vectors require multiple defenses.

### IV. Performance

**Non-Negotiable Standards:**
- API responses: < 200ms (p95 latency baseline)
- Initial application load: < 3 seconds to interactive
- Image optimization: lazy loading, responsive sizes, appropriate formats
- Component lazy loading: defer non-critical UI until needed

**Rationale**: Performance directly impacts user retention and accessibility. These thresholds balance responsiveness with development pragmatism.

### V. User Experience

**Non-Negotiable Standards:**
- Navigation must never require more than 3 clicks to reach core functionality
- Every user action provides visual feedback (loading states, error/success messages, confirmations)
- Responsive design: mobile, tablet, desktop all fully functional
- Accessibility: WCAG 2.1 Level AA compliance (keyboard navigation, screen reader support, color contrast)

**Rationale**: Intuitive UX reduces support burden and increases user satisfaction. Accessibility is both ethical and legally required.

### VI. Maintainability

**Non-Negotiable Standards:**
- Code comments must explain WHY, not WHAT (naming + structure already show WHAT)
- All business logic exposed as reusable components/functions
- Clear separation of concerns: UI logic ≠ business logic ≠ data access
- Structured logging at key decision points (errors, state transitions, performance milestones)

**Rationale**: Future maintainers (often including your future self) need to understand intent, not just syntax. Reusable components prevent duplication and inconsistency.

### VII. Documentation

**Non-Negotiable Standards:**
- README.md: Setup instructions, architecture overview, development workflow for new contributors
- API Documentation: Full OpenAPI 3.0 specification covering all endpoints, request/response schemas, error codes

**Rationale**: Self-documenting code is a myth; explicit documentation enables onboarding and reduces decision-making time during development.

## Governance

### Amendment Process

Amendments to this constitution require:
1. **Proposal**: Document the change and its rationale
2. **Review**: Ensure no backward-incompatible breaks without team consensus
3. **Documentation**: Update this file with new amendment date and reasoning
4. **Propagation**: Update dependent templates (spec, plan, tasks) and README references

### Versioning Policy

**Semantic Versioning** (MAJOR.MINOR.PATCH):
- **MAJOR**: Principle removal or redefinition (backward-incompatible governance)
- **MINOR**: New principle added, existing principle expanded, new mandatory section
- **PATCH**: Clarifications, wording refinements, typo fixes, non-semantic improvements

### Compliance & Review

- All PRs must reference which principle(s) they satisfy or maintain
- Architecture reviews gate PRs that modify the backend structure
- Performance regressions must be explicitly justified or rejected
- Constitution Check gate in `/speckit-plan` ensures every feature plan aligns with these principles

## Implementation Guidance

For detailed runtime guidance (conventions, file structure, tech stack, development workflow), see `CLAUDE.md` and `README.md`.

---

**Version**: 1.0.0 | **Ratified**: 2026-07-09 | **Last Amended**: 2026-07-09
