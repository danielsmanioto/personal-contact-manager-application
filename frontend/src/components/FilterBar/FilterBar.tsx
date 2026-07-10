import { useState } from 'react';

interface FilterBarProps {
  onFilter: (fromDate: string | null, toDate: string | null) => void;
  onClearFilters: () => void;
}

export default function FilterBar({ onFilter, onClearFilters }: FilterBarProps) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    onFilter(fromDate || null, toDate || null);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFromDate('');
    setToDate('');
    onClearFilters();
  };

  const hasFilters = fromDate || toDate;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 border transition-colors ${
          hasFilters
            ? 'border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filter by Date
        {hasFilters && <span className="ml-1 font-semibold">●</span>}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 rounded-lg border border-gray-300 bg-white p-4 shadow-lg z-10">
          <h3 className="mb-4 font-semibold text-gray-900">Birth Date Range</h3>

          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="from-date" className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <input
                id="from-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="to-date" className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                id="to-date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors font-medium"
            >
              Apply
            </button>
            <button
              onClick={handleClear}
              className="flex-1 rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
