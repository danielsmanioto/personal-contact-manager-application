import type { Contact } from '../../types';
import Button from '../Common/Button';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export default function ContactCard({
  contact,
  onEdit: _onEdit,
  onDelete: _onDelete,
}: ContactCardProps) {
  const onEdit = _onEdit;
  const onDelete = _onDelete;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow hover:shadow-md transition-shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <dt className="text-gray-600">Email:</dt>
            <dd className="text-gray-900 break-all">
              <a
                href={`mailto:${contact.email}`}
                className="text-blue-600 hover:underline"
              >
                {contact.email}
              </a>
            </dd>
          </div>

          {contact.phone && (
            <div className="flex items-center gap-2">
              <dt className="text-gray-600">Phone:</dt>
              <dd className="text-gray-900">
                <a
                  href={`tel:${contact.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact.phone}
                </a>
              </dd>
            </div>
          )}

          {contact.birthDate && (
            <div className="flex items-center gap-2">
              <dt className="text-gray-600">Birth Date:</dt>
              <dd className="text-gray-900">{formatDate(contact.birthDate)}</dd>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <dt className="text-gray-600">Created:</dt>
            <dd className="text-gray-900 text-xs">
              {formatDate(contact.createdAt)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(contact)}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(contact.id)}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
