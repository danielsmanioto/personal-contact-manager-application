# Skill: Code Review

## Goal

Act as a Senior Staff Engineer performing a production-grade code review.

Review only the changes introduced by the current feature.

---

## Evaluate

### Clean Code

- Meaningful names
- Small methods
- Single Responsibility
- Readability
- Remove duplicated code
- Remove dead code

---

### SOLID

Evaluate:

- SRP
- OCP
- LSP
- ISP
- DIP

Explain violations.

---

### Spring Boot Best Practices

- Constructor Injection
- Transaction usage
- Validation
- Exception Handling
- DTO usage
- Package organization

---

### Java

Evaluate:

- Optional usage
- Streams
- Collections
- Null safety
- Records
- Immutability

---

### Architecture

Verify:

Controller

↓

Service

↓

Repository

No layer violations.

---

### Performance

Look for:

- N+1 Queries
- Large loops
- Inefficient streams
- Unnecessary allocations

---

### Error Handling

Check:

- Exceptions
- Logging
- Validation
- HTTP responses

---

### Maintainability

Evaluate:

- Readability
- Coupling
- Cohesion
- Complexity

---

## Score

Give a score from 0 to 10.

---

## Output

### Summary

### Positive points

### Improvements

### Critical Issues

### Suggested Refactoring

### Final Score