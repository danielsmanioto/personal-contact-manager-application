# Accessibility Standards

All components must meet WCAG 2.1 Level AA compliance.

## Checklist

- [ ] Color contrast: 4.5:1 for normal text, 3:1 for large text (18px+)
- [ ] Keyboard navigation: All interactive elements reachable via Tab
- [ ] Focus indicators: Visible 2px outline
- [ ] Labels: All form inputs have associated labels
- [ ] ARIA: Appropriate roles, states, and properties
- [ ] Semantic HTML: Use proper elements (button, link, form, etc.)
- [ ] Screen reader: Text alternatives for images/icons
- [ ] Motion: Respect prefers-reduced-motion preference

## Testing

```bash
npm run test:a11y
```

Uses axe-core for automated accessibility scanning.
