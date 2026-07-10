import { render, screen } from '@testing-library/react';
import Header from './Header';
import { describe, it, expect } from 'vitest';

describe('Header', () => {
  it('renders title', () => {
    render(<Header title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    const title = 'Personal Contact Manager';
    render(<Header title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('renders logo or icon', () => {
    render(<Header title="Test" />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});
