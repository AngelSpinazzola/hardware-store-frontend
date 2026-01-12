import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { detectSubcategory } from '../utils/subcategoryDetector';
import type { ProductSummary } from '../types';

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'stock';

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

interface UseProductsDataReturn {
    allProducts: ProductSummary[];
    filteredProducts: ProductSummary[];
    loading: boolean;
    error: string | null;
    isInitialLoad: boolean;
}

export const useProductsData = (filters: ProductsFilters): UseProductsDataReturn => {
    const [allProducts, setAllProducts] = useState<ProductSummary[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

    // Cargar datos iniciales
    useEffect(() => {
        let isMounted = true;

        const loadInitialData = async (): Promise<void> => {
            try {
                setLoading(true);
                setError(null);

                const response = await productService.getAllProducts(1, 50);
                const productsData = Array.isArray(response?.data)
                    ? response.data
                    : Array.isArray(response)
                    ? response
                    : [];

                if (isMounted) {
                    setAllProducts(productsData);
                    setIsInitialLoad(false);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error loading initial data:', err);
                    setError('Error al cargar los productos');
                    setAllProducts([]);
                    setIsInitialLoad(false);
                }
            }
        };

        loadInitialData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Inicializar productos filtrados
    useEffect(() => {
        if (!isInitialLoad && allProducts.length > 0) {
            setFilteredProducts(allProducts);
        }
    }, [allProducts, isInitialLoad]);

    // Aplicar filtros
    useEffect(() => {
        if (isInitialLoad) return;

        let isMounted = true;
        let debounceTimer: NodeJS.Timeout | null = null;

        const applyFilters = async (): Promise<void> => {
            const {
                selectedCategory,
                selectedBrand,
                searchTerm,
                selectedSubcategory,
                selectedSubcategoryBrand,
                minPrice,
                maxPrice,
                sortBy
            } = filters;

            try {
                if (allProducts.length > 0) {
                    setLoading(true);
                }

                let filtered = [...allProducts];

                // Filtro de búsqueda
                if (searchTerm?.trim()) {
                    const term = searchTerm.toLowerCase();
                    filtered = filtered.filter(product =>
                        product.name?.toLowerCase().includes(term) ||
                        product.brand?.toLowerCase().includes(term) ||
                        product.categoryName?.toLowerCase().includes(term)
                    );
                }

                // Filtro de categoría
                if (selectedCategory) {
                    filtered = filtered.filter(product =>
                        product.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
                    );
                }

                // Filtro de marca
                if (selectedBrand) {
                    filtered = filtered.filter(product =>
                        product.brand?.toLowerCase() === selectedBrand.toLowerCase()
                    );
                }

                // Filtro de subcategoría
                if (selectedSubcategory) {
                    filtered = filtered.filter(product => {
                        const subcategory = detectSubcategory(product, selectedCategory);
                        return subcategory?.id === selectedSubcategory ||
                            product.brand?.toLowerCase() === selectedSubcategory.toLowerCase();
                    });
                }

                // Filtro de marca de subcategoría
                if (selectedSubcategoryBrand) {
                    filtered = filtered.filter(product =>
                        product.brand?.toLowerCase() === selectedSubcategoryBrand.toLowerCase()
                    );
                }

                // Filtro de precio mínimo
                if (minPrice !== null && minPrice !== undefined) {
                    filtered = filtered.filter(product => product.price >= minPrice);
                }

                // Filtro de precio máximo
                if (maxPrice !== null && maxPrice !== undefined) {
                    filtered = filtered.filter(product => product.price <= maxPrice);
                }

                // Ordenamiento
                filtered.sort((a, b) => {
                    switch (sortBy as SortOption) {
                        case 'name':
                            return a.name.localeCompare(b.name);
                        case 'price-asc':
                            return a.price - b.price;
                        case 'price-desc':
                            return b.price - a.price;
                        case 'stock':
                            return b.stock - a.stock;
                        default:
                            return 0;
                    }
                });

                if (isMounted) {
                    setFilteredProducts(filtered);
                }

            } catch (err) {
                if (isMounted) {
                    console.error('Error applying filters:', err);
                    setError('Error al filtrar productos');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        debounceTimer = setTimeout(applyFilters, 150);

        return () => {
            isMounted = false;
            if (debounceTimer) clearTimeout(debounceTimer);
        };

    }, [
        filters.selectedCategory,
        filters.selectedBrand,
        filters.searchTerm,
        filters.selectedSubcategory,
        filters.selectedSubcategoryBrand,
        filters.minPrice,
        filters.maxPrice,
        filters.sortBy,
        allProducts,
        isInitialLoad
    ]);

    return {
        allProducts,
        filteredProducts,
        loading,
        error,
        isInitialLoad
    };
};
