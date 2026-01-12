import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import type { OrderItemWithSubtotal } from '../../types';

interface OrderProductsProps {
    orderItems: OrderItemWithSubtotal[];
    total: number;
}

const OrderProducts = ({ orderItems, total }: OrderProductsProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="font-poppins text-lg font-semibold text-gray-800 mb-6">
                Productos
            </h2>

            <div className="space-y-4">
                {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                        <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg overflow-hidden">
                            <img
                                src={productService.getImageUrl(item.productImageUrl || '')}
                                alt={item.productName}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://picsum.photos/64/64?random=' + item.productId;
                                }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-poppins text-sm font-medium text-gray-900 mb-1">
                                {item.productName}
                            </h3>
                            <p className="font-poppins text-sm text-gray-500">
                                ${orderService.formatPrice(item.unitPrice)} × {item.quantity}
                            </p>
                        </div>
                        <div className="font-poppins text-sm font-semibold text-gray-900">
                            ${orderService.formatPrice(item.subtotal)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between items-center">
                    <span className="font-poppins text-lg font-semibold text-gray-900">Total</span>
                    <span className="font-poppins text-xl font-semibold text-gray-900">
                        ${orderService.formatPrice(total)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderProducts;
