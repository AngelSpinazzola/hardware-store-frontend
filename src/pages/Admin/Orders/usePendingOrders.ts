// src/pages/Admin/Orders/usePendingOrders.ts
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { toast } from 'react-toastify';
import type { OrderSummary } from '@/types/order.types';

interface UsePendingOrdersReturn {
  orders: OrderSummary[];
  loading: boolean;
  error: string | null;
  processingOrder: number | null;
  handleApprovePayment: (orderId: number, notes: string) => Promise<void>;
  handleRejectPayment: (orderId: number, notes: string) => Promise<void>;
  loadOrders: () => Promise<void>;
}

export const usePendingOrders = (): UsePendingOrdersReturn => {
  const queryClient = useQueryClient();
  const [processingOrderId, setProcessingOrderId] = useState<number | null>(null);

  // Query para obtener órdenes pendientes (con cache)
  const {
    data: orders = [],
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['pending-orders'],
    queryFn: async () => {
      try {
        return await orderService.getOrdersPendingReview();
      } catch (err: any) {
        const errorMessage = err?.message || 'Error al cargar órdenes pendientes';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minuto (se actualizan frecuentemente)
  });

  // Mutation para aprobar pago
  const approveMutation = useMutation({
    mutationFn: ({ orderId, notes }: { orderId: number; notes: string }) =>
      orderService.approvePayment(orderId, notes),
    onMutate: ({ orderId }) => {
      setProcessingOrderId(orderId);
    },
    onSuccess: () => {
      toast.success('Pago aprobado exitosamente');
      // Invalidar ambos caches (pending orders y all orders)
      queryClient.invalidateQueries({ queryKey: ['pending-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || 'Error al aprobar el pago';
      toast.error(errorMessage);
    },
    onSettled: () => {
      setProcessingOrderId(null);
    }
  });

  // Mutation para rechazar pago
  const rejectMutation = useMutation({
    mutationFn: ({ orderId, notes }: { orderId: number; notes: string }) =>
      orderService.rejectPayment(orderId, notes),
    onMutate: ({ orderId }) => {
      setProcessingOrderId(orderId);
    },
    onSuccess: () => {
      toast.success('Pago rechazado');
      // Invalidar ambos caches
      queryClient.invalidateQueries({ queryKey: ['pending-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || 'Error al rechazar el pago';
      toast.error(errorMessage);
    },
    onSettled: () => {
      setProcessingOrderId(null);
    }
  });

  // Handlers
  const handleApprovePayment = async (orderId: number, notes: string): Promise<void> => {
    await approveMutation.mutateAsync({ orderId, notes });
  };

  const handleRejectPayment = async (orderId: number, notes: string): Promise<void> => {
    await rejectMutation.mutateAsync({ orderId, notes });
  };

  const loadOrders = async (): Promise<void> => {
    await refetch();
  };

  return {
    orders,
    loading: isLoading,
    error: queryError?.message || null,
    processingOrder: processingOrderId,
    handleApprovePayment,
    handleRejectPayment,
    loadOrders
  };
};