import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import CategoryBrandFilter from './CategoryBrandFilter';
import PriceRangeFilter from './PriceRangeFilter';
import SortFilter from './SortFilter';
import { ProductSummary } from '@/types/product.types';

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'stock';

interface MobileFiltersPanelProps {
    isOpen: boolean;
    onClose: () => void;
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

const MobileFiltersPanel = ({
    isOpen,
    onClose,
    allProducts,
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    onBrandChange,
    minPrice,
    maxPrice,
    onPriceChange,
    sortBy,
    onSortChange
}: MobileFiltersPanelProps) => {

    // Bloquear scroll del body
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleApplyFilters = () => {
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Panel de filtros - DESDE LA IZQUIERDA */}
            <div className={`fixed top-0 left-0 bottom-0 z-50 lg:hidden w-80 h-full nova-bg-primary transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="relative flex flex-col h-full">
                    {/* Header */}
                    <header className="p-3 flex items-center justify-between border-b" style={{ borderBottomColor: 'var(--nova-gray-700)' }}>
                        <div className="flex items-center space-x-2">
                            <h2 className="text-base font-semibold" style={{ color: 'var(--nova-white)' }}>
                                Filtros
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full text-gray-200 bg-gray-500 hover:bg-gray-700 transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5"/>
                        </button>
                    </header>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto px-4 py-6">
                        {/* Mensaje si no hay categoría seleccionada */}
                        {!selectedCategory ? (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <svg className="w-16 h-16 mb-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <p className="text-sm mb-2 text-white">
                                    Selecciona una categoría primero
                                </p>
                                <p className="text-xs text-gray-400">
                                    Los filtros estarán disponibles una vez que elijas una categoría
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Ordenamiento */}
                                <div>
                                    <SortFilter sortBy={sortBy} onSortChange={onSortChange} />
                                </div>

                                {/* Marcas */}
                                <div>
                                    <CategoryBrandFilter
                                        allProducts={allProducts}
                                        selectedCategory={selectedCategory}
                                        selectedSubcategory={selectedSubcategory}
                                        selectedBrand={selectedBrand}
                                        onBrandChange={onBrandChange}
                                    />
                                </div>

                                {/* Precio */}
                                <div>
                                    <PriceRangeFilter
                                        minPrice={minPrice}
                                        maxPrice={maxPrice}
                                        onPriceChange={onPriceChange}
                                        allProducts={allProducts}
                                        selectedCategory={selectedCategory}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {selectedCategory && (
                        <div className="p-3 border-t" style={{ borderTopColor: 'var(--nova-gray-700)' }}>
                            <button
                                onClick={handleApplyFilters}
                                className="w-full py-2.5 rounded-xl font-semibold transition-colors bg-orange-500 text-white md:hover:opacity-90 text-sm"
                            >
                                Aplicar filtros
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MobileFiltersPanel;