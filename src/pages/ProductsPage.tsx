import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useProductFilters } from '../hooks/useProductFilters';
import { useCategoriesStructure } from '../hooks/useCategoriesStructure';
import { useProductsData } from '../hooks/useProductsData';
import { useProductsNavigation } from '../hooks/useProductsNavigation';
import Pagination from '../components/Common/Pagination';
import { usePagination } from '../hooks/usePagination';
import NavBar from '../components/Common/NavBar';
import SidebarHierarchical from '../components/SidebarHierarchical';
import MobileSidebar from '../components/MobileSidebar';
import MobileFiltersPanel from '../components/MobileFiltersPanel';
import MobileFilterChips from '../components/MobileFilterChips';
import {
    ProductGrid,
    LoadingState,
    ErrorState,
    EmptyState,
    ProductsPageHeader,
} from '../components/Products';
import { detectSubcategory } from '../utils/subcategoryDetector';

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'stock';
type LayoutType = 'grid' | 'list';

interface MobileModalRef {
    resetExpansion: () => void;
}

interface DesktopSidebarRef {
    resetExpansion: () => void;
}

const ProductsPage = () => {
    const { categoryName } = useParams<{ categoryName?: string }>();

    const mobileModalRef = useRef<MobileModalRef>(null);
    const desktopSidebarRef = useRef<DesktopSidebarRef>(null);

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
    const [layout, setLayout] = useState<LayoutType>('grid');

    const filters = useProductFilters(categoryName);

    // Hook para carga y filtrado de productos
    const { allProducts, filteredProducts, loading, error, isInitialLoad } = useProductsData({
        selectedCategory: filters.selectedCategory,
        selectedBrand: filters.selectedBrand,
        searchTerm: filters.searchTerm,
        selectedSubcategory: filters.selectedSubcategory,
        selectedSubcategoryBrand: filters.selectedSubcategoryBrand,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortBy: filters.sortBy
    });

    // Hook para navegación
    const { handleProductClick } = useProductsNavigation({
        selectedCategory: filters.selectedCategory,
        selectedBrand: filters.selectedBrand,
        searchTerm: filters.searchTerm,
        selectedSubcategory: filters.selectedSubcategory,
        selectedSubcategoryBrand: filters.selectedSubcategoryBrand,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortBy: filters.sortBy
    });

    const categoriesWithSubcategories = useCategoriesStructure(allProducts);

    const {
        currentPage: paginationPage,
        totalPages,
        currentData: currentProducts,
        goToPage
    } = usePagination({
        data: filteredProducts,
        itemsPerPage: 21,
        initialPage: 1
    });

    // Scroll to top cuando cambia la categoría
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [filters.selectedCategory]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            filters.updateURL();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [
        filters.selectedCategory,
        filters.selectedSubcategory,
        filters.selectedSubcategoryBrand,
        filters.minPrice,
        filters.maxPrice,
        filters.updateURL
    ]);

    const handleCategoryChange = useCallback((categoryName: string) => {
        filters.setSelectedCategory(categoryName);
        filters.setSelectedBrand('');
        filters.setSelectedSubcategory('');
        filters.setSelectedSubcategoryBrand('');
        filters.setMinPrice(null);
        filters.setMaxPrice(null);
        filters.setSortBy('name');
    }, [filters]);

    const handleBrandChange = useCallback((brand: string | null) => {
        filters.setSelectedBrand(brand || '');
    }, [filters]);

    const handleSubcategoryChange = useCallback((subcategoryId: string) => {
        filters.setSelectedSubcategory(subcategoryId);
        filters.setSelectedSubcategoryBrand('');
    }, [filters]);

    const handlePriceChange = useCallback((minPrice: number | null, maxPrice: number | null) => {
        filters.handlePriceChange(minPrice, maxPrice);
    }, [filters]);

    const resetFiltersAndExpansion = useCallback(() => {
        filters.clearFilters();
        mobileModalRef.current?.resetExpansion?.();
        desktopSidebarRef.current?.resetExpansion?.();
    }, [filters]);

    const getSelectedSubcategoryName = useCallback((): string => {
        if (!filters.selectedSubcategory || !filters.selectedCategory) return '';

        const categoryProducts = allProducts.filter(product =>
            product.categoryName?.toLowerCase() === filters.selectedCategory.toLowerCase()
        );

        for (const product of categoryProducts) {
            const subcategory = detectSubcategory(product as any, filters.selectedCategory);
            if (subcategory?.id === filters.selectedSubcategory) {
                return subcategory.name;
            }
            if (product.brand?.toLowerCase() === filters.selectedSubcategory.toLowerCase()) {
                return product.brand;
            }
        }
        return filters.selectedSubcategory;
    }, [filters.selectedSubcategory, filters.selectedCategory, allProducts]);

    const renderMainContent = () => {
        if (loading) return <LoadingState />;
        if (error) return <ErrorState onRetry={() => window.location.reload()} />;
        if (!loading && !isInitialLoad && currentProducts.length === 0) {
            return (
                <EmptyState
                    hasActiveFilters={filters.hasActiveFilters}
                    onClearFilters={resetFiltersAndExpansion}
                />
            );
        }

        return (
            <ProductGrid
                products={currentProducts}
                onProductClick={handleProductClick}
                layout={layout}
            />
        );
    };

    return (
        <div className="min-h-screen bg-white">
            <NavBar
                searchTerm={filters.searchTerm}
                setSearchTerm={filters.setSearchTerm}
                showSearch={true}
            />

            <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pt-24 lg:pt-28 pb-8">
                <div className="flex gap-0">
                    {/* Sidebar Desktop */}
                    <div className="hidden lg:block lg:w-96">
                        <SidebarHierarchical
                            ref={desktopSidebarRef}
                            allProducts={allProducts}
                            selectedCategory={filters.selectedCategory}
                            selectedSubcategory={filters.selectedSubcategory}
                            onCategoryChange={handleCategoryChange}
                            onSubcategoryChange={handleSubcategoryChange}
                            sidebarOpen={false}
                            setSidebarOpen={() => { }}
                            categoriesWithSubcategories={categoriesWithSubcategories}
                            selectedBrand={filters.selectedBrand}
                            onBrandChange={handleBrandChange}
                            minPrice={filters.minPrice}
                            maxPrice={filters.maxPrice}
                            onPriceChange={handlePriceChange}
                            sortBy={filters.sortBy as SortOption}
                            onSortChange={(sortBy: SortOption) => filters.setSortBy(sortBy)}
                            filters={filters}
                            getSelectedSubcategoryName={getSelectedSubcategoryName}
                            onResetFilters={resetFiltersAndExpansion}
                        />
                    </div>

                    {/* Contenido principal */}
                    <div className="flex-1 min-w-0">
                        <div className="px-4 sm:px-0">
                            {/* Header con botones de Categorías, Filtros y Vista */}
                            <ProductsPageHeader
                                onCategoriesClick={() => setSidebarOpen(true)}
                                onFiltersClick={() => setFiltersOpen(true)}
                                layout={layout}
                                onLayoutChange={setLayout}
                            />

                            {/* Chips de filtros - SOLO MOBILE */}
                            {filters.hasActiveFilters && (
                                <div className="lg:hidden">
                                    <MobileFilterChips
                                        filters={filters}
                                        getSelectedSubcategoryName={getSelectedSubcategoryName}
                                        onResetFilters={resetFiltersAndExpansion}
                                    />
                                </div>
                            )}

                            {/* Sidebar Mobile de CATEGORÍAS */}
                            <MobileSidebar
                                key={`${filters.selectedCategory}-${filters.selectedSubcategory}`}
                                ref={mobileModalRef}
                                isOpen={sidebarOpen}
                                onClose={() => setSidebarOpen(false)}
                                categoriesWithSubcategories={categoriesWithSubcategories}
                                selectedCategory={filters.selectedCategory}
                                selectedSubcategory={filters.selectedSubcategory}
                                onCategoryChange={handleCategoryChange}
                                onSubcategoryChange={handleSubcategoryChange}
                            />

                            {/* Panel Mobile de FILTROS */}
                            <MobileFiltersPanel
                                isOpen={filtersOpen}
                                onClose={() => setFiltersOpen(false)}
                                allProducts={allProducts}
                                selectedCategory={filters.selectedCategory}
                                selectedSubcategory={filters.selectedSubcategory}
                                selectedBrand={filters.selectedBrand}
                                onBrandChange={handleBrandChange}
                                minPrice={filters.minPrice}
                                maxPrice={filters.maxPrice}
                                onPriceChange={handlePriceChange}
                                sortBy={filters.sortBy as SortOption}
                                onSortChange={(sortBy: SortOption) => filters.setSortBy(sortBy)}
                                onResetFilters={resetFiltersAndExpansion}
                            />

                            {renderMainContent()}

                            {!loading && !error && totalPages > 1 && (
                                <div className="flex justify-center items-center mt-8">
                                    <Pagination
                                        currentPage={paginationPage}
                                        totalPages={totalPages}
                                        onPageChange={goToPage}
                                        showPages={5}
                                        size="normal"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;