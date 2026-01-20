import { SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { CartItem as CartItemType } from '@/types';
import { productService } from '@/services/productService';

interface CartItemProps {
    item: CartItemType;
    index: number;
    onIncrement: (productId: number, currentQuantity: number, maxStock: number) => void;
    onDecrement: (productId: number, currentQuantity: number) => void;
    onRemove: (productId: number) => void;
    onImageError: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
}

const CartItem = ({ item, index, onIncrement, onDecrement, onRemove, onImageError }: CartItemProps) => {
    return (
        <div
            className="group relative bg-white rounded-xl border border-gray-200 p-6 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{
                animationDelay: `${index * 100}ms`
            }}
        >
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r to-cyan-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>

            <div className="flex flex-col sm:flex-row gap-4">
                {/* Imagen del producto */}
                <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden mx-auto sm:mx-0">
                    <img
                        src={productService.getImageUrl(item.mainImageUrl)}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        data-product-id={item.id}
                        onError={onImageError}
                    />
                </div>

                {/* Detalles del producto */}
                <div className="flex-1 flex flex-col text-center sm:text-left">
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div className="flex-1">
                                <h3 className="font-poppins text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
                                    <Link to={`/product/${item.id}`}>
                                        {item.name}
                                    </Link>
                                </h3>
                                <p className="font-poppins text-gray-500 text-sm mb-2 sm:mb-3">
                                    <span className="font-semibold text-gray-900 tabular-nums">
                                        ${Math.floor(item.price).toLocaleString('es-AR')}
                                        <span className="text-xs align-super">{(item.price % 1).toFixed(2).substring(2)}</span>
                                    </span>
                                </p>
                            </div>
                            <div className="sm:text-right">
                                <p className="text-lg font-semibold text-gray-900 tabular-nums">
                                    ${Math.floor(item.price * item.quantity).toLocaleString('es-AR')}
                                    <span className="text-sm font-medium text-gray-700 align-super">{((item.price * item.quantity) % 1).toFixed(2).substring(2)}</span>
                                </p>

                                {item.quantity > 1 && (
                                    <p className="font-poppins text-sm text-gray-500 mt-1 tabular-nums">
                                        Por unidad ${Math.floor(item.price).toLocaleString('es-AR')}
                                        <span className="text-xs align-super">{(item.price % 1).toFixed(2).substring(2)}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Controles de cantidad y eliminar */}
                    <div className="flex sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-3 sm:mt-4">
                        {/* Botón eliminar */}
                        <button
                            onClick={() => onRemove(item.id)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group/remove shadow-sm border border-red-200"
                        >
                            <svg className="w-5 h-5 group-hover/remove:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>

                        {/* Controles de cantidad */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1 shadow-sm border border-gray-200">
                            <button
                                onClick={() => onDecrement(item.id, item.quantity)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-red-50 hover:text-red-600 transition-all duration-200 group/btn border border-gray-100"
                            >
                                <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                </svg>
                            </button>

                            <div className="px-4 py-2 min-w-[50px] text-center">
                                <span className="font-poppins text-base font-bold text-gray-900 tabular-nums">{item.quantity}</span>
                            </div>

                            <button
                                onClick={() => onIncrement(item.id, item.quantity, item.stock)}
                                disabled={item.quantity >= item.stock}
                                className={`w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-sm transition-all duration-200 group/btn border border-gray-100 ${
                                    item.quantity >= item.stock
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'hover:bg-green-50 hover:text-green-600'
                                }`}
                            >
                                <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
