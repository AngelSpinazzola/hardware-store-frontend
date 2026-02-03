import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { productService } from '@/services/productService';
import { useCart } from '@/context/CartContext';
import { detectSubcategory } from '@/utils/subcategoryDetector';
import { ProductDetail as ProductDetailType } from '@/types/product.types';

interface LocationState {
    filters?: {
        category?: string;
        subcategory?: string;
        brand?: string;
        [key: string]: string | undefined;
    };
}

export const useProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<ProductDetailType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        if (id) {
            loadProduct();
        }
    }, [id]);

    const loadProduct = async (): Promise<void> => {
        if (!id) {
            setError('ID de producto no válido');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await productService.getProductById(parseInt(id));
            setProduct(data);
        } catch (err) {
            setError('Producto no encontrado');
            console.error('Error loading product:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = useCallback((): void => {
        if (product) {
            addToCart(product, quantity);
        }
    }, [product, quantity, addToCart]);

    const incrementQuantity = useCallback((): void => {
        if (product && quantity < product.stock) {
            setQuantity(prev => prev + 1);
        }
    }, [product, quantity]);

    const decrementQuantity = useCallback((): void => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    }, [quantity]);

    const handleQuantityChange = useCallback((value: number): void => {
        if (isNaN(value) || value < 1) {
            setQuantity(1);
        } else if (product && value > product.stock) {
            setQuantity(product.stock);
        } else {
            setQuantity(value);
        }
    }, [product]);

    const buildCategoryUrl = useCallback((category?: string) => {
        if (!category) return '/products';
        const newParams = new URLSearchParams();
        newParams.set('category', category);
        return `/products?${newParams.toString()}`;
    }, []);

    const buildSubcategoryUrl = useCallback((category: string, subcategoryId: string) => {
        const newParams = new URLSearchParams();
        newParams.set('category', category);
        newParams.set('subcategory', subcategoryId);
        return `/products?${newParams.toString()}`;
    }, []);

    const getProductSubcategory = useCallback(() => {
        if (!product) return null;
        const subcategory = detectSubcategory(product, product.categoryName);
        return subcategory && subcategory.id !== 'otros' ? subcategory : null;
    }, [product]);

    const buildAllProductsUrl = useCallback(() => {
        const state = location.state as LocationState | null;
        if (state?.filters) {
            const { category: _category, subcategory: _subcategory, brand: _brand, ...otherFilters } = state.filters;
            const searchParams = new URLSearchParams();
            Object.entries(otherFilters).forEach(([key, value]) => {
                if (value) searchParams.set(key, value as string);
            });
            const queryString = searchParams.toString();
            return queryString ? `/products?${queryString}` : '/products';
        }
        return '/products';
    }, [location.state]);

    return {
        product,
        loading,
        error,
        quantity,
        handleAddToCart,
        incrementQuantity,
        decrementQuantity,
        handleQuantityChange,
        buildCategoryUrl,
        buildSubcategoryUrl,
        getProductSubcategory,
        buildAllProductsUrl,
        productSubcategory: getProductSubcategory(),
    };
};
