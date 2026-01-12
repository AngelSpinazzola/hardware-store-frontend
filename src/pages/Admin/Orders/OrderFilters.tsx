import { HiSearch, HiFilter } from 'react-icons/hi';
import type { OrderStatus } from '@/types/order.types';

interface StatusOption {
  status: OrderStatus | 'all';
  count: number;
  label: string;
}

interface OrderFiltersProps {
  selectedStatus: string;
  sortBy: string;
  searchTerm: string;
  statusOptions: StatusOption[];
  onStatusChange: (status: string) => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (term: string) => void;
}

export default function OrderFilters({
  selectedStatus,
  sortBy,
  searchTerm,
  statusOptions,
  onStatusChange,
  onSortChange,
  onSearchChange
}: OrderFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      {/* Búsqueda */}
      <div className="mb-4">
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por ID, cliente, email, ciudad..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Filtro por estado */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <HiFilter className="inline w-4 h-4 mr-1" />
            Filtrar por Estado
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {statusOptions.map((option) => (
              <option key={option.status} value={option.status}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>

        {/* Ordenar */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="highest">Mayor valor</option>
            <option value="lowest">Menor valor</option>
          </select>
        </div>
      </div>

      {/* Chips de filtros activos */}
      {(selectedStatus !== 'all' || searchTerm) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedStatus !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              Estado: {statusOptions.find(o => o.status === selectedStatus)?.label}
              <button
                onClick={() => onStatusChange('all')}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              Búsqueda: "{searchTerm}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-2 text-gray-600 hover:text-gray-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}