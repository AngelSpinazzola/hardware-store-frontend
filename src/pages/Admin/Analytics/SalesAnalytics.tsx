// src/pages/Admin/Analytics/SalesAnalytics.tsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../Layout/AdminLayout';
import ReactApexChart from 'react-apexcharts';
import Spinner from '@/components/Common/Spinner';
import { useSalesAnalytics, type PeriodType } from './hooks/useSalesAnalytics';
import { getRevenueChartOptions, getTicketChartOptions } from './config/salesChartConfig';
import PeriodDropdown from './components/PeriodDropdown';

interface PeriodOption {
    value: PeriodType;
    label: string;
}

const periodOptions: PeriodOption[] = [
    { value: 'daily', label: 'Por Día' },
    { value: 'weekly', label: 'Por Semana' },
    { value: 'monthly', label: 'Por Mes' },
];

export default function SalesAnalytics() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showRevenueDropdown, setShowRevenueDropdown] = useState(false);
    const [showTicketDropdown, setShowTicketDropdown] = useState(false);

    // Hook con React Query - toda la lógica aquí
    const {
        revenuePeriod,
        setRevenuePeriod,
        ticketPeriod,
        setTicketPeriod,
        revenueData,
        ticketData,
        totalRevenue,
        totalOrders,
        averageOrderValue,
        loading
    } = useSalesAnalytics();

    // Configuraciones de gráficos (memoizadas)
    const revenueChartOptions = useMemo(
        () => getRevenueChartOptions(revenueData),
        [revenueData]
    );

    const ticketChartOptions = useMemo(
        () => getTicketChartOptions(ticketData, averageOrderValue),
        [ticketData, averageOrderValue]
    );

    // Series de gráficos
    const revenueChartSeries = useMemo(() => [{
        name: 'Ingresos',
        data: revenueData.map(d => d.revenue)
    }], [revenueData]);

    const ticketChartSeries = useMemo(() => [{
        name: 'Valor Promedio por Compra',
        data: ticketData.map(d => d.orders > 0 ? d.revenue / d.orders : 0)
    }], [ticketData]);

    if (loading) {
        return (
            <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <div className="flex flex-col items-center justify-center min-h-[90vh]">
                    <Spinner size="md" color="blue" />
                    <p className="mt-4 text-gray-600">Cargando datos de ventas...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                    Ventas por período
                </h1>
                <p className="text-sm text-gray-600 font-normal">
                    Análisis de ingresos y valor promedio de compra en el tiempo
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {/* Card: Ingresos Totales */}
                <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg shadow-sm border border-purple-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Ingresos Totales</h3>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                        ${totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Card: Total Órdenes */}
                <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-sm border border-green-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Total Órdenes</h3>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalOrders}</p>
                </div>

                {/* Card: Valor Promedio */}
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-sm border border-blue-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Valor Promedio por Compra</h3>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                        ${averageOrderValue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                        <div>
                            <h2 className="text-base sm:text-lg font-medium text-gray-900">
                                Tendencia de Ingresos
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Evolución de ventas totales por período
                            </p>
                        </div>
                        <PeriodDropdown
                            months={periodOptions}
                            selectedMonth={revenuePeriod}
                            onMonthChange={(period) => setRevenuePeriod(period as PeriodType)}
                            showDropdown={showRevenueDropdown}
                            setShowDropdown={setShowRevenueDropdown}
                        />
                    </div>
                    {revenueData.length > 0 ? (
                        <ReactApexChart
                            options={revenueChartOptions}
                            series={revenueChartSeries}
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

                {/* Ticket Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                        <div>
                            <h2 className="text-base sm:text-lg font-medium text-gray-900">
                                Valor Promedio por Compra
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Cuánto gasta cada cliente en promedio
                            </p>
                        </div>
                        <PeriodDropdown
                            months={periodOptions}
                            selectedMonth={ticketPeriod}
                            onMonthChange={(period) => setTicketPeriod(period as PeriodType)}
                            showDropdown={showTicketDropdown}
                            setShowDropdown={setShowTicketDropdown}
                        />
                    </div>
                    {ticketData.length > 0 ? (
                        <ReactApexChart
                            options={ticketChartOptions}
                            series={ticketChartSeries}
                            type="line"
                            height={350}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-96 text-gray-400">
                            <div className="text-center">
                                <p className="text-sm">No hay datos disponibles</p>
                                <p className="text-xs mt-1">Aún no hay órdenes en este período</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Back link */}
            <div className="mt-6">
                <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-purple-700 transition-colors"
                >
                    ← Volver al Dashboard
                </Link>
            </div>
        </AdminLayout>
    );
}