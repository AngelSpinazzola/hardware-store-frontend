import { Link, useParams } from 'react-router-dom';
import AdminLayout from '@/pages/Admin/Layout/AdminLayout';
import OrderHeader from '@/pages/Admin/Orders/OrderHeader';
import OrderInfoCards from '@/pages/Admin/Orders/OrderInfoCards';
import OrderItemsTable from '@/pages/Admin/Orders/OrderItemsTable';
import OrderActions from '@/pages/Admin/Orders/OrderActions';
import { useOrderDetail } from '@/pages/Admin/Orders/useOrderDetail';
import { useState } from 'react';

export default function AdminOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { order, loading, error } = useOrderDetail(orderId);

  const handlePrint = (): void => {
    window.print();
  };

  return (
    <AdminLayout
      title={order ? `Orden #${order.id}` : 'Detalle de Orden'}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
            <p className="mt-4 text-gray-600">Cargando orden...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !order && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Orden no encontrada</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            to="/admin/orders"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Volver a órdenes
          </Link>
        </div>
      )}

      {/* Order content */}
      {!loading && order && (
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <OrderHeader
            orderId={order.id}
            status={order.status}
            onPrint={handlePrint}
          />

          {/* Info Cards */}
          <OrderInfoCards order={order} />

          {/* Items Table */}
          <OrderItemsTable
            items={order.orderItems || []}
            total={order.total}
          />

          {/* Actions */}
          <OrderActions
            orderId={order.id}
            customerEmail={order.customerEmail}
            onPrint={handlePrint}
          />
        </div>
      )}
    </AdminLayout>
  );
}