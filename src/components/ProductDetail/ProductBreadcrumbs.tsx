import React from 'react';
import { Link } from 'react-router-dom';

interface Subcategory {
    id: string;
    name: string;
}

interface ProductBreadcrumbsProps {
    category: string;
    subcategory?: Subcategory | null;
    buildAllProductsUrl: () => string;
    buildCategoryUrl: (category: string) => string;
    buildSubcategoryUrl: (category: string, subcategoryId: string) => string;
}

const ProductBreadcrumbs: React.FC<ProductBreadcrumbsProps> = ({
    category,
    subcategory,
    buildAllProductsUrl,
    buildCategoryUrl,
    buildSubcategoryUrl,
}) => {
    return (
        <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
            <Link
                to={buildAllProductsUrl()}
                className="font-bold transition-colors hover:underline"
            >
                Todos los productos
            </Link>
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <Link
                to={buildCategoryUrl(category)}
                className="font-bold transition-colors hover:underline"
            >
                {category}
            </Link>
            {subcategory && (
                <>
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <Link
                        to={buildSubcategoryUrl(category, subcategory.id)}
                        className="font-bold transition-colors hover:underline"
                    >
                        {subcategory.name}
                    </Link>
                </>
            )}
        </div>
    );
};

export default ProductBreadcrumbs;
