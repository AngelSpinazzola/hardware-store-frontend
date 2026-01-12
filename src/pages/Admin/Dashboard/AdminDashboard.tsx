import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../../services/productService";
import { orderService } from "../../../services/orderService";
import AdminLayout from "../Layout/AdminLayout";
import StatsCard from "./StatsCard";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import {
    CubeIcon,
    ShoppingCartIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import type { OrderSummary } from "../../../types/order.types";

import { ProductStatus } from "../../../types/product.types";

interface Product {
    id: number;
    name: string;
    status: ProductStatus;
    stock: number;
    category: string;
    brand?: string;
    price: number;
    createdAt?: string;
}

interface CategoryDistribution {
    name: string;
    value: number;
    percentage: string;
}

interface StockAnalysis {
    name: string;
    stock: number;
}

interface PaymentStats {
    approved: number;
    rejected: number;
    pending: number;
}

interface OrderStatusStats {
    status: string;
    count: number;
}

interface MonthlyRevenue {
    month: string;
    revenue: number;
}

interface DashboardStats {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    totalCategories: number;
    categoryDistribution: CategoryDistribution[];
    stockAnalysis: StockAnalysis[];
    recentProducts: Product[];
    totalOrders: number;
    pendingPayments: number;
    pendingShipments: number;
    totalRevenue: number;
    recentOrders: OrderSummary[];
    paymentStats: PaymentStats;
    orderStatusStats: OrderStatusStats[];
    monthlyRevenue: MonthlyRevenue[];
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        activeProducts: 0,
        lowStockProducts: 0,
        totalCategories: 0,
        categoryDistribution: [],
        stockAnalysis: [],
        recentProducts: [],
        totalOrders: 0,
        pendingPayments: 0,
        pendingShipments: 0,
        totalRevenue: 0,
        recentOrders: [],
        paymentStats: {
            approved: 0,
            rejected: 0,
            pending: 0,
        },
        orderStatusStats: [],
        monthlyRevenue: [],
    });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async (): Promise<void> => {
        try {
            setLoading(true);
            const [productsResponse, categories] = await Promise.all([
                productService.getAllProductsForAdmin(),
                productService.getCategories(),
            ]);

            let products: Product[];
            if (
                productsResponse?.data &&
                Array.isArray(productsResponse.data)
            ) {
                products = productsResponse.data;
            } else if (Array.isArray(productsResponse)) {
                products = productsResponse;
            } else {
                console.error(
                    "Unexpected products format:",
                    productsResponse
                );
                products = [];
            }

            const categoriesData: string[] = Array.isArray(categories)
                ? categories
                : [];

            let allOrders: OrderSummary[] = [];
            let pendingOrders: OrderSummary[] = [];
            try {
                const ordersResults = await Promise.all([
                    orderService.getAllOrders(),
                    orderService.getOrdersPendingReview(),
                ]);
                allOrders = ordersResults[0];
                pendingOrders = ordersResults[1];
            } catch (orderError) {
                console.error("Error loading orders:", orderError);
            }

            const activeProducts = products.filter((p) => p.status === ProductStatus.Active).length;
            const lowStockProducts = products.filter(
                (p) => p.stock < 10
            ).length;

            const categoryCount: Record<string, number> = {};
            products.forEach((product) => {
                const category = product.categoryName || "Sin categoría";
                categoryCount[category] = (categoryCount[category] || 0) + 1;
            });

            const categoryDistribution: CategoryDistribution[] = Object.entries(
                categoryCount
            )
                .map(([name, value]) => ({
                    name,
                    value,
                    percentage: ((value / products.length) * 100).toFixed(1),
                }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 6);

            const stockAnalysis: StockAnalysis[] = products
                .filter((p) => p.stock < 10)
                .sort((a, b) => a.stock - b.stock)
                .slice(0, 10)
                .map((p) => ({
                    name:
                        p.name.length > 20
                            ? p.name.substring(0, 20) + "..."
                            : p.name,
                    stock: p.stock,
                }));

            const totalRevenue = allOrders.reduce(
                (sum, order) => sum + order.total,
                0
            );
            const pendingPayments = allOrders.filter(
                (o) => o.status === "pending_payment" || o.status === "pending"
            ).length;
            const pendingShipments = allOrders.filter(
                (o) =>
                    o.status === "payment_approved" ||
                    o.status === "payment_submitted"
            ).length;

            const paymentStats = {
                approved: allOrders.filter((o) =>
                    [
                        "payment_approved",
                        "shipped",
                        "delivered",
                        "completed",
                    ].includes(o.status)
                ).length,
                pending: pendingOrders.length,
                rejected: allOrders.filter(
                    (o) =>
                        o.status === "payment_rejected" ||
                        o.status === "cancelled"
                ).length,
            };

            const recentOrders = allOrders
                .sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )
                .slice(0, 5);

            // Calcular estadísticas de estado de órdenes
            const statusLabels: Record<string, string> = {
                'pending': 'Pendiente',
                'pending_payment': 'Pago pendiente',
                'payment_submitted': 'Pago enviado',
                'payment_approved': 'Pago aprobado',
                'payment_rejected': 'Pago rechazado',
                'shipped': 'Enviado',
                'delivered': 'Entregado',
                'completed': 'Completado',
                'cancelled': 'Cancelado'
            };

            const statusCount: Record<string, number> = {};
            allOrders.forEach((order) => {
                const status = order.status || 'pending';
                statusCount[status] = (statusCount[status] || 0) + 1;
            });

            const orderStatusStats = Object.entries(statusCount)
                .map(([status, count]) => ({
                    status: statusLabels[status] || status,
                    count
                }))
                .sort((a, b) => b.count - a.count);

            // Calcular ingresos por mes (últimos 6 meses)
            const monthlyRevenueMap: Record<string, number> = {};
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

            allOrders.forEach((order) => {
                const date = new Date(order.createdAt);
                const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
                monthlyRevenueMap[monthKey] = (monthlyRevenueMap[monthKey] || 0) + order.total;
            });

            const monthlyRevenue = Object.entries(monthlyRevenueMap)
                .map(([month, revenue]) => ({
                    month,
                    revenue
                }))
                .slice(-6); // Últimos 6 meses

            setStats({
                totalProducts: products.length,
                activeProducts,
                lowStockProducts,
                totalCategories: categoriesData.length,
                categoryDistribution,
                stockAnalysis,
                recentProducts: products.slice(0, 5),
                totalOrders: allOrders.length,
                pendingPayments,
                pendingShipments,
                totalRevenue,
                recentOrders,
                paymentStats,
                orderStatusStats,
                monthlyRevenue,
            });
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            >
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            Cargando dashboard...
                        </p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            {/* Header con bienvenida */}
            <div className="mb-8">
                <h1 className="text-2xl font-medium text-gray-900 mt-2 md:mt-0">
                    Resumen general de la tienda
                </h1>
            </div>

            {/* Stats Cards - Grid responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <StatsCard
                    title="Total productos"
                    value={stats.totalProducts}
                    onClick={() => navigate("/admin/products")}
                    icon={<CubeIcon className="w-full h-full" />}
                />
                <StatsCard
                    title="Total órdenes"
                    value={stats.totalOrders}
                    onClick={() => navigate("/admin/orders")}
                    icon={<ShoppingCartIcon className="w-full h-full" />}
                />
                <StatsCard
                    title="Ingresos"
                    value={`$${stats.totalRevenue.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`}
                    onClick={() => navigate("/admin/analytics/sales")}
                    icon={<CurrencyDollarIcon className="w-full h-full" />}
                />
                <StatsCard
                    title="Productos con stock bajo"
                    value={stats.lowStockProducts}
                    onClick={() => navigate("/admin/products")}
                    icon={<ExclamationTriangleIcon className="w-full h-full" />}
                />
            </div>

            {/* Charts - Grid 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
                {/* 1. Gráfico de Ingresos Mensuales */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <div className="mb-3">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            Ingresos mensuales
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Últimos 6 meses
                        </p>
                    </div>

                    {stats.monthlyRevenue.length > 0 ? (
                        <ReactApexChart
                            options={{
                                chart: {
                                    type: 'area',
                                    background: 'transparent',
                                    toolbar: { show: false }
                                },
                                stroke: {
                                    curve: 'smooth',
                                    width: 2
                                },
                                fill: {
                                    type: 'gradient',
                                    gradient: {
                                        shadeIntensity: 1,
                                        opacityFrom: 0.4,
                                        opacityTo: 0.1
                                    }
                                },
                                colors: ['#8B5CF6'],
                                xaxis: {
                                    categories: stats.monthlyRevenue.map(m => m.month),
                                    labels: {
                                        style: { colors: '#6B7280', fontSize: '10px' }
                                    }
                                },
                                yaxis: {
                                    labels: {
                                        style: { colors: '#6B7280', fontSize: '10px' },
                                        formatter: (val: number) => `$${val.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
                                    }
                                },
                                grid: {
                                    borderColor: '#E5E7EB',
                                    strokeDashArray: 3
                                },
                                dataLabels: { enabled: false },
                                tooltip: {
                                    theme: 'light',
                                    y: {
                                        formatter: (val: number) => `$${val.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
                                    }
                                },
                                markers: {
                                    size: 3,
                                    colors: ['#8B5CF6'],
                                    strokeColors: '#fff',
                                    strokeWidth: 2
                                }
                            } as ApexOptions}
                            series={[{
                                name: 'Ingresos',
                                data: stats.monthlyRevenue.map(m => m.revenue)
                            }]}
                            type="area"
                            height={240}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-[240px] text-gray-400">
                            <p className="text-sm">No hay datos de ingresos</p>
                        </div>
                    )}
                </div>

                {/* 2. Gráfico de Stock Bajo */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <div className="mb-3">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            Productos con bajo stock
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Menos de 10 unidades
                        </p>
                    </div>

                    {stats.stockAnalysis.length > 0 ? (
                        <ReactApexChart
                            options={{
                                chart: {
                                    type: 'bar',
                                    background: 'transparent',
                                    toolbar: { show: false }
                                },
                                plotOptions: {
                                    bar: {
                                        borderRadius: 6,
                                        horizontal: false,
                                        columnWidth: '60%'
                                    }
                                },
                                colors: ['#4F46E5'],
                                xaxis: {
                                    categories: stats.stockAnalysis.map(s => s.name),
                                    labels: {
                                        show: false
                                    }
                                },
                                yaxis: {
                                    labels: {
                                        style: { colors: '#6B7280', fontSize: '10px' },
                                        formatter: (val: number) => val.toString()
                                    }
                                },
                                grid: {
                                    borderColor: '#E5E7EB',
                                    strokeDashArray: 3
                                },
                                dataLabels: { enabled: false },
                                tooltip: {
                                    theme: 'light',
                                    x: {
                                        show: true
                                    },
                                    y: {
                                        formatter: (val: number) => `${val} unidades`
                                    }
                                }
                            } as ApexOptions}
                            series={[{
                                name: 'Stock',
                                data: stats.stockAnalysis.map(s => s.stock)
                            }]}
                            type="bar"
                            height={240}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-[240px] text-gray-400">
                            <p className="text-sm">No hay productos con stock bajo</p>
                        </div>
                    )}
                </div>

                {/* 3. Gráfico de Categorías */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <div className="mb-3">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            Categorías
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Distribución de productos
                        </p>
                    </div>

                    {stats.categoryDistribution.length > 0 ? (
                        <ReactApexChart
                            options={{
                                chart: {
                                    type: 'donut',
                                    background: 'transparent',
                                    toolbar: { show: false }
                                },
                                labels: stats.categoryDistribution.map(c => c.name),
                                colors: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'],
                                legend: {
                                    position: 'bottom',
                                    labels: { colors: '#374151', fontSize: '11px' },
                                    formatter: (seriesName: string, opts: any) => {
                                        const percentage = stats.categoryDistribution[opts.seriesIndex].percentage;
                                        return `${seriesName} (${percentage}%)`;
                                    }
                                },
                                plotOptions: {
                                    pie: {
                                        donut: {
                                            size: '60%',
                                            labels: {
                                                show: true,
                                                total: {
                                                    show: true,
                                                    label: 'Total',
                                                    color: '#374151',
                                                    fontSize: '14px',
                                                    formatter: () => stats.totalProducts.toString()
                                                }
                                            }
                                        }
                                    }
                                },
                                dataLabels: { enabled: false },
                                tooltip: {
                                    theme: 'light',
                                    y: {
                                        formatter: (val: number) => `${val} productos`
                                    }
                                }
                            } as ApexOptions}
                            series={stats.categoryDistribution.map(c => c.value)}
                            type="donut"
                            height={240}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-[240px] text-gray-400">
                            <p className="text-sm">No hay datos de categorías</p>
                        </div>
                    )}
                </div>

                {/* 4. Gráfico de Estado de Órdenes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <div className="mb-3">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            Estado de órdenes
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Distribución por estado
                        </p>
                    </div>

                    {stats.orderStatusStats.length > 0 ? (
                        <ReactApexChart
                            options={{
                                chart: {
                                    type: 'donut',
                                    background: 'transparent',
                                    toolbar: { show: false }
                                },
                                labels: stats.orderStatusStats.map(s => s.status),
                                colors: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#06B6D4', '#14B8A6'],
                                legend: {
                                    position: 'bottom',
                                    labels: { colors: '#374151', fontSize: '11px' }
                                },
                                plotOptions: {
                                    pie: {
                                        donut: {
                                            size: '60%',
                                            labels: {
                                                show: true,
                                                total: {
                                                    show: true,
                                                    label: 'Total',
                                                    color: '#374151',
                                                    fontSize: '14px',
                                                    formatter: () => stats.totalOrders.toString()
                                                }
                                            }
                                        }
                                    }
                                },
                                dataLabels: { enabled: false },
                                tooltip: {
                                    theme: 'light',
                                    y: {
                                        formatter: (val: number) => `${val} órdenes`
                                    }
                                }
                            } as ApexOptions}
                            series={stats.orderStatusStats.map(s => s.count)}
                            type="donut"
                            height={240}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-[240px] text-gray-400">
                            <p className="text-sm">No hay datos de órdenes</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
