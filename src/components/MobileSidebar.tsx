import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Subcategory {
    id: string;
    name: string;
}

interface CategoryWithSubcategories {
    name: string;
    subcategories?: Subcategory[];
}

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    categoriesWithSubcategories: CategoryWithSubcategories[];
    selectedCategory: string;
    selectedSubcategory: string;
    onCategoryChange: (categoryName: string) => void;
    onSubcategoryChange: (subcategoryId: string) => void;
}

interface MobileSidebarRef {
    resetExpansion: () => void;
}

const MobileSidebar = forwardRef<MobileSidebarRef, MobileSidebarProps>(({
    isOpen,
    onClose,
    categoriesWithSubcategories,
    selectedCategory,
    selectedSubcategory,
    onCategoryChange,
    onSubcategoryChange
}, ref) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    // Sincronizar expansión con categoría seleccionada
    useEffect(() => {
        if (selectedCategory) {
            setExpandedCategories(new Set([selectedCategory]));
        } else {
            setExpandedCategories(new Set());
        }
    }, [selectedCategory]);

    // Bloquear scroll del body
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useImperativeHandle(ref, () => ({
        resetExpansion: () => {
            setExpandedCategories(new Set());
        }
    }));

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
        onClose();
    };

    const handleSubcategoryClick = (subcategoryId: string, categoryName: string): void => {
        onCategoryChange(categoryName);
        onSubcategoryChange(subcategoryId);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 bottom-0 z-50 lg:hidden w-80 h-full nova-bg-primary transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="relative flex flex-col h-full">
                    {/* Header */}
                    <header className="p-3 flex items-center justify-between border-b border-gray-700">
                        <h2 className="text-base font-semibold text-white">
                            Categorías
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5 text-gray-200" />
                        </button>
                    </header>

                    {/* Body con acordeón */}
                    <div className="flex-1 overflow-y-auto px-3 py-3">
                        <div className="space-y-1">
                            {/* Todos los productos */}
                            <button
                                onClick={() => {
                                    onCategoryChange('');
                                    onSubcategoryChange('');
                                    setExpandedCategories(new Set());
                                    onClose();
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm ${
                                    !selectedCategory
                                        ? 'bg-gray-700 text-white'
                                        : 'bg-transparent text-gray-400'
                                }`}
                            >
                                <span className='text-gray-100'>Todos los productos</span>
                            </button>

                            {/* Categorías con acordeón */}
                            {categoriesWithSubcategories.map((category) => {
                                const isSelected = selectedCategory === category.name;
                                const isExpanded = expandedCategories.has(category.name);
                                const hasSubcategories = category.subcategories && category.subcategories.length > 0;

                                return (
                                    <div key={category.name}>
                                        {/* Categoría principal */}
                                        {hasSubcategories ? (
                                            <div>
                                                <div
                                                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm flex items-center justify-between ${
                                                        isSelected
                                                            ? 'bg-gray-700 text-white'
                                                            : 'bg-transparent text-gray-200'
                                                    }`}
                                                >
                                                    {/* Texto de categoría clickeable */}
                                                    <button
                                                        onClick={() => handleCategoryClick(category.name)}
                                                        className="flex-1 text-left capitalize"
                                                    >
                                                        {category.name}
                                                    </button>

                                                    {/* Botón para expandir/colapsar */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleCategory(category.name);
                                                        }}
                                                        className="p-1 rounded"
                                                    >
                                                        <svg
                                                            className={`w-4 h-4 transition-transform duration-200 text-orange-500 ${isExpanded ? 'rotate-180' : ''
                                                                }`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Subcategorías expandibles */}
                                                <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                    }`}>
                                                    <div className="ml-6 mt-1 space-y-1">
                                                        {category.subcategories?.map((subcategory) => {
                                                            const isSubcategorySelected = selectedSubcategory === subcategory.id && selectedCategory === category.name;
                                                            return (
                                                                <button
                                                                    key={subcategory.id}
                                                                    onClick={() => handleSubcategoryClick(subcategory.id, category.name)}
                                                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                                                                        isSubcategorySelected
                                                                            ? 'bg-gray-700 text-white'
                                                                            : 'bg-transparent text-gray-300'
                                                                    }`}
                                                                >
                                                                    {subcategory.name}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // Categoría sin subcategorías
                                            <button
                                                onClick={() => handleCategoryClick(category.name)}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors capitalize text-sm ${
                                                    isSelected
                                                        ? 'bg-gray-700 text-white'
                                                        : 'bg-transparent text-gray-200'
                                                }`}
                                            >
                                                {category.name}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default MobileSidebar;