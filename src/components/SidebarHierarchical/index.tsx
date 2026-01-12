import { forwardRef, useImperativeHandle } from 'react';
import { ProductSummary } from '@/types/product.types';
import { CategoryWithSubcategories, FiltersObject, SortOption } from './types';
import { useSidebarState } from './useSidebarState';
import CategoryList from './CategoryList';
import SubcategoryView from './SubcategoryView';
import FilterBreadcrumbs from '../Products/FilterBreadcrumbs';

interface SidebarHierarchicalProps {
    allProducts: ProductSummary[];
    selectedCategory: string | null;
    selectedSubcategory: string | null;
    onCategoryChange: (category: string) => void;
    onSubcategoryChange: (subcategory: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    categoriesWithSubcategories: CategoryWithSubcategories[];
    selectedBrand: string | null;
    onBrandChange: (brand: string | null) => void;
    minPrice: number | null;
    maxPrice: number | null;
    onPriceChange: (min: number | null, max: number | null) => void;
    sortBy: SortOption;
    onSortChange: (sortBy: SortOption) => void;
    filters: FiltersObject;
    getSelectedSubcategoryName: () => string;
    onResetFilters: () => void;
}

export interface SidebarHierarchicalRef {
    resetExpansion: () => void;
}

const BreadcrumbArrow = () => (
    <span className="text-orange-500">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </span>
);

const SidebarHierarchical = forwardRef<SidebarHierarchicalRef, SidebarHierarchicalProps>(({
    allProducts,
    selectedCategory,
    selectedSubcategory,
    onCategoryChange,
    onSubcategoryChange,
    sidebarOpen,
    setSidebarOpen,
    categoriesWithSubcategories,
    selectedBrand,
    onBrandChange,
    minPrice,
    maxPrice,
    onPriceChange,
    sortBy,
    onSortChange,
    filters,
    getSelectedSubcategoryName,
    onResetFilters
}, ref) => {
    const {
        expandedCategories,
        toggleCategory,
        handleCategoryClick,
        handleSubcategoryClick,
        handleBackToCategories,
        resetExpansion
    } = useSidebarState({
        selectedCategory,
        onCategoryChange,
        onSubcategoryChange,
        onBrandChange,
        onPriceChange,
        setSidebarOpen
    });

    useImperativeHandle(ref, () => ({ resetExpansion }));

    const showAllCategories = !selectedCategory;
    const showCategoryView = selectedCategory;

    return (
        <div className={`fixed lg:static top-0 left-0 z-50 lg:z-auto lg:w-[340px] h-full lg:h-auto bg-white ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } shadow-2xl lg:shadow-none`}>

            {/* Header con breadcrumb */}
            <div className="hidden lg:block relative">
                <div className="p-4 border-b border-gray-600/30">
                    <div className="flex items-center space-x-2">
                        {showAllCategories && (
                            <h3 className="text-sm font-semibold text-gray-800 tracking-wide">Categorías</h3>
                        )}
                        {showCategoryView && (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleBackToCategories}
                                    className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                                >
                                    Categorías
                                </button>
                                <BreadcrumbArrow />
                                <h3 className="text-sm font-semibold text-gray-800 tracking-wide capitalize">
                                    {selectedCategory}
                                </h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {filters?.hasActiveFilters && (
                <div className="px-4 py-3 border-b border-gray-200">
                    <FilterBreadcrumbs
                        filters={filters}
                        getSelectedSubcategoryName={getSelectedSubcategoryName}
                        onResetFilters={onResetFilters}
                    />
                </div>
            )}

            {/* Contenido del sidebar */}
            <div className="py-1 max-h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
                {showAllCategories && (
                    <CategoryList
                        categories={categoriesWithSubcategories}
                        selectedCategory={selectedCategory}
                        selectedSubcategory={selectedSubcategory}
                        expandedCategories={expandedCategories}
                        onCategoryClick={handleCategoryClick}
                        onSubcategoryClick={handleSubcategoryClick}
                        onToggleCategory={toggleCategory}
                        onResetAll={handleBackToCategories}
                    />
                )}

                {showCategoryView && (
                    <SubcategoryView
                        categories={categoriesWithSubcategories}
                        selectedCategory={selectedCategory}
                        selectedSubcategory={selectedSubcategory}
                        allProducts={allProducts}
                        selectedBrand={selectedBrand}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        sortBy={sortBy}
                        onSubcategoryClick={handleSubcategoryClick}
                        onSubcategoryChange={onSubcategoryChange}
                        onBrandChange={onBrandChange}
                        onPriceChange={onPriceChange}
                        onSortChange={onSortChange}
                        onBackToCategories={handleBackToCategories}
                    />
                )}
            </div>

            {/* Custom scrollbar styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(55, 65, 81, 0.1);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #22d3ee, #3b82f6);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #06b6d4, #2563eb);
                }
            `}</style>
        </div>
    );
});

export default SidebarHierarchical;
