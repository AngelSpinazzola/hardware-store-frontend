// src/pages/Admin/Analytics/hooks/useProductsAnalytics.ts
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import type { OrderConfirmationDetail, OrderItemWithSubtotal } from '@/types/order.types';

export interface ProductStats {
    productId: number;
    productName: string;
    totalSold: number;
    totalRevenue: number;
    orderCount: number;
    averagePrice: number;
}

interface MonthOption {
    value: string;
    label: string;
}

// Función que obtiene y procesa datos (se ejecuta por React Query)
const fetchProductsData = async (selectedMonth: string) => {
    // 1. Obtener todas las órdenes
    const orders = await orderService.getAllOrders();
    
    // 2. Filtrar válidas (excluir canceladas)
    const validOrders = orders.filter(order => order.status !== 'cancelled');

    // 3. Filtrar por mes si es necesario
    let filteredOrders = validOrders;
    if (selectedMonth !== 'all') {
        filteredOrders = validOrders.filter(order => {
            const date = new Date(order.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            return monthKey === selectedMonth;
        });
    }

    // 4. Limitar a 50 órdenes
    const ordersToProcess = filteredOrders.slice(0, 50);
    
    // 5. Obtener detalles
    const detailedOrdersResults = await Promise.allSettled(
        ordersToProcess.map(order => orderService.getOrderById(order.id))
    );

    const detailedOrders: OrderConfirmationDetail[] = detailedOrdersResults
        .filter((result): result is PromiseFulfilledResult<OrderConfirmationDetail> =>
            result.status === 'fulfilled'
        )
        .map(result => result.value);

    // 6. Procesar productos
    const productsMap = new Map<number, ProductStats>();

    detailedOrders.forEach(order => {
        order.orderItems?.forEach((item: OrderItemWithSubtotal) => {
            const existing = productsMap.get(item.productId);
            const itemRevenue = (item.totalPrice && item.totalPrice > 0)
                ? item.totalPrice
                : (item.unitPrice || 0) * (item.quantity || 0);

            if (existing) {
                existing.totalSold += item.quantity || 0;
                existing.totalRevenue += itemRevenue;
                existing.orderCount += 1;
            } else {
                productsMap.set(item.productId, {
                    productId: item.productId,
                    productName: item.productName || 'Producto sin nombre',
                    totalSold: item.quantity || 0,
                    totalRevenue: itemRevenue,
                    orderCount: 1,
                    averagePrice: item.unitPrice || 0
                });
            }
        });
    });

    // 7. Ordenar y retornar
    return Array.from(productsMap.values()).sort((a, b) => {
        if (b.totalSold !== a.totalSold) return b.totalSold - a.totalSold;
        return b.totalRevenue - a.totalRevenue;
    });
};

// Función para obtener meses disponibles (query separada)
const fetchAvailableMonths = async (): Promise<MonthOption[]> => {
    const orders = await orderService.getAllOrders();
    const validOrders = orders.filter(order => order.status !== 'cancelled');
    
    const monthsSet = new Set<string>();
    validOrders.forEach(order => {
        const date = new Date(order.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthsSet.add(monthKey);
    });

    const months = Array.from(monthsSet)
        .sort()
        .reverse()
        .map(monthKey => {
            const [year, month] = monthKey.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return {
                value: monthKey,
                label: date.toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })
            };
        });

    return [{ value: 'all', label: 'Todos los meses' }, ...months];
};

// Hook principal con React Query
export const useProductsAnalytics = () => {
    const [selectedMonth, setSelectedMonth] = useState<string>('all');

    // Query para productos (cambia según el mes seleccionado)
    const { 
        data: productsStats = [], 
        isLoading: isLoadingProducts 
    } = useQuery({
        queryKey: ['products-analytics', selectedMonth],
        queryFn: () => fetchProductsData(selectedMonth),
        staleTime: 5 * 60 * 1000, // 5 minutos
    });

    // Query para meses disponibles (se ejecuta una sola vez)
    const { 
        data: availableMonths = [] 
    } = useQuery({
        queryKey: ['available-months'],
        queryFn: fetchAvailableMonths,
        staleTime: Infinity, // Nunca expira hasta refrescar
    });

    return {
        productsStats,
        loading: isLoadingProducts,
        selectedMonth,
        setSelectedMonth,
        availableMonths
    };
};