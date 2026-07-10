import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { describe, it, expect } from 'vitest';

describe('Footer', () => {
  it('renders footer', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('renders copyright year', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(new Date().getFullYear().toString()))).toBeInTheDocument();
  });
});
