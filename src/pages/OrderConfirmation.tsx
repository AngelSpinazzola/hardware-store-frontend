import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../services/orderService';
import NavBar from '../components/Common/NavBar';
import { Footer } from '../components/Common/Footer';
import { useOrderConfirmation } from '../hooks/useOrderConfirmation';
import { getTimelineSteps } from '../utils/orderTimeline';
import {
    OrderTimeline,
    ReceiptUploadSection,
    ShippingInfo,
    OrderProducts
} from '../components/Orders';

const OrderConfirmation = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [loadingMercadoPago, setLoadingMercadoPago] = useState(false);

    const {
        order,
        loading,
        error,
        selectedFile,
        uploadingReceipt,
        uploadSuccess,
        handleFileSelect,
        handleUploadReceipt
    } = useOrderConfirmation({ orderId });

    // Success toast (solo una vez)
    useEffect(() => {
        if (order && orderId) {
            const shouldShowSuccess = localStorage.getItem(`order_success_${orderId}`);

            if (shouldShowSuccess === 'true') {
                toast.success('¡Gracias por tu compra! Tu pedido ha sido creado exitosamente.');
                localStorage.removeItem(`order_success_${orderId}`);
            }
        }
    }, [order, orderId]);

    // File input handler
    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        handleFileSelect(file);
    };

    // MercadoPago payment handler
    const handlePayWithMercadoPago = async () => {
        if (!orderId) return;

        setLoadingMercadoPago(true);
        try {
            const backUrl = `${window.location.origin}/payment`;
            const paymentResponse = await orderService.createMercadoPagoPayment(parseInt(orderId), backUrl);
            orderService.redirectToMercadoPago(paymentResponse);
        } catch (error) {
            console.error('Error al crear pago:', error);
            toast.error('Error al procesar el pago. Intenta nuevamente.');
            setLoadingMercadoPago(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16">
                <NavBar />
                <div className="flex items-center justify-center py-20">
                    <div className="text-center bg-white p-8 rounded-lg shadow-sm">
                        <h2 className="font-poppins text-xl font-semibold text-gray-800 mb-4">Orden no encontrada</h2>
                        <p className="font-poppins text-sm text-gray-500 mb-6 leading-relaxed">{error}</p>
                        <Link
                            to="/"
                            className="font-poppins bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition-colors inline-block"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const timelineSteps = getTimelineSteps(order);

    return (
        <div className="min-h-screen bg-white pt-16">
            <NavBar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-poppins text-xl sm:text-2xl font-semibold text-gray-800">Detalles de tu pedido</h1>
                    <div className="h-px bg-gray-300 w-full mt-2 mb-3"></div>
                </div>

                {/* Timeline */}
                <OrderTimeline steps={timelineSteps} />

                {/* Sección de comprobante - Solo para transferencia bancaria */}
                {order.paymentMethod === 'bank_transfer' && orderService.canUploadReceipt(order.status) && (
                    <ReceiptUploadSection
                        orderTotal={order.total}
                        selectedFile={selectedFile}
                        uploadingReceipt={uploadingReceipt}
                        uploadSuccess={uploadSuccess}
                        onFileSelect={handleFileInputChange}
                        onUploadReceipt={handleUploadReceipt}
                    />
                )}

                {/* Sección de pago con MercadoPago - Solo para MercadoPago */}
                {order.paymentMethod === 'mercadopago' && orderService.canPayWithMercadoPago(order.status) && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="font-poppins text-lg font-semibold text-gray-800 mb-4">
                            Pagar con MercadoPago
                        </h2>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <p className="font-poppins text-sm text-blue-800 mb-2">
                                Pagá con tarjeta de crédito o débito de forma segura
                            </p>
                            <ul className="font-poppins text-xs text-blue-700 space-y-1 ml-4 list-disc">
                                <li>Aprobación inmediata</li>
                                <li>Hasta 12 cuotas sin interés</li>
                            </ul>
                        </div>
                        <button
                            onClick={handlePayWithMercadoPago}
                            disabled={loadingMercadoPago}
                            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-poppins font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loadingMercadoPago ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Redirigiendo...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    Pagar con MercadoPago
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Información de envío */}
                <ShippingInfo order={order} />

                {/* Productos */}
                <OrderProducts orderItems={order.orderItems} total={order.total} />

                {/* Tracking info */}
                {order.status === 'shipped' && order.trackingNumber && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="font-poppins text-lg font-semibold text-gray-800 mb-4">
                            Información de envío
                        </h2>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <p className="font-poppins text-sm text-purple-800">
                                <span className="font-semibold">Seguimiento:</span> {order.trackingNumber}
                            </p>
                            {order.shippingProvider && (
                                <p className="font-poppins text-sm text-purple-700 mt-1">
                                    <span className="font-semibold">Transportista:</span> {order.shippingProvider}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Link
                        to="/my-orders"
                        className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md text-center font-poppins font-medium md:hover:bg-gray-300 transition-colors"
                    >
                        Ver mis compras
                    </Link>

                    <Link
                        to="/products"
                        className="flex-1 nova-bg-primary text-white py-3 px-4 rounded-md text-center font-poppins font-medium md:hover:bg-gray-700 transition-colors"
                    >
                        Continuar comprando
                    </Link>
                </div>
            </main>
            <div className='mt-10 lg:mt-32'>
                <Footer />
            </div>
        </div>
    );
};

export default OrderConfirmation;