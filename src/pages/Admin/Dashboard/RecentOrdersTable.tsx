import { Card, Badge } from 'flowbite-react';
import { Link } from 'react-router-dom';
import type { OrderSummary } from '../../../types/order.types';
import { orderService } from '../../../services/orderService';

interface RecentOrdersTableProps {
    orders: OrderSummary[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    const getStatusBadgeColor = (status: string) => {
        const colors: Record<string, 'warning' | 'info' | 'purple' | 'success' | 'failure' | 'gray'> = {
            'PendingPayment': 'warning',
            'PaymentApproved': 'info',
            'InTransit': 'purple',
            'Delivered': 'success',
            'Cancelled': 'failure',
            'PaymentRejected': 'failure'
        };
        return colors[status] || 'gray';
    };

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Órdenes Recientes
                </h3>
                <Link
                    to="/admin/orders"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                    Ver todas →
                </Link>
            </div>

            {orders.length > 0 ? (
                <div className="overflow-x-auto">
                    {/* Vista de tabla para desktop */}
                    <div className="hidden sm:block">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Orden #</th>
                                    <th className="px-6 py-3">Cliente</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {order.customerName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {order.customerEmail}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            ${order.total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge color={getStatusBadgeColor(order.status)}>
                                                {orderService.getStatusText(order.status)}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Vista de cards para móvil */}
                    <div className="sm:hidden space-y-3">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-bold text-gray-900">#{order.id}</p>
                                    <Badge color={getStatusBadgeColor(order.status)} size="sm">
                                        {orderService.getStatusText(order.status)}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-700 mb-1">{order.customerName}</p>
                                <p className="text-sm text-gray-500 mb-2">{order.customerEmail}</p>
                                <p className="text-lg font-bold text-gray-900">
                                    ${order.total.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">No hay órdenes recientes</p>
                </div>
            )}
        </Card>
    );
}