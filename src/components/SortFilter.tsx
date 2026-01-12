import React from 'react';

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'stock';

interface SortFilterProps {
    sortBy?: SortOption;
    onSortChange: (sortBy: SortOption) => void;
}

const SortFilter = ({
    sortBy = 'name',
    onSortChange
}: SortFilterProps) => {
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChange(e.target.value as SortOption);
    };

    const handleClearSortFilter = () => {
        onSortChange('name');
    };

    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 min-w-0">
                <label className="text-sm font-semibold text-gray-200 lg:text-gray-800">
                    Ordenar por:
                </label>

                <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors cursor-pointer hover:border-gray-400"
                >
                    <option value="name">Más relevante</option>
                    <option value="price-asc">Menor precio</option>
                    <option value="price-desc">Mayor precio</option>
                    <option value="stock">Mayor stock</option>
                </select>

                {sortBy !== 'name' && (
                    <button
                        onClick={handleClearSortFilter}
                        className="px-2 py-1 text-xs text-gray-200 hover:text-red-500 hover:bg-red-50 rounded transition-colors whitespace-nowrap"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default SortFilter;