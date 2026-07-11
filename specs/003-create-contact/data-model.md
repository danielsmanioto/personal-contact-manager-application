# Data Model: Create Contact Feature

**Purpose**: Document the Contact entity, DTOs, and frontend form data structure.

**Date**: 2026-07-11

---

## Contact Entity (Backend)

**Source**: `backend/src/main/java/com/contactmanager/entity/Contact.java`

Represents a persisted contact in the system.

```java
@Entity
@Table(name = "contacts")
public class Contact {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, length = 255)
  @NotBlank(message = "Name is required")
  @Size(min = 1, max = 255, message = "Name must not exceed 255 characters")
  private String name;

  @Column(nullable = false, length = 255, unique = true)
  @NotBlank(message = "Email is required")
  @Email(message = "Please enter a valid email address")
  private String email;

  @Column(length = 20)
  @Pattern(regexp = "^[0-9]{10,20}$|^$", message = "Phone must be 10-20 digits")
  private String phone;  // nullable, optional

  @Column(name = "birth_date")
  @PastOrPresent(message = "Birth date must not be in the future")
  private LocalDate birthDate;  // nullable, optional

  @Column(nullable = false, updatable = false)
  @CreationTimestamp
  private LocalDateTime createdAt;

  @Column(nullable = false)
  @UpdateTimestamp
  private LocalDateTime updatedAt;

  @Column(nullable = true)
  private LocalDateTime deletedAt;  // soft-delete marker

  // Getters, setters, helper methods (e.g., isActive())
}
```

**Validation Rules**:
- `name`: Required, 1-255 characters, no special format
- `email`: Required, must be a valid email address, must be unique across all non-deleted contacts
- `phone`: Optional, if provided must be exactly 10-20 digits (no spaces, dashes, or other characters)
- `birthDate`: Optional, if provided must be a past date (not today, not future)
- `createdAt`: Auto-generated on insert, not updatable
- `updatedAt`: Auto-generated on insert and update
- `deletedAt`: NULL for active contacts; set on soft-delete (optional soft-delete support, not used in create flow)

---

## Request DTO

**Source**: `backend/src/main/java/com/contactmanager/dto/ContactRequest.java`

Represents user input for creating or updating a contact.

```java
public record ContactRequest(
  @NotBlank(message = "Name is required")
  @Size(min = 1, max = 255)
  String name,

  @NotBlank(message = "Email is required")
  @Email(message = "Please enter a valid email address")
  String email,

  @Pattern(regexp = "^[0-9]{10,20}$|^$", message = "Phone must be 10-20 digits")
  String phone,  // nullable

  @PastOrPresent(message = "Birth date must not be in the future")
  LocalDate birthDate  // nullable
) {}
```

**Validation**: Performed by Jakarta Bean Validation annotations at the controller layer (`@Valid` in method signature).

---

## Response DTO

**Source**: `backend/src/main/java/com/contactmanager/dto/ContactResponse.java`

Represents a contact returned to the client after creation.

```java
public record ContactResponse(
  UUID id,
  String name,
  String email,
  String phone,
  LocalDate birthDate,
  LocalDateTime createdAt,
  LocalDateTime updatedAt
) {}
```

**Note**: `deletedAt` is intentionally omitted from the response (soft-delete implementation detail not exposed to API clients).

---

## Frontend Form Data Type

**Source**: `frontend/src/utils/validation.ts`

TypeScript type inferred from the Zod schema (strict runtime validation).

```typescript
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must not exceed 255 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .transform(val => val?.trim() || '')
    .refine(
      (val) => !val || /^[0-9]{10,20}$/.test(val),
      'Phone must be 10-20 digits'
    )
    .optional(),
  birthDate: z
    .string()
    .transform(val => val?.trim() || '')
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      'Please enter a valid date'
    )
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return date <= new Date();
    }, 'Birth date must be in the past')
    .optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

**TypeScript Type** (inferred):
```typescript
type ContactFormData = {
  name: string;           // required
  email: string;          // required
  phone?: string;         // optional (undefined or empty string)
  birthDate?: string;     // optional (undefined or empty string), ISO date format
};
```

**Validation Rules** (same as backend, enforced client-side):
- `name`: Required, 1-255 characters
- `email`: Required, valid email format
- `phone`: Optional; if provided, must be 10-20 digits only (normalized to empty string if empty)
- `birthDate`: Optional; if provided, must be parseable as a date and be in the past (normalized to empty string if empty)

---

## Data Flow

**Create Contact Flow**:

1. **User Input** → FormField components capture values → `watch()` syncs with form state
2. **Frontend Validation** → Zod schema validates on keystroke (mode: 'onChange') → errors appear inline, button enabled/disabled based on `formState.isValid`
3. **Form Submission** → ContactForm sends `ContactFormData` as `ContactRequest` to `POST /api/contacts`
4. **Backend Validation** → Spring receives request, validates with Bean Validation (`@Valid`) → throws `MethodArgumentNotValidException` if invalid
5. **Business Logic** → ContactService checks for duplicate email → throws `EmailAlreadyExistsException` (409) if found
6. **Persistence** → Contact entity saved via JPA repository → auto-generated `id`, `createdAt`, `updatedAt`
7. **Response** → ContactResponse returned (201 Created) with new contact details
8. **Frontend** → Toast message shown, contact list refetches and displays new contact

---

## Summary Table

| Aspect | Backend Entity | Frontend Type | Validation |
|--------|---|---|---|
| **name** | String (255) | string | Required, 1-255 chars, no format |
| **email** | String (255) | string | Required, valid email, unique |
| **phone** | String (20) | string \| undefined | Optional, 10-20 digits only |
| **birthDate** | LocalDate | string \| undefined | Optional, ISO date, must be past |
| **id** | UUID | UUID | Auto-generated, read-only |
| **createdAt** | LocalDateTime | LocalDateTime | Auto-generated, read-only |
| **updatedAt** | LocalDateTime | LocalDateTime | Auto-generated, read-only |
| **deletedAt** | LocalDateTime | — | Not exposed in API |

---

**Status**: ✅ Data model complete. Ready for API contract documentation.
