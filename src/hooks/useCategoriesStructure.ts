import { useMemo } from 'react';
import { SUBCATEGORY_RULES } from '@/config/subcategories';
import { detectSubcategory } from '@/utils/subcategoryDetector';
import type { 
  ProductForCategory, 
  CategoryWithSubcategories, 
  TempCategoryStructure,
  Subcategory 
} from '@/types/category.types';

/**
 * Hook optimizado para construir la estructura jerárquica de categorías
 * Ahora con soporte para el campo platform del backend
 */
export const useCategoriesStructure = (products: ProductForCategory[]): CategoryWithSubcategories[] => {
    return useMemo((): CategoryWithSubcategories[] => {
        if (!products || products.length === 0) {
            return [];
        }

        const categoryCount: Record<string, TempCategoryStructure> = {};
        // Caché para evitar recalcular subcategorías del mismo producto
        const subcategoryCache = new Map<string, Subcategory>();

        // Procesar productos una sola vez
        products.forEach((product: ProductForCategory) => {
            const categoryName = product.categoryName;

            // Inicializar categoría si no existe
            if (!categoryCount[categoryName]) {
                categoryCount[categoryName] = {
                    name: categoryName,
                    count: 0,
                    subcategories: {}
                };
            }

            categoryCount[categoryName].count++;

            // Procesar subcategorías
            const normalizedCategory = categoryName.toLowerCase();

            // NUEVO: Verificar si debe usar platform directamente
            if ((normalizedCategory === 'mothers' || normalizedCategory === 'procesadores') && product.platform) {
                const platformId = `${product.platform.toLowerCase()}-${normalizedCategory}`;

                if (!categoryCount[categoryName].subcategories[platformId]) {
                    categoryCount[categoryName].subcategories[platformId] = {
                        id: platformId,
                        name: product.platform,
                        description: `${product.platform} ${categoryName}`,
                        category: categoryName,
                        priority: product.platform.toLowerCase() === 'intel' ? 1 : 2,
                        count: 0
                    };
                }
                categoryCount[categoryName].subcategories[platformId].count++;

            } else if (SUBCATEGORY_RULES[normalizedCategory]) {
                // Para otras categorías, usar detección por keywords
                const cacheKey = `${product.name}-${categoryName}-${product.platform || ''}`;

                let subcategory: Subcategory;
                if (subcategoryCache.has(cacheKey)) {
                    subcategory = subcategoryCache.get(cacheKey)!;
                } else {
                    // Pasar el producto completo para que detectSubcategory pueda usar platform si existe
                    subcategory = detectSubcategory(product, categoryName);
                    subcategoryCache.set(cacheKey, subcategory);
                }

                const subId = subcategory.id;

                // Inicializar subcategoría si no existe
                if (!categoryCount[categoryName].subcategories[subId]) {
                    categoryCount[categoryName].subcategories[subId] = {
                        ...subcategory,
                        count: 0
                    };
                }
                categoryCount[categoryName].subcategories[subId].count++;
            }
        });

        // Convertir a array y ordenar una sola vez
        const result: CategoryWithSubcategories[] = Object.values(categoryCount)
            .map((category: TempCategoryStructure) => ({
                name: category.name,
                count: category.count,
                subcategories: Object.values(category.subcategories)
                    .sort((a, b) => a.priority - b.priority)
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        return result;

    }, [products]);
};