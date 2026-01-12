import { SyntheticEvent } from 'react';
import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import type { OrderItemWithSubtotal } from '@/types/order.types';

interface OrderItemsTableProps {
  items: OrderItemWithSubtotal[];
  total: number;
}

export default function OrderItemsTable({ items, total }: OrderItemsTableProps) {
  const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>, productId: number): void => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://picsum.photos/48/48?random=' + productId;
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 mt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Productos de la Orden</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Unit.
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12">
                      <img
                        src={productService.getImageUrl(item.productImageUrl || '')}
                        alt={item.productName}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover"
                        onError={(e) => handleImageError(e, item.productId)}
                      />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.productName}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        ID: {item.productId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${orderService.formatPrice(item.unitPrice)}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.quantity}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${orderService.formatPrice(item.totalPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mt-6">
        <div className="flex justify-end">
          <div className="text-right">
            <div className="text-base sm:text-lg font-medium text-gray-900">
              Total: <span className="font-bold">${orderService.formatPrice(total)}</span>
            </div>
            <div className="text-sm text-gray-500">
              {items.reduce((sum, item) => sum + item.quantity, 0)} unidades
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}