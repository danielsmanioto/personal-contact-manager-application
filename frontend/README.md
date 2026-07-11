# Personal Contact Manager - Frontend

Modern React 18 frontend with TypeScript, Tailwind CSS, and Magic UI inspired design system.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Development

### Running Tests
```bash
npm run test              # Unit tests
npm run test:visual       # Visual regression tests
npm run test:a11y         # Accessibility tests
npm run test -- --coverage  # Coverage report
```

### Running Storybook
```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006)

### Linting & Formatting
```bash
npm run lint
npm run format
```

## Project Structure

```
src/
├── components/
│   ├── atoms/         # Base UI elements
│   ├── molecules/     # Composed components
│   ├── organisms/     # Page-level components
│   └── layouts/       # Page layouts
├── design-tokens/     # Colors, typography, spacing
├── styles/           # Global styles
├── utils/            # Helper functions
└── hooks/            # Custom React hooks
```

## Design System

See Storybook for complete component documentation and design token guide.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

WCAG 2.1 Level AA compliant. All interactive elements are keyboard navigable and screen reader compatible.
