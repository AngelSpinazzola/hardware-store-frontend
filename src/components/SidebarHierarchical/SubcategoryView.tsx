import { CategoryWithSubcategories, SortOption } from './types';
import { ProductSummary } from '@/types/product.types';
import FiltersPanel from './FiltersPanel';

interface SubcategoryViewProps {
    categories: CategoryWithSubcategories[];
    selectedCategory: string | null;
    selectedSubcategory: string | null;
    allProducts: ProductSummary[];
    selectedBrand: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    sortBy: SortOption;
    onSubcategoryClick: (subcategoryId: string, categoryName: string) => void;
    onSubcategoryChange: (subcategory: string) => void;
    onBrandChange: (brand: string | null) => void;
    onPriceChange: (min: number | null, max: number | null) => void;
    onSortChange: (sortBy: SortOption) => void;
    onBackToCategories: () => void;
}

const SubcategoryView = ({
    categories,
    selectedCategory,
    selectedSubcategory,
    allProducts,
    selectedBrand,
    minPrice,
    maxPrice,
    sortBy,
    onSubcategoryClick,
    onSubcategoryChange,
    onBrandChange,
    onPriceChange,
    onSortChange,
    onBackToCategories
}: SubcategoryViewProps) => {
    const currentCategory = categories.find(cat => cat.name === selectedCategory);

    // Vista: Categoría con subcategorías (sin subcategoría seleccionada)
    if (!selectedSubcategory && currentCategory) {
        return (
            <div className="px-4 py-2">
                {/* Mostrar subcategorías */}
                <div className="space-y-1">
                    {currentCategory.subcategories.map((subcategory) => (
                        <button
                            key={subcategory.id}
                            onClick={() => onSubcategoryClick(subcategory.id, selectedCategory!)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 flex items-center justify-between group relative ${
                                selectedSubcategory === subcategory.id ? 'bg-gray-200 text-gray-800' : 'text-gray-800 hover:bg-gray-100'
                            }`}
                        >
                            <span className="text-sm">{subcategory.name}</span>
                        </button>
                    ))}
                </div>

                {/* Filtros generales */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <FiltersPanel
                        allProducts={allProducts}
                        selectedCategory={selectedCategory}
                        selectedSubcategory={selectedSubcategory}
                        selectedBrand={selectedBrand}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        sortBy={sortBy}
                        onBrandChange={onBrandChange}
                        onPriceChange={onPriceChange}
                        onSortChange={onSortChange}
                    />
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={onBackToCategories}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-gray-600 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-all duration-200"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm">Atrás</span>
                    </button>
                </div>
            </div>
        );
    }

    // Vista: Filtros de subcategoría (subcategoría seleccionada)
    return (
        <div className="px-4 py-2">
            {/* Botón volver */}
            <button
                onClick={() => onSubcategoryChange('')}
                className="w-full flex items-center space-x-2 px-3 py-2 mb-4 text-gray-600 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm">Volver a {selectedCategory}</span>
            </button>

            {/* Filtros específicos */}
            <FiltersPanel
                allProducts={allProducts}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                selectedBrand={selectedBrand}
                minPrice={minPrice}
                maxPrice={maxPrice}
                sortBy={sortBy}
                onBrandChange={onBrandChange}
                onPriceChange={onPriceChange}
                onSortChange={onSortChange}
            />
        </div>
    );
};

export default SubcategoryView;
