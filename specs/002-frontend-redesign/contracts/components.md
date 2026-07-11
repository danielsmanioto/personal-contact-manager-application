# Component API Contract: Frontend Redesign

**Date**: 2026-07-11

**Purpose**: Define the public API contracts for reusable UI components in the redesigned frontend. This ensures consistency and enables independent component testing and documentation.

## Contract Format

Each component contract specifies:
- **Props**: Input parameters with types, defaults, and descriptions
- **Events**: Callbacks/handlers for user interactions
- **Slots/Children**: Composability (what can be passed inside)
- **Accessibility**: Required ARIA attributes and keyboard behavior
- **Variants**: Predefined configurations (size, color, state)
- **Usage Example**: Minimal code showing how to use the component

---

## Atom Components

### Button

**Purpose**: Primary interactive element for user actions.

**Props**:
```typescript
{
  children: ReactNode;              // Button text or content (REQUIRED)
  onClick?: () => void;              // Click handler
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger'; // Default: 'primary'
  size?: 'sm' | 'md' | 'lg';        // Default: 'md' (36px height)
  disabled?: boolean;                // Default: false
  loading?: boolean;                 // Shows spinner, disables interaction; Default: false
  fullWidth?: boolean;               // Fills 100% of parent width; Default: false
  type?: 'button' | 'submit' | 'reset'; // Default: 'button'
  aria-label?: string;               // Required if children are icons-only
}
```

**Variants**:
- `primary-solid`: Primary background + white text (default action)
- `primary-outline`: Outlined with primary color (secondary action)
- `secondary-solid`: Secondary background + text (less emphasis)
- `tertiary`: Minimal styling, text-only (low priority)
- `danger`: Red background (destructive action, e.g., delete)

**Accessibility**:
- Focus indicator visible on keyboard Tab
- `aria-label` required for icon-only buttons
- Disabled state indicated by `disabled` prop (prevents interaction)
- Loading state announces via aria-busy (screen reader compatible)

**Example**:
```tsx
<Button variant="primary" onClick={handleSave}>Save Contact</Button>
<Button variant="danger" size="sm" onClick={handleDelete} aria-label="Delete">🗑️</Button>
<Button variant="secondary" loading>Creating...</Button>
```

---

### Input

**Purpose**: Text input field for user data entry.

**Props**:
```typescript
{
  value: string;                    // Current value (REQUIRED, controlled component)
  onChange: (value: string) => void; // Change handler (REQUIRED)
  name?: string;                    // HTML name attribute
  type?: 'text' | 'email' | 'password' | 'tel' | 'url'; // Default: 'text'
  placeholder?: string;             // Placeholder text
  label?: string;                   // Associated label
  disabled?: boolean;               // Default: false
  error?: string;                   // Error message to display
  required?: boolean;               // Mark as required; Default: false
  aria-label?: string;              // Accessibility label
  aria-describedby?: string;        // Links to error message ID
}
```

**Accessibility**:
- Associated `<label>` element with `htmlFor` attribute
- Error message has unique `id` and linked via `aria-describedby`
- Focus indicator visible
- Screen reader announces label, placeholder, error state

**Example**:
```tsx
<Input 
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  required
/>
```

---

### Card

**Purpose**: Container for grouped content with visual elevation and padding.

**Props**:
```typescript
{
  children: ReactNode;              // Card content (REQUIRED)
  title?: string;                   // Optional header title
  elevation?: 'sm' | 'md' | 'lg';   // Shadow depth; Default: 'md'
  padding?: 'sm' | 'md' | 'lg';     // Internal padding; Default: 'md'
  onClick?: () => void;             // Optional click handler
  interactive?: boolean;            // Add hover effect if clickable; Default: false
}
```

**Variants**:
- Flat: `elevation="sm"` + minimal shadow
- Standard: `elevation="md"` + normal shadow
- Elevated: `elevation="lg"` + large shadow

**Example**:
```tsx
<Card title="Contact Information" interactive onClick={() => navigate(`/contacts/${id}`)}>
  <p>Name: John Doe</p>
  <p>Email: john@example.com</p>
</Card>
```

---

### Badge

**Purpose**: Small label for categorizing or highlighting information.

**Props**:
```typescript
{
  children: string;                 // Badge text (REQUIRED)
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info'; // Default: 'primary'
  size?: 'sm' | 'md';               // Default: 'sm'
  icon?: ReactNode;                 // Optional icon before text
}
```

**Example**:
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="error" icon={<AlertIcon />}>Urgent</Badge>
```

---

### Divider

**Purpose**: Visual separator between sections.

**Props**:
```typescript
{
  orientation?: 'horizontal' | 'vertical'; // Default: 'horizontal'
  spacing?: 'sm' | 'md' | 'lg';           // Margin around divider; Default: 'md'
}
```

**Example**:
```tsx
<Divider />
<Divider orientation="vertical" />
```

---

## Molecule Components

### FormField

**Purpose**: Composed input with label, error message, and helper text.

**Props**:
```typescript
{
  label: string;                    // Field label (REQUIRED)
  name: string;                     // Field name (REQUIRED)
  type?: 'text' | 'email' | 'password' | 'tel'; // Default: 'text'
  value: string;                    // Current value (REQUIRED)
  onChange: (value: string) => void; // Change handler (REQUIRED)
  error?: string;                   // Error message
  helperText?: string;              // Additional help text
  required?: boolean;               // Mark as required; Default: false
  disabled?: boolean;               // Default: false
  placeholder?: string;             // Placeholder text
}
```

**Behavior**:
- Renders Label → Input → HelperText (or Error if validation failed)
- Error message in red with icon
- Helper text in smaller, gray text
- Focus on input highlights label

**Example**:
```tsx
<FormField
  label="Email Address"
  name="email"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  helperText="We'll never share your email"
  required
/>
```

---

### SearchBar

**Purpose**: Input field with search icon and clear button.

**Props**:
```typescript
{
  value: string;                    // Search query (REQUIRED)
  onChange: (value: string) => void; // Change handler (REQUIRED)
  placeholder?: string;             // Default: "Search..."
  onSearch?: () => void;            // Optional handler on Enter key
  disabled?: boolean;               // Default: false
}
```

**Behavior**:
- Search icon on left
- Clear (X) button on right (visible when value is not empty)
- Pressing Enter triggers `onSearch` if provided
- Pressing Escape clears the field

**Example**:
```tsx
<SearchBar 
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search contacts..."
  onSearch={handleSearch}
/>
```

---

### Alert

**Purpose**: Notification message with icon and optional close button.

**Props**:
```typescript
{
  children: ReactNode;              // Alert message content (REQUIRED)
  variant?: 'success' | 'warning' | 'error' | 'info'; // Default: 'info'
  title?: string;                   // Optional bold title
  dismissible?: boolean;            // Show close button; Default: false
  onDismiss?: () => void;           // Close handler
  icon?: ReactNode;                 // Custom icon (uses default if omitted)
}
```

**Variants**:
- `success`: Green background, success icon ✓
- `warning`: Amber background, warning icon ⚠️
- `error`: Red background, error icon ✗
- `info`: Blue background, info icon ℹ️

**Example**:
```tsx
<Alert variant="success" title="Saved" dismissible onDismiss={() => setAlert(null)}>
  Contact information has been updated successfully.
</Alert>
```

---

## Organism Components

### ContactCard

**Purpose**: Visual representation of a single contact in a list or grid.

**Props**:
```typescript
{
  contact: {                        // Contact data (REQUIRED)
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;                // URL to avatar image
  };
  onClick?: () => void;             // Click handler (navigate to detail)
  onEdit?: () => void;              // Edit action
  onDelete?: () => void;            // Delete action
  selected?: boolean;               // Highlight selected state; Default: false
}
```

**Behavior**:
- Displays avatar (if available), name, email, phone
- Hover effect (slight elevation, color change)
- Click navigates to detail or triggers onClick
- Edit/Delete actions in optional menu

**Accessibility**:
- Card is keyboard navigable (Tab focus)
- Enter key triggers onClick
- Action buttons have aria-labels

**Example**:
```tsx
<ContactCard 
  contact={contact}
  onClick={() => navigate(`/contacts/${contact.id}`)}
  onEdit={() => setEditingId(contact.id)}
  onDelete={() => handleDelete(contact.id)}
/>
```

---

### ContactList

**Purpose**: Grid/list of contacts with filtering, sorting, and search.

**Props**:
```typescript
{
  contacts: Array<Contact>;         // Array of contacts (REQUIRED)
  loading?: boolean;                // Loading state; Default: false
  error?: string;                   // Error message
  onSearch?: (query: string) => void; // Search handler
  onSelect?: (contact: Contact) => void; // Selection handler
  onEdit?: (contact: Contact) => void;   // Edit handler
  onDelete?: (contactId: string) => void; // Delete handler
  viewMode?: 'grid' | 'list';       // Default: 'grid'
}
```

**Behavior**:
- Renders ContactCard for each contact
- Grid layout on desktop, list on mobile
- Search bar filters contacts
- Loading spinner during async operations
- Empty state message if no contacts

**Example**:
```tsx
<ContactList 
  contacts={contacts}
  loading={isLoading}
  onSearch={handleSearch}
  onSelect={(contact) => navigate(`/contacts/${contact.id}`)}
  viewMode="grid"
/>
```

---

### ContactForm

**Purpose**: Form for creating or editing a contact.

**Props**:
```typescript
{
  initialValues?: {                 // Pre-fill form (edit mode)
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
  };
  onSubmit: (data: FormData) => Promise<void>; // Submit handler (REQUIRED)
  onCancel?: () => void;            // Cancel button handler
  isLoading?: boolean;              // Disable during submission; Default: false
}
```

**Behavior**:
- FormField components for each input
- Submit button triggers validation, then `onSubmit`
- Cancel button (if `onCancel` provided)
- Error messages displayed per-field
- Success message after submission

**Accessibility**:
- Form title announced
- Required fields marked
- Errors linked to fields via aria-describedby

**Example**:
```tsx
<ContactForm
  initialValues={editingContact}
  onSubmit={handleSave}
  onCancel={() => setEditingMode(false)}
/>
```

---

## Design Token Contract

**Color Tokens** (defined in Tailwind config):
```typescript
colors: {
  primary: { 50, 100, 200, ..., 950 },    // Brand colors
  accent: { 50, 100, 200, ..., 950 },    // Accent colors
  neutral: { 50, 100, 200, ..., 950 },   // Grayscale
  success: { light, DEFAULT, dark },     // Green semantic
  warning: { light, DEFAULT, dark },     // Amber semantic
  error: { light, DEFAULT, dark },       // Red semantic
  info: { light, DEFAULT, dark },        // Blue semantic
}
```

**Typography Tokens**:
```typescript
fontSize: {
  xs: '10px',   // Helper text, captions
  sm: '12px',   // Labels
  base: '14px', // Body text
  lg: '16px',   // Emphasized body
  xl: '18px',   // Subtitles
  '2xl': '20px', // Section titles
  '3xl': '24px', // Page titles
  '4xl': '28px', // Feature headings
}

fontWeight: {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}
```

**Spacing Tokens**:
```typescript
spacing: { 0, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96 }
```

**Breakpoints**:
```typescript
screens: {
  mobile: '0px',      // 375px–639px
  tablet: '640px',    // 640px–1023px
  desktop: '1024px',  // 1024px–1279px
  xl: '1280px',       // 1280px+
}
```

---

## Contract Validation

**Contract Compliance Check**:
1. All required props must be handled
2. Props must match TypeScript types exactly
3. Accessibility requirements (aria-labels, focus indicators) must be implemented
4. Variants must match specification
5. Components must render without console errors or warnings

**Test Coverage**:
- Each component has unit tests covering all props
- Each variant has visual regression snapshots
- Accessibility tests (axe-core) run on components
- Integration tests verify component composition

---

## Contract Evolution

**Breaking Changes** (require MAJOR version bump):
- Remove a prop
- Change prop type significantly
- Remove a variant
- Change accessibility behavior

**Non-Breaking Changes** (MINOR version bump):
- Add optional prop
- Add new variant
- Enhance accessibility
- Improve performance

**Patches** (PATCH version bump):
- Bug fixes
- Documentation updates
- Visual refinements

Consumers must be notified of breaking changes via CHANGELOG and migration guide.

---

## References

- Component implementation: `frontend/src/components/`
- Storybook documentation: `npm run storybook`
- Design tokens: `frontend/tailwind.config.ts`
- Type definitions: `frontend/src/types/`
