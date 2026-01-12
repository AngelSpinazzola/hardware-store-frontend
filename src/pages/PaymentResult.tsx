import { useSearchParams, Link } from 'react-router-dom';
import NavBar from '../components/Common/NavBar';
import { Footer } from '../components/Common/Footer';

type PaymentStatus = 'success' | 'approved' | 'pending' | 'failure' | 'rejected';

interface PaymentResultProps {
    defaultStatus: PaymentStatus;
}

const PaymentResult = ({ defaultStatus }: PaymentResultProps) => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('external_reference');
    const paymentId = searchParams.get('payment_id');
    const status = (searchParams.get('status') || defaultStatus) as PaymentStatus;

    const getStatusConfig = () => {
        switch (status) {
            case 'approved':
            case 'success':
                return {
                    icon: (
                        <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    title: '¡Pago exitoso!',
                    message: 'Tu pago fue procesado correctamente. Tu pedido será preparado para envío.',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200'
                };
            case 'pending':
                return {
                    icon: (
                        <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    title: 'Pago pendiente',
                    message: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200'
                };
            case 'failure':
            case 'rejected':
                return {
                    icon: (
                        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    title: 'Pago rechazado',
                    message: 'No pudimos procesar tu pago. Por favor, intenta nuevamente o usa otro método de pago.',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200'
                };
            default:
                return {
                    icon: (
                        <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    title: 'Estado desconocido',
                    message: 'No pudimos determinar el estado de tu pago. Por favor, verifica en "Mis Compras".',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className="min-h-screen bg-white pt-16">
            <NavBar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-8 text-center`}>
                    <div className="flex justify-center mb-6">
                        {config.icon}
                    </div>

                    <h1 className="font-poppins text-2xl font-bold text-gray-800 mb-3">
                        {config.title}
                    </h1>

                    <p className="font-poppins text-base text-gray-600 mb-6 max-w-md mx-auto">
                        {config.message}
                    </p>

                    {orderId && (
                        <p className="font-poppins text-sm text-gray-500 mb-6">
                            Número de orden: <span className="font-semibold">#{orderId}</span>
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        {orderId ? (
                            <Link
                                to={`/order-confirmation/${orderId}`}
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-poppins font-medium hover:bg-blue-600 transition-colors"
                            >
                                Ver detalles del pedido
                            </Link>
                        ) : (
                            <Link
                                to="/my-orders"
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-poppins font-medium hover:bg-blue-600 transition-colors"
                            >
                                Ir a Mis Compras
                            </Link>
                        )}

                        <Link
                            to="/products"
                            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-poppins font-medium hover:bg-gray-300 transition-colors"
                        >
                            Continuar comprando
                        </Link>
                    </div>
                </div>

                {paymentId && (
                    <div className="mt-6 text-center">
                        <p className="font-poppins text-xs text-gray-400">
                            ID de transacción: {paymentId}
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default PaymentResult;
