import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { productService } from '@/services/productService';
import { ProductDetail, CreateProductData, ProductStatus } from '@/types/product.types';
import { useQueryClient } from '@tanstack/react-query';
import type { FormImage } from './useProductFormData';

interface FormData extends CreateProductData {
    status: ProductStatus;
}

interface FormErrors {
    [key: string]: string;
}

const INITIAL_FORM_DATA: FormData = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    brand: '',
    model: '',
    platform: '',
    status: ProductStatus.Active
};

export const useProductForm = (
    product?: ProductDetail | null,
    onSuccess?: (productId?: number) => void
) => {
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const queryClient = useQueryClient();

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || 0,
                stock: product.stock || 0,
                categoryId: product.categoryId || 0,
                brand: product.brand || '',
                model: product.model || '',
                platform: product.platform || '',
                status: product.status ?? ProductStatus.Active
            });
        }
    }, [product]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ): void => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        let finalValue: any = value;

        if (type === 'checkbox') {
            finalValue = checked;
        } else if (type === 'number') {
            finalValue = parseFloat(value) || 0;
        } else if (name === 'status' || name === 'categoryId') {
            finalValue = parseInt(value) || 0;
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (
        isNewBrand: boolean,
        newBrand: string
    ): boolean => {
        const newErrors: FormErrors = {};

        // Validaciones básicas
        if (!formData.name?.trim()) newErrors.name = 'El nombre es requerido';
        if (!formData.price || formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
        if (formData.stock < 0) newErrors.stock = 'El stock debe ser 0 o mayor';

        // Validar categoría
        if (!formData.categoryId || formData.categoryId === 0) {
            newErrors.categoryId = 'La categoría es requerida';
        }

        // Validar marca (considerar nueva marca)
        const effectiveBrand = isNewBrand ? newBrand.trim() : formData.brand?.trim();
        if (!effectiveBrand) {
            newErrors.brand = isNewBrand
                ? 'Debe ingresar una nueva marca'
                : 'La marca es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (
        e: React.FormEvent,
        images: FormImage[],
        isNewBrand: boolean,
        newBrand: string,
        reloadData: () => Promise<void>
    ): Promise<void> => {
        e.preventDefault();

        const finalFormData = {
            ...formData,
            brand: isNewBrand ? newBrand : formData.brand
        };

        if (!validateForm(isNewBrand, newBrand)) return;

        setLoading(true);

        try {
            const newImages = images.filter(img => !img.isExisting && img.file);

            if (product) {
                // Actualización
                await productService.updateProduct(product.id, finalFormData);

                if (newImages.length > 0) {
                    const imageFiles = newImages.map(img => img.file!);
                    const mainImageIndex = newImages.findIndex(img => img.isMain);

                    await productService.addProductImages(product.id, {
                        imageFiles,
                        mainImageIndex: mainImageIndex >= 0 ? mainImageIndex : 0
                    });
                }

                toast.success('Producto actualizado exitosamente');
                onSuccess?.(product.id);
            } else {
                // Creación
                const productData: CreateProductData = {
                    ...finalFormData,
                    imageFiles: newImages.map(img => img.file!),
                    mainImageIndex: newImages.findIndex(img => img.isMain)
                };

                const created = await productService.createProduct(productData);
                toast.success('Producto creado exitosamente');
                onSuccess?.(created.id);
            }

            // Refresca la lista de productos
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });

            if (isNewBrand) {
                await reloadData();
            }

        } catch (err) {
            console.error('Error saving product:', err);
            const error = err as any;
            const message = error.response?.data?.message || error.message || 'Error al guardar producto';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const getInputValue = (name: keyof FormData, type?: string) => {
        const value = formData[name];
        if (type === 'number') {
            return value === 0 ? '' : value?.toString() || '';
        }
        return value?.toString() || '';
    };

    return {
        formData,
        loading,
        errors,
        handleInputChange,
        handleSubmit,
        getInputValue,
    };
};
