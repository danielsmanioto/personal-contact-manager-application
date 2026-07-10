interface SortOptionsProps {
  sortBy: 'name' | 'date';
  onSort: (sortBy: 'name' | 'date') => void;
}

export default function SortOptions({ sortBy, onSort }: SortOptionsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Sort by:</span>
      <div className="flex gap-2">
        <button
          onClick={() => onSort('name')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            sortBy === 'name'
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Name (A-Z)
        </button>
        <button
          onClick={() => onSort('date')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            sortBy === 'date'
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Date (Newest)
        </button>
      </div>
    </div>
  );
}
