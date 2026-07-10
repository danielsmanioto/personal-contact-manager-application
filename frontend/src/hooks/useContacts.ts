import { useState, useEffect, useCallback, useRef } from 'react';
import { contactService } from '../services/contactService';
import type { Contact, PaginatedResponse } from '../types';

interface UseContactsState {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalItems: number;
}

export function useContacts(
  page: number = 0,
  size: number = 10,
  searchQuery: string = '',
  fromDate: string | null = null,
  toDate: string | null = null,
  sortBy: 'name' | 'date' = 'name'
) {
  const [state, setState] = useState<UseContactsState>({
    contacts: [],
    loading: false,
    error: null,
    totalPages: 1,
    totalItems: 0,
  });

  const prevParamsRef = useRef<string>('');

  const fetchContacts = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      let response: { data: PaginatedResponse<Contact> };

      if (searchQuery) {
        response = await contactService.searchContacts(searchQuery, page, size);
      } else if (fromDate || toDate) {
        response = await contactService.filterByDateRange(
          fromDate || '',
          toDate || '',
          page,
          size
        );
      } else {
        response = await contactService.sortContacts(sortBy, page, size);
      }

      setState((prev) => ({
        ...prev,
        contacts: response.data.content,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalElements,
        loading: false,
      }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch contacts';
      setState((prev) => ({
        ...prev,
        error: message,
        loading: false,
      }));
    }
  }, [page, size, searchQuery, fromDate, toDate, sortBy]);

  useEffect(() => {
    const currentParams = JSON.stringify({
      page,
      size,
      searchQuery,
      fromDate,
      toDate,
      sortBy,
    });

    if (currentParams !== prevParamsRef.current) {
      prevParamsRef.current = currentParams;
      fetchContacts();
    }
  }, [page, size, searchQuery, fromDate, toDate, sortBy, fetchContacts]);

  return {
    ...state,
    refetch: fetchContacts,
  };
}
