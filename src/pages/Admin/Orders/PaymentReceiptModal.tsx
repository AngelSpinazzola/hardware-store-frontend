import { useState } from 'react';
import { HiX, HiCheckCircle, HiXCircle, HiDownload, HiZoomIn, HiZoomOut } from 'react-icons/hi';
import type { OrderSummary } from '@/types/order.types';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  order: OrderSummary | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  processing: boolean;
}

export default function PaymentReceiptModal({
  isOpen,
  order,
  onClose,
  onApprove,
  onReject,
  processing
}: PaymentReceiptModalProps) {
  const [zoom, setZoom] = useState(100);

  if (!isOpen || !order) return null;

  const handleDownload = () => {
    if (order.paymentReceiptUrl) {
      window.open(order.paymentReceiptUrl, '_blank');
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Comprobante de Pago - Orden #{order.id}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Cliente: {order.customerName} | Total: ${order.total.toFixed(2)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Alejar"
                >
                  <HiZoomOut className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600 font-medium min-w-[60px] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Acercar"
                >
                  <HiZoomIn className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleDownload}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors"
              >
                <HiDownload className="w-4 h-4 mr-2" />
                Descargar
              </button>
            </div>
          </div>

          {/* Image Container */}
          <div className="overflow-auto max-h-[calc(90vh-250px)] bg-gray-100 p-6">
            <div className="flex justify-center">
              {order.paymentReceiptUrl ? (
                <img
                  src={order.paymentReceiptUrl}
                  alt={`Comprobante de pago - Orden ${order.id}`}
                  style={{ width: `${zoom}%` }}
                  className="rounded-lg shadow-lg transition-all duration-200"
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay comprobante disponible</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                disabled={processing}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
              >
                Cerrar
              </button>
              <button
                onClick={onReject}
                disabled={processing}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
              >
                <HiXCircle className="w-5 h-5 mr-2" />
                {processing ? 'Procesando...' : 'Rechazar Pago'}
              </button>
              <button
                onClick={onApprove}
                disabled={processing}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
              >
                <HiCheckCircle className="w-5 h-5 mr-2" />
                {processing ? 'Procesando...' : 'Aprobar Pago'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}