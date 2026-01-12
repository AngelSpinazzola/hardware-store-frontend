import { useState, useEffect } from 'react';

interface UseSidebarStateProps {
    selectedCategory: string | null;
    onCategoryChange: (category: string) => void;
    onSubcategoryChange: (subcategory: string) => void;
    onBrandChange: (brand: string | null) => void;
    onPriceChange: (min: number | null, max: number | null) => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useSidebarState = ({
    selectedCategory,
    onCategoryChange,
    onSubcategoryChange,
    onBrandChange,
    onPriceChange,
    setSidebarOpen
}: UseSidebarStateProps) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(selectedCategory ? [selectedCategory] : [])
    );

    // Sincronizar expansión con categoría seleccionada
    useEffect(() => {
        if (selectedCategory) {
            setExpandedCategories(new Set([selectedCategory]));
        } else {
            setExpandedCategories(new Set());
        }
    }, [selectedCategory]);

    const toggleCategory = (categoryName: string): void => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryName)) {
            newExpanded.delete(categoryName);
        } else {
            newExpanded.clear();
            newExpanded.add(categoryName);
        }
        setExpandedCategories(newExpanded);
    };

    const handleCategoryClick = (categoryName: string): void => {
        onCategoryChange(categoryName);
        onSubcategoryChange('');
        setSidebarOpen(false);
    };

    const handleSubcategoryClick = (subcategoryId: string, categoryName: string): void => {
        if (selectedCategory !== categoryName) {
            onCategoryChange(categoryName);
        }
        onSubcategoryChange(subcategoryId);
        setSidebarOpen(false);
    };

    const handleBackToCategories = (): void => {
        onCategoryChange('');
        onSubcategoryChange('');
        onBrandChange(null);
        onPriceChange(null, null);
        setExpandedCategories(new Set());
        setSidebarOpen(false);
    };

    const resetExpansion = (): void => {
        setExpandedCategories(new Set());
    };

    return {
        expandedCategories,
        toggleCategory,
        handleCategoryClick,
        handleSubcategoryClick,
        handleBackToCategories,
        resetExpansion
    };
};
