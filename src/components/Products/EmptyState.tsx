interface EmptyStateProps {
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

const EmptyState = ({ hasActiveFilters, onClearFilters }: EmptyStateProps) => (
    <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
        <h3 className="text-xl font-light text-gray-900 mb-2">Sin resultados</h3>
        <p className="text-gray-600 mb-6">No encontramos productos con estos filtros</p>
        {hasActiveFilters && (
            <button
                onClick={onClearFilters}
                className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
                Limpiar filtros
            </button>
        )}
    </div>
);

export default EmptyState;