export type SortOption = 'name' | 'price-asc' | 'price-desc' | 'stock';

export interface Subcategory {
    id: string;
    name: string;
}

export interface CategoryWithSubcategories {
    name: string;
    subcategories: Subcategory[];
}

export interface FiltersObject {
    hasActiveFilters: boolean;
    selectedCategory: string;
    selectedSubcategory: string;
    selectedBrand: string;
    selectedSubcategoryBrand: string;
    minPrice: number | null;
    maxPrice: number | null;
    searchTerm: string;
    sortBy: string;
    setSelectedSubcategory: (value: string) => void;
    setSelectedSubcategoryBrand: (value: string) => void;
    setSelectedBrand: (value: string) => void;
    setSearchTerm: (value: string) => void;
    setSortBy: (value: string) => void;
    handlePriceChange: (min: number | null, max: number | null) => void;
}
