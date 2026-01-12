// src/pages/Admin/Analytics/hooks/useSalesAnalytics.ts
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import type { OrderSummary } from '@/types/order.types';

export type PeriodType = 'daily' | 'weekly' | 'monthly';

export interface SalesDataPoint {
    period: string;
    revenue: number;
    orders: number;
}

interface GroupedData {
    daily: SalesDataPoint[];
    weekly: SalesDataPoint[];
    monthly: SalesDataPoint[];
}

// Función helper para calcular número de semana
const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Función que obtiene y procesa todos los datos de ventas
const fetchSalesData = async (): Promise<GroupedData> => {
    const orders: OrderSummary[] = await orderService.getAllOrders();

    // Agrupar por todos los períodos
    const dailyData: Record<string, SalesDataPoint> = {};
    const weeklyData: Record<string, SalesDataPoint> = {};
    const monthlyData: Record<string, SalesDataPoint> = {};

    orders.forEach(order => {
        const date = new Date(order.createdAt);

        // Daily
        const dailyKey = date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
        if (!dailyData[dailyKey]) {
            dailyData[dailyKey] = { period: dailyKey, revenue: 0, orders: 0 };
        }
        dailyData[dailyKey].revenue += order.total;
        dailyData[dailyKey].orders += 1;

        // Weekly
        const weekNumber = getWeekNumber(date);
        const weeklyKey = `Sem ${weekNumber}`;
        if (!weeklyData[weeklyKey]) {
            weeklyData[weeklyKey] = { period: weeklyKey, revenue: 0, orders: 0 };
        }
        weeklyData[weeklyKey].revenue += order.total;
        weeklyData[weeklyKey].orders += 1;

        // Monthly
        const monthlyKey = date.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
        if (!monthlyData[monthlyKey]) {
            monthlyData[monthlyKey] = { period: monthlyKey, revenue: 0, orders: 0 };
        }
        monthlyData[monthlyKey].revenue += order.total;
        monthlyData[monthlyKey].orders += 1;
    });

    return {
        daily: Object.values(dailyData),
        weekly: Object.values(weeklyData),
        monthly: Object.values(monthlyData)
    };
};

// Hook principal con React Query
export const useSalesAnalytics = () => {
    const [revenuePeriod, setRevenuePeriod] = useState<PeriodType>('daily');
    const [ticketPeriod, setTicketPeriod] = useState<PeriodType>('daily');

    // Query única para todos los datos (se cachea una sola vez)
    const { data: allSalesData, isLoading } = useQuery({
        queryKey: ['sales-analytics'],
        queryFn: fetchSalesData,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });

    // Manejar cuando data es undefined
    const safeData = allSalesData || { daily: [], weekly: [], monthly: [] };

    // Datos filtrados por período (se calculan en memoria)
    const revenueData = safeData[revenuePeriod];
    const ticketData = safeData[ticketPeriod];

    // Métricas calculadas
    const summaryData = safeData[revenuePeriod];

    const totalRevenue = summaryData.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = summaryData.reduce((sum, item) => sum + item.orders, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
        // Estados de período
        revenuePeriod,
        setRevenuePeriod,
        ticketPeriod,
        setTicketPeriod,

        // Datos
        revenueData,
        ticketData,

        // Métricas
        totalRevenue,
        totalOrders,
        averageOrderValue,

        // Loading
        loading: isLoading
    };
};