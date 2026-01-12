// src/pages/Admin/Analytics/AnalyticsDashboard.tsx
import { useState, useMemo } from 'react';
import AdminLayout from '@/pages/Admin/Layout/AdminLayout';
import ReactApexChart from 'react-apexcharts';
import { useDashboardAnalytics } from './hooks/useDashboardAnalytics';
import { getRevenueOrdersChartOptions, getCategorySalesChartOptions } from './config/dashboardChartConfig';
import PeriodDropdown from './components/PeriodDropdown';
import { HiTrendingUp, HiTrendingDown, HiChartBar, HiShoppingCart, HiClock, HiCurrencyDollar } from 'react-icons/hi';

export default function AnalyticsDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showRevenueDropdown, setShowRevenueDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    // Hook con React Query
    const {
        stats,
        revenueOrdersData,
        salesByCategory,
        loading,
        timePeriod,
        setTimePeriod
    } = useDashboardAnalytics();

    // Opciones de período
    const periodOptions = useMemo(() => [
        { value: 'week', label: 'Últimos 7 días' },
        { value: 'month', label: 'Último mes' },
        { value: 'quarter', label: 'Últimos 3 meses' },
        { value: 'year', label: 'Último año' }
    ], []);

    // Series para gráfico combinado (Ingresos + Órdenes)
    const revenueOrdersSeries = useMemo(() => [
        {
            name: 'Ingresos',
            type: 'area',
            data: revenueOrdersData.map(d => d.revenue)
        },
        {
            name: 'Órdenes',
            type: 'line',
            data: revenueOrdersData.map(d => d.orders)
        }
    ], [revenueOrdersData]);

    // Datos para gráfico donut (Órdenes por estado)
    const statusChartData = useMemo(() => {
        const categories = salesByCategory.map(c => c.category);
        const revenues = salesByCategory.map(c => c.revenue);
        return { categories, revenues };
    }, [salesByCategory]);

    // Validar si hay datos
    const hasRevenueData = revenueOrdersData.length > 0;
    const hasCategoryData = salesByCategory.length > 0;

    // Componente de Card de Stats
    const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color }: any) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 sm:p-3 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                {trend && trendValue !== undefined && trendValue !== 0 && (
                    <div className={`flex items-center text-xs sm:text-sm font-medium ${trendValue > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {trendValue > 0 ? (
                            <HiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        ) : (
                            <HiTrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        )}
                        {Math.abs(trendValue).toFixed(1)}%
                    </div>
                )}
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
    );

    if (loading) {
        return (
            <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando analytics...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                    Analytics Dashboard
                </h1>
                <p className="text-sm text-gray-600 font-normal">
                    Resumen general de métricas y rendimiento del negocio
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                <StatCard
                    title="Ingresos Totales"
                    value={`$${stats.totalRevenue.toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`}
                    subtitle="Total acumulado"
                    icon={HiCurrencyDollar}
                    trend="up"
                    trendValue={stats.revenueGrowth}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Órdenes"
                    value={stats.totalOrders}
                    subtitle="Órdenes procesadas"
                    icon={HiShoppingCart}
                    trend="up"
                    trendValue={stats.ordersGrowth}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Ticket Promedio"
                    value={`$${stats.averageOrderValue.toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`}
                    subtitle="Por orden"
                    icon={HiChartBar}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Órdenes Pendientes"
                    value={stats.pendingOrders}
                    subtitle="Requieren revisión"
                    icon={HiClock}
                    color="bg-orange-500"
                />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Gráfico 1: Ingresos + Órdenes */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                        <div>
                            <h2 className="text-base sm:text-lg font-medium text-gray-900">
                                Tendencia de Ingresos y Órdenes
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Evolución de ventas e ingresos por período
                            </p>
                        </div>
                        <PeriodDropdown
                            months={periodOptions}
                            selectedMonth={timePeriod}
                            onMonthChange={(period) => setTimePeriod(period as any)}
                            showDropdown={showRevenueDropdown}
                            setShowDropdown={setShowRevenueDropdown}
                        />
                    </div>

                    {hasRevenueData ? (
                        <ReactApexChart
                            options={getRevenueOrdersChartOptions(revenueOrdersData)}
                            series={revenueOrdersSeries}
                            type="area"
                            height={350}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-96 text-gray-400">
                            <div className="text-center">
                                <p className="text-sm">No hay datos disponibles</p>
                                <p className="text-xs mt-1">Aún no hay ventas en este período</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Gráfico 2: Ventas por Categoría */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                        <div>
                            <h2 className="text-base sm:text-lg font-medium text-gray-900">
                                Ventas por Categoría
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Distribución de ingresos por tipo de producto
                            </p>
                        </div>
                        <PeriodDropdown
                            months={periodOptions}
                            selectedMonth={timePeriod}
                            onMonthChange={(period) => setTimePeriod(period as any)}
                            showDropdown={showStatusDropdown}
                            setShowDropdown={setShowStatusDropdown}
                        />
                    </div>

                    {hasCategoryData ? (
                        <div className="py-2">
                            <ReactApexChart
                                key={`category-${timePeriod}`}
                                options={getCategorySalesChartOptions(statusChartData.categories)}
                                series={[{
                                    name: 'Ingresos',
                                    data: statusChartData.revenues.map((revenue, idx) => ({
                                        x: statusChartData.categories[idx],
                                        y: revenue,
                                        percentage: salesByCategory[idx]?.percentage || 0
                                    }))
                                }]}
                                type="bar"
                                height={350}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[380px] bg-gray-50 rounded-lg">
                            <div className="text-center px-4">
                                <p className="text-sm text-gray-500 font-medium">No hay datos</p>
                                <p className="text-xs text-gray-400 mt-1">Sin ventas por categoría en este período</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}