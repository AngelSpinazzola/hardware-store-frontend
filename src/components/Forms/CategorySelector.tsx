import React from 'react';
import { Category } from '@/types/category.types';

interface CategorySelectorProps {
    categories: Category[];
    selectedCategoryId: number | undefined;
    onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
    categories,
    selectedCategoryId,
    onCategoryChange,
    error,
}) => {
    return (
        <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Categoría <span className="text-red-500">*</span>
            </label>
            <select
                id="categoryId"
                name="categoryId"
                value={selectedCategoryId || ''}
                onChange={onCategoryChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    error ? 'border-red-500' : ''
                }`}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'categoryId-error' : undefined}
            >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>

            {error && (
                <p id="categoryId-error" className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default CategorySelector;
