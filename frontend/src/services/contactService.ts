import api from './api';
import type { Contact, ContactRequest, PaginatedResponse } from '../types';

export const contactService = {
  listContacts: (page = 0, size = 10) =>
    api.get<PaginatedResponse<Contact>>('/contacts', {
      params: { page, size },
    }),

  getContact: (id: string) => api.get<Contact>(`/contacts/${id}`),

  createContact: (data: ContactRequest) => api.post<Contact>('/contacts', data),

  updateContact: (id: string, data: ContactRequest) =>
    api.put<Contact>(`/contacts/${id}`, data),

  deleteContact: (id: string) => api.delete(`/contacts/${id}`),

  searchContacts: (q: string, page = 0, size = 10) =>
    api.get<PaginatedResponse<Contact>>('/contacts/search', {
      params: { q, page, size },
    }),
};
