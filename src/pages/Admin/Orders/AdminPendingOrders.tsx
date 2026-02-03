import { useState } from 'react';
import AdminLayout from '@/pages/Admin/Layout/AdminLayout';
import PendingOrdersTable from '@/pages/Admin/Orders/PendingOrdersTable';
import OrderActionModal from '@/pages/Admin/Orders/OrderActionModal';
import PaymentReceiptModal from '@/pages/Admin/Orders/PaymentReceiptModal';
import Spinner from '@/components/Common/Spinner';
import { usePendingOrders } from '@/pages/Admin/Orders/usePendingOrders';
import { HiExclamationCircle, HiCheckCircle } from 'react-icons/hi';
import type { OrderSummary } from '@/types/order.types';

interface ActionModal {
  show: boolean;
  order: OrderSummary | null;
  action: 'approve' | 'reject' | null;
}

interface ReceiptModal {
  show: boolean;
  order: OrderSummary | null;
}

export default function AdminPendingOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionModal, setActionModal] = useState<ActionModal>({
    show: false,
    order: null,
    action: null
  });
  const [receiptModal, setReceiptModal] = useState<ReceiptModal>({
    show: false,
    order: null
  });

  const {
    orders,
    loading,
    error,
    processingOrder,
    handleApprovePayment,
    handleRejectPayment
  } = usePendingOrders();


  // Handler para abrir modal de comprobante
  const handleViewReceipt = (order: OrderSummary) => {
    setReceiptModal({ show: true, order });
  };

  const handleCloseReceiptModal = () => {
    setReceiptModal({ show: false, order: null });
  };

  // Handlers para action modal (aprobar/rechazar desde tabla)
  const handleOpenApproveModal = (order: OrderSummary) => {
    setActionModal({ show: true, order, action: 'approve' });
  };

  const handleOpenRejectModal = (order: OrderSummary) => {
    setActionModal({ show: true, order, action: 'reject' });
  };

  const handleCloseActionModal = () => {
    setActionModal({ show: false, order: null, action: null });
  };

  const handleConfirmAction = async (notes: string) => {
    if (!actionModal.order) return;

    try {
      if (actionModal.action === 'approve') {
        await handleApprovePayment(actionModal.order.id, notes);
      } else if (actionModal.action === 'reject') {
        await handleRejectPayment(actionModal.order.id, notes);
      }
      handleCloseActionModal();
    } catch {
      // Error ya manejado en usePendingOrders
    }
  };

  // Handlers desde receipt modal (aprobar/rechazar desde modal de comprobante)
  const handleApproveFromModal = () => {
    if (receiptModal.order) {
      setReceiptModal({ show: false, order: null });
      setActionModal({ show: true, order: receiptModal.order, action: 'approve' });
    }
  };

  const handleRejectFromModal = () => {
    if (receiptModal.order) {
      setReceiptModal({ show: false, order: null });
      setActionModal({ show: true, order: receiptModal.order, action: 'reject' });
    }
  };

  // Calcular estadísticas
  const ordersWithReceipt = orders.filter(o => o.hasPaymentReceipt).length;
  const ordersWithoutReceipt = orders.length - ordersWithReceipt;

  if (loading) {
    return (
      <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="flex flex-col items-center justify-center min-h-[90vh]">
          <Spinner size="md" color="blue" />
          <p className="mt-4 text-gray-600">Cargando órdenes pendientes...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      {/* Alert banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <HiExclamationCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Atención:</span> Estas órdenes requieren revisión y aprobación de pago antes de poder ser procesadas.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pendientes</p>
              <p className="text-2xl font-bold text-indigo-600">{orders.length}</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <HiExclamationCircle className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Con Comprobante</p>
              <p className="text-2xl font-bold text-green-600">{ordersWithReceipt}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <HiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sin Comprobante</p>
              <p className="text-2xl font-bold text-yellow-600">{ordersWithoutReceipt}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <HiExclamationCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Tabla de órdenes - CON onViewReceipt */}
      {!error && (
        <PendingOrdersTable
          orders={orders}
          processingOrder={processingOrder}
          onViewReceipt={handleViewReceipt}
          onApprove={handleOpenApproveModal}
          onReject={handleOpenRejectModal}
        />
      )}

      {/* Modal de comprobante */}
      <PaymentReceiptModal
        isOpen={receiptModal.show}
        order={receiptModal.order}
        onClose={handleCloseReceiptModal}
        onApprove={handleApproveFromModal}
        onReject={handleRejectFromModal}
        processing={processingOrder === receiptModal.order?.id}
      />

      {/* Modal de acciones (aprobar/rechazar con notas) */}
      <OrderActionModal
        isOpen={actionModal.show}
        order={actionModal.order}
        action={actionModal.action}
        processing={processingOrder === actionModal.order?.id}
        onClose={handleCloseActionModal}
        onConfirm={handleConfirmAction}
      />
    </AdminLayout>
  );
}