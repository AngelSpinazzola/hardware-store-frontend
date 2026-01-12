import { Link } from 'react-router-dom';
import { HiEye, HiCheckCircle, HiXCircle, HiClock, HiDocumentText, HiPhotograph } from 'react-icons/hi';
import type { OrderSummary } from '@/types/order.types';

interface PendingOrdersTableProps {
  orders: OrderSummary[];
  processingOrder: number | null;
  onViewReceipt: (order: OrderSummary) => void;
  onApprove: (order: OrderSummary) => void;
  onReject: (order: OrderSummary) => void;
}

export default function PendingOrdersTable({
  orders,
  processingOrder,
  onViewReceipt,
  onApprove,
  onReject
}: PendingOrdersTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (order: OrderSummary) => {
    if (order.hasPaymentReceipt) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          <HiDocumentText className="w-4 h-4 mr-1" />
          Con comprobante
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
        <HiClock className="w-4 h-4 mr-1" />
        Sin comprobante
      </span>
    );
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay órdenes pendientes</h3>
        <p className="text-gray-500">¡Excelente! No hay pagos pendientes de revisión</p>
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
                Orden #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comprobante
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
              const isProcessing = processingOrder === order.id;

              return (
                <tr key={order.id} className="hover:bg-gray-50">
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
                    {order.hasPaymentReceipt && order.paymentReceiptUrl ? (
                      <button
                        onClick={() => onViewReceipt(order)}
                        className="group relative"
                      >
                        <img
                          src={order.paymentReceiptUrl}
                          alt="Comprobante"
                          className="h-12 w-12 object-cover rounded-lg border-2 border-gray-200 group-hover:border-indigo-500 transition-colors cursor-pointer"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all">
                          <HiPhotograph className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Sin comprobante</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {order.hasPaymentReceipt ? (
                      <>
                        <button
                          onClick={() => onViewReceipt(order)}
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors"
                        >
                          <HiPhotograph className="w-4 h-4 mr-1" />
                          Revisar
                        </button>
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
                    ) : (
                      <Link
                        to={`/admin/order/${order.id}`}
                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <HiEye className="w-4 h-4 mr-1" />
                        Ver orden
                      </Link>
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
          const isProcessing = processingOrder === order.id;

          return (
            <div key={order.id} className="p-4">
              {/* Card header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900">Orden #{order.id}</span>
                {getStatusBadge(order)}
              </div>

              {/* Card info */}
              <div className="space-y-2 text-sm mb-3">
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

                {/* Receipt preview */}
                {order.hasPaymentReceipt && order.paymentReceiptUrl && (
                  <div className="pt-2 border-t">
                    <p className="text-gray-600 text-xs mb-2">Comprobante:</p>
                    <button
                      onClick={() => onViewReceipt(order)}
                      className="w-full"
                    >
                      <img
                        src={order.paymentReceiptUrl}
                        alt="Comprobante"
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 hover:border-indigo-500 transition-colors"
                      />
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              {order.hasPaymentReceipt ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onViewReceipt(order)}
                    className="w-full inline-flex items-center justify-center px-3 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg transition-colors text-sm font-medium"
                  >
                    <HiPhotograph className="w-4 h-4 mr-1" />
                    Revisar Comprobante
                  </button>
                  <div className="flex gap-2">
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
                  </div>
                </div>
              ) : (
                <Link
                  to={`/admin/order/${order.id}`}
                  className="block w-full text-center px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                >
                  <HiEye className="w-4 h-4 inline mr-1" />
                  Ver orden
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}