import { CartItem } from '@/types';
import { productService } from '@/services/productService';

interface OrderSummaryCheckoutProps {
    cartItems: CartItem[];
    total: number;
    itemsCount: number;
}

const OrderSummaryCheckout = ({ cartItems, total, itemsCount }: OrderSummaryCheckoutProps) => {
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, itemId: number): void => {
        const target = e.target as HTMLImageElement;
        target.src = 'https://picsum.photos/64/64?random=' + itemId;
    };

    return (
        <div className="rounded-sm p-6">
            <h2 className="font-poppins text-lg font-medium text-gray-900 mb-6">Resumen del pedido</h2>

            <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-white rounded-md overflow-hidden">
                            <img
                                src={productService.getImageUrl(item.mainImageUrl)}
                                alt={item.name}
                                className="w-full h-full object-contain"
                                onError={(e) => handleImageError(e, item.id)}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-poppins text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                            <p className="font-poppins text-sm text-gray-500">Cantidad: {item.quantity}</p>
                        </div>
                        <div className="font-poppins text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center text-lg font-medium text-gray-900">
                    <span className="font-poppins">Total</span>
                    <span className="font-poppins">${total.toFixed(2)}</span>
                </div>
                <p className="font-poppins text-sm text-gray-500 mt-1">
                    {itemsCount} artículos en total
                </p>
            </div>

        </div>
    );
};

export default OrderSummaryCheckout;
