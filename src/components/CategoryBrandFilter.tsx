import React, { useMemo } from 'react';
import { detectSubcategory } from '@/utils/subcategoryDetector';
import { ProductSummary } from '@/types/product.types';

interface CategoryBrandFilterProps {
    allProducts: ProductSummary[];
    selectedCategory: string | null;
    selectedSubcategory: string | null;
    selectedBrand: string | null;
    onBrandChange: (brand: string | null) => void;
}

const CategoryBrandFilter = ({
    allProducts,
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    onBrandChange
}: CategoryBrandFilterProps) => {
    const availableBrands = useMemo(() => {
        // No muestra filtro de marcas para procesadores (redundante con subcategorías Intel/AMD)
        if (selectedCategory?.toLowerCase() === 'procesadores') {
            return [];
        }

        if (!selectedCategory || !allProducts) return [];

        let filteredProducts = allProducts.filter(product =>
            product.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
        );

        if (selectedSubcategory) {
            filteredProducts = filteredProducts.filter(product => {
                const subcategory = detectSubcategory({
                    id: product.id,
                    name: product.name,
                    categoryName: product.categoryName,
                    brand: product.brand,
                    platform: product.platform
                }, selectedCategory);
                return subcategory?.id === selectedSubcategory;
            });
        }

        return [...new Set(
            filteredProducts
                .map(product => product.brand)
                .filter(brand => brand && brand.trim() !== '')
        )].sort();
    }, [allProducts, selectedCategory, selectedSubcategory]);

    // No mostrar el filtro si no hay marcas disponibles o es procesadores
    if (availableBrands.length === 0) {
        return null;
    }

    const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onBrandChange(e.target.value || null);
    };

    const handleClearBrandFilter = () => {
        onBrandChange(null);
    };

    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 min-w-0">
                <label className="text-sm font-semibold text-gray-200 lg:text-gray-800 whitespace-nowrap">
                    Marcas:
                </label>

                <select
                    value={selectedBrand || ''}
                    onChange={handleBrandChange}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors cursor-pointer hover:border-gray-400"
                >
                    <option value="">Todas las marcas</option>
                    {availableBrands.map((brand) => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>

                {selectedBrand && (
                    <button
                        onClick={handleClearBrandFilter}
                        className="px-2 py-1 text-xs text-gray-200 hover:text-red-500 hover:bg-red-50 rounded transition-colors whitespace-nowrap"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default CategoryBrandFilter;