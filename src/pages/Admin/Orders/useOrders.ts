// src/pages/Admin/Orders/useOrders.ts
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { toast } from 'react-toastify';
import type { OrderSummary, OrderStatus } from '@/types/order.types';

interface UseOrdersReturn {
  orders: OrderSummary[];
  filteredOrders: OrderSummary[];
  loading: boolean;
  error: string | null;
  selectedStatus: string;
  expandedOrder: number | null;
  sortBy: string;
  searchTerm: string;
  processingOrder: number | null;
  stats: OrderStats;
  statusOptions: StatusOption[];
  setSelectedStatus: (status: string) => void;
  setExpandedOrder: (id: number | null) => void;
  setSortBy: (sort: string) => void;
  setSearchTerm: (term: string) => void;
  handleApprovePayment: (orderId: number, notes: string) => Promise<void>;
  handleRejectPayment: (orderId: number, notes: string) => Promise<void>;
  loadOrders: () => Promise<void>;
}

interface OrderStats {
  totalOrders: number;
  pendingPayments: number;
  approvedPayments: number;
  rejectedPayments: number;
  totalRevenue: number;
}

interface StatusOption {
  status: OrderStatus | 'all';
  count: number;
  label: string;
}

// Función para calcular estadísticas (pura, sin side effects)
const calculateStats = (ordersList: OrderSummary[]): OrderStats => {
  const totalOrders = ordersList.length;
  const pendingPayments = ordersList.filter(o => 
    o.status === 'pending_payment' || o.status === 'payment_submitted'
  ).length;
  const approvedPayments = ordersList.filter(o => 
    ['payment_approved', 'shipped', 'delivered', 'completed'].includes(o.status)
  ).length;
  const rejectedPayments = ordersList.filter(o => 
    o.status === 'payment_rejected' || o.status === 'cancelled'
  ).length;
  const totalRevenue = ordersList
    .filter(o => ['payment_approved', 'shipped', 'delivered', 'completed'].includes(o.status))
    .reduce((sum, order) => sum + order.total, 0);

  return {
    totalOrders,
    pendingPayments,
    approvedPayments,
    rejectedPayments,
    totalRevenue
  };
};

// Función para filtrar órdenes (pura, sin side effects)
const filterOrders = (
  orders: OrderSummary[],
  selectedStatus: string,
  searchTerm: string,
  sortBy: string
): OrderSummary[] => {
  let result = [...orders];

  // Filtrar por estado
  if (selectedStatus !== 'all') {
    if (selectedStatus === 'pending_payment') {
      result = result.filter(o => o.status === 'pending_payment' || o.status === 'payment_submitted');
    } else if (selectedStatus === 'payment_rejected') {
      result = result.filter(o => o.status === 'payment_rejected' || o.status === 'cancelled');
    } else {
      result = result.filter(o => o.status === selectedStatus);
    }
  }

  // Filtrar por búsqueda
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    result = result.filter(order =>
      order.id.toString().includes(term) ||
      order.customerName.toLowerCase().includes(term) ||
      order.customerEmail.toLowerCase().includes(term) ||
      (order.shippingCity && order.shippingCity.toLowerCase().includes(term)) ||
      (order.shippingProvince && order.shippingProvince.toLowerCase().includes(term))
    );
  }

  // Ordenar
  switch (sortBy) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'highest':
      result.sort((a, b) => b.total - a.total);
      break;
    case 'lowest':
      result.sort((a, b) => a.total - b.total);
      break;
  }

  return result;
};

export const useOrders = (): UseOrdersReturn => {
  const queryClient = useQueryClient();
  
  // Estados locales
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Query para obtener órdenes (con cache)
  const { 
    data: orders = [], 
    isLoading, 
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      try {
        return await orderService.getAllOrders();
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Error al cargar las órdenes';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutos (se actualizan más frecuentemente que analytics)
  });

  // Mutation para aprobar pago
  const approveMutation = useMutation({
    mutationFn: ({ orderId, notes }: { orderId: number; notes: string }) =>
      orderService.approvePayment(orderId, notes),
    onSuccess: () => {
      toast.success('Pago aprobado exitosamente');
      // Invalidar TODOS los caches relacionados
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['sales-by-category'] });
      queryClient.invalidateQueries({ queryKey: ['products-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['sales-analytics'] });
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || 'Error al aprobar el pago';
      toast.error(errorMessage);
    }
  });

  // Mutation para rechazar pago
  const rejectMutation = useMutation({
    mutationFn: ({ orderId, notes }: { orderId: number; notes: string }) =>
      orderService.rejectPayment(orderId, notes),
    onSuccess: () => {
      toast.success('Pago rechazado');
      // Invalidar TODOS los caches relacionados
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['sales-by-category'] });
      queryClient.invalidateQueries({ queryKey: ['products-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['sales-analytics'] });
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || 'Error al rechazar el pago';
      toast.error(errorMessage);
    }
  });

  // Estadísticas calculadas con useMemo
  const stats = useMemo(() => calculateStats(orders), [orders]);

  // Órdenes filtradas con useMemo
  const filteredOrders = useMemo(
    () => filterOrders(orders, selectedStatus, searchTerm, sortBy),
    [orders, selectedStatus, searchTerm, sortBy]
  );

  // Opciones de estado con useMemo
  const statusOptions: StatusOption[] = useMemo(() => [
    { status: 'all', count: orders.length, label: 'Todas' },
    { 
      status: 'pending_payment', 
      count: orders.filter(o => o.status === 'pending_payment' || o.status === 'payment_submitted').length,
      label: 'Pendiente de Pago'
    },
    { 
      status: 'payment_approved', 
      count: orders.filter(o => o.status === 'payment_approved').length,
      label: 'Pago Aprobado'
    },
    { 
      status: 'shipped', 
      count: orders.filter(o => o.status === 'shipped').length,
      label: 'Enviado'
    },
    { 
      status: 'delivered', 
      count: orders.filter(o => o.status === 'delivered').length,
      label: 'Entregado'
    },
    { 
      status: 'payment_rejected', 
      count: orders.filter(o => o.status === 'payment_rejected' || o.status === 'cancelled').length,
      label: 'Rechazado'
    }
  ], [orders]);

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
    filteredOrders,
    loading: isLoading,
    error: queryError?.message || null,
    selectedStatus,
    expandedOrder,
    sortBy,
    searchTerm,
    processingOrder: approveMutation.isPending || rejectMutation.isPending 
      ? (approveMutation.variables?.orderId || rejectMutation.variables?.orderId || null)
      : null,
    stats,
    statusOptions,
    setSelectedStatus,
    setExpandedOrder,
    setSortBy,
    setSearchTerm,
    handleApprovePayment,
    handleRejectPayment,
    loadOrders
  };
};