import { useState, useCallback } from 'react';
import type { Contact, ContactRequest, ToastMessage } from './types';
import {
  Header,
  Footer,
  Container,
  ContactForm,
  ContactList,
  ConfirmDialog,
  ToastContainer,
} from './components';
import { useContacts } from './hooks/useContacts';
import { contactService } from './services/contactService';

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    contactId?: string;
  }>({ isOpen: false });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Listing filters state
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');

  // Fetch contacts with current filters
  const { contacts, loading, error, totalPages, totalItems, refetch } =
    useContacts(page, 10, searchQuery, fromDate, toDate, sortBy);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmitContact = useCallback(
    async (data: ContactRequest) => {
      setIsSubmitting(true);
      try {
        if (editingContact) {
          await contactService.updateContact(editingContact.id, data);
          addToast('success', 'Contact updated successfully!');
        } else {
          await contactService.createContact(data);
          addToast('success', 'Contact created successfully!');
        }
        setShowForm(false);
        setEditingContact(undefined);
        setPage(0);
        refetch();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to save contact';
        addToast('error', message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingContact, refetch]
  );

  const handleDeleteContact = (id: string) => {
    setDeleteConfirm({ isOpen: true, contactId: id });
  };

  const confirmDelete = useCallback(async () => {
    if (deleteConfirm.contactId) {
      try {
        await contactService.deleteContact(deleteConfirm.contactId);
        addToast('success', 'Contact deleted successfully!');
        setDeleteConfirm({ isOpen: false });
        refetch();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to delete contact';
        addToast('error', message);
      }
    }
  }, [deleteConfirm.contactId, refetch]);

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(0);
  }, []);

  const handleFilter = useCallback(
    (from: string | null, to: string | null) => {
      setFromDate(from);
      setToDate(to);
      setPage(0);
    },
    []
  );

  const handleSort = useCallback((newSort: 'name' | 'date') => {
    setSortBy(newSort);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header title="Personal Contact Manager" />
        <main className="flex-1 py-8">
          <Container maxWidth="2xl">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
              <p className="font-semibold">Error loading contacts</p>
              <p className="mt-2 text-sm">{error}</p>
              <button
                onClick={() => refetch()}
                className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header title="Personal Contact Manager" />

      <main className="flex-1 py-8">
        <Container maxWidth="2xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Contacts</h2>
              <p className="mt-1 text-gray-600">
                Manage your personal contact information
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingContact(undefined);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
            >
              ✚ New Contact
            </button>
          </div>

          {showForm && (
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">
                {editingContact ? 'Edit Contact' : 'Create New Contact'}
              </h3>
              <ContactForm
                initialValues={editingContact}
                onSubmit={handleSubmitContact}
                onCancel={() => {
                  setShowForm(false);
                  setEditingContact(undefined);
                }}
                isLoading={isSubmitting}
              />
            </div>
          )}

          <ContactList
            contacts={contacts}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
            isLoading={loading}
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={page}
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            onPageChange={handlePageChange}
          />
        </Container>
      </main>

      <Footer />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false })}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
