import api from './api';
import type {
  ProductDetail,
  ProductSummary,
  ProductListResponse,
  CreateProductData,
  UpdateProductData,
  AddImageData,
  ProductFilters,
  ProductImage,
  ProductStats,
  MenuItem
} from '@/types/product.types';
import { PRODUCT_PLACEHOLDER_IMAGE } from '@/config/constants';


export const productService = {
  // Obtiene todos los productos (público)
  getAllProducts: async (page: number = 1, pageSize: number = 20): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>(`/product?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  getAllProductsForAdmin: async (): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>(`/product/admin/all`);
    return response.data;
  },

  // Obtiene producto por ID (público)
  getProductById: async (id: number): Promise<ProductDetail> => {
    const response = await api.get<ProductDetail>(`/product/${id}`);
    return response.data;
  },

  // Crea producto (Admin)
  createProduct: async (productData: CreateProductData): Promise<ProductDetail> => {
    const formData = new FormData();

    // Campos básicos
    formData.append('Name', productData.name);
    formData.append('Description', productData.description || '');
    formData.append('Price', productData.price.toString());
    formData.append('Stock', productData.stock.toString());
    if (productData.categoryId) {
      formData.append('CategoryId', productData.categoryId.toString());
    }

    // NUEVOS - Brand y Model
    formData.append('Brand', productData.brand || '');
    if (productData.model) {
      formData.append('Model', productData.model);
    }

    // PLATFORM
    if (productData.platform) {
      formData.append('Platform', productData.platform);
    }

    // Agrega múltiples imágenes si existen
    if (productData.imageFiles && productData.imageFiles.length > 0) {
      for (let i = 0; i < productData.imageFiles.length; i++) {
        formData.append('ImageFiles', productData.imageFiles[i]);
      }
    }

    // Agrega MainImageIndex si existe
    if (productData.mainImageIndex !== undefined) {
      formData.append('MainImageIndex', productData.mainImageIndex.toString());
    }

    const response = await api.post<ProductDetail>('/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Actualiza producto (Admin)
  updateProduct: async (id: number, productData: UpdateProductData): Promise<ProductDetail> => {
    const formData = new FormData();

    formData.append('Name', productData.name || '');
    formData.append('Description', productData.description || '');
    if (productData.price !== undefined) {
      formData.append('Price', productData.price.toString());
    }
    if (productData.stock !== undefined) {
      formData.append('Stock', productData.stock.toString());
    }
    if (productData.categoryId !== undefined && productData.categoryId > 0) {
      formData.append('CategoryId', productData.categoryId.toString());
    }

    // NUEVOS - Brand y Model
    if (productData.brand) {
      formData.append('Brand', productData.brand);
    }
    if (productData.model) {
      formData.append('Model', productData.model);
    }

    // PLATFORM
    if (productData.platform) {
      formData.append('Platform', productData.platform);
    }

    // STATUS
    if (productData.status !== undefined) {
      formData.append('Status', productData.status.toString());
    }

    // Agrega nuevas imágenes si existen
    if (productData.imageFiles && productData.imageFiles.length > 0) {
      for (let i = 0; i < productData.imageFiles.length; i++) {
        formData.append('ImageFiles', productData.imageFiles[i]);
      }
    }

    // MainImageIndex
    if (productData.mainImageIndex !== undefined) {
      formData.append('MainImageIndex', productData.mainImageIndex.toString());
    }

    const response = await api.put<ProductDetail>(`/product/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Elimina producto (Admin)
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/product/${id}`);
  },

  // Obtiene imágenes de un producto
  getProductImages: async (productId: number): Promise<ProductImage[]> => {
    const response = await api.get<ProductImage[]>(`/product/${productId}/images`);
    return response.data;
  },

  // Agrega imágenes a un producto existente
  addProductImages: async (productId: number, imageData: AddImageData): Promise<ProductImage[]> => {
    const formData = new FormData();

    if (imageData.imageFiles && imageData.imageFiles.length > 0) {
      for (let i = 0; i < imageData.imageFiles.length; i++) {
        formData.append('ImageFiles', imageData.imageFiles[i]);
      }
    }

    if (imageData.imageUrls && imageData.imageUrls.length > 0) {
      for (let i = 0; i < imageData.imageUrls.length; i++) {
        formData.append('ImageUrls', imageData.imageUrls[i]);
      }
    }

    if (imageData.mainImageIndex !== undefined) {
      formData.append('MainImageIndex', imageData.mainImageIndex.toString());
    }

    const response = await api.post<ProductImage[]>(`/product/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Elimina imagen específica
  deleteProductImage: async (productId: number, imageId: number): Promise<void> => {
    await api.delete(`/product/${productId}/images/${imageId}`);
  },

  // Establece imagen principal
  setMainImage: async (productId: number, imageId: number): Promise<ProductImage> => {
    const response = await api.put<ProductImage>(`/product/${productId}/images/${imageId}/main`);
    return response.data;
  },

  // Actualiza orden de imágenes
  updateImagesOrder: async (productId: number, updateData: any): Promise<ProductImage[]> => {
    const response = await api.put<ProductImage[]>(`/product/${productId}/images/order`, updateData);
    return response.data;
  },

  // Obtiene productos por categoría (público)
  getProductsByCategory: async (category: string): Promise<ProductSummary[]> => {
    const response = await api.get<ProductSummary[]>(`/product/category/${category}`);
    return response.data;
  },

  // NUEVO - Obtiene productos por marca (público)
  getProductsByBrand: async (brand: string): Promise<ProductSummary[]> => {
    const response = await api.get<ProductSummary[]>(`/product/brand/${brand}`);
    return response.data;
  },

  // Busca productos (público)
  searchProducts: async (term: string): Promise<ProductSummary[]> => {
    const response = await api.get<ProductSummary[]>(`/product/search?term=${encodeURIComponent(term)}`);
    return response.data;
  },

  // NUEVO - Filtrado avanzado
  filterProducts: async (filters: ProductFilters = {}): Promise<ProductListResponse> => {
    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());

    const response = await api.get<ProductListResponse>(`/product/filter?${params.toString()}`);
    return response.data;
  },

  // Obtiene categorías (público)
  getCategories: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/product/categories');
    return response.data;
  },

  // NUEVO - Obtiene marcas (público)
  getBrands: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/product/brands');
    return response.data;
  },

  // NUEVO - Obtiene estructura de menú
  getMenuStructure: async (): Promise<MenuItem[]> => {
    const response = await api.get<MenuItem[]>('/product/menu-structure');
    return response.data;
  },

  // NUEVO - Obtiene estadísticas
  getProductStats: async (): Promise<ProductStats> => {
    const response = await api.get<ProductStats>('/product/stats');
    return response.data;
  },

  // Construye URL completa de imagen
  getImageUrl: (imageUrl: string): string => {
    if (!imageUrl || imageUrl === '' || imageUrl === 'null' || imageUrl === 'undefined') {
      return PRODUCT_PLACEHOLDER_IMAGE; 
    }

    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    return `https://localhost:7209${imageUrl}`;
  }
};