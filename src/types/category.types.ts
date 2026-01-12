// Categoría del backend
export interface Category {
  id: number;
  name: string;
}

// Producto básico para categorías (simplificado)
export interface ProductForCategory {
  id: number;
  name: string;
  category: string;
  brand?: string;
  platform?: string;
}

// Subcategoría
export interface Subcategory {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: number;
  count: number;
}

// Categoría con subcategorías
export interface CategoryWithSubcategories {
  name: string;
  count: number;
  subcategories: Subcategory[];
}

// Estructura de categorías temporales (para construcción)
export interface TempCategoryStructure {
  name: string;
  count: number;
  subcategories: Record<string, Subcategory>;
}

// Reglas de subcategorías
export interface SubcategoryRule {
  keywords: string[];
  priority: number;
}