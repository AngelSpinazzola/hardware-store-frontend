import { useState } from 'react';
import { ChevronDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SortFilter from './SortFilter';
import CategoryBrandFilter from './CategoryBrandFilter';
import PriceRangeFilter from './PriceRangeFilter';
import { ProductSummary } from '@/types/product.types';

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'stock';

interface Filters {
    hasActiveFilters: boolean;
}

interface MobileFiltersDropdownProps {
    filters: Filters;
    allProducts: ProductSummary[];
    selectedCategory: string | null;
    selectedSubcategory: string | null;
    selectedBrand: string | null;
    onBrandChange: (brand: string | null) => void;
    minPrice: number | null;
    maxPrice: number | null;
    onPriceChange: (min: number | null, max: number | null) => void;
    sortBy: SortOption;
    onSortChange: (sortBy: SortOption) => void;
    onResetFilters: () => void;
}

const MobileFiltersDropdown = ({
    filters,
    allProducts,
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    onBrandChange,
    minPrice,
    maxPrice,
    onPriceChange,
    sortBy,
    onSortChange,
    onResetFilters
}: MobileFiltersDropdownProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const hasActiveFilters: boolean = filters?.hasActiveFilters || false;
    const activeFiltersCount: number = [
        selectedBrand,
        minPrice,
        maxPrice,
        sortBy !== 'name' ? sortBy : null
    ].filter(Boolean).length;

    return (
        <div className="lg:hidden">
            {/* Botón principal de filtros */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between px-4 py-3 mb-4
                    border rounded-lg transition-all duration-200
                    ${hasActiveFilters 
                        ? 'border-orange-500 bg-orange-50 text-orange-700' 
                        : 'border-gray-300 bg-white text-gray-700'
                    }
                    hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50
                `}
            >
                <div className="flex items-center space-x-2">
                    <FunnelIcon className="h-5 w-5" />
                    <span className="font-medium">
                        Filtros y ordenamiento
                        {activeFiltersCount > 0 && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500 text-white">
                                {activeFiltersCount}
                            </span>
                        )}
                    </span>
                </div>
                <ChevronDownIcon 
                    className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Panel de filtros desplegable */}
            <div className={`
                transition-all duration-300 ease-in-out overflow-hidden
                ${isOpen ? 'max-h-screen opacity-100 mb-6' : 'max-h-0 opacity-0'}
            `}>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                    {/* Botón limpiar filtros */}
                    {hasActiveFilters && (
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-sm font-medium text-gray-700">
                                Filtros activos ({activeFiltersCount})
                            </span>
                            <button
                                onClick={() => {
                                    onResetFilters();
                                    setIsOpen(false);
                                }}
                                className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                            >
                                <XMarkIcon className="h-4 w-4" />
                                <span>Limpiar todo</span>
                            </button>
                        </div>
                    )}

                    {/* Filtros organizados */}
                    <div className="space-y-4">
                        {/* Ordenamiento */}
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <SortFilter sortBy={sortBy} onSortChange={onSortChange} />
                        </div>

                        {/* Marcas - Solo si hay categoría */}
                        {selectedCategory && (
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <CategoryBrandFilter 
                                    allProducts={allProducts}
                                    selectedCategory={selectedCategory}
                                    selectedSubcategory={selectedSubcategory}
                                    selectedBrand={selectedBrand}
                                    onBrandChange={onBrandChange}
                                />
                            </div>
                        )}

                        {/* Rango de precios - Solo si hay categoría */}
                        {selectedCategory && (
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <PriceRangeFilter 
                                    minPrice={minPrice}
                                    maxPrice={maxPrice}
                                    onPriceChange={onPriceChange}
                                    allProducts={allProducts}
                                    selectedCategory={selectedCategory}
                                />
                            </div>
                        )}

                        {/* Mensaje cuando no hay categoría */}
                        {!selectedCategory && (
                            <div className="text-center py-4 text-gray-500">
                                <FunnelIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm">
                                    Selecciona una categoría para ver más filtros
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                        >
                            Cerrar
                        </button>
                        {hasActiveFilters && (
                            <button
                                onClick={() => {
                                    onResetFilters();
                                    setIsOpen(false);
                                }}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                            >
                                Aplicar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileFiltersDropdown;