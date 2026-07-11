import { Contact } from '../../types';
import { Button, Badge } from '../atoms';
import { Mail, Phone, Calendar, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export const ContactCard = ({ contact, onEdit, onDelete }: ContactCardProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div
      className={cn(
        'bg-white border border-gray-400 rounded-md p-5',
        'shadow-sm hover:shadow-md hover:border-sky-500 hover:-translate-y-1',
        'transition-all duration-200 cursor-pointer group'
      )}
    >
      {/* Header com nome e ícone */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-sky-600 transition-colors">
          {contact.name}
        </h3>
      </div>

      {/* Informações de contato */}
      <div className="space-y-3 mb-4">
        {contact.email && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-sky-500 flex-shrink-0" />
            <span>{contact.email}</span>
          </div>
        )}

        {contact.phone && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-sky-500 flex-shrink-0" />
            <span>{contact.phone}</span>
          </div>
        )}

        {contact.birthDate && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-sky-500 flex-shrink-0" />
            <span>{formatDate(contact.birthDate)}</span>
          </div>
        )}
      </div>

      {/* Timestamps */}
      <div className="mb-4 pb-4 border-t border-gray-400">
        <div className="flex flex-col gap-1 mt-3 text-xs text-gray-500">
          <p>Criado: {formatDate(contact.createdAt)}</p>
          {contact.updatedAt && contact.updatedAt !== contact.createdAt && (
            <p>Atualizado: {formatDate(contact.updatedAt)}</p>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="md"
          onClick={() => onEdit(contact)}
          icon={<Edit2 className="w-4 h-4" />}
          className="flex-1 text-xs"
        >
          Editar
        </Button>
        <Button
          variant="danger"
          size="md"
          onClick={() => onDelete(contact)}
          icon={<Trash2 className="w-4 h-4" />}
          className="flex-1 text-xs"
        >
          Deletar
        </Button>
      </div>
    </div>
  );
};
