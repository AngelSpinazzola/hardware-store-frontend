interface FiltersObject {
    hasActiveFilters: boolean;
    selectedCategory: string;
    selectedSubcategory: string;
    selectedBrand: string;
    selectedSubcategoryBrand: string;
    minPrice: number | null;
    maxPrice: number | null;
    searchTerm: string;
    sortBy: string;
    setSelectedSubcategory: (value: string) => void;
    setSelectedSubcategoryBrand: (value: string) => void;
    setSelectedBrand: (value: string) => void;
    setSearchTerm: (value: string) => void;
    setSortBy: (value: string) => void;
    handlePriceChange: (min: number | null, max: number | null) => void;
}

interface FilterBreadcrumbsProps {
    filters: FiltersObject;
    getSelectedSubcategoryName: () => string;
    onResetFilters: () => void;
}

const FilterBreadcrumbs = ({ filters, getSelectedSubcategoryName, onResetFilters }: FilterBreadcrumbsProps) => {
    if (!filters.hasActiveFilters) {
        return null;
    }

    const handleRemoveCategory = () => {
        onResetFilters();
    };

    const handleRemoveSubcategory = () => {
        filters.setSelectedSubcategory('');
        filters.setSelectedSubcategoryBrand('');
        if (!filters.selectedCategory) {
            onResetFilters();
        }
    };

    const handleRemoveSubcategoryBrand = () => {
        filters.setSelectedSubcategoryBrand('');
    };

    const handleRemoveSearch = () => {
        filters.setSearchTerm('');
    };

    const handleRemoveSort = () => {
        filters.setSortBy('name');
    };

    const handleRemovePriceRange = () => {
        filters.handlePriceChange(null, null);
    };

    const getSortLabel = (sortBy: string): string => {
        switch (sortBy) {
            case 'price-asc': return 'Precio ↑';
            case 'price-desc': return 'Precio ↓';
            case 'stock': return 'Stock ↓';
            default: return sortBy;
        }
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getPriceRangeLabel = (): string => {
        if (filters.minPrice && filters.maxPrice) {
            return `${formatPrice(filters.minPrice)} - ${formatPrice(filters.maxPrice)}`;
        } else if (filters.minPrice) {
            return `Desde ${formatPrice(filters.minPrice)}`;
        } else if (filters.maxPrice) {
            return `Hasta ${formatPrice(filters.maxPrice)}`;
        }
        return '';
    };

    return (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-600 font-medium text-sm">Filtros:</span>

            {filters.selectedCategory && (
                <span className="inline-flex items-center px-2 py-2 bg-white border border-orange-400 text-orange-400 rounded-full font-semibold shadow-sm hover:shadow-md transition-shadow capitalize text-xs">
                    {filters.selectedCategory}
                    <button
                        onClick={handleRemoveCategory}
                        className="ml-1 w-4 h-4 flex items-center justify-center bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full text-xs transition-all duration-200 border border-orange-300"
                        aria-label="Remover filtro de categoría"
                    >
                        ×
                    </button>
                </span>
            )}

            {filters.selectedSubcategory && (
                <span className="inline-flex items-center px-2 py-2 bg-white border border-orange-400 text-orange-400 rounded-full font-semibold shadow-sm hover:shadow-md transition-shadow text-xs">
                    {getSelectedSubcategoryName()}
                    <button
                        onClick={handleRemoveSubcategory}
                        className="ml-1 w-4 h-4 flex items-center justify-center bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full text-xs transition-all duration-200 border border-orange-300"
                        aria-label="Remover filtro de subcategoría"
                    >
                        ×
                    </button>
                </span>
            )}

            {filters.selectedBrand && (
                <span className="inline-flex items-center px-2 py-2 bg-white border border-orange-400 text-orange-400 rounded-full font-semibold shadow-sm hover:shadow-md transition-shadow text-xs">
                    Marca: {filters.selectedBrand}
                    <button
                        onClick={() => filters.setSelectedBrand('')}
                        className="ml-1 w-4 h-4 flex items-center justify-center bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full text-xs transition-all duration-200 border border-orange-300"
                        aria-label="Remover filtro de marca"
                    >
                        ×
                    </button>
                </span>
            )}

            {filters.selectedSubcategoryBrand && (
                <span className="inline-flex items-center px-2 py-2 bg-white border border-orange-400 text-orange-400 rounded-full font-semibold shadow-sm hover:shadow-md transition-shadow text-xs">
                    Marca: {filters.selectedSubcategoryBrand}
                    <button
                        onClick={handleRemoveSubcategoryBrand}
                        className="ml-1 w-4 h-4 flex items-center justify-center bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full text-xs transition-all duration-200 border border-orange-300"
                        aria-label="Remover filtro de marca"
                    >
                        ×
                    </button>
                </span>
            )}

            {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center px-2 py-2 bg-white border border-orange-400 text-orange-400 rounded-full font-semibold shadow-sm hover:shadow-md transition-shadow text-xs">
                    {getPriceRangeLabel()}
                    <button
                        onClick={handleRemovePriceRange}
                        className="ml-1 w-4 h-4 flex items-center justify-center bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full text-xs transition-all duration-200 border border-orange-300"
                        aria-label="Remover filtro de precio"
                    >
                        ×
                    </button>
                </span>
            )}

            {filters.searchTerm && (
                <span className="inline-flex items-center px-2 py-2 bg-white border border-orange-400 text-orange-400 rounded-full font-semibold shadow-sm hover:shadow-md transition-shadow text-xs">
                    "{filters.searchTerm}"
                    <button
                        onClick={handleRemoveSearch}
                        className="ml-1 w-4 h-4 flex items-center justify-center bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full text-xs transition-all duration-200 border border-orange-300"
                        aria-label="Remover filtro de búsqueda"
                    >
                        ×
                    </button>
                </span>
            )}

            {filters.sortBy !== 'name' && (
                <span className="inline-flex items-center px-2 py-2 bg-white border border-orange-400 text-orange-400 rounded-full font-semibold shadow-sm hover:shadow-md transition-shadow text-xs">
                    {getSortLabel(filters.sortBy)}
                    <button
                        onClick={handleRemoveSort}
                        className="ml-1 w-4 h-4 flex items-center justify-center bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full text-xs transition-all duration-200 border border-orange-300"
                        aria-label="Remover ordenamiento"
                    >
                        ×
                    </button>
                </span>
            )}

            {/* Botón para limpiar todos los filtros */}
            {filters.hasActiveFilters && (
                <button
                    onClick={onResetFilters}
                    className="inline-flex items-center px-3 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md text-xs"
                >
                    Limpiar todo
                </button>
            )}
        </div>
    );
};

export default FilterBreadcrumbs;