// src/pages/Admin/Analytics/hooks/useDashboardAnalytics.ts
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import type { OrderSummary } from '@/types/order.types';

export type TimePeriod = 'week' | 'month' | 'quarter' | 'year';

interface AnalyticsStats {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    pendingOrders: number;
    revenueGrowth: number;
    ordersGrowth: number;
}

interface ChartDataPoint {
    period: string;
    revenue: number;
    orders: number;
}

interface OrdersByStatus {
    pending: number;
    approved: number;
    shipped: number;
    delivered: number;
}

// Filtrar órdenes por período
const filterOrdersByPeriod = (orders: OrderSummary[], period: TimePeriod): OrderSummary[] => {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
        case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
        case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        case 'quarter':
            startDate.setMonth(now.getMonth() - 3);
            break;
        case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
    }

    return orders.filter(order => new Date(order.createdAt) >= startDate);
};

// Agrupar datos para gráfico combinado
const groupDataByPeriod = (orders: OrderSummary[], period: TimePeriod): ChartDataPoint[] => {
    const grouped: Record<string, ChartDataPoint> = {};

    orders.forEach(order => {
        const date = new Date(order.createdAt);
        let key: string;

        if (period === 'week') {
            // Lun 4, Mar 5, etc
            key = date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' });
        } else if (period === 'month') {
            // 04 ene, 05 ene, etc
            key = date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
        } else if (period === 'quarter') {
            // Ene, Feb, etc
            key = date.toLocaleDateString('es-AR', { month: 'short' });
        } else {
            // Ene 2024, Feb 2024, etc
            key = date.toLocaleDateString('es-AR', { month: 'short', year: 'numeric' });
        }

        if (!grouped[key]) {
            grouped[key] = { period: key, revenue: 0, orders: 0 };
        }

        // CORRECCIÓN: Solo contar revenue Y orders de órdenes válidas
        if (['payment_approved', 'shipped', 'delivered'].includes(order.status)) {
            grouped[key].revenue += order.total;
            grouped[key].orders += 1;
        }
    });

    // Ordenar y limitar
    const sorted = Object.values(grouped).sort((a, b) => {
        const indexA = Object.keys(grouped).indexOf(
            Object.keys(grouped).find(k => grouped[k] === a)!
        );
        const indexB = Object.keys(grouped).indexOf(
            Object.keys(grouped).find(k => grouped[k] === b)!
        );
        return indexA - indexB;
    });

    // Mostrar últimos 12 puntos para quarter/year, 7 para week, 30 para month
    const limit = period === 'week' ? 7 : period === 'month' ? 30 : 12;
    return sorted.slice(-limit);
};

// Calcular estadísticas
const calculateStats = (currentOrders: OrderSummary[], previousOrders: OrderSummary[]): AnalyticsStats => {
    // Current period
    const validOrders = currentOrders.filter(o => o.status !== 'cancelled');
    const totalRevenue = validOrders
        .filter(o => ['payment_approved', 'shipped', 'delivered'].includes(o.status))
        .reduce((sum, order) => sum + order.total, 0);
    const totalOrders = validOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const pendingOrders = currentOrders.filter(o => 
        o.status === 'pending_payment' || o.status === 'payment_submitted'
    ).length;

    // Previous period (para calcular growth)
    const prevValidOrders = previousOrders.filter(o => o.status !== 'cancelled');
    const prevRevenue = prevValidOrders
        .filter(o => ['payment_approved', 'shipped', 'delivered'].includes(o.status))
        .reduce((sum, order) => sum + order.total, 0);
    const prevOrders = prevValidOrders.length;

    // Calcular crecimiento
    const revenueGrowth = prevRevenue > 0 
        ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 
        : 0;
    const ordersGrowth = prevOrders > 0 
        ? ((totalOrders - prevOrders) / prevOrders) * 100 
        : 0;

    return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        pendingOrders,
        revenueGrowth,
        ordersGrowth
    };
};

// Contar órdenes por estado
const getOrdersByStatus = (orders: OrderSummary[]): OrdersByStatus => {
    return {
        pending: orders.filter(o => 
            o.status === 'pending_payment' || o.status === 'payment_submitted'
        ).length,
        approved: orders.filter(o => o.status === 'payment_approved').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length
    };
};

// NUEVO: Calcular ventas por categoría
interface CategorySales {
    category: string;
    revenue: number;
    orders: number;
    percentage: number;
}

const getSalesByCategory = async (orders: OrderSummary[]): Promise<CategorySales[]> => {
    // Solo órdenes pagadas
    const paidOrders = orders.filter(o => 
        ['payment_approved', 'shipped', 'delivered'].includes(o.status)
    );

    // Obtener detalles de órdenes (limitar a 100 para performance)
    const ordersToProcess = paidOrders.slice(0, 100);
    
    try {
        const { orderService } = await import('@/services/orderService');
        
        const detailsResults = await Promise.allSettled(
            ordersToProcess.map(order => orderService.getOrderById(order.id))
        );

        const categoryMap = new Map<string, { revenue: number; orders: Set<number> }>();

        detailsResults.forEach((result) => {
            if (result.status === 'fulfilled') {
                const order = result.value;
                
                order.orderItems?.forEach((item: any) => {
                    const category = item.category || 'Sin categoría';
                    const itemRevenue = item.totalPrice || (item.unitPrice * item.quantity);

                    if (!categoryMap.has(category)) {
                        categoryMap.set(category, { revenue: 0, orders: new Set() });
                    }

                    const categoryData = categoryMap.get(category)!;
                    categoryData.revenue += itemRevenue;
                    categoryData.orders.add(order.id);
                });
            }
        });

        // Calcular total para porcentajes
        const totalRevenue = Array.from(categoryMap.values())
            .reduce((sum, cat) => sum + cat.revenue, 0);

        // Convertir a array y calcular porcentajes
        const categories: CategorySales[] = Array.from(categoryMap.entries())
            .map(([category, data]) => ({
                category,
                revenue: data.revenue,
                orders: data.orders.size,
                percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 8); // Top 8 categorías

        return categories;
    } catch (error) {
        console.error('Error calculating sales by category:', error);
        return [];
    }
};

export const useDashboardAnalytics = () => {
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');

    // Query para obtener todas las órdenes
    const { data: allOrders = [], isLoading } = useQuery({
        queryKey: ['dashboard-analytics'],
        queryFn: async () => {
            return await orderService.getAllOrders();
        },
        staleTime: 2 * 60 * 1000, // 2 minutos
    });

    // Filtrar órdenes por período actual y anterior (en memoria)
    const { currentOrders, previousOrders } = useMemo(() => {
        const current = filterOrdersByPeriod(allOrders, timePeriod);
        
        // Calcular período anterior para growth
        const now = new Date();
        const prevStart = new Date();
        const prevEnd = new Date();

        switch (timePeriod) {
            case 'week':
                prevStart.setDate(now.getDate() - 14);
                prevEnd.setDate(now.getDate() - 7);
                break;
            case 'month':
                prevStart.setMonth(now.getMonth() - 2);
                prevEnd.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                prevStart.setMonth(now.getMonth() - 6);
                prevEnd.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                prevStart.setFullYear(now.getFullYear() - 2);
                prevEnd.setFullYear(now.getFullYear() - 1);
                break;
        }

        const previous = allOrders.filter(order => {
            const date = new Date(order.createdAt);
            return date >= prevStart && date < prevEnd;
        });

        return { currentOrders: current, previousOrders: previous };
    }, [allOrders, timePeriod]);

    // Calcular estadísticas (en memoria)
    const stats = useMemo(
        () => calculateStats(currentOrders, previousOrders),
        [currentOrders, previousOrders]
    );

    // Datos para gráfico combinado (en memoria)
    const revenueOrdersData = useMemo(
        () => groupDataByPeriod(currentOrders, timePeriod),
        [currentOrders, timePeriod]
    );

    // Datos para gráfico de donut (en memoria)
    const ordersByStatus = useMemo(
        () => getOrdersByStatus(currentOrders),
        [currentOrders]
    );

    // NUEVO: Query separada para ventas por categoría (puede tardar)
    const { data: salesByCategory = [] } = useQuery({
        queryKey: ['sales-by-category', timePeriod],
        queryFn: () => getSalesByCategory(currentOrders),
        enabled: currentOrders.length > 0,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });

    return {
        stats,
        revenueOrdersData,
        ordersByStatus,
        salesByCategory,
        loading: isLoading,
        timePeriod,
        setTimePeriod
    };
};