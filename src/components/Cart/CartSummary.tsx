import { Link } from 'react-router-dom';

interface CartSummaryProps {
    itemsCount: number;
    total: number;
    isAuthenticated: boolean;
    hasItems: boolean;
    onCheckout: () => void;
}

const CartSummary = ({ itemsCount, total, isAuthenticated, hasItems, onCheckout }: CartSummaryProps) => {
    return (
        <div className="sticky top-32">
            <div className="relative bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="font-poppins text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                    Resumen
                </h2>

                <div className="flex items-center justify-between text-sm mb-6">
                    <p className="font-poppins text-sm text-gray-500">
                        {itemsCount} {itemsCount === 1 ? 'artículo' : 'artículos'}
                    </p>
                    <p className="font-poppins font-semibold text-gray-900 tabular-nums">
                        ${Math.floor(total).toLocaleString('es-AR')}
                        <span className="text-xs text-gray-700 align-super">{(total % 1).toFixed(2).substring(2)}</span>
                    </p>
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between mb-8">
                    <dt className="font-poppins text-base font-medium text-gray-700">Total</dt>
                    <dd className="font-poppins text-xl font-semibold text-gray-900 tabular-nums">
                        ${Math.floor(total).toLocaleString('es-AR')}
                        <span className="text-sm text-gray-700 font-medium align-super">{(total % 1).toFixed(2).substring(2)}</span>
                    </dd>
                </div>

                {/* Botón de checkout */}
                <div className="mt-8">
                    <button
                        onClick={onCheckout}
                        disabled={!hasItems}
                        className={`w-full py-3 sm:py-4 px-6 font-poppins text-sm sm:text-base font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            !hasItems
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'nova-bg-primary text-white hover:bg-gray-700'
                        }`}
                    >
                        <span className="flex items-center justify-center">
                            {!isAuthenticated ? (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span className="hidden sm:inline">Iniciar sesión para continuar</span>
                                    <span className="sm:hidden">Iniciar sesión</span>
                                </>
                            ) : (
                                <>
                                    <span className="hidden sm:inline">Comprar</span>
                                    <span className="sm:hidden">Comprar</span>
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </span>
                    </button>
                </div>

                {/* Mensaje de autenticación */}
                {!isAuthenticated && hasItems && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                        <div className="flex items-center">
                            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <p className="font-poppins text-sm text-yellow-800 font-medium">
                                Necesitas iniciar sesión para continuar con tu compra
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link
                        to="/products"
                        className="font-poppins inline-flex items-center hover:text-gray-700 font-medium transition-colors text-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Continuar comprando
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;
