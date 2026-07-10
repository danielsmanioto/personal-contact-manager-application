import { useState, useEffect, useCallback } from 'react';
import { contactService } from '../services/contactService';
import type { Contact } from '../types';

interface UseContactsState {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
}

export function useContacts(page: number = 0, size: number = 10) {
  const [state, setState] = useState<UseContactsState>({
    contacts: [],
    loading: false,
    error: null,
  });

  const fetchContacts = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await contactService.listContacts(page, size);
      setState((prev) => ({
        ...prev,
        contacts: response.data.content,
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
  }, [page, size]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    ...state,
    refetch: fetchContacts,
  };
}
