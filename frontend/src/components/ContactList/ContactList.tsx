import { useState, useCallback } from 'react';
import type { Contact } from '../../types';
import { Spinner } from '../atoms';
import SearchBar from '../SearchBar/SearchBar';
import FilterBar from '../FilterBar/FilterBar';
import SortOptions from '../SortOptions/SortOptions';
import Pagination from '../Pagination/Pagination';
import ContactCard from '../ContactCard/ContactCard';
import { cn } from '../../utils/cn';
import { Search, Filter } from 'lucide-react';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  onSearch?: (query: string) => void;
  onFilter?: (fromDate: string | null, toDate: string | null) => void;
  onSort?: (sortBy: 'name' | 'date') => void;
  onPageChange?: (page: number) => void;
}

export default function ContactList({
  contacts,
  onEdit,
  onDelete,
  isLoading = false,
  totalItems = 0,
  totalPages = 1,
  currentPage = 0,
  onSearch,
  onFilter,
  onSort,
  onPageChange,
}: ContactListProps) {
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const handleSearch = useCallback(
    (query: string) => {
      onSearch?.(query);
    },
    [onSearch]
  );

  const handleFilter = useCallback(
    (fromDate: string | null, toDate: string | null) => {
      setHasActiveFilters(Boolean(fromDate || toDate));
      onFilter?.(fromDate, toDate);
    },
    [onFilter]
  );

  const handleClearFilters = useCallback(() => {
    setHasActiveFilters(false);
    onFilter?.(null, null);
  }, [onFilter]);

  const handleSort = useCallback(
    (newSortBy: 'name' | 'date') => {
      setSortBy(newSortBy);
      onSort?.(newSortBy);
    },
    [onSort]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      onPageChange?.(page);
    },
    [onPageChange]
  );

  if (isLoading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Carregando contatos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter & Search Section */}
      <div className="bg-white rounded-md shadow-sm border border-gray-400 p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />

          {/* Filter & Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex gap-2 items-center">
              <Filter className="w-4 h-4 text-gray-600" />
              <FilterBar
                onFilter={handleFilter}
                onClearFilters={handleClearFilters}
              />
            </div>
            <SortOptions sortBy={sortBy} onSort={handleSort} />
          </div>

          {/* Active Filters Badge */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-400">
              <span className="text-sm text-gray-600">Filtros ativos:</span>
              <button
                onClick={handleClearFilters}
                className="text-xs bg-sky-100 text-sky-600 px-3 py-1 rounded-full hover:bg-sky-200 transition-colors"
              >
                ✕ Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contacts Count */}
      {contacts.length > 0 && (
        <div className="text-sm text-gray-600 px-2">
          Mostrando <span className="font-semibold text-sky-600">{contacts.length}</span> de{' '}
          <span className="font-semibold text-gray-900">{totalItems}</span> contatos
        </div>
      )}

      {/* Empty State */}
      {contacts.length === 0 ? (
        <div className="bg-white rounded-md shadow-sm border border-gray-400 p-12 text-center">
          <div className="mb-4 text-6xl">
            {hasActiveFilters ? '🔍' : '📭'}
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            {hasActiveFilters ? 'Nenhum contato encontrado' : 'Nenhum contato ainda'}
          </h3>
          <p className="text-gray-600 mb-6">
            {hasActiveFilters
              ? 'Tente ajustar seus critérios de busca ou filtro.'
              : 'Crie seu primeiro contato para começar a organizar seus relacionamentos.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-block px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors font-medium text-sm"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Contacts Grid - Responsive Layout */}
          <div className={cn(
            'grid gap-6',
            'grid-cols-1',
            'sm:grid-cols-2',
            'lg:grid-cols-3'
          )}>
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-3">
                <Spinner size="sm" />
                <span className="text-sm text-gray-600">Carregando mais...</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {contacts.length > 0 && totalPages > 1 && (
        <div className="mt-8 border-t border-gray-400 pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={10}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
