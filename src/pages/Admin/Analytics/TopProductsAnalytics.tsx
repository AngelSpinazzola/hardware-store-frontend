import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/pages/Admin/Layout/AdminLayout';
import ReactApexChart from 'react-apexcharts';
import { useProductsAnalytics } from './hooks/useProductsAnalytics';
import { getBarChartOptions, getPieChartOptions } from './config/chartConfigs';
import TopProductCard from './components/TopProductCard';
import PeriodDropdown from './components/PeriodDropdown';

export default function TopProductsAnalytics() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showBarChartDropdown, setShowBarChartDropdown] = useState(false);
    const [showPieChartDropdown, setShowPieChartDropdown] = useState(false);

    // Hook personalizado con toda la lógica de datos
    const {
        productsStats,
        loading,
        selectedMonth,
        setSelectedMonth,
        availableMonths
    } = useProductsAnalytics();

    // Datos para gráfico de pie (Top 3)
    const pieChartData = useMemo(() => {
        const topProducts = productsStats.slice(0, 3);
        return {
            series: topProducts.map(p => p.totalRevenue),
            labels: topProducts.map(p => p.productName),
        };
    }, [productsStats]);

    // Datos para gráfico de barras (Top 10)
    const barData = useMemo(() => {
        return productsStats.slice(0, 10).map(p => ({
            name: p.productName,
            'Unidades Vendidas': p.totalSold,
            'Ingresos': p.totalRevenue,
        }));
    }, [productsStats]);

    // Series para gráfico de barras
    const barChartSeries = useMemo(() => [{
        name: 'Unidades Vendidas',
        data: barData.map(p => p['Unidades Vendidas'])
    }], [barData]);

    // Verificar si hay datos válidos
    const hasValidData = pieChartData.series.some(val => val > 0);

    if (loading) {
        return (
            <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando datos de productos...</p>
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
                    Productos destacados
                </h1>
                <p className="text-sm text-gray-600 font-normal">
                    Análisis de ventas y rendimiento de los productos más exitosos
                </p>
            </div>

            {/* Podio Top 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 items-stretch">
                <TopProductCard
                    rank={1}
                    productName={productsStats[0]?.productName || 'N/A'}
                    totalSold={productsStats[0]?.totalSold || 0}
                />
                <TopProductCard
                    rank={2}
                    productName={productsStats[1]?.productName || 'N/A'}
                    totalSold={productsStats[1]?.totalSold || 0}
                />
                <TopProductCard
                    rank={3}
                    productName={productsStats[2]?.productName || 'N/A'}
                    totalSold={productsStats[2]?.totalSold || 0}
                />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Gráfico de Barras - Top 10 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
                        <h2 className="text-base sm:text-lg font-medium text-gray-900">
                            Productos destacados - Top 10
                        </h2>
                        <PeriodDropdown
                            months={availableMonths}
                            selectedMonth={selectedMonth}
                            onMonthChange={setSelectedMonth}
                            showDropdown={showBarChartDropdown}
                            setShowDropdown={setShowBarChartDropdown}
                        />
                    </div>

                    {barData.length > 0 ? (
                        <ReactApexChart
                            options={getBarChartOptions(barData)}
                            series={barChartSeries}
                            type="bar"
                            height={350}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-96 text-gray-400">
                            <div className="text-center">
                                <p className="text-sm">No hay datos disponibles</p>
                                <p className="text-xs mt-1">Aún no hay productos vendidos en este período</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Gráfico de Torta - Top 3 Ingresos */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                        <h2 className="text-base sm:text-lg font-medium text-gray-900">
                            Top 3 Productos - Ingresos
                        </h2>
                        <PeriodDropdown
                            months={availableMonths}
                            selectedMonth={selectedMonth}
                            onMonthChange={setSelectedMonth}
                            showDropdown={showPieChartDropdown}
                            setShowDropdown={setShowPieChartDropdown}
                        />
                    </div>

                    {hasValidData ? (
                        <div className="py-4">
                            <ReactApexChart
                                key={`pie-${selectedMonth}`}
                                options={getPieChartOptions(pieChartData)}
                                series={pieChartData.series}
                                type="donut"
                                height={280}
                                className="lg:h-[280px] h-[300px]"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[380px] bg-gray-50 rounded-lg">
                            <div className="text-center px-4">
                                <p className="text-sm text-gray-500 font-medium">No hay datos</p>
                                <p className="text-xs text-gray-400 mt-1">Sin productos vendidos</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Back link */}
            <div className="mt-6">
                <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-700"
                >
                    ← Volver al Dashboard
                </Link>
            </div>
        </AdminLayout>
    );
}