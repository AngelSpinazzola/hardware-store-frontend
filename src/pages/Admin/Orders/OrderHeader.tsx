import { orderService } from '@/services/orderService';
import type { OrderStatus } from '@/types/order.types';

interface OrderHeaderProps {
  orderId: number;
  status: OrderStatus;
  onPrint: () => void;
}

export default function OrderHeader({ orderId, status, onPrint }: OrderHeaderProps) {
  const getStatusBadgeColor = (status: OrderStatus): string => {
    const colors: Record<OrderStatus, string> = {
      'pending_payment': 'bg-yellow-100 text-yellow-800',
      'payment_submitted': 'bg-blue-100 text-blue-800',
      'payment_approved': 'bg-green-100 text-green-800',
      'payment_rejected': 'bg-red-100 text-red-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-emerald-100 text-emerald-800',
      'cancelled': 'bg-red-100 text-red-800',
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Orden #{orderId}
          </h1>
          <p className="text-gray-600 mt-2">
            Detalles completos de la orden
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(status)}`}>
            {orderService.getStatusText(status)}
          </span>
          <button
            onClick={onPrint}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>
    </div>
  );
}