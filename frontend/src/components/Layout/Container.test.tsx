import { render, screen } from '@testing-library/react';
import Container from './Container';
import { describe, it, expect } from 'vitest';

describe('Container', () => {
  it('renders children', () => {
    render(
      <Container maxWidth="2xl">
        <div>Test Content</div>
      </Container>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default max width', () => {
    const { container } = render(
      <Container maxWidth="2xl">
        <div>Test</div>
      </Container>
    );
    const div = container.querySelector('.max-w-2xl');
    expect(div).toBeInTheDocument();
  });

  it('renders with different max widths', () => {
    const { container: container1 } = render(
      <Container maxWidth="xl">
        <div>Test</div>
      </Container>
    );
    const div1 = container1.querySelector('.max-w-xl');
    expect(div1).toBeInTheDocument();

    const { container: container2 } = render(
      <Container maxWidth="full">
        <div>Test</div>
      </Container>
    );
    const div2 = container2.querySelector('.max-w-full');
    expect(div2).toBeInTheDocument();
  });
});
