interface PriceFilterProps {
    sortBy?: string;
    onSortChange?: (value: string) => void;
}

const PriceFilter = ({ 
    sortBy = 'name',
    onSortChange
}: PriceFilterProps) => {
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onSortChange) {
            onSortChange(e.target.value);
        }
    };

    return (
        <div className="flex items-center space-x-3 mb-6">
            <span className="text-sm text-gray-900  font-medium">Ordenar por:</span>
            <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--nova-accent)] focus:border-[var(--nova-accent)] transition-colors cursor-pointer hover:border-gray-400"
            >
                <option value="relevance">Más relevante</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
                <option value="name">Nombre A-Z</option>
            </select>
        </div>
    );
};

export default PriceFilter;