import { useMemo } from 'react';
import { detectSubcategory } from '@/utils/subcategoryDetector';
import { ProductSummary } from '@/types/product.types';

interface SubcategoryBrandFilterProps {
    allProducts: ProductSummary[];
    selectedCategory: string | null;
    selectedSubcategory: string | null;
    selectedSubcategoryBrand: string | null;
    onSubcategoryBrandChange: (brand: string | null) => void;
}

const SubcategoryBrandFilter = ({ 
    allProducts, 
    selectedCategory, 
    selectedSubcategory, 
    selectedSubcategoryBrand,
    onSubcategoryBrandChange 
}: SubcategoryBrandFilterProps) => {
    // Obtener las marcas disponibles para la subcategoría seleccionada
    const availableBrands = useMemo(() => {
        if (!selectedCategory || !selectedSubcategory || !allProducts) return [];

        // Caso especial para Mothers (mantener lógica existente)
        if (selectedCategory?.toLowerCase() === 'mothers') {
            const filteredProducts = allProducts.filter(product => {
                const categoryMatch = product.categoryName?.toLowerCase() === selectedCategory.toLowerCase();
                
                const platformMatch = 
                    (selectedSubcategory.includes('intel') && product.platform?.toLowerCase() === 'intel') ||
                    (selectedSubcategory.includes('amd') && product.platform?.toLowerCase() === 'amd');
                
                return categoryMatch && platformMatch;
            });

            const brands = [...new Set(
                filteredProducts
                    .map(product => product.brand)
                    .filter(brand => brand && brand.trim() !== '')
            )].sort();

            return brands;
        }

        // Para otras categorías (incluido Periféricos)
        const filteredProducts = allProducts.filter(product => {
            const categoryMatch = product.categoryName?.toLowerCase() === selectedCategory.toLowerCase();

            if (!categoryMatch) return false;

            const subcategory = detectSubcategory({
                id: product.id,
                name: product.name,
                categoryName: product.categoryName,
                brand: product.brand,
                platform: product.platform
            }, selectedCategory);
            const subcategoryMatch = subcategory?.id === selectedSubcategory;

            return subcategoryMatch;
        });

        const brands = [...new Set(
            filteredProducts
                .map(product => product.brand)
                .filter(brand => brand && brand.trim() !== '')
        )].sort();

        return brands;
    }, [allProducts, selectedCategory, selectedSubcategory]);

    // No mostrar el filtro si no hay marcas disponibles o no hay subcategoría seleccionada
    if (!selectedSubcategory || availableBrands.length === 0) {
        return null;
    }

    // Determinar el nombre de la subcategoría para mostrar
    const getSubcategoryDisplayName = (): string => {
        if (selectedCategory?.toLowerCase() === 'mothers') {
            return selectedSubcategory.includes('intel') ? 'Intel' : 'AMD';
        }

        const sampleProduct = allProducts.find(product => {
            const categoryMatch = product.categoryName?.toLowerCase() === selectedCategory?.toLowerCase();
            if (!categoryMatch) return false;

            const subcategory = detectSubcategory({
                id: product.id,
                name: product.name,
                categoryName: product.categoryName,
                brand: product.brand,
                platform: product.platform
            }, selectedCategory);
            return subcategory?.id === selectedSubcategory;
        });

        if (sampleProduct && selectedCategory) {
            const subcategory = detectSubcategory({
                id: sampleProduct.id,
                name: sampleProduct.name,
                categoryName: sampleProduct.categoryName,
                brand: sampleProduct.brand,
                platform: sampleProduct.platform
            }, selectedCategory);
            return subcategory?.name || selectedSubcategory;
        }

        return selectedSubcategory;
    };

    // Determinar si debe mostrar el filtro
    const shouldShowFilter = (): boolean => {
        if (selectedCategory?.toLowerCase() === 'mothers' && 
            (selectedSubcategory.includes('intel') || selectedSubcategory.includes('amd'))) {
            return true;
        }

        return availableBrands.length > 0;
    };

    if (!shouldShowFilter()) {
        return null;
    }

    const displayName = getSubcategoryDisplayName();

    const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSubcategoryBrandChange(e.target.value || null);
    };

    return (
        <div className="flex items-center space-x-3 mb-6">
            <span className="text-sm text-gray-900 font-medium">Marcas {displayName}:</span>
            <select
                value={selectedSubcategoryBrand || ''}
                onChange={handleBrandChange}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--nova-accent)] focus:border-[var(--nova-accent)] transition-colors cursor-pointer hover:border-gray-400"
            >
                <option value="">Todas las marcas</option>
                {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>
                        {brand}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SubcategoryBrandFilter;