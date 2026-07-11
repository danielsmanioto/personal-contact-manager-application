import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from '../../src/App';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as any;

describe('Create Contact - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for getting contacts
    mockedAxios.create.mockReturnValue(mockedAxios);
    mockedAxios.get.mockResolvedValue({
      data: { content: [], pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0 },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a contact end-to-end when form is submitted', async () => {
    const user = userEvent.setup();

    // Mock successful contact creation
    mockedAxios.post.mockResolvedValue({
      status: 201,
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'João Silva',
        email: 'joao@example.com',
        phone: null,
        birthDate: null,
        createdAt: '2026-07-11T14:30:00Z',
        updatedAt: '2026-07-11T14:30:00Z',
      },
    });

    // Mock updated contacts list after creation
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        content: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'João Silva',
            email: 'joao@example.com',
            phone: null,
            birthDate: null,
            createdAt: '2026-07-11T14:30:00Z',
            updatedAt: '2026-07-11T14:30:00Z',
          },
        ],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 1,
        totalPages: 1,
      },
    });

    render(<App />);

    // Click "New Contact" button
    const newContactButton = screen.getByRole('button', { name: /✚ New Contact/i });
    await user.click(newContactButton);

    // Wait for form to appear
    const nameInput = await screen.findByLabelText(/Nome Completo/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

    // Fill form
    await user.type(nameInput, 'João Silva');
    await user.type(emailInput, 'joao@example.com');

    // Submit
    await user.click(submitButton);

    // Verify success toast appears
    await waitFor(() => {
      expect(screen.getByText(/Contact created successfully/i)).toBeInTheDocument();
    });

    // Verify contact appears in list
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('joao@example.com')).toBeInTheDocument();
    });
  });

  it('should handle 500 error when creating contact fails', async () => {
    const user = userEvent.setup();

    // Mock API error
    mockedAxios.post.mockRejectedValue({
      response: {
        status: 500,
        data: { message: 'Internal Server Error' },
      },
    });

    render(<App />);

    // Click "New Contact" button and fill form
    const newContactButton = screen.getByRole('button', { name: /✚ New Contact/i });
    await user.click(newContactButton);

    const nameInput = await screen.findByLabelText(/Nome Completo/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    // Verify error toast appears
    await waitFor(() => {
      expect(screen.getByText(/Failed to save contact|Internal Server Error/i)).toBeInTheDocument();
    });

    // Verify form remains open for retry
    expect(submitButton).toBeInTheDocument();
  });

  it('should handle 409 duplicate email error', async () => {
    const user = userEvent.setup();

    // Mock 409 error for duplicate email
    mockedAxios.post.mockRejectedValue({
      response: {
        status: 409,
        data: { message: 'Email already exists' },
      },
    });

    render(<App />);

    // Open form and try to create contact
    const newContactButton = screen.getByRole('button', { name: /✚ New Contact/i });
    await user.click(newContactButton);

    const nameInput = await screen.findByLabelText(/Nome Completo/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

    await user.type(nameInput, 'Duplicate User');
    await user.type(emailInput, 'existing@example.com');
    await user.click(submitButton);

    // Verify duplicate email error message
    await waitFor(() => {
      expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
    });

    // Form should remain open
    expect(submitButton).toBeInTheDocument();
  });

  it('should allow retrying after error', async () => {
    const user = userEvent.setup();

    // First call fails, second succeeds
    mockedAxios.post
      .mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: 'Server Error' },
        },
      })
      .mockResolvedValueOnce({
        status: 201,
        data: {
          id: 'new-id',
          name: 'Retry Test',
          email: 'retry@example.com',
          phone: null,
          birthDate: null,
          createdAt: '2026-07-11T14:30:00Z',
          updatedAt: '2026-07-11T14:30:00Z',
        },
      });

    render(<App />);

    // Open form and attempt submission
    const newContactButton = screen.getByRole('button', { name: /✚ New Contact/i });
    await user.click(newContactButton);

    const nameInput = await screen.findByLabelText(/Nome Completo/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

    await user.type(nameInput, 'Retry Test');
    await user.type(emailInput, 'retry@example.com');

    // First submission fails
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to save contact|Server Error/i)).toBeInTheDocument();
    });

    // Clear form and retry
    await user.clear(nameInput);
    await user.clear(emailInput);
    await user.type(nameInput, 'Retry Test');
    await user.type(emailInput, 'retry@example.com');

    // Second submission succeeds
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        content: [
          {
            id: 'new-id',
            name: 'Retry Test',
            email: 'retry@example.com',
            phone: null,
            birthDate: null,
            createdAt: '2026-07-11T14:30:00Z',
            updatedAt: '2026-07-11T14:30:00Z',
          },
        ],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 1,
        totalPages: 1,
      },
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Contact created successfully/i)).toBeInTheDocument();
    });
  });

  it('should handle 400 validation error from server', async () => {
    const user = userEvent.setup();

    // Mock 400 error
    mockedAxios.post.mockRejectedValue({
      response: {
        status: 400,
        data: {
          message: 'Validation failed',
          errors: {
            email: 'Please enter a valid email address',
            name: 'Name must not exceed 255 characters',
          },
        },
      },
    });

    render(<App />);

    const newContactButton = screen.getByRole('button', { name: /✚ New Contact/i });
    await user.click(newContactButton);

    const nameInput = await screen.findByLabelText(/Nome Completo/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

    await user.type(nameInput, 'Test');
    await user.type(emailInput, 'invalid');
    await user.click(submitButton);

    // Verify validation error is displayed
    await waitFor(() => {
      expect(screen.getByText(/Validation failed|Invalid data provided/i)).toBeInTheDocument();
    });
  });
});
