import { useState } from 'react';
import AdminLayout from '@/pages/Admin/Layout/AdminLayout';
import OrderStats from '@/pages/Admin/Orders/OrderStats';
import OrderFilters from '@/pages/Admin/Orders/OrderFilters';
import OrdersTable from '@/pages/Admin/Orders/OrdersTable';
import OrderActionModal from '@/pages/Admin/Orders/OrderActionModal';
import Spinner from '@/components/Common/Spinner';
import { useOrders } from '@/pages/Admin/Orders/useOrders';
import type { OrderSummary } from '@/types/order.types';

interface ActionModal {
  show: boolean;
  order: OrderSummary | null;
  action: 'approve' | 'reject' | null;
}

export default function AdminOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionModal, setActionModal] = useState<ActionModal>({
    show: false,
    order: null,
    action: null
  });

  const {
    filteredOrders,
    loading,
    error,
    selectedStatus,
    expandedOrder,
    sortBy,
    searchTerm,
    processingOrder,
    stats,
    statusOptions,
    setSelectedStatus,
    setExpandedOrder,
    setSortBy,
    setSearchTerm,
    handleApprovePayment,
    handleRejectPayment
  } = useOrders();

  // Handlers para modal
  const handleOpenApproveModal = (order: OrderSummary) => {
    setActionModal({ show: true, order, action: 'approve' });
  };

  const handleOpenRejectModal = (order: OrderSummary) => {
    setActionModal({ show: true, order, action: 'reject' });
  };

  const handleCloseModal = () => {
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
      handleCloseModal();
    } catch (error) {
      // Error ya manejado en useOrders
    }
  };

  // Toggle expand orden
  const handleToggleExpand = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <div className="flex flex-col items-center justify-center min-h-[90vh]">
          <Spinner size="md" color="blue" />
          <p className="mt-4 text-gray-600">Cargando órdenes...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      {/* Estadísticas */}
      <OrderStats
        totalOrders={stats.totalOrders}
        pendingPayments={stats.pendingPayments}
        approvedPayments={stats.approvedPayments}
        rejectedPayments={stats.rejectedPayments}
        totalRevenue={stats.totalRevenue}
      />

      {/* Filtros */}
      <OrderFilters
        selectedStatus={selectedStatus}
        sortBy={sortBy}
        searchTerm={searchTerm}
        statusOptions={statusOptions}
        onStatusChange={setSelectedStatus}
        onSortChange={setSortBy}
        onSearchChange={setSearchTerm}
      />

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

      {/* Tabla de órdenes */}
      {!error && (
        <>
          <OrdersTable
            orders={filteredOrders}
            expandedOrder={expandedOrder}
            processingOrder={processingOrder}
            onToggleExpand={handleToggleExpand}
            onApprove={handleOpenApproveModal}
            onReject={handleOpenRejectModal}
          />

          {/* Info de resultados */}
          {filteredOrders.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Mostrando {filteredOrders.length} de {stats.totalOrders} órdenes
            </div>
          )}
        </>
      )}

      {/* Modal de acciones */}
      <OrderActionModal
        isOpen={actionModal.show}
        order={actionModal.order}
        action={actionModal.action}
        processing={processingOrder === actionModal.order?.id}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
      />
    </AdminLayout>
  );
}