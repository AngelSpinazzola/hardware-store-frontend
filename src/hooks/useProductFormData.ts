import { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import categoryService from '@/services/categoryService';
import { ProductDetail } from '@/types/product.types';
import { Category } from '@/types/category.types';

interface FormImage {
    id: number | string;
    url: string;
    isMain: boolean;
    displayOrder: number;
    isExisting: boolean;
    file: File | null;
}

export const useProductFormData = (product?: ProductDetail | null) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [images, setImages] = useState<FormImage[]>([]);

    // Estados para nuevas marcas
    const [isNewBrand, setIsNewBrand] = useState<boolean>(false);
    const [newBrand, setNewBrand] = useState<string>('');

    useEffect(() => {
        loadCategories();
        loadBrands();

        if (product) {
            loadProductImages(product.id);
        }
    }, [product]);

    const loadProductImages = async (productId: number): Promise<void> => {
        try {
            const productImages = await productService.getProductImages(productId);
            if (productImages && productImages.length > 0) {
                const existingImages = productImages
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((img): FormImage => ({
                        id: img.id,
                        url: productService.getImageUrl(img.imageUrl),
                        isMain: img.isMain,
                        displayOrder: img.displayOrder,
                        isExisting: true,
                        file: null
                    }))
                    .filter(img =>
                        !img.url.includes('placehold.co') &&
                        !img.url.includes('picsum.photos')
                    );

                setImages(existingImages);
            }
        } catch (error) {
            console.error('Error loading product images:', error);
        }
    };

    const loadCategories = async (): Promise<void> => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (err) {
            console.error('Error loading categories:', err);
        }
    };

    const loadBrands = async (): Promise<void> => {
        try {
            const data = await productService.getBrands();
            setBrands(data);
        } catch (err) {
            console.error('Error loading brands:', err);
        }
    };

    const reloadData = async (): Promise<void> => {
        await Promise.all([loadCategories(), loadBrands()]);
    };

    return {
        categories,
        brands,
        images,
        setImages,
        isNewBrand,
        setIsNewBrand,
        newBrand,
        setNewBrand,
        reloadData,
    };
};

export type { FormImage };
