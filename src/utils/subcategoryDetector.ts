import { SUBCATEGORY_RULES } from '@/config/subcategories';
import type { Subcategory, ProductForCategory } from '@/types/category.types';

// CACHÉ GLOBAL para evitar recálculos
const subcategoryCache = new Map<string, Subcategory>();

/**
 * Detecta la subcategoría de un producto de forma optimizada
 * Ahora soporta tanto string (nombre) como objeto producto completo
 */
export const detectSubcategory = (
    productOrName: ProductForCategory | string, 
    categoryName: string
): Subcategory => {
    if (!productOrName || !categoryName) {
        return {
            id: 'otros',
            name: 'Otros',
            description: 'Otros productos de esta categoría',
            category: categoryName,
            priority: 999,
            count: 0
        };
    }

    // Determinar si es un objeto producto o solo el nombre
    const isProductObject = typeof productOrName === 'object' && productOrName !== null;
    const productName = isProductObject ? productOrName.name : productOrName;
    const platform = isProductObject ? productOrName.platform : null;

    // USAR CACHÉ GLOBAL - incluir platform en la clave si existe
    const cacheKey = `${productName}-${categoryName}-${platform || ''}`;
    if (subcategoryCache.has(cacheKey)) {
        return subcategoryCache.get(cacheKey)!;
    }

    const normalizedCategory = categoryName.toLowerCase();
    
    // NUEVO: Si es motherboard o procesador Y tiene platform definido, usar directamente
    if (platform && (normalizedCategory === 'mothers' || normalizedCategory === 'procesadores')) {
        const result: Subcategory = {
            id: `${platform.toLowerCase()}-${normalizedCategory}`,
            name: platform, // Intel o AMD
            description: `${platform} ${categoryName}`,
            category: categoryName,
            priority: platform.toLowerCase() === 'intel' ? 1 : 2,
            count: 0
        };
        subcategoryCache.set(cacheKey, result);
        return result;
    }

    // Para otros casos, usar detección por keywords
    const normalizedName = productName.toLowerCase();
    
    // Buscar reglas para esta categoría
    const categoryRules = SUBCATEGORY_RULES[normalizedCategory];
    if (!categoryRules || !categoryRules.types) {
        const defaultResult: Subcategory = {
            id: 'otros',
            name: 'Otros',
            description: 'Otros productos de esta categoría',
            category: categoryName,
            priority: 999,
            count: 0
        };
        subcategoryCache.set(cacheKey, defaultResult);
        return defaultResult;
    }
    
    // Ordenar tipos por prioridad
    const sortedTypes = Object.values(categoryRules.types)
        .sort((a, b) => a.priority - b.priority);
    
    // Detectar el primer tipo que haga match
    for (const type of sortedTypes) {
        const hasMatch = type.keywords?.some(keyword => 
            normalizedName.includes(keyword.toLowerCase())
        );
        
        if (hasMatch) {
            const result: Subcategory = {
                ...type,
                category: categoryName,
                description: type.name,
                count: 0
            };
            subcategoryCache.set(cacheKey, result);
            return result;
        }
    }
    
    // Si no encuentra nada, retornar tipo "otros"
    const defaultResult: Subcategory = {
        id: 'otros',
        name: 'Otros',
        description: 'Otros productos de esta categoría',
        category: categoryName,
        priority: 999,
        count: 0
    };
    subcategoryCache.set(cacheKey, defaultResult);
    return defaultResult;
};

/**
 * Limpia la caché de subcategorías (útil para testing o memory management)
 */
export const clearSubcategoryCache = (): void => {
    subcategoryCache.clear();
};

/**
 * Obtiene estadísticas de la caché
 */
export const getCacheStats = (): { size: number; keys: string[] } => {
    return {
        size: subcategoryCache.size,
        keys: Array.from(subcategoryCache.keys()).slice(0, 5) // Primeras 5 keys para debug
    };
};

/**
 * Pre-calcula subcategorías para una lista de productos (útil para optimización inicial)
 */
export const precalculateSubcategories = (products: ProductForCategory[]): void => {
    products.forEach(product => {
        const cacheKey = `${product.name}-${product.categoryName}-${product.platform || ''}`;
        if (!subcategoryCache.has(cacheKey)) {
            detectSubcategory(product, product.categoryName);
        }
    });
};