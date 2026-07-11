# Deployment Checklist

Before deploying to production, verify:

## Code Quality
- [ ] All tests pass: `npm run test`
- [ ] TypeScript strict mode passes: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] No console errors or warnings

## Performance
- [ ] Initial load time <3 seconds
- [ ] Bundle size optimized (check via vite build)
- [ ] Images optimized and lazy-loaded
- [ ] No memory leaks

## Accessibility
- [ ] WCAG 2.1 Level AA compliant
- [ ] No accessibility violations in Lighthouse audit
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

## Browser Compatibility
- [ ] Tested on Chrome 90+
- [ ] Tested on Firefox 88+
- [ ] Tested on Safari 14+
- [ ] Tested on Edge 90+

## Documentation
- [ ] README updated
- [ ] Storybook builds without errors
- [ ] Component documentation complete
- [ ] API documentation current

## Testing
- [ ] Unit tests pass (80%+ coverage)
- [ ] Visual regression tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)

## Deployment Steps

1. Update version in package.json
2. Create git tag: `git tag v1.x.x`
3. Push to main: `git push origin main`
4. Run build: `npm run build`
5. Deploy to hosting

## Rollback

If issues occur in production:

1. Identify the issue
2. Create a hotfix branch
3. Test thoroughly
4. Deploy hotfix
5. Patch version (1.x.x)
