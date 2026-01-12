import { Link } from 'react-router-dom';
import { HiChevronDown, HiChevronUp, HiEye, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import type { OrderSummary, OrderStatus } from '@/types/order.types';

interface OrdersTableProps {
  orders: OrderSummary[];
  expandedOrder: number | null;
  processingOrder: number | null;
  onToggleExpand: (orderId: number) => void;
  onApprove: (order: OrderSummary) => void;
  onReject: (order: OrderSummary) => void;
}

export default function OrdersTable({
  orders,
  expandedOrder,
  processingOrder,
  onToggleExpand,
  onApprove,
  onReject
}: OrdersTableProps) {
  const getStatusInfo = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { color: string; text: string; bgColor: string }> = {
      'pending_payment': { color: 'text-yellow-700', text: 'Pago Pendiente', bgColor: 'bg-yellow-100' },
      'payment_submitted': { color: 'text-blue-700', text: 'Pago Enviado', bgColor: 'bg-blue-100' },
      'payment_approved': { color: 'text-green-700', text: 'Pago Aprobado', bgColor: 'bg-green-100' },
      'payment_rejected': { color: 'text-red-700', text: 'Pago Rechazado', bgColor: 'bg-red-100' },
      'shipped': { color: 'text-indigo-700', text: 'Enviado', bgColor: 'bg-indigo-100' },
      'delivered': { color: 'text-purple-700', text: 'Entregado', bgColor: 'bg-purple-100' },
      'cancelled': { color: 'text-gray-700', text: 'Cancelado', bgColor: 'bg-gray-100' },
      'pending': { color: 'text-orange-700', text: 'Pendiente', bgColor: 'bg-orange-100' },
      'completed': { color: 'text-teal-700', text: 'Completado', bgColor: 'bg-teal-100' }
    };
    return statusMap[status] || { color: 'text-gray-700', text: status, bgColor: 'bg-gray-100' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canApproveOrReject = (order: OrderSummary) => {
    return (order.status === 'payment_submitted' || order.status === 'pending_payment') && 
           order.hasPaymentReceipt;
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay órdenes</h3>
        <p className="text-gray-500">No se encontraron órdenes con los filtros aplicados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const isExpanded = expandedOrder === order.id;
              const isProcessing = processingOrder === order.id;

              return (
                <tr key={order.id} className={isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      to={`/admin/order/${order.id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors"
                    >
                      <HiEye className="w-4 h-4 mr-1" />
                      Ver
                    </Link>
                    {canApproveOrReject(order) && (
                      <>
                        <button
                          onClick={() => onApprove(order)}
                          disabled={isProcessing}
                          className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <HiCheckCircle className="w-4 h-4 mr-1" />
                          Aprobar
                        </button>
                        <button
                          onClick={() => onReject(order)}
                          disabled={isProcessing}
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <HiXCircle className="w-4 h-4 mr-1" />
                          Rechazar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const isExpanded = expandedOrder === order.id;
          const isProcessing = processingOrder === order.id;

          return (
            <div key={order.id} className="p-4">
              {/* Card header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-semibold text-gray-900">Orden #{order.id}</span>
                  <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </div>
                <button
                  onClick={() => onToggleExpand(order.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {isExpanded ? <HiChevronUp className="w-5 h-5" /> : <HiChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Card info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium text-gray-900">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="text-gray-900">{formatDate(order.createdAt)}</span>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-gray-900">{order.customerEmail}</span>
                      </div>
                      {order.shippingCity && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ciudad:</span>
                          <span className="text-gray-900">{order.shippingCity}, {order.shippingProvince}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                <Link
                  to={`/admin/order/${order.id}`}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors text-sm font-medium"
                >
                  <HiEye className="w-4 h-4 mr-1" />
                  Ver Detalle
                </Link>
                {canApproveOrReject(order) && (
                  <>
                    <button
                      onClick={() => onApprove(order)}
                      disabled={isProcessing}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      <HiCheckCircle className="w-4 h-4 mr-1" />
                      Aprobar
                    </button>
                    <button
                      onClick={() => onReject(order)}
                      disabled={isProcessing}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      <HiXCircle className="w-4 h-4 mr-1" />
                      Rechazar
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}