// Imagen de producto
export interface ProductImage {
  id: number;
  imageUrl: string;    
  isMain: boolean;
  displayOrder: number; 
  productId: number;
}

// Enum para el estado del producto (debe coincidir con el backend)
export enum ProductStatus {
  Active = 0,
  Inactive = 1,
  Deleted = 2
}

// Producto completo (extendiendo el Product básico del cart)
export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  categoryName: string;
  brand?: string;
  model?: string;
  platform?: string;
  status: ProductStatus;
  deletedAt?: string;
  mainImageUrl: string;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

// Para listados de productos (versión simplificada)
export interface ProductSummary {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  categoryName: string;
  brand?: string;
  platform?: string;
  mainImageUrl: string;
  status: ProductStatus;
}

// Datos para crear producto
export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: number;
  brand?: string;
  model?: string;
  platform?: string;
  imageFiles?: File[];
  mainImageIndex?: number;
}

// Datos para actualizar producto
export interface UpdateProductData extends Partial<CreateProductData> {
  status?: ProductStatus;
}

// Datos para agregar imágenes
export interface AddImageData {
  imageFiles?: File[];
  imageUrls?: string[];
  mainImageIndex?: number;
}

// Filtros de productos
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  pageSize?: number;
}

// Respuesta paginada de productos
export interface ProductListResponse {
  data: ProductSummary[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

// Orden de imágenes
export interface ImageOrder {
  id: number;
  order: number;
}

// Estadísticas de productos
export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalCategories: number;
  totalBrands: number;
  lowStockProducts: number;
}

// Estructura de menú
export interface MenuItem {
  name: string;
  count: number;
  subcategories?: MenuItem[];
}