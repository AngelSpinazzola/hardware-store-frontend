import { orderService } from '@/services/orderService';
import type { OrderConfirmationDetail } from '@/types/order.types';

interface OrderInfoCardsProps {
  order: OrderConfirmationDetail;
}

export default function OrderInfoCards({ order }: OrderInfoCardsProps) {
  const buildShippingAddress = (order: OrderConfirmationDetail): string => {
    const parts = [
      `${order.shippingStreet} ${order.shippingNumber}`,
      order.shippingFloor ? `Piso ${order.shippingFloor}` : '',
      order.shippingApartment ? `Depto ${order.shippingApartment}` : '',
      order.shippingCity,
      order.shippingProvince,
      order.shippingPostalCode ? `(${order.shippingPostalCode})` : ''
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {/* Información general */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Información General</h2>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">ID de Orden</dt>
            <dd className="text-sm text-gray-900 font-mono">#{order.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Fecha de Creación</dt>
            <dd className="text-sm text-gray-900">{orderService.formatDate(order.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Estado</dt>
            <dd className={`text-sm font-medium ${orderService.getStatusColor(order.status)}`}>
              {orderService.getStatusText(order.status)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total de Artículos</dt>
            <dd className="text-sm text-gray-900">{order.orderItems?.length || 0} productos</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total</dt>
            <dd className="text-lg font-bold text-gray-900">${orderService.formatPrice(order.total)}</dd>
          </div>
        </dl>
      </div>

      {/* Información del cliente */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Datos del Cliente</h2>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Nombre Completo</dt>
            <dd className="text-sm text-gray-900">{order.customerName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="text-sm text-gray-900">
              <a href={`mailto:${order.customerEmail}`} className="text-indigo-600 hover:text-indigo-800">
                {order.customerEmail}
              </a>
            </dd>
          </div>
          {order.customerPhone && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd className="text-sm text-gray-900">
                <a href={`tel:${order.customerPhone}`} className="text-indigo-600 hover:text-indigo-800">
                  {order.customerPhone}
                </a>
              </dd>
            </div>
          )}
          {(order.shippingStreet && order.shippingNumber) && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Dirección</dt>
              <dd className="text-sm text-gray-900">
                {buildShippingAddress(order)}
              </dd>
            </div>
          )}
          {order.userId && (
            <div>
              <dt className="text-sm font-medium text-gray-500">ID Usuario</dt>
              <dd className="text-sm text-gray-900 font-mono">#{order.userId}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Resumen */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Resumen</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              ${orderService.formatPrice(order.total)}
            </div>
            <div className="text-sm text-blue-800">Valor Total</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {order.orderItems?.length || 0}
            </div>
            <div className="text-sm text-green-800">Productos</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0}
            </div>
            <div className="text-sm text-purple-800">Unidades</div>
          </div>
        </div>
      </div>
    </div>
  );
}