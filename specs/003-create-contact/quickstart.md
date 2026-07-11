# Quickstart: Validate Create Contact Feature

**Purpose**: Manual end-to-end validation that the create contact feature works correctly.

**Date**: 2026-07-11

---

## Prerequisites

- Java 21 installed and `JAVA_HOME` set
- Maven 3.9+ installed
- Node.js 18+ and npm installed
- PostgreSQL 15+ running (or Docker container with Postgres)
- Git repository initialized and on `main` branch

---

## Setup: Start Backend and Frontend Servers

### 1. Start PostgreSQL (if not already running)

```bash
# Using Docker (recommended)
docker run --rm -d \
  --name postgres-contact-manager \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=contact_manager \
  -p 5432:5432 \
  postgres:15

# Or use a local PostgreSQL installation
# (Ensure it's running on port 5432 and has a database named 'contact_manager')
```

### 2. Start Backend Server

```bash
cd backend
export JAVA_HOME=$(/usr/libexec/java_home)  # macOS; adjust for Linux/Windows
mvn spring-boot:run
```

**Expected output**:
```
...
Tomcat started on port(s): 8080 (http)
Started Application in 3.5 seconds
```

Keep this terminal open.

### 3. Start Frontend Dev Server (in a new terminal)

```bash
cd frontend
npm install  # if not already done
npm run dev
```

**Expected output**:
```
  VITE v4.5.0  ready in 125 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## Test Scenario 1: Create Contact with Required Fields Only

### Steps

1. Open `http://localhost:5173/` in a web browser
2. Click the **"✚ New Contact"** button in the header
3. A form should appear with fields: Name, Email, Phone (optional), Birth Date (optional)
4. Observe that the **"+ Criar Contato"** button is **disabled** (appears grayed out)

### Validation Points

- ✓ Form renders with all four fields
- ✓ Submit button is initially disabled
- ✓ No error messages appear (fields are untouched)

### Continue the Test

5. Type a name: "João Silva"
6. Observe: Submit button is still **disabled** (only name is filled)
7. Type an email: "joao@example.com"
8. Observe: Submit button becomes **enabled** (name + email are valid)

### Validation Points

- ✓ Submit button enables once name and email are both provided
- ✓ No error messages appear for valid inputs
- ✓ Optional fields (phone, birth date) can remain empty

9. Click the **"+ Criar Contato"** button
10. Observe: 
    - Form disappears
    - A toast message appears: **"Contact created successfully!"**
    - The new contact appears in the contact list below
    - Contact row shows: "João Silva" | "joao@example.com" | ✎ ✕ (edit/delete buttons)

### Validation Points

- ✓ Contact is created successfully with only required fields
- ✓ Success toast appears
- ✓ Contact list updates immediately with the new contact
- ✓ Contact can be edited/deleted (buttons present)

---

## Test Scenario 2: Real-Time Validation — Empty Fields

### Steps (from main page)

1. Click **"✚ New Contact"** again
2. Leave all fields empty
3. Observe: Submit button is **disabled**

### Validation Points

- ✓ Submit button remains disabled when form is empty
- ✓ No error messages appear yet (untouched state)

4. Click in the Name field and type a single character "J"
5. Click out of the field (or press Tab)
6. Observe: 
   - Submit button is still **disabled** (email is missing)
   - No error message appears for the name (it's valid: "J" is ≥ 1 char)

7. Type more in name field to complete: "Jane Doe"
8. Click in the Email field and type an invalid email "jane@" (missing domain)
9. Click out of the field
10. Observe:
    - Submit button is still **disabled**
    - Error message appears below the email field: **"Please enter a valid email address"**

### Validation Points

- ✓ Validation errors appear in real-time as the user leaves fields
- ✓ Submit button doesn't enable until all required fields are valid
- ✓ Error messages are clear and actionable

11. Complete the email: "jane@example.com"
12. Observe:
    - Error message disappears
    - Submit button becomes **enabled**

### Validation Points

- ✓ Submit button enables as soon as validation errors are fixed
- ✓ Real-time feedback confirms the user is on the right track

---

## Test Scenario 3: Optional Fields — Phone Validation

### Steps (from main page)

1. Click **"✚ New Contact"**
2. Fill required fields: Name="Alex", Email="alex@example.com"
3. Submit button is **enabled**
4. Click in the Phone field and type "123" (less than 10 digits)
5. Click out of the field
6. Observe:
   - Error message appears: **"Phone must be 10-20 digits"**
   - Submit button becomes **disabled** (phone is invalid)

### Validation Points

- ✓ Phone validation is enforced when a value is provided
- ✓ Submit button respects phone validation errors

7. Complete the phone number to "11987654321" (11 digits, valid)
8. Observe:
   - Error message disappears
   - Submit button becomes **enabled**

### Validation Points

- ✓ Phone validation passes with 10-20 digits
- ✓ Button re-enables once phone is valid

9. Clear the phone field (leave it empty)
10. Observe:
    - No error message appears
    - Submit button remains **enabled**

### Validation Points

- ✓ Phone is optional — empty phone field doesn't trigger errors or disable the button
- ✓ User can submit without providing a phone number

---

## Test Scenario 4: Optional Fields — Birth Date Validation

### Steps (from main page)

1. Click **"✚ New Contact"**
2. Fill required fields: Name="Maria", Email="maria@example.com"
3. Click in the Birth Date field and select today's date (e.g., 2026-07-11)
4. Click out of the field
5. Observe:
   - Error message appears: **"Birth date must be in the past"**
   - Submit button is **disabled**

### Validation Points

- ✓ Birth date validation rejects today's date and future dates
- ✓ Submit button respects birth date validation errors

6. Select a past date (e.g., 1990-05-20)
7. Observe:
   - Error message disappears
   - Submit button becomes **enabled**

### Validation Points

- ✓ Birth date validation accepts past dates
- ✓ Button re-enables with a valid past date

8. Clear the birth date field
9. Observe:
   - No error message
   - Submit button remains **enabled**

### Validation Points

- ✓ Birth date is optional — empty field doesn't prevent submission

---

## Test Scenario 5: Duplicate Email Error (409 Conflict)

### Steps

1. Click **"✚ New Contact"**
2. Create a contact with Name="Test User", Email="test@example.com", submit successfully
3. Contact appears in the list
4. Click **"✚ New Contact"** again
5. Try to create another contact with the same email: Name="Another Name", Email="test@example.com"
6. Click submit
7. Observe:
   - Form remains open
   - An error toast appears: **"Email already exists"**
   - Contact list is NOT updated with a duplicate
   - No new contact row is added to the list

### Validation Points

- ✓ Backend rejects duplicate email with 409 error
- ✓ Frontend displays error message to user
- ✓ Form allows retry (user can try a different email)

8. Change email to "another@example.com" and submit
9. Observe: Contact is created successfully (error is resolved)

### Validation Points

- ✓ User can recover from duplicate email error by changing the email

---

## Test Scenario 6: Button Disable/Enable State Machine

### Steps (testing the core requirement: button state correctness)

1. Click **"✚ New Contact"**
2. Verify initial state: **Button is disabled**
3. Type Name="J" → **Button remains disabled**
4. Type Email="j@" → **Button remains disabled**
5. Complete Email="j@example.com" → **Button becomes enabled** ✓
6. Delete Email (leave empty) → **Button becomes disabled** ✓
7. Re-enter Email="j@example.com" → **Button becomes enabled** ✓
8. Type Phone="123" → **Button becomes disabled** (invalid phone)
9. Complete Phone="12345678901" → **Button becomes enabled** ✓
10. Delete Phone (leave empty) → **Button remains enabled** ✓ (phone is optional)

### Validation Points

- ✓ Button correctly toggles enabled/disabled based on form validity
- ✓ Button is enabled iff: name is non-empty AND email is valid AND (phone is empty OR phone is valid) AND (birthDate is empty OR birthDate is valid and in past)
- ✓ Optional fields don't prevent button from enabling when empty

---

## Test Scenario 7: Network Error Handling (Optional)

### Steps (Advanced)

1. Open browser DevTools (F12)
2. Go to Network tab
3. Click **"✚ New Contact"** and fill in a valid form
4. Simulate a network error:
   - In DevTools → Network → throttle to "Offline" (or use Response simulation)
   - Or stop the backend server temporarily
5. Click submit
6. Observe:
   - Loading spinner appears on the button (if implemented)
   - An error toast appears: **"Failed to create contact"** or similar
   - Form remains open for retry

### Validation Points

- ✓ API errors are caught and displayed
- ✓ User is informed of the failure
- ✓ Form is not cleared, allowing retry

---

## Verification Checklist

After completing all test scenarios, verify:

- [ ] ✓ Form renders with 4 fields (name, email, phone, birthDate)
- [ ] ✓ Submit button starts disabled and enables only when form is valid
- [ ] ✓ Validation errors appear in real-time as user types
- [ ] ✓ Required fields (name, email) are enforced
- [ ] ✓ Optional fields (phone, birthDate) don't prevent submission when empty
- [ ] ✓ Phone validation: 10-20 digits only
- [ ] ✓ Birth date validation: past dates only
- [ ] ✓ Successful creation: contact appears in list, success toast shown
- [ ] ✓ Duplicate email error (409): error toast shown, form remains open
- [ ] ✓ Button state machine is correct across all transitions
- [ ] ✓ Form can be cancelled (Escape key or Cancel button)
- [ ] ✓ Contact list updates immediately after creation

---

## Database Verification (Optional)

To verify that data was actually persisted:

```sql
-- Connect to PostgreSQL
psql -U postgres -d contact_manager

-- Query created contacts
SELECT id, name, email, phone, birth_date, created_at, updated_at 
FROM contacts 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC;
```

Expected output: All contacts created during testing should appear with correct values.

---

## API-Level Verification (Optional)

To verify the API directly (using curl or Postman):

```bash
# Create a contact
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "11987654321",
    "birthDate": "1990-05-20"
  }'

# Expected response (201 Created)
{
  "id": "uuid...",
  "name": "Test User",
  "email": "test@example.com",
  "phone": "11987654321",
  "birthDate": "1990-05-20",
  "createdAt": "2026-07-11T...",
  "updatedAt": "2026-07-11T..."
}

# Try duplicate email (should return 409)
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name": "Another User", "email": "test@example.com"}'

# Expected response (409 Conflict)
{
  "status": 409,
  "message": "Email already exists"
}
```

---

## Cleanup

After testing, stop the servers:

```bash
# Stop frontend (Ctrl+C in the npm run dev terminal)
# Stop backend (Ctrl+C in the mvn spring-boot:run terminal)

# Stop Docker PostgreSQL (if used)
docker stop postgres-contact-manager
```

---

**Status**: ✅ Quickstart guide complete. Ready for implementation and testing.
