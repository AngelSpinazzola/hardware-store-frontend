import { CategoryWithSubcategories } from './types';

interface CategoryListProps {
    categories: CategoryWithSubcategories[];
    selectedCategory: string | null;
    selectedSubcategory: string | null;
    expandedCategories: Set<string>;
    onCategoryClick: (categoryName: string) => void;
    onSubcategoryClick: (subcategoryId: string, categoryName: string) => void;
    onToggleCategory: (categoryName: string) => void;
    onResetAll: () => void;
}

const CategoryList = ({
    categories,
    selectedCategory,
    selectedSubcategory,
    expandedCategories,
    onCategoryClick,
    onSubcategoryClick,
    onToggleCategory,
    onResetAll
}: CategoryListProps) => {
    return (
        <>
            {/* Todos los productos */}
            <button
                onClick={onResetAll}
                className="w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between group relative overflow-hidden text-gray-800 hover:bg-gray-100"
            >
                <div className="flex items-center space-x-3 relative z-10">
                    <span className="text-sm font-medium">Todos los productos</span>
                </div>
            </button>

            {/* Categorías con estructura jerárquica */}
            {categories.map((category) => {
                const isSelected = selectedCategory === category.name;
                const isExpanded = expandedCategories.has(category.name);
                const hasSubcategories = category.subcategories && category.subcategories.length > 0;

                return (
                    <div key={category.name} className="relative">
                        {/* Categoría principal */}
                        <button
                            onClick={() => onCategoryClick(category.name)}
                            className={`w-full text-left px-4 py-2 rounded-md transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                                isSelected ? 'bg-gray-200 text-gray-800' : 'text-gray-800 hover:bg-gray-100'
                            }`}
                        >
                            <div className="flex items-center justify-between w-full relative z-10">
                                <div className="flex items-center space-x-3">
                                    <span className="capitalize text-sm font-medium">{category.name}</span>
                                </div>

                                {/* Flecha expandir */}
                                {hasSubcategories && (
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleCategory(category.name);
                                        }}
                                        className="text-orange-500 cursor-pointer p-1 hover:bg-white/10 rounded transition-all duration-200"
                                    >
                                        <svg
                                            className={`w-3.5 h-3.5 transition-all duration-300 text-orange-500 ${
                                                isExpanded ? 'rotate-90' : 'hover:scale-110'
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2.5}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        </button>

                        {/* Subcategorías */}
                        <div className={`transition-all duration-300 ease-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            {hasSubcategories && (
                                <div className="ml-6 mt-2 space-y-1">
                                    {category.subcategories.map((subcategory, subIndex) => (
                                        <button
                                            key={subcategory.id}
                                            onClick={() => onSubcategoryClick(subcategory.id, category.name)}
                                            className={`w-full text-left px-3 py-1 rounded-md transition-all duration-200 flex items-center group relative ${
                                                selectedSubcategory === subcategory.id ? 'bg-gray-200 text-gray-800' : 'text-gray-800 hover:bg-gray-100'
                                            }`}
                                            style={{ animationDelay: `${subIndex * 50}ms` }}
                                        >
                                            <span className="text-sm">{subcategory.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default CategoryList;
