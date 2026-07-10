import type { Contact } from '../../types';
import ContactCard from '../ContactCard/ContactCard';
import Empty from '../Common/Empty';
import Spinner from '../Common/Spinner';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function ContactList({
  contacts,
  onEdit: _onEdit,
  onDelete: _onDelete,
  isLoading = false,
}: ContactListProps) {
  const onEdit = _onEdit;
  const onDelete = _onDelete;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <Empty
        title="No contacts found"
        message="Start by creating your first contact or searching for existing ones."
        icon="📋"
      />
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
