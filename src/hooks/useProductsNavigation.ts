import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ProductSummary } from '../types';

interface ProductsFilters {
    selectedCategory: string;
    selectedBrand: string;
    searchTerm: string;
    selectedSubcategory: string;
    selectedSubcategoryBrand: string;
    minPrice: number | null;
    maxPrice: number | null;
    sortBy: string;
}

interface UseProductsNavigationReturn {
    handleProductClick: (product: ProductSummary) => void;
}

export const useProductsNavigation = (
    filters: ProductsFilters
): UseProductsNavigationReturn => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleProductClick = useCallback((product: ProductSummary) => {
        const productUrl = `/product/${product.id}`;
        const currentFilters: Record<string, string> = {};

        if (filters.selectedCategory) currentFilters.category = filters.selectedCategory;
        if (filters.selectedSubcategory) currentFilters.subcategory = filters.selectedSubcategory;
        if (filters.selectedBrand) currentFilters.brand = filters.selectedBrand;
        if (filters.selectedSubcategoryBrand) currentFilters.subcategoryBrand = filters.selectedSubcategoryBrand;
        if (filters.minPrice !== null) currentFilters.minPrice = filters.minPrice.toString();
        if (filters.maxPrice !== null) currentFilters.maxPrice = filters.maxPrice.toString();
        if (filters.sortBy && filters.sortBy !== 'name') currentFilters.sortBy = filters.sortBy;
        if (filters.searchTerm) currentFilters.search = filters.searchTerm;

        navigate(productUrl, {
            state: {
                filters: currentFilters,
                previousPath: location.pathname + location.search,
                sidebarContext: {
                    selectedCategory: filters.selectedCategory,
                    selectedSubcategory: filters.selectedSubcategory,
                    selectedBrand: filters.selectedBrand,
                    expandedCategories: filters.selectedCategory ? [filters.selectedCategory] : []
                }
            }
        });
    }, [navigate, location, filters]);

    return {
        handleProductClick
    };
};
