import { useState } from 'react';
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

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      birthDate: '1990-01-01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    contactId?: string;
  }>({ isOpen: false });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmitContact = async (data: ContactRequest) => {
    setIsLoading(true);
    try {
      if (editingContact) {
        setContacts((prev) =>
          prev.map((c) =>
            c.id === editingContact.id
              ? {
                  ...c,
                  ...data,
                  updatedAt: new Date().toISOString(),
                }
              : c
          )
        );
        addToast('success', 'Contact updated successfully!');
      } else {
        const newContact: Contact = {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setContacts((prev) => [...prev, newContact]);
        addToast('success', 'Contact created successfully!');
      }
      setShowForm(false);
      setEditingContact(undefined);
    } catch {
      addToast('error', 'Failed to save contact');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = (id: string) => {
    setDeleteConfirm({ isOpen: true, contactId: id });
  };

  const confirmDelete = () => {
    if (deleteConfirm.contactId) {
      setContacts((prev) =>
        prev.filter((c) => c.id !== deleteConfirm.contactId)
      );
      addToast('success', 'Contact deleted successfully!');
      setDeleteConfirm({ isOpen: false });
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

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
                isLoading={isLoading}
              />
            </div>
          )}

          <ContactList
            contacts={contacts}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
            isLoading={false}
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
