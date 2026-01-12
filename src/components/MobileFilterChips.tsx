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

interface MobileFilterChipsProps {
    filters: FiltersObject;
    getSelectedSubcategoryName: () => string;
    onResetFilters: () => void;
}

const MobileFilterChips = ({ filters, getSelectedSubcategoryName, onResetFilters }: MobileFilterChipsProps) => {
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
        <div className="lg:hidden mb-4 px-4">
            {/* Header con contador - SIN BOTÓN */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                    Filtros:
                </span>
            </div>

            {/* Chips container */}
            <div className="flex flex-wrap gap-2">
                {/* Categoría */}
                {filters.selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-2 py-1.5 bg-white border border-orange-400 text-orange-400 rounded-full text-xs font-semibold shadow-sm">
                        <span className="capitalize">{filters.selectedCategory}</span>
                        <button
                            onClick={handleRemoveCategory}
                            className="flex items-center justify-center w-4 h-4 bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full transition-all duration-200 border border-orange-300"
                            aria-label="Remover categoría"
                        >
                            ×
                        </button>
                    </span>
                )}

                {/* Subcategoría */}
                {filters.selectedSubcategory && (
                    <span className="inline-flex items-center gap-1 px-2 py-1.5 bg-white border border-orange-400 text-orange-400 rounded-full text-xs font-semibold shadow-sm">
                        <span>{getSelectedSubcategoryName()}</span>
                        <button
                            onClick={handleRemoveSubcategory}
                            className="flex items-center justify-center w-4 h-4 bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full transition-all duration-200 border border-orange-300"
                            aria-label="Remover subcategoría"
                        >
                            ×
                        </button>
                    </span>
                )}

                {/* Marca */}
                {filters.selectedBrand && (
                    <span className="inline-flex items-center gap-1 px-2 py-1.5 bg-white border border-orange-400 text-orange-400 rounded-full text-xs font-semibold shadow-sm">
                        <span>Marca: {filters.selectedBrand}</span>
                        <button
                            onClick={() => filters.setSelectedBrand('')}
                            className="flex items-center justify-center w-4 h-4 bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full transition-all duration-200 border border-orange-300"
                            aria-label="Remover marca"
                        >
                            ×
                        </button>
                    </span>
                )}

                {/* Marca de subcategoría */}
                {filters.selectedSubcategoryBrand && (
                    <span className="inline-flex items-center gap-1 px-2 py-1.5 bg-white border border-orange-400 text-orange-400 rounded-full text-xs font-semibold shadow-sm">
                        <span>Marca: {filters.selectedSubcategoryBrand}</span>
                        <button
                            onClick={handleRemoveSubcategoryBrand}
                            className="flex items-center justify-center w-4 h-4 bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full transition-all duration-200 border border-orange-300"
                            aria-label="Remover marca"
                        >
                            ×
                        </button>
                    </span>
                )}

                {/* Rango de precio */}
                {(filters.minPrice || filters.maxPrice) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1.5 bg-white border border-orange-400 text-orange-400 rounded-full text-xs font-semibold shadow-sm">
                        <span>{getPriceRangeLabel()}</span>
                        <button
                            onClick={handleRemovePriceRange}
                            className="flex items-center justify-center w-4 h-4 bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full transition-all duration-200 border border-orange-300"
                            aria-label="Remover precio"
                        >
                            ×
                        </button>
                    </span>
                )}

                {/* Búsqueda */}
                {filters.searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2 py-1.5 bg-white border border-orange-400 text-orange-400 rounded-full text-xs font-semibold shadow-sm">
                        <span>"{filters.searchTerm}"</span>
                        <button
                            onClick={handleRemoveSearch}
                            className="flex items-center justify-center w-4 h-4 bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full transition-all duration-200 border border-orange-300"
                            aria-label="Remover búsqueda"
                        >
                            ×
                        </button>
                    </span>
                )}

                {/* Ordenamiento */}
                {filters.sortBy !== 'name' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1.5 bg-white border border-orange-400 text-orange-400 rounded-full text-xs font-semibold shadow-sm">
                        <span>{getSortLabel(filters.sortBy)}</span>
                        <button
                            onClick={handleRemoveSort}
                            className="flex items-center justify-center w-4 h-4 bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full transition-all duration-200 border border-orange-300"
                            aria-label="Remover ordenamiento"
                        >
                            ×
                        </button>
                    </span>
                )}

                {/* Limpiar todo - AL FINAL COMO CHIP */}
                <button
                    onClick={onResetFilters}
                    className="inline-flex items-center px-3 py-1.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-200 font-semibold shadow-sm hover:shadow-md text-xs"
                >
                    Limpiar todo
                </button>
            </div>
        </div>
    );
};

export default MobileFilterChips;