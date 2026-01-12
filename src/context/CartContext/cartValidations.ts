import type { Product, CartItem } from '@/types/cart.types';
import { ProductStatus } from '@/types/product.types';

interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateProduct = (product: Product): ValidationResult => {
    if (!product || !product.id) {
        return { isValid: false, error: 'Producto inválido' };
    }

    if (product.status !== ProductStatus.Active) {
        return { isValid: false, error: 'Este producto no está disponible' };
    }

    if (product.stock <= 0) {
        return { isValid: false, error: 'Producto sin stock' };
    }

    return { isValid: true };
};

export const validateQuantity = (quantity: number): ValidationResult => {
    if (quantity <= 0) {
        return { isValid: false, error: 'Cantidad debe ser mayor a 0' };
    }

    return { isValid: true };
};

export const validateStock = (
    requestedQuantity: number,
    availableStock: number,
    currentQuantity: number = 0
): ValidationResult => {
    const newTotalQuantity = currentQuantity + requestedQuantity;

    if (newTotalQuantity > availableStock) {
        return {
            isValid: false,
            error: `Solo hay ${availableStock} unidades disponibles`
        };
    }

    return { isValid: true };
};

export const createCartItem = (product: Product, quantity: number): CartItem => {
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        mainImageUrl: product.mainImageUrl,
        stock: product.stock,
        quantity: quantity
    };
};
