# Data Model & Design System: Frontend Redesign

**Date**: 2026-07-11

**Scope**: Design tokens, component hierarchy, and system structure for the redesigned Personal Contact Manager UI

## Design Token Categories

### 1. Color Palette

**Primary Colors** (Magic UI inspired):
- `primary-50` to `primary-950`: Range of primary brand colors (sophisticated, modern tone)
- `accent-50` to `accent-950`: Accent colors for CTAs and highlights
- `neutral-50` to `neutral-950`: Grayscale for text, borders, backgrounds

**Semantic Colors**:
- `success-*`: Green tones for positive feedback (completion, validation)
- `warning-*`: Amber tones for caution (unverified data, unsaved changes)
- `error-*`: Red tones for errors and destructive actions
- `info-*`: Blue tones for informational messages

**Accessibility Requirements**:
- All foreground/background combinations meet WCAG 2.1 AA contrast ratios
- Color never the only means of conveying information (icon + color for status)
- Support for color-blind users via patterns/icons

### 2. Typography

**Font Family**:
- Primary: Inter or equivalent modern sans-serif (system font fallback)
- Monospace: Source Code Pro or JetBrains Mono (for data/code display)

**Type Scale**:
- `text-xs` (10px): Helper text, captions
- `text-sm` (12px): Secondary text, labels
- `text-base` (14px): Body text, regular content
- `text-lg` (16px): Emphasized body, list items
- `text-xl` (18px): Section subtitles
- `text-2xl` (20px): Page titles
- `text-3xl` (24px): Major headings
- `text-4xl` (28px): Feature headings

**Font Weights**:
- `font-normal` (400): Body text
- `font-medium` (500): Emphasized text, labels
- `font-semibold` (600): Section headings
- `font-bold` (700): Major headings

**Line Heights**:
- `leading-tight` (1.25): Headings
- `leading-normal` (1.5): Body text
- `leading-relaxed` (1.625): Long-form content

### 3. Spacing Scale

`0, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96px`

- Used for padding, margins, gaps in flexbox/grid
- Consistent rhythm ensures visual hierarchy
- Example: Component padding = 16px, section gaps = 24px

### 4. Border & Shadow

**Border Radius**:
- `rounded-none`: Sharp corners (rare)
- `rounded-sm` (2px): Subtle rounding (inputs, small components)
- `rounded-md` (4px): Standard components (buttons, cards)
- `rounded-lg` (8px): Elevated components, modals
- `rounded-xl` (12px): Feature cards, large dialogs
- `rounded-full`: Badges, avatars, pills

**Shadow System** (elevation):
- `shadow-none`: Flat surfaces
- `shadow-sm`: Subtle lift (hover states, slight emphasis)
- `shadow-md`: Standard elevation (cards at rest)
- `shadow-lg`: Elevated (modals, popovers)
- `shadow-xl`: Maximum elevation (dropdowns, tooltips)

**Border Width**:
- `border-0`: No border
- `border` (1px): Default borders (inputs, cards)
- `border-2` (2px): Emphasized borders (focus states)

### 5. Animation & Motion

**Duration Scale**:
- `duration-75` (75ms): Micro-interactions (hover, focus)
- `duration-150` (150ms): Quick feedback (button press)
- `duration-300` (300ms): Standard transitions (modal open, navigation)
- `duration-500` (500ms): Emphasized animations (page transitions)
- `duration-700` (700ms): Slow, intentional animations

**Easing Functions**:
- `easing-linear`: Status bars, progress indicators
- `easing-ease-in-out`: Most UI animations (default)
- `easing-ease-out`: Entrance animations (elements appearing)
- `easing-ease-in`: Exit animations (elements disappearing)

**Animation Library** (Framer Motion):
- Transitions: Smooth movement between states
- Variants: Reusable animation definitions
- Spring physics: Natural, bouncy feel (optional for specific components)

### 6. Breakpoints (Responsive)

- `mobile`: 0px–639px (phones, small tablets)
- `tablet`: 640px–1023px (iPads, large phones)
- `desktop`: 1024px+ (laptops, desktops)
- `xl`: 1280px+ (large monitors)

**Responsive Behavior**:
- Mobile-first: Start with mobile layout, enhance for larger screens
- Flexible containers: Use flexbox/grid for reflow
- Touch targets: Minimum 44×44px on mobile, 40×40px on desktop

## Component Hierarchy (Atomic Design)

### Atoms (Base UI Elements)

- **Button**: Primary, secondary, tertiary variants; sizes (sm, md, lg); states (default, hover, active, disabled, loading)
- **Input**: Text, email, password, number; with label, placeholder, helper text, error state
- **Select**: Dropdown with options; searchable variant
- **Checkbox**: Single checkbox with label; checked/unchecked/indeterminate
- **Radio**: Radio group with options
- **Badge**: Label with color variants (primary, success, warning, error, info)
- **Icon**: Consistent icon library (e.g., Lucide React icons)
- **Typography**: Heading (h1–h6), Paragraph, Label, Caption components
- **Divider**: Horizontal/vertical dividers with spacing
- **Tooltip**: Information on hover, accessible via aria-label

### Molecules (Composed Components)

- **Card**: Container with optional title, content, footer; elevation variants
- **SearchBar**: Input + Icon + Clear button combination
- **FormField**: Label + Input + Helper text + Error state (reusable for all inputs)
- **Avatar**: Image or initials; multiple sizes
- **Tag**: Removable label with close button
- **Alert**: Message container (success, warning, error, info) with icon
- **Modal Header**: Close button + Title for modal dialogs
- **Loading Spinner**: Animated loading indicator
- **Pagination**: Previous/Next + page numbers
- **Breadcrumb**: Navigation path (e.g., Home > Contacts > Detail)

### Organisms (Complex, Page-Level Components)

- **ContactCard**: Displays single contact summary; clickable for details
- **ContactList**: Grid/list of ContactCards with filtering, sorting, search
- **ContactForm**: Form for creating/editing contacts; validation feedback
- **ContactDetail**: Full contact view with edit/delete actions
- **AppHeader**: Navigation bar with logo, user menu, search
- **Sidebar**: Navigation menu (if needed for expanded scope)
- **Footer**: App footer with links/info
- **Modal**: Dialog wrapper for forms, confirmations, alerts
- **Toast Notification**: Temporary message for feedback

## Key Entities & Relationships

### Design System Entity

**Entity**: `DesignSystem`

Represents the collection of design tokens and component specifications.

**Attributes**:
- `version`: Semantic version (e.g., 1.0.0)
- `colorPalette`: Map of color tokens to hex values
- `typography`: Font family, size, weight, line-height definitions
- `spacing`: Pixel values for spacing scale
- `borders`: Border radius and shadow definitions
- `animations`: Duration and easing definitions
- `breakpoints`: Responsive design breakpoints

**Relationships**:
- Defines: ComponentLibrary
- Uses: ColorPalette, Typography, Spacing, AnimationLibrary

### Component Entity

**Entity**: `Component`

Represents a reusable UI component.

**Attributes**:
- `name`: Component identifier (e.g., "Button", "ContactCard")
- `atomicLevel`: Atom, Molecule, or Organism
- `variants`: Configuration options (size, color, state)
- `props`: Required and optional prop definitions
- `accessibility`: ARIA roles, keyboard navigation, screen reader support
- `storybook`: Link to component story for documentation

**Relationships**:
- Composed from: Atoms (for molecules/organisms)
- Defines: Variants
- References: DesignTokens

### Variant Entity

**Entity**: `Variant`

Represents a configuration of a component.

**Attributes**:
- `name`: Variant identifier (e.g., "primary-solid", "secondary-outline")
- `description`: Purpose and usage (e.g., "Primary action button")
- `visual`: Color, size, styling applied
- `state`: Default, hover, active, disabled, loading
- `usage`: When/where to use this variant

**Relationships**:
- Belongs to: Component
- Uses: DesignTokens (colors, spacing, typography)

## State Definitions

### Component States

- **Default**: Normal, interactive state
- **Hover**: User cursor over element (desktop)
- **Active**: User has clicked or is interacting
- **Focus**: Keyboard focus or screen reader selection (WCAG requirement)
- **Disabled**: Interaction not available; grayed out
- **Loading**: Async operation in progress; spinner or skeleton
- **Error**: Validation or operational failure; error styling
- **Success**: Positive confirmation; success styling

### Form States

- **Empty**: No data entered; placeholder text visible
- **Filled**: User has entered data
- **Error**: Validation failed; error message shown
- **Submitted**: Form submitted; loading or success state
- **Disabled**: Field interaction disabled; grayed out

## Validation & Accessibility Rules

**Color Contrast** (WCAG 2.1 AA):
- Body text on backgrounds: 4.5:1 ratio minimum
- Large text (18px+): 3:1 ratio minimum
- UI components (borders, icons): 3:1 ratio minimum

**Keyboard Navigation**:
- All interactive elements reachable via Tab key
- Focus order logical and predictable
- Tab traps prevented (users can escape with Escape key)

**Screen Reader Support**:
- Semantic HTML (button, link, form elements)
- ARIA labels for icon-only buttons
- Role attributes for custom components
- Live regions for dynamic content updates

**Touch Targets**:
- Minimum 44×44px on mobile
- Minimum 40×40px on desktop
- Adequate spacing between adjacent targets (8px minimum)

## Migration Path from Current UI

**Components to Refactor** (in priority order):
1. Button: Current → Atomic Button with variants
2. Input: Current → FormField molecule
3. Card: Current → Card atom/molecule
4. ContactCard: Existing → Redesigned using atoms/molecules
5. ContactList: Existing → Redesigned using organisms
6. ContactForm: Existing → Redesigned using form fields + validation

**Backward Compatibility**: Old components remain available during transition; new code uses redesigned components. Gradual migration as features are touched.

**Theme Application**: Design tokens centralized in Tailwind config; update once, all components reflect changes.
