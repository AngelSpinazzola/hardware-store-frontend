import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// Tipos para el hook
export interface ProductFiltersState {
  selectedCategory: string;
  selectedBrand: string;
  searchTerm: string;
  sortBy: string;
  selectedSubcategory: string;
  selectedSubcategoryBrand: string;
  hasActiveFilters: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  itemsPerPage: number;
}

export interface ProductFiltersActions {
  setSelectedCategory: (category: string) => void;
  setSelectedBrand: (brand: string) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: string) => void;
  setSelectedSubcategory: (subcategory: string) => void;
  setSelectedSubcategoryBrand: (brand: string) => void;
  setMinPrice: (price: number | null) => void;
  setMaxPrice: (price: number | null) => void;
  handlePriceChange: (min: number | null, max: number | null) => void;
  setItemsPerPage: (items: number) => void;
  updateURL: () => void;
  clearFilters: () => void;
  searchParams: URLSearchParams;
}

export type UseProductFiltersReturn = ProductFiltersState & ProductFiltersActions;

export const useProductFilters = (categoryName?: string): UseProductFiltersReturn => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Estados de filtros existentes
    const [selectedCategory, setSelectedCategory] = useState<string>(
        categoryName || searchParams.get('category') || ''
    );
    const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brand') || '');
    const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');
    const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'name');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>(searchParams.get('subcategory') || '');
    const [selectedSubcategoryBrand, setSelectedSubcategoryBrand] = useState<string>(searchParams.get('subcategoryBrand') || '');

    // Estados de precio
    const [minPrice, setMinPrice] = useState<number | null>(() => {
        const urlMinPrice = searchParams.get('minPrice');
        return urlMinPrice ? parseFloat(urlMinPrice) : null;
    });
    const [maxPrice, setMaxPrice] = useState<number | null>(() => {
        const urlMaxPrice = searchParams.get('maxPrice');
        return urlMaxPrice ? parseFloat(urlMaxPrice) : null;
    });

    // Nuevo estado para items por página
    const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
        const urlItemsPerPage = searchParams.get('itemsPerPage');
        return urlItemsPerPage ? parseInt(urlItemsPerPage) : 20;
    });

    // NUEVO: Sincronizar estados con cambios de URL
    useEffect(() => {
        const newCategory = categoryName || searchParams.get('category') || '';
        const newBrand = searchParams.get('brand') || '';
        const newSearch = searchParams.get('search') || '';
        const newSort = searchParams.get('sort') || 'name';
        const newSubcategory = searchParams.get('subcategory') || '';
        const newSubcategoryBrand = searchParams.get('subcategoryBrand') || '';

        const newMinPrice = searchParams.get('minPrice');
        const newMaxPrice = searchParams.get('maxPrice');
        const newItemsPerPage = searchParams.get('itemsPerPage');

        // Solo actualizar si hay cambios para evitar loops infinitos
        if (newCategory !== selectedCategory) {
            setSelectedCategory(newCategory);
        }
        if (newBrand !== selectedBrand) {
            setSelectedBrand(newBrand);
        }
        if (newSearch !== searchTerm) {
            setSearchTerm(newSearch);
        }
        if (newSort !== sortBy) {
            setSortBy(newSort);
        }
        if (newSubcategory !== selectedSubcategory) {
            setSelectedSubcategory(newSubcategory);
        }
        if (newSubcategoryBrand !== selectedSubcategoryBrand) {
            setSelectedSubcategoryBrand(newSubcategoryBrand);
        }

        // Actualizar precios
        const parsedMinPrice = newMinPrice ? parseFloat(newMinPrice) : null;
        const parsedMaxPrice = newMaxPrice ? parseFloat(newMaxPrice) : null;
        const parsedItemsPerPage = newItemsPerPage ? parseInt(newItemsPerPage) : 20;

        if (parsedMinPrice !== minPrice) {
            setMinPrice(parsedMinPrice);
        }
        if (parsedMaxPrice !== maxPrice) {
            setMaxPrice(parsedMaxPrice);
        }
        if (parsedItemsPerPage !== itemsPerPage) {
            setItemsPerPage(parsedItemsPerPage);
        }
    }, [
        searchParams, 
        categoryName
        // CRÍTICO: Remover todas las dependencias de estado para evitar loops
    ]);

    // Función para manejar cambios de precio
    const handlePriceChange = useCallback((min: number | null, max: number | null): void => {
        setMinPrice(min);
        setMaxPrice(max);
    }, []);

    const updateURL = useCallback((): void => {
        const params = new URLSearchParams();

        // Parámetros existentes
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedBrand) params.set('brand', selectedBrand);
        if (searchTerm) params.set('search', searchTerm);
        if (sortBy !== 'name') params.set('sort', sortBy);
        if (selectedSubcategory) params.set('subcategory', selectedSubcategory);
        if (selectedSubcategoryBrand) params.set('subcategoryBrand', selectedSubcategoryBrand);
        
        // Parámetros de precio
        if (minPrice !== null && minPrice !== undefined) params.set('minPrice', minPrice.toString());
        if (maxPrice !== null && maxPrice !== undefined) params.set('maxPrice', maxPrice.toString());
        
        // Parámetro de items por página (solo si es diferente del default)
        if (itemsPerPage !== 20) params.set('itemsPerPage', itemsPerPage.toString());

        const currentParams = new URLSearchParams(window.location.search);
        const newParamsString = params.toString();
        const currentParamsString = currentParams.toString();

        // Normalizar ambas strings para comparación
        const normalizeParams = (str: string): string => decodeURIComponent(str).replace(/\+/g, ' ');

        if (normalizeParams(newParamsString) !== normalizeParams(currentParamsString)) {
            setSearchParams(params, { replace: true });
        }
    }, [selectedCategory, selectedBrand, searchTerm, sortBy, selectedSubcategory, selectedSubcategoryBrand, minPrice, maxPrice, itemsPerPage, setSearchParams]);

    const clearFilters = useCallback((): void => {
        // Limpiar filtros existentes
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedBrand('');
        setSelectedSubcategory('');
        setSelectedSubcategoryBrand('');
        setSortBy('name');
        
        // Limpiar filtros de precio
        setMinPrice(null);
        setMaxPrice(null);
        
        // Resetear items por página al default
        setItemsPerPage(20);

        setSearchParams({}, { replace: true });
    }, [setSearchParams]);

    // Detectar filtros activos
    const hasActiveFilters = useMemo((): boolean =>
        Boolean(
            searchTerm || 
            selectedCategory || 
            selectedBrand || 
            selectedSubcategory || 
            selectedSubcategoryBrand || 
            sortBy !== 'name' ||
            minPrice !== null ||
            maxPrice !== null ||
            itemsPerPage !== 20
        ),
        [searchTerm, selectedCategory, selectedBrand, selectedSubcategory, selectedSubcategoryBrand, sortBy, minPrice, maxPrice, itemsPerPage]
    );

    return {
        // Estados existentes
        selectedCategory,
        selectedBrand,
        searchTerm,
        sortBy,
        selectedSubcategory,
        selectedSubcategoryBrand,
        hasActiveFilters,

        // Estados de precio
        minPrice,
        maxPrice,

        // Nuevo estado de paginación
        itemsPerPage,

        // Setters existentes
        setSelectedCategory,
        setSelectedBrand,
        setSearchTerm,
        setSortBy,
        setSelectedSubcategory,
        setSelectedSubcategoryBrand,

        // Setters de precio
        setMinPrice,
        setMaxPrice,
        handlePriceChange,

        // Nuevo setter de paginación
        setItemsPerPage,

        // Funciones
        updateURL,
        clearFilters,

        // Para restaurar desde URL
        searchParams
    };
};