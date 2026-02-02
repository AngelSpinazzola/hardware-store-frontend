import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { orderService } from '@/services/orderService';
import { toast } from 'react-toastify';
import type { OrderConfirmationDetail } from '@/types/order.types';

interface UseOrderDetailReturn {
  order: OrderConfirmationDetail | null;
  loading: boolean;
  error: string | null;
  loadOrder: () => Promise<void>;
}

export const useOrderDetail = (orderId: string | undefined): UseOrderDetailReturn => {
  const [order, setOrder] = useState<OrderConfirmationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrder = async (): Promise<void> => {
    if (!orderId) {
      setError('ID de orden no válido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const orderData = await orderService.getOrderById(parseInt(orderId));
      setOrder(orderData);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Error al cargar la orden';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  return {
    order,
    loading,
    error,
    loadOrder
  };
};