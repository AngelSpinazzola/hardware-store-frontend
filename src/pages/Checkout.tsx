import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCheckoutForm } from '../hooks/useCheckoutForm';
import NavBar from '../components/Common/NavBar';
import ReceiverForm from '../components/Checkout/ReceiverForm';
import OrderSummaryCheckout from '../components/Checkout/OrderSummaryCheckout';
import PaymentLoadingOverlay from '../components/Checkout/PaymentLoadingOverlay';

const Checkout = () => {
    const { cartItems, getCartTotal, getCartItemsCount } = useCart();
    const {
        receiverData,
        selectedAddressId,
        paymentMethod,
        loading,
        errors,
        shakeAddress,
        touchedFields,
        handleReceiverInputChange,
        handleAddressSelect,
        setPaymentMethod,
        handleSubmit
    } = useCheckoutForm();

    if (cartItems.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white pt-16">
            <NavBar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                <div className="mb-6 sm:mb-8">
                    <h1 className="font-poppins text-xl sm:text-2xl font-semibold text-gray-800">Finalizar Compra</h1>
                    <div className="h-px bg-gray-200 w-full mt-3 mb-2"></div>
                    <p className="font-poppins text-base text-gray-700 mt-2">
                        Completa los datos del receptor y selecciona la dirección de envío
                    </p>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                    {/* Formulario de datos */}
                    <div className="lg:col-span-7">
                        {/* Selector de método de pago */}
                        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6">
                            <h2 className="font-poppins text-lg font-semibold text-gray-800 mb-4">
                                Método de Pago
                            </h2>
                            <span><p>
                            <span className='text-red-600'>¡IMPORTANTE! </span> 
                                Este pago es a modo de demostración, la tienda no entregará ningun producto real.
                            </p></span>
                            <div className='mt-4'>
                                <div className="space-y-3">
                                    <label className="flex items-center p-4 border-2 rounded-sm cursor-pointer transition-all hover:border-gray-400"
                                        style={{ borderColor: paymentMethod === 'bank_transfer' ? '#1f2937' : '#e5e7eb' }}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="bank_transfer"
                                            checked={paymentMethod === 'bank_transfer'}
                                            onChange={(e) => setPaymentMethod(e.target.value as 'bank_transfer' | 'mercadopago')}
                                            className="w-4 h-4 text-gray-800"
                                        />
                                        <div className="ml-3">
                                            <span className="font-poppins font-medium text-gray-800">Transferencia Bancaria</span>
                                            <p className="text-sm text-gray-600 mt-1">Realiza una transferencia y sube el comprobante</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border-2 rounded-sm cursor-pointer transition-all hover:border-gray-400"
                                        style={{ borderColor: paymentMethod === 'mercadopago' ? '#1f2937' : '#e5e7eb' }}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="mercadopago"
                                            checked={paymentMethod === 'mercadopago'}
                                            onChange={(e) => setPaymentMethod(e.target.value as 'bank_transfer' | 'mercadopago')}
                                            className="w-4 h-4 text-gray-800"
                                        />
                                        <div className="ml-3">
                                            <span className="font-poppins font-medium text-gray-800">MercadoPago</span>
                                            <p className="text-sm text-gray-600 mt-1">Paga con tarjeta de crédito/débito (máx. $500)</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <ReceiverForm
                            receiverData={receiverData}
                            selectedAddressId={selectedAddressId}
                            errors={errors}
                            shakeAddress={shakeAddress}
                            touchedFields={touchedFields}
                            onReceiverInputChange={handleReceiverInputChange}
                            onAddressSelect={handleAddressSelect}
                        />

                        {/* Botones */}
                        <div className="flex space-x-4 mt-8">
                            <Link
                                to="/cart"
                                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-sm text-center font-poppins font-medium hover:bg-gray-300 transition-colors"
                            >
                                ← Volver al carrito
                            </Link>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 nova-bg-primary text-white py-3 px-4 rounded-sm font-poppins font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? (paymentMethod === 'mercadopago' ? 'Redirigiendo a MercadoPago...' : 'Procesando...')
                                    : (paymentMethod === 'mercadopago' ? 'Pagar con MercadoPago' : 'Confirmar Pedido')}
                            </button>
                        </div>
                    </div>

                    {/* Resumen del pedido */}
                    <div className="mt-10 lg:mt-0 lg:col-span-5">
                        <OrderSummaryCheckout
                            cartItems={cartItems}
                            total={getCartTotal()}
                            itemsCount={getCartItemsCount()}
                        />
                    </div>
                </div>
            </main>

            {/* Loading overlay para MercadoPago */}
            {loading && <PaymentLoadingOverlay paymentMethod={paymentMethod} />}
        </div>
    );
};

export default Checkout;
