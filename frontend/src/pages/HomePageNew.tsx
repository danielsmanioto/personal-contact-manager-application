import { useState, useEffect } from 'react';
import { Button, Badge } from '../components/atoms';
import { Header } from '../components/organisms/HeaderNew';
import { ContactCard } from '../components/organisms/ContactCardNew';
import { Search, Plus, Filter } from 'lucide-react';
import { Contact } from '../types';
import { cn } from '../utils/cn';

export const HomePageNew = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with API call
  useEffect(() => {
    const mockContacts: Contact[] = [
      {
        id: '1',
        name: 'João da Silva',
        email: 'joao@example.com',
        phone: '(11) 98765-4321',
        birthDate: '1990-01-15',
        createdAt: '2026-07-09T10:00:00Z',
        updatedAt: '2026-07-09T10:00:00Z',
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@example.com',
        phone: '(21) 98765-1234',
        birthDate: '1995-03-22',
        createdAt: '2026-07-08T15:30:00Z',
        updatedAt: '2026-07-08T15:30:00Z',
      },
      {
        id: '3',
        name: 'Pedro Oliveira',
        email: 'pedro@example.com',
        phone: '(31) 99999-8888',
        birthDate: '1988-06-10',
        createdAt: '2026-07-07T09:15:00Z',
        updatedAt: '2026-07-07T09:15:00Z',
      },
    ];
    setContacts(mockContacts);
  }, []);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (contact: Contact) => {
    console.log('Editing:', contact);
  };

  const handleDelete = (contact: Contact) => {
    if (confirm(`Tem certeza que deseja deletar ${contact.name}?`)) {
      setContacts(contacts.filter((c) => c.id !== contact.id));
    }
  };

  const handleNewContact = () => {
    console.log('Create new contact');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border border-gray-400">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta! 👋</h2>
          <p className="text-gray-600 mb-6">
            Você tem{' '}
            <span className="font-semibold text-sky-600">{contacts.length} contatos</span> salvos.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  'w-full pl-10 pr-4 py-3 rounded-md border transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-sky-500',
                  'border-gray-400 focus:border-sky-500'
                )}
              />
            </div>

            <Button
              variant="ghost"
              size="md"
              icon={<Filter className="w-4 h-4" />}
              className="flex-1 sm:flex-none"
            >
              Filtrar
            </Button>

            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleNewContact}
              className="flex-1 sm:flex-none"
              isLoading={isLoading}
            >
              Novo Contato
            </Button>
          </div>

          {/* Resultados */}
          {filteredContacts.length > 0 && (
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-semibold">{filteredContacts.length}</span> de{' '}
              <span className="font-semibold">{contacts.length}</span> contatos
            </p>
          )}
        </div>

        {/* Contacts Grid */}
        {filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-400">
            <div className="mb-4 text-6xl">📭</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Nenhum contato encontrado</h3>
            <p className="text-gray-600 mb-6">
              {contacts.length === 0
                ? 'Crie seu primeiro contato para começar'
                : `Nenhum contato corresponde a "${searchTerm}"`}
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleNewContact}
              icon={<Plus className="w-4 h-4" />}
            >
              Criar Primeiro Contato
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-400 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            <strong>Personal Contact Manager</strong> © 2026 | Todos os contatos salvos com segurança
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="info">React 18</Badge>
            <Badge variant="primary">TypeScript</Badge>
            <Badge variant="success">Tailwind CSS</Badge>
          </div>
        </div>
      </footer>
    </div>
  );
};
