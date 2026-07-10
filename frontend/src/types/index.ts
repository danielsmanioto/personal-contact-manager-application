export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface ErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string>;
  timestamp: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
