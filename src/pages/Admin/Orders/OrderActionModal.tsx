import { useState } from 'react';
import { HiX, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import type { OrderSummary } from '@/types/order.types';

interface OrderActionModalProps {
  isOpen: boolean;
  order: OrderSummary | null;
  action: 'approve' | 'reject' | null;
  processing: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => void;
}

export default function OrderActionModal({
  isOpen,
  order,
  action,
  processing,
  onClose,
  onConfirm
}: OrderActionModalProps) {
  const [notes, setNotes] = useState('');

  if (!isOpen || !order || !action) return null;

  const isApprove = action === 'approve';
  const Icon = isApprove ? HiCheckCircle : HiXCircle;
  const colorClass = isApprove ? 'text-green-600' : 'text-red-600';
  const bgColorClass = isApprove ? 'bg-green-50' : 'bg-red-50';
  const buttonClass = isApprove
    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(notes);
    setNotes('');
  };

  const handleClose = () => {
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`${bgColorClass} p-2 rounded-lg mr-3`}>
                <Icon className={`w-6 h-6 ${colorClass}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isApprove ? 'Aprobar Pago' : 'Rechazar Pago'}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                ¿Estás seguro de que deseas{' '}
                <span className={`font-semibold ${colorClass}`}>
                  {isApprove ? 'aprobar' : 'rechazar'}
                </span>{' '}
                el pago de la orden <span className="font-semibold">#{order.id}</span>?
              </p>
              <div className="bg-gray-50 p-3 rounded-lg mt-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Cliente:</span> {order.customerName}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Notas admin */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nota del administrador
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Agrega comentarios o razones..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={processing}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${buttonClass}`}
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  `Confirmar ${isApprove ? 'Aprobación' : 'Rechazo'}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}