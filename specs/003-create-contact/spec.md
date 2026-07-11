# Feature Specification: Create Contact with Validated Form

**Feature Branch**: `feature/TASK-003-create-contact`

**Created**: 2026-07-11

**Status**: Draft

**Input**: User description: "Criar funcionalidade de criação de contato (usuário) com formulário validado, onde o botão de salvar deve ser habilitado apenas quando todos os campos obrigatórios (nome e email) forem preenchidos corretamente. O formulário deve incluir campos para nome completo, email, telefone (opcional) e data de nascimento (opcional), com validações em tempo real enquanto o usuário digita. Após o envio, o contato deve ser criado com sucesso e a lista de contatos deve ser atualizada."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a New Contact (Priority: P1)

A user opens the contact manager application and wants to add a new contact to their personal address book. They click the "New Contact" button and fill in the required information (name and email), then submit the form to create the contact.

**Why this priority**: This is the core functionality of the feature and delivers immediate value—users can persist new contacts in the system.

**Independent Test**: Can be fully tested by filling in name and email fields, clicking submit, and verifying the contact appears in the contact list.

**Acceptance Scenarios**:

1. **Given** the user is on the main contacts page, **When** they click the "New Contact" button, **Then** a form appears with fields for name, email, phone, and birth date
2. **Given** the user has filled in name and email, **When** they click the submit button, **Then** the contact is created and added to the list
3. **Given** the user has filled in name and email with optional phone and birth date, **When** they click the submit button, **Then** the contact is created with all provided information

---

### User Story 2 - Real-Time Form Validation (Priority: P1)

A user fills in the contact form and sees validation errors appear immediately as they type. The submit button remains disabled until all required fields are correctly filled, preventing submission of invalid data.

**Why this priority**: Real-time validation prevents user frustration and ensures data quality at submission time. This directly supports the core create functionality.

**Independent Test**: Can be tested by typing in each field and observing validation messages and button state changes without submitting.

**Acceptance Scenarios**:

1. **Given** the form is displayed, **When** the user leaves the name field empty, **Then** the submit button is disabled
2. **Given** the form is displayed, **When** the user enters an invalid email, **Then** an error message appears and the submit button remains disabled
3. **Given** the user has entered a valid name and email, **When** the form validates, **Then** the submit button becomes enabled
4. **Given** the user has entered valid name and email and optional phone, **When** they enter an invalid phone format, **Then** an error message appears but the submit button remains enabled (since phone is optional)
5. **Given** the user has entered a future birth date, **When** the form validates, **Then** an error message appears saying "Birth date must be in the past"

---

### User Story 3 - Optional Fields (Priority: P2)

A user can create a contact with only the required fields (name and email) without providing phone or birth date information. The form accepts incomplete optional fields gracefully.

**Why this priority**: Users should not be forced to provide information they don't have. This improves form completion rates and user satisfaction.

**Independent Test**: Can be tested by submitting a form with only name and email, verifying the contact is created without phone or birth date.

**Acceptance Scenarios**:

1. **Given** the user has entered only name and valid email, **When** they click submit, **Then** the contact is created successfully without phone or birth date
2. **Given** the user has entered phone but left birth date empty, **When** they click submit, **Then** the contact is created with phone but without birth date

---

### User Story 4 - Form Validation Feedback (Priority: P2)

A user receives clear, immediate feedback about validation errors so they know what needs to be corrected before they can submit.

**Why this priority**: Good error messages reduce friction and support the user in completing the form correctly on first attempt.

**Independent Test**: Can be tested by intentionally entering invalid data and verifying appropriate error messages appear for each field.

**Acceptance Scenarios**:

1. **Given** the user enters an email without the "@" symbol, **When** validation runs, **Then** the message "Please enter a valid email address" appears
2. **Given** the user enters a phone number with less than 10 digits, **When** validation runs, **Then** the message "Phone must be 10-20 digits" appears
3. **Given** the user leaves the name field empty, **When** validation runs, **Then** the message "Name is required" appears

---

### Edge Cases

- What happens when the user tries to create a contact with an email that already exists in the system?
- How does the form behave if the user clicks submit multiple times quickly?
- What happens if the network request fails after the user clicks submit?
- Can the user create a contact with a very long name (e.g., 500+ characters)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a form with fields for name, email, phone (optional), and birth date (optional)
- **FR-002**: System MUST validate the name field is required and non-empty (max 255 characters)
- **FR-003**: System MUST validate the email field is required and contains a valid email format
- **FR-004**: System MUST validate the phone field is optional, but if provided must contain 10-20 digits only (no special characters or spaces)
- **FR-005**: System MUST validate the birth date field is optional, but if provided must be a valid date in the past
- **FR-006**: System MUST display validation error messages in real-time as the user types
- **FR-007**: System MUST keep the submit button disabled until all required fields are valid
- **FR-008**: System MUST enable the submit button only when name and email are valid and phone/birth date are either empty or valid
- **FR-009**: System MUST send the form data to the backend API to create a new contact
- **FR-010**: System MUST show a success message after the contact is created
- **FR-011**: System MUST update the contact list to include the newly created contact
- **FR-012**: System MUST clear the form after successful submission or provide a cancel button to dismiss the form
- **FR-013**: System MUST handle API errors gracefully and display error messages to the user

### Key Entities

- **Contact**: Represents a person in the contact list with attributes:
  - `id`: Unique identifier (assigned by system)
  - `name`: Full name of the person (required, max 255 characters)
  - `email`: Email address (required, valid email format)
  - `phone`: Phone number (optional, 10-20 digits)
  - `birthDate`: Date of birth (optional, must be a past date)
  - `createdAt`: Timestamp when contact was created (assigned by system)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a contact with required fields (name and email) in under 30 seconds
- **SC-002**: The submit button correctly enables/disables based on form validation state 100% of the time
- **SC-003**: Form validation messages appear within 500ms of user input (real-time feedback)
- **SC-004**: 95% of contacts created successfully are added to the contact list immediately after submission
- **SC-005**: Error messages for invalid inputs are clear and actionable (users can correct the error based on the message)
- **SC-006**: The form accepts both required and optional fields according to the specification, with no unintended data loss

## Assumptions

- **Users have basic familiarity with web forms**: They understand required vs. optional fields and can interpret validation messages
- **Email validation** follows standard patterns (must contain @, domain, and TLD)
- **Phone formatting** is flexible in storage (backend handles stripping special characters) but input requires pure digits
- **Existing authentication system** will handle user identity; this feature assumes users are logged in
- **Existing contact list UI** will be used to display newly created contacts; no new list component is required
- **API endpoint** `/api/contacts` (POST) already exists and is implemented
- **Network connectivity** is available; offline functionality is out of scope for v1
- **Desktop and mobile responsiveness** are covered by existing design system; form should inherit responsive behavior
- **Accessibility (WCAG 2.1 AA)** is covered by existing form components; new fields should use existing accessible input components
