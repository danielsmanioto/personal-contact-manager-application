# Frontend Tests - Create Contact Feature

## Overview

This directory contains comprehensive tests for the "Create Contact with Validated Form" feature. Tests are organized by type (unit, integration) and cover all 4 user stories.

## Test Organization

### Unit Tests (`unit/`)

Unit tests validate individual components in isolation with mocked dependencies.

#### `ContactForm.render.test.tsx`
**Coverage**: Component rendering and structure  
**Test Count**: 8 tests  
**Story**: US1, US4  
**What it tests**:
- Form displays all 4 fields (name, email, phone, birthDate)
- Submit button exists and starts disabled
- Cancel button exists
- Field types are correct (email input, tel input, date input)
- Placeholder text provides guidance
- Hint text indicates optional fields
- "Atualizar" button shows when editing (not creating)
- All inputs disable when `isLoading=true`

**Run**: `npm run test -- ContactForm.render.test.tsx`

#### `ContactForm.submission.test.tsx`
**Coverage**: Form submission logic and button gating  
**Test Count**: 8 tests  
**Story**: US1  
**What it tests**:
- Submit button enables after filling name and email
- Submit button is disabled for invalid email
- Submit button is disabled when name is empty
- onSubmit is called with correct data
- Form clears/resets after successful submission
- onCancel callback is called when Cancel button clicked
- Loading state is shown during submission
- Submission works with empty optional fields (phone, birthDate)

**Run**: `npm run test -- ContactForm.submission.test.tsx`

#### `ContactForm.validation.test.tsx`
**Coverage**: Real-time validation and button state machine  
**Test Count**: 10+ tests  
**Story**: US2, US3  
**What it tests**:
- Button state machine with 8+ state transitions
- Button starts disabled, enables with valid name+email
- Button disables if email becomes invalid
- Button remains enabled when optional phone is cleared
- Button disables if optional phone becomes invalid
- Button handles future birth date (disables)
- Button enables with valid past birth date
- Email validation accepts valid formats, rejects invalid
- Phone validation: 10-20 digits only (no special chars)
- Birth date validation: past dates only, rejects future

**Run**: `npm run test -- ContactForm.validation.test.tsx`

#### `ContactForm.errors.test.tsx`
**Coverage**: Error message display and feedback  
**Test Count**: 12+ tests  
**Story**: US4  
**What it tests**:
- Error messages don't appear initially (untouched fields)
- "Name is required" for empty name
- "Please enter a valid email address" for invalid email
- "Phone must be 10-20 digits" for invalid phone format
- "Birth date must be in the past" for future dates
- Error messages disappear when field is corrected
- Multiple errors display simultaneously
- Errors are properly associated with form fields (visual)
- Valid inputs don't show errors
- Optional fields (phone, birthDate) don't show errors when empty

**Run**: `npm run test -- ContactForm.errors.test.tsx`

### Integration Tests (`integration/`)

Integration tests validate full user workflows with mocked API calls.

#### `createContact.test.tsx`
**Coverage**: End-to-end creation flow and error handling  
**Test Count**: 6+ tests  
**Story**: US1, US2, US4  
**What it tests**:
- Complete flow: "New Contact" button → form appears → fill fields → submit → success toast → contact appears in list
- API 201 response creates contact and updates list
- Success toast message displays "Contact created successfully!"
- Form submission calls API with correct POST payload
- API 500 error shows error toast, form remains open for retry
- API 409 duplicate email error displays "Email already exists"
- API 400 validation error displays validation messages
- User can retry after error by correcting fields
- Real-time validation works during integration flow
- Optional fields (phone, birthDate) work in full flow

**Run**: `npm run test -- createContact.test.tsx`

## Running Tests

### Run All Tests
```bash
cd frontend
npm run test
```

Expected output: 40+ tests passing

### Run Specific Test File
```bash
npm run test -- ContactForm.render.test.tsx
```

### Run Tests in Watch Mode (development)
```bash
npm run test:watch
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

Expected coverage:
- `ContactForm.tsx`: 85%+
- `validation.ts`: 90%+
- `contactService.ts`: 80%+

### Run TypeScript Type Checking
```bash
npm run type-check
```

### Run Linting
```bash
npm run lint
```

### Run Prettier Formatting
```bash
npm run format
```

## Test Strategy

### Unit vs. Integration

**Unit Tests** (in `unit/`):
- Test component behavior in isolation
- Mock API calls (axios)
- Fast execution (~50ms per test)
- Focus on business logic, validation, UI state
- Use `@testing-library/react` + `@testing-library/user-event`

**Integration Tests** (in `integration/`):
- Test full user workflows with mocked APIs
- Simulate real app behavior (App component)
- Slower execution (~100-300ms per test)
- Focus on data flow, error handling, UI coordination
- Mock HTTP responses (201, 400, 409, 500)

### Test Patterns Used

**1. User Event Simulation** (`userEvent`)
```typescript
const user = userEvent.setup();
await user.type(nameInput, 'John Doe');
```

**2. Async Waiting** (`waitFor`)
```typescript
await waitFor(() => {
  expect(submitButton).not.toBeDisabled();
});
```

**3. API Mocking** (`vi.mock('axios')`)
```typescript
mockedAxios.post.mockResolvedValue({ status: 201, data: {...} });
```

**4. Query Methods** (Testing Library best practices)
- `getByRole()` — find buttons, inputs by semantic role
- `getByLabelText()` — find inputs by label text
- `queryByText()` — check if element exists
- `findByText()` — wait for element to appear

## Coverage Goals

- **Unit Tests**: 85%+ branch coverage per file
- **Integration Tests**: Happy path + major error scenarios
- **Combined**: 80%+ overall code coverage for modified files

## Manual Testing (Quickstart)

For manual validation in a browser, follow the scenarios in:
```
specs/003-create-contact/quickstart.md
```

### Setup
```bash
# Terminal 1: Backend
cd backend && mvn spring-boot:run

# Terminal 2: Frontend
cd frontend && npm run dev

# Browser: http://localhost:5173
```

### Test Scenarios
1. Create contact with required fields only
2. Real-time validation feedback
3. Optional fields handling
4. Error message clarity
5. Duplicate email (409) handling
6. Button state machine transitions

## Common Issues & Fixes

### Tests Fail with "Cannot find module"
```bash
npm install
npm run test
```

### Tests Hang or Timeout
- Increase timeout: `vi.setConfig({ testTimeout: 10000 })`
- Check for missing `waitFor()` around async operations
- Verify mocks are set up before render

### useForm Errors in Tests
- Ensure `ContactForm` has default `onSubmit` and `onCancel` props
- Mock `axios` before importing components
- Use `mockResolvedValue` for successful submissions

### "Name is required" Error Doesn't Appear
- Use `waitFor()` after user actions (validation happens async)
- Check that field validation runs on `blur` or `change` event
- Verify `mode: 'onChange'` in form setup

## Debugging Tests

### Add console.log
```typescript
it('should work', async () => {
  render(<ContactForm {...props} />);
  const button = screen.getByRole('button');
  console.log('Button:', button);
  expect(button).toBeDisabled();
});
```

### Use screen.debug()
```typescript
screen.debug(); // Prints full DOM
```

### Check for hidden elements
```typescript
screen.getByText('...',{ hidden: false })
```

### Run single test
```typescript
it.only('should work', async () => { ... })
npm run test
```

## Test Maintenance

### When Adding New Fields
1. Update `ContactForm.render.test.tsx` to test new field rendering
2. Update `ContactForm.submission.test.tsx` to test submission with new field
3. Update `ContactForm.validation.test.tsx` to test validation rules
4. Update `ContactForm.errors.test.tsx` to test error messages

### When Changing Validation Rules
1. Update validation schema in `validation.ts`
2. Update corresponding test cases in `ContactForm.validation.test.tsx`
3. Update error message tests in `ContactForm.errors.test.tsx`
4. Run tests to ensure new rules work: `npm run test`

### When Changing API Contract
1. Update mock responses in `createContact.test.tsx`
2. Verify API error responses (400, 409, 500) still work
3. Check that error messages map correctly to API errors

## Performance Metrics

**Test Execution Time**:
- Unit tests: ~200ms total (40+ tests)
- Integration tests: ~500ms total (6+ tests)
- Combined with overhead: ~1s total

**Build/Compile Time**:
- TypeScript check: ~2s
- Lint: ~1s
- All checks: ~3-4s

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with: { node-version: 18 }
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run test:coverage
```

## Resources

- [Testing Library Docs](https://testing-library.com/react)
- [Vitest Docs](https://vitest.dev/)
- [React Hook Form Testing](https://react-hook-form.com/form-builder)
- [Zod Validation Testing](https://zod.dev/)

---

**Last Updated**: 2026-07-11  
**Total Tests**: 40+  
**Coverage Target**: 80%+
