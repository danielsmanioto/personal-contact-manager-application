# Constitution

This document outlines the non-negotiable principles and values that guide ALL decisions and implementations in the Personal Contact Manager Application.

---

## Overview

These principles are **BINDING**. No code can be merged that violates them. Every line of code, every commit, every feature must respect these principles.

---

## 1. Code Quality

### Principle: Quality is Non-Negotiable

**Minimum 80% Test Coverage**
- **Why:** Catch bugs early, refactor with confidence, prevent regressions
- **How:** 
  - Backend: JUnit 5 unit tests + integration tests with Testcontainers
  - Frontend: Vitest + React Testing Library component tests
  - Coverage reports in every PR
- **Enforcement:** CI fails if coverage drops below 80%

**No console.log in Production Code**
- **Why:** Use professional logging frameworks, not browser/terminal logs
- **How:**
  - Backend: SLF4J logger (never System.out.println)
  - Frontend: Remove all console.log before merge (keep in dev only)
  - Linting detects console statements
- **Enforcement:** ESLint rule: no-console in production

**Explicit Types Everywhere**
- **Why:** Catch type errors at compile time, better IDE support, safer refactoring
- **How:**
  - Frontend: TypeScript strict mode enabled, all functions have types
  - Backend: Java generics (no raw types), explicit return types
  - No `any`, no `Object`, no `var`
- **Enforcement:** TypeScript strict, no `@ts-ignore`

**Lint Clean (ESLint + Prettier)**
- **Why:** Consistent code style, fewer merge conflicts, professional codebase
- **How:**
  - Frontend: `npm run lint` passes, `npm run format` runs before commit
  - Backend: Checkstyle passes (Maven checkstyle plugin)
  - Pre-commit hooks enforce formatting
- **Enforcement:** CI blocks merge if linting fails

---

## 2. Security

### Principle: Security First, Always

**Validate ALL User Inputs**
- **Why:** Prevent SQL injection, XSS, data corruption, malicious payloads
- **How:**
  - Frontend: Zod schemas + React Hook Form validation
  - Backend: Jakarta Bean Validation (@Valid annotations)
  - Both layers validate independently (never trust client)
- **Examples:**
  - Email: RFC 5322 format validation
  - Phone: 10-20 digits regex
  - Name: 1-255 characters, no special injection chars
  - Date: Past dates only

**No SQL Injection**
- **Why:** Database attacks, data theft, data loss
- **How:**
  - Backend: Use JPA (Spring Data) with parameterized queries
  - Never concatenate SQL strings
  - Use @Query with named parameters
- **Example:**
  ```java
  // ✅ CORRECT: Parameterized
  @Query("SELECT c FROM Contact c WHERE c.name LIKE :name")
  List<Contact> findByName(@Param("name") String name);
  
  // ❌ WRONG: String concatenation
  Query q = em.createQuery("SELECT c FROM Contact c WHERE c.name LIKE '" + name + "'");
  ```

**No XSS (Cross-Site Scripting)**
- **Why:** Malicious code injection, data theft, user hijacking
- **How:**
  - Frontend: React escapes by default, use dangerouslySetInnerHTML only with sanitized content
  - Backend: Never send raw HTML, always JSON
  - Sanitize user input before rendering
- **Example:**
  ```tsx
  // ✅ CORRECT: React escapes automatically
  <p>{userInput}</p>
  
  // ❌ WRONG: Creates XSS vulnerability
  <p dangerouslySetInnerHTML={{ __html: userInput }} />
  ```

**Secure Data Handling**
- **Why:** Protect sensitive information
- **How:**
  - Never log sensitive data (emails, personal info)
  - Use environment variables for secrets (not hardcoded)
  - Soft delete sensitive data (mark as deleted, don't remove)
- **Enforcement:** Code review catches sensitive data leaks

---

## 3. Performance

### Principle: Performance Matters, Measure It

**API Response Time < 200ms (p95)**
- **Why:** Users expect fast apps, perceived speed = actual speed
- **How:**
  - Backend: Optimize database queries, use indexes strategically
  - Cache frequently accessed data
  - Use pagination (never return all records)
  - Monitor with load tests
- **Enforcement:** Performance tests in CI, alert on regressions

**Initial Page Load < 3 Seconds**
- **Why:** Users abandon slow sites, SEO penalty
- **How:**
  - Frontend: Code splitting with Vite
  - Lazy load components (React.lazy)
  - Optimize bundle size (no unnecessary dependencies)
  - Minify assets
- **Enforcement:** Lighthouse CI check (> 90 score)

**Database Query Optimization**
- **Why:** Database is the bottleneck for most apps
- **How:**
  - Index frequently queried columns (email, name, birthDate)
  - Avoid N+1 queries (use JOIN fetching)
  - Use pagination for large result sets (never SELECT all)
  - Monitor slow queries in logs
- **Indexes:**
  ```sql
  CREATE INDEX idx_contacts_email ON contacts(email);
  CREATE INDEX idx_contacts_name ON contacts(name);
  CREATE INDEX idx_contacts_birthDate ON contacts(birthDate);
  CREATE INDEX idx_contacts_deletedAt ON contacts(deletedAt);
  ```

---

## 4. User Experience (UX)

### Principle: Intuitive, Responsive, Accessible

**Intuitive Navigation (Max 3 Clicks)**
- **Why:** Users shouldn't get lost, clear information hierarchy
- **How:**
  - Feature is accessible in maximum 3 clicks from home
  - Clear visual hierarchy (headers, emphasis)
  - Breadcrumbs or navigation path shown
- **Examples:**
  - Create contact: Home → New Contact (1 click)
  - Edit contact: Home → List → Edit (2 clicks)
  - Search: Home → Search (1 click)

**Visual Feedback for EVERY Action**
- **Why:** Users need to know what's happening (loading, success, error)
- **How:**
  - Loading: Show spinner while API call in progress
  - Success: Toast notification "Contact saved successfully"
  - Error: Clear error message "Email already exists" (not generic error)
  - Disabled state: Submit button disabled while loading
  - Confirmation: Confirm before destructive actions (delete)
- **Examples:**
  ```
  Create contact: spinner → success toast → contact in list
  Delete contact: confirm dialog → spinner → success toast → removed from list
  Search: spinner → results appear → or "no results found"
  ```

**Responsive Design (Mobile, Tablet, Desktop)**
- **Why:** Users access from phones, tablets, laptops
- **How:**
  - Mobile-first approach (design for small first)
  - Breakpoints: 375px (mobile), 768px (tablet), 1440px (desktop)
  - No horizontal scrolling (ever)
  - Touch-friendly buttons (min 44px height)
  - Flexible layouts (flexbox, grid)
- **Enforcement:** Responsive test in Playwright

**WCAG 2.1 Level AA Accessibility**
- **Why:** Everyone should be able to use the app (legal + ethical)
- **How:**
  - Semantic HTML (`<button>` not `<div onclick>`)
  - ARIA labels for screen readers (`aria-label`, `aria-describedby`)
  - Color contrast: minimum AA (4.5:1 for text)
  - Keyboard navigation: tab through all elements
  - Form labels associated with inputs (`<label htmlFor>`)
- **Enforcement:** axe DevTools, Lighthouse accessibility audit

---

## 5. Maintainability

### Principle: Code is Read More Than Written

**Well-Documented Code**
- **Why:** Future developers (including you) need to understand WHY, not just WHAT
- **How:**
  - Comments explain WHY, not WHAT (code shows WHAT)
  - README.md for each module
  - API documentation (endpoint descriptions)
  - Type definitions are self-documenting
- **Example:**
  ```typescript
  // ❌ BAD: Comments describe what code does
  // Loop through contacts
  for (const contact of contacts) {
    if (contact.age > 18) {
      // Add to adults
      adults.push(contact);
    }
  }
  
  // ✅ GOOD: Comments explain why
  // Only include adults in marketing emails (legal requirement)
  const adultContacts = contacts.filter(c => c.age > 18);
  ```

**Reusable Components**
- **Why:** Don't repeat yourself (DRY principle)
- **How:**
  - Extract common patterns into functions/components
  - Share utilities across codebase
  - Component libraries for UI elements
- **Example:**
  - `useContacts` hook instead of duplicating fetch logic
  - `formatDate` utility instead of date logic everywhere
  - `Button` component with consistent styling

**Clear Separation of Concerns**
- **Why:** Code is easier to test, debug, modify
- **How:**
  - Frontend: Components → Hooks → Services → Utils
  - Backend: Controller → Service → Repository → Entity
  - Each layer has one responsibility
- **Example:**
  ```
  Frontend:
  ContactForm (UI) → useContacts (state) → api.ts (HTTP) → validation.ts (rules)
  
  Backend:
  ContactController (HTTP) → ContactService (logic) → ContactRepository (DB)
  ```

---

## Enforcement & Governance

### Code Review
- **Mandatory** before any merge to main
- Reviewer checks all 5 principles
- Can request changes if constitution violated
- "Looks good" = all principles followed

### Automated Checks (CI/CD)
- **Linting:** ESLint + Prettier (frontend), Checkstyle (backend)
- **Type Checking:** TypeScript strict mode, Java compilation
- **Tests:** Must pass, coverage >= 80%
- **Security:** No console.log, no hardcoded secrets

### Manual Testing
- Responsive design (test on real devices)
- Accessibility (keyboard nav, screen reader)
- Performance (network throttling, real devices)
- Security (try injecting invalid data)

### Enforcement Actions
If constitution is violated:
1. Code review blocks merge
2. Automated checks fail
3. Developer must fix before merge
4. Cannot bypass with `--force` or `--no-verify`

---

## When Constitution Conflicts with Deadline

**The Constitution ALWAYS wins.**

If shipping faster means breaking a principle:
- Quality requirement? → Extend deadline
- Security requirement? → Extend deadline
- Performance target? → Extend deadline
- UX standard? → Extend deadline
- Maintainability? → Extend deadline

Never ship code that violates constitution to meet a deadline.

---

## Sign-Off

This Constitution is approved and binding on all developers working on Personal Contact Manager Application.

Every commit, every PR, every feature must respect these principles.

**No exceptions. No shortcuts. Quality first.**

---

**Last Updated:** 2026-07-09  
**Version:** 1.0.0
