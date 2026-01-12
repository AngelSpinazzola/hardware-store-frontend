import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import type { OrderSummary } from '../types/order.types';

export const useMyOrders = () => {
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 6
    });

    useEffect(() => {
        if (isAuthenticated) {
            loadMyOrders();
        }
    }, [isAuthenticated]);

    const loadMyOrders = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const orderData = await orderService.getMyOrders();
            setOrders(orderData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar las órdenes';
            setError(errorMessage);
            console.error('Error loading orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const paginatedOrders = useMemo(() => {
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const endIndex = startIndex + pagination.itemsPerPage;
        return orders.slice(startIndex, endIndex);
    }, [orders, pagination.currentPage, pagination.itemsPerPage]);

    const totalPages = Math.ceil(orders.length / pagination.itemsPerPage);

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleCancelOrder = async (orderId: number) => {
        try {
            const { default: Swal } = await import('sweetalert2');

            const result = await Swal.fire({
                title: '¿Cancelar orden?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Sí, cancelar',
                cancelButtonText: 'No cancelar',
                reverseButtons: true,
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mr-3',
                    cancelButton: 'bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700',
                    actions: 'flex flex-row-reverse'
                }
            });

            if (result.isConfirmed) {
                await orderService.cancelOrder(orderId);

                await Swal.fire({
                    title: 'Orden cancelada',
                    text: 'Tu orden ha sido cancelada correctamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

                await loadMyOrders();
            }
        } catch (error) {
            console.error('Error cancelling order:', error);

            const { default: Swal } = await import('sweetalert2');
            await Swal.fire({
                title: 'Error',
                text: error instanceof Error ? error.message : 'No se pudo cancelar la orden',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
    };

    return {
        orders,
        paginatedOrders,
        loading,
        error,
        pagination,
        totalPages,
        handlePageChange,
        handleCancelOrder,
        loadMyOrders
    };
};
