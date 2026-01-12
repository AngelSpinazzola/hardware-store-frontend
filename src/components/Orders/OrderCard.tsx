import { Link } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { getStatusBadgeColor, getStatusIcon } from '@/utils/orderStatus';
import type { OrderSummary } from '@/types';

interface OrderCardProps {
    order: OrderSummary;
    onCancelOrder: (orderId: number) => void;
}

const OrderCard = ({ order, onCancelOrder }: OrderCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-wrap items-center gap-y-4 py-6 px-4 sm:px-6">
            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                <dt className="text-base font-medium text-gray-900 font-poppins">Orden:</dt>
                <dd className="mt-1.5 text-base font-medium text-gray-500 font-poppins">
                    #{order.id}
                </dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                <dt className="text-base font-medium text-gray-900 font-poppins">Fecha:</dt>
                <dd className="mt-1.5 text-base font-medium text-gray-500 font-poppins">
                    {orderService.formatDate(order.createdAt)}
                </dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                <dt className="text-base font-medium text-gray-900 font-poppins">Total:</dt>
                <dd className="mt-1.5 text-base font-medium text-gray-500 font-poppins">
                    ${orderService.formatPrice(order.total)}
                </dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                <dt className="text-base font-medium text-gray-900 font-poppins">Estado:</dt>
                <dd className={`mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium font-poppins ${getStatusBadgeColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="me-1">{orderService.getStatusText(order.status)}</span>
                </dd>
            </dl>

            <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-80 lg:items-center lg:justify-end gap-4">
                <Link
                    to={`/order-confirmation/${order.id}`}
                    className="w-full inline-flex items-center justify-center rounded-lg border border-gray-400 bg-white px-3 py-2 text-sm font-medium text-gray-900 md:hover:bg-gray-100 font-poppins lg:w-auto"
                >
                    Ver detalles
                </Link>
                {orderService.canCancelOrder(order.status) && (
                    <button
                        onClick={() => onCancelOrder(order.id)}
                        className="w-full inline-flex items-center justify-center rounded-lg border border-red-600 bg-white px-3 py-2 text-sm font-medium text-red-600 md:hover:bg-red-50 font-poppins lg:w-auto"
                    >
                        Cancelar orden
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderCard;
