// src/pages/Admin/Products/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { toast } from 'react-toastify';
import type { ProductSummary, ProductDetail, ProductListResponse } from '@/types/product.types';

interface UseProductsReturn {
  products: ProductSummary[];
  loading: boolean;
  error: string | null;
  categories: string[];
  loadProducts: () => Promise<void>;
  handleDeleteProduct: (productId: number, productName: string) => Promise<void>;
  getProductById: (productId: number) => Promise<ProductDetail>;
  isDeleting: boolean;
}

export const useProducts = (): UseProductsReturn => {
  const queryClient = useQueryClient();

  // Query para obtener productos
  const { 
    data: products = [], 
    isLoading, 
    error: queryError,
    refetch: refetchProducts
  } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async (): Promise<ProductSummary[]> => {
      try {
        const productsResponse: ProductListResponse = await productService.getAllProductsForAdmin();

        let productsData: ProductSummary[];
        if (productsResponse?.data && Array.isArray(productsResponse.data)) {
          productsData = productsResponse.data;
        } else if (Array.isArray(productsResponse)) {
          productsData = productsResponse as unknown as ProductSummary[];
        } else {
          console.error('Unexpected products format:', productsResponse);
          productsData = [];
        }

        return productsData;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Error al cargar los productos';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Query para obtener categorías
  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async (): Promise<string[]> => {
      try {
        const categoriesResponse: string[] = await productService.getCategories();
        return Array.isArray(categoriesResponse) ? categoriesResponse : [];
      } catch (err: any) {
        console.error('Error loading categories:', err);
        toast.error('Error al cargar las categorías');
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutos (categorías cambian menos frecuentemente)
  });

  // Mutation para eliminar producto
  const deleteMutation = useMutation({
    mutationFn: async ({ productId, productName }: { productId: number; productName: string }) => {
      if (!window.confirm(`¿Estás seguro de que quieres eliminar "${productName}"? Esta acción no se puede deshacer.`)) {
        throw new Error('Cancelled by user');
      }
      await productService.deleteProduct(productId);
    },
    onSuccess: () => {
      toast.success('Producto eliminado exitosamente');
      // Invalidar cache para refrescar la lista de productos
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err: any) => {
      if (err.message !== 'Cancelled by user') {
        const errorMessage = err.response?.data?.message || 'Error al eliminar producto';
        toast.error(errorMessage);
      }
    }
  });

  // Función para obtener producto por ID (puede mantenerse como está o convertirse en query)
  const getProductById = async (productId: number): Promise<ProductDetail> => {
    return await productService.getProductById(productId);
  };

  // Handlers
  const loadProducts = async (): Promise<void> => {
    await refetchProducts();
  };

  const handleDeleteProduct = async (productId: number, productName: string): Promise<void> => {
    await deleteMutation.mutateAsync({ productId, productName });
  };

  return {
    products,
    loading: isLoading || categoriesLoading,
    error: queryError?.message || null,
    categories,
    loadProducts,
    handleDeleteProduct,
    getProductById,
    isDeleting: deleteMutation.isPending
  };
};