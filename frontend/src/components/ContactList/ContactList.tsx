import { useState, useCallback } from 'react';
import type { Contact } from '../../types';
import ContactCard from '../ContactCard/ContactCard';
import Empty from '../Common/Empty';
import Spinner from '../Common/Spinner';
import SearchBar from '../SearchBar/SearchBar';
import FilterBar from '../FilterBar/FilterBar';
import SortOptions from '../SortOptions/SortOptions';
import Pagination from '../Pagination/Pagination';

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
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="space-y-4">
        <SearchBar onSearch={handleSearch} />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterBar
            onFilter={handleFilter}
            onClearFilters={handleClearFilters}
          />
          <SortOptions sortBy={sortBy} onSort={handleSort} />
        </div>
      </div>

      {/* Contacts Grid */}
      {contacts.length === 0 ? (
        <Empty
          title={
            hasActiveFilters ? 'No contacts match your filters' : 'No contacts found'
          }
          message={
            hasActiveFilters
              ? 'Try adjusting your search or filter criteria.'
              : 'Start by creating your first contact or searching for existing ones.'
          }
          icon="📋"
        />
      ) : (
        <>
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

          {isLoading && (
            <div className="flex justify-center py-4">
              <Spinner size="sm" />
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {contacts.length > 0 && totalPages > 1 && (
        <div className="mt-8 border-t border-gray-200 pt-6">
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
