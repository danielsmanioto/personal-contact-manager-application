# Research & Design Decisions: Create Contact with Validated Form

**Date**: 2026-07-11

**Purpose**: Document research into validation strategies and finalize design decisions for the contact creation feature.

---

## R1: Submit Button Validity Gating Strategy

**Question**: How should the form determine when the submit button should be enabled?

### Decision

Use react-hook-form's `formState.isValid` combined with `mode: 'onChange'`.

### Rationale

- `formState.isValid` is the official, purpose-built API from react-hook-form for determining form validity. It correctly:
  - Accounts for untouched fields (ignores validation errors on fields the user hasn't interacted with yet, if the form is in a "submit on blur" mode, but with `mode: 'onChange'` it validates on keystroke)
  - Handles optional fields correctly when paired with Zod's `.optional()` placed correctly in the schema chain
  - Synchronizes with the Zod resolver's validation timing
  - Updates synchronously as the user types (with `mode: 'onChange'`)

- Manual approaches (checking `watch()` + `Object.keys(errors).length`) are error-prone:
  - Errors object is stale — it doesn't update at the same time as `watch()` due to resolver timing
  - Optional fields can unexpectedly fail refinements if `.optional()` is placed after `.refine()` chains (fixed in the schema)
  - Edge case: empty string vs. undefined for optional fields can cause validation errors if not normalized

### The Original Bug

The form was computing:
```typescript
const isFormValid = formValues.name && formValues.email && !Object.keys(errors).length;
```

This failed because:
1. `formValues` (from `watch()`) updates before the resolver has finished revalidating
2. `errors` object may still contain old errors even after the user fixes a field
3. The check `!Object.keys(errors).length` is brittle if the `errors` object is being mutated or if optional fields trigger spurious errors

### Implementation

```typescript
const { formState: { errors, isValid }, watch, ... } = useForm({
  resolver: zodResolver(contactSchema),
  mode: 'onChange',  // Validate on every keystroke
});

// Later, in the button:
disabled={isLoading || !isValid}
```

### Validation Stack

Frontend validation (Zod) → Backend validation (Bean Validation) → Database constraints (NOT NULL, UNIQUE).

This layering ensures:
- **User experience**: Instant feedback as the user types, preventing submission of invalid data
- **Security**: Backend re-validates to prevent bypassing frontend validation
- **Data integrity**: Database constraints are the final safety gate (e.g., email uniqueness)

---

## R2: Optional Field Handling in Zod Schema

**Question**: How should optional fields (phone, birthDate) be handled in the Zod schema to avoid spurious validation errors?

### Decision

Place `.optional()` immediately after the string type, before any `.refine()` chains.

### Rationale

Zod's `.refine()` chains run on **non-undefined** values. If `.optional()` is placed after `.refine()`, the refinement logic runs on empty strings, causing validation errors. By placing `.optional()` first, Zod skips refinements for undefined/empty values and only validates them if a value is actually provided.

### Schema Structure

```typescript
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, ...),
  email: z.string().min(1, 'Email is required').email(...),
  phone: z.string()
    .transform(val => val?.trim() || '')  // Normalize: empty string → empty string
    .refine(
      (val) => !val || /^[0-9]{10,20}$/.test(val),
      'Phone must be 10-20 digits'
    )
    .optional(),
  birthDate: z.string()
    .transform(val => val?.trim() || '')
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      'Please enter a valid date'
    )
    .refine(
      (val) => { if (!val) return true; const date = new Date(val); return date <= new Date(); },
      'Birth date must be in the past'
    )
    .optional(),
});
```

The `.transform()` ensures that whitespace-only input is normalized to an empty string, which is then skipped by the refinements (due to the `!val ||` check in each refinement).

---

## R3: API Contract — POST /api/contacts

**Question**: What request/response schema does the backend API expect?

### Decision

Use the existing backend endpoint `POST /api/contacts` (already implemented, no changes needed).

### Specification

**Request**:
```json
{
  "name": "string (1-255 chars, required)",
  "email": "string (valid email format, required, must be unique)",
  "phone": "string (optional, 10-20 digits only) | null",
  "birthDate": "date string ISO 8601 (optional, must be in the past) | null"
}
```

**Response** (201 Created):
```json
{
  "id": "UUID",
  "name": "string",
  "email": "string",
  "phone": "string | null",
  "birthDate": "date string ISO 8601 | null",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

**Error Responses**:
- **400 Bad Request**: Validation failure (e.g., invalid email format, name > 255 chars)
  ```json
  {
    "status": 400,
    "message": "Validation failed",
    "errors": { "email": "must be a valid email address", "name": "must not be blank" }
  }
  ```
- **409 Conflict**: Email already exists in the system
  ```json
  {
    "status": 409,
    "message": "Email already exists"
  }
  ```
- **500 Internal Server Error**: Unexpected server error

---

## R4: Testing Strategy

**Question**: What testing approach ensures the feature works end-to-end and covers edge cases?

### Decision

- **Unit tests**: Validate the Zod schema in isolation (test each field's rules)
- **Component tests**: Test ContactForm's rendering, validation state machine, and button toggles
- **Integration tests**: Test the full flow (form → API call → contact list update)
- **Backend tests**: Ensure the API correctly validates and persists (already covered by existing tests)

### Test Scenarios

1. **Schema validation** (unit):
   - Valid input: name="John", email="john@example.com", phone="", birthDate="" → passes
   - Invalid email: email="john@" → fails
   - Invalid phone: phone="123" (< 10 digits) → fails
   - Future birth date: birthDate="2099-01-01" → fails
   - Empty optional: phone="" and birthDate="" → passes (no error)

2. **Form component** (component):
   - Button starts disabled with empty form
   - Button becomes enabled once name and email are filled validly
   - Button remains enabled if phone/birthDate are left empty
   - Button becomes disabled if email becomes invalid
   - Error messages appear/disappear as the user types

3. **E2E** (integration):
   - User fills form with valid data, clicks submit, receives success toast, contact appears in list
   - User tries to create with duplicate email, receives error toast "Email already exists"
   - User leaves form with Escape key, form closes, no contact created

---

## R5: Browser Compatibility & Accessibility

**Question**: Should the form work on older browsers? What accessibility requirements apply?

### Decision

- **Browser support**: Modern browsers (Chrome, Firefox, Safari, Edge) with ES2020+ support (already used by project)
- **Accessibility**: WCAG 2.1 Level AA compliance via existing form component library

### Implementation Notes

- Use existing `FormField` component (which wraps label, input, error message, icon) to ensure consistent accessibility patterns
- DateInput field should use native `<input type="date">` for browser date picker support
- Error messages should be associated with inputs via `aria-describedby`
- Form should be keyboard navigable (Tab through fields, Enter to submit, Escape to cancel)

All of these are already handled by the existing design system; no new accessibility work is required for this feature.

---

## Summary of Design Decisions

| Decision | Outcome | Impact |
|----------|---------|--------|
| Use `formState.isValid` + `mode: 'onChange'` | Canonical validity check + real-time feedback | Fixes the bug, enables UX principle |
| Place `.optional()` early in Zod schema | Optional fields don't trigger spurious errors | Prevents user confusion, ensures correct validation |
| Reuse existing `POST /api/contacts` endpoint | No backend changes needed | Faster implementation, leverages existing code |
| Test schema, component, and E2E flows | Comprehensive coverage | Ensures feature works end-to-end and catches regressions |
| Inherit accessibility from design system | WCAG 2.1 AA compliance | Meets Constitution Check (V. User Experience) |

---

**Status**: ✅ All research questions resolved. Ready for Phase 1 design artifacts.
