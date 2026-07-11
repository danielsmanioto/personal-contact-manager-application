# Component Documentation Guide

## Atomic Design Pattern

This design system uses Atomic Design to organize components into three levels:

### Atoms
Base UI elements with minimal composition:
- Button, Input, Card, Badge, Divider, Typography, Tooltip, Icon

### Molecules
Composed elements that build on atoms:
- FormField, SearchBar, Alert, LoadingSpinner, Avatar, Pagination

### Organisms
Complex, page-level components:
- ContactCard, ContactList, ContactForm, AppHeader

## Using Components

All components are exported from their respective index files:

```tsx
import { Button, Card, Badge } from '@components/atoms'
import { FormField, SearchBar, Alert } from '@components/molecules'
import { ContactCard, ContactList, ContactForm } from '@components/organisms'
```

## Design Tokens

Access design tokens via the useDesignTokens hook:

```tsx
import { useDesignTokens } from '@hooks/useDesignTokens'

function MyComponent() {
  const { colors, typography, spacing, animations } = useDesignTokens()
  // Use tokens...
}
```

## Testing Components

All components include unit tests using Vitest and React Testing Library:

```bash
npm run test                    # Run all tests
npm run test -- --watch        # Watch mode
npm run test -- --coverage     # Coverage report
```

## Storybook

View interactive component documentation in Storybook:

```bash
npm run storybook
```

## Accessibility

All components meet WCAG 2.1 Level AA standards:
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader support (aria-labels, semantic HTML)
- Color contrast ratios (4.5:1 for normal text)
- Focus indicators

## Contributing

When adding new components:

1. Create in appropriate folder (atoms/molecules/organisms)
2. Export from index.ts
3. Create Storybook stories (.stories.tsx)
4. Create unit tests (.test.tsx)
5. Ensure accessibility compliance
6. Update this documentation
