import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import NavBar from '../components/Common/NavBar';
import { Footer } from '../components/Common/Footer';
import { orderService } from '../services/orderService';

type PaymentStatus = 'success' | 'approved' | 'pending' | 'failure' | 'rejected';

interface PaymentResultProps {
    defaultStatus: PaymentStatus;
}

const STATUS_DETAIL_MESSAGES: Record<string, string> = {
    // Rechazos comunes
    cc_rejected_insufficient_amount: 'Tu tarjeta no tiene fondos suficientes para completar el pago.',
    cc_rejected_bad_filled_card_number: 'El número de tarjeta es incorrecto. Por favor, verificalo e intentá de nuevo.',
    cc_rejected_bad_filled_date: 'La fecha de vencimiento es incorrecta.',
    cc_rejected_bad_filled_security_code: 'El código de seguridad (CVV) es incorrecto.',
    cc_rejected_bad_filled_other: 'Revisá los datos de la tarjeta. Alguno es incorrecto.',
    cc_rejected_call_for_authorize: 'Debés autorizar el pago con tu banco antes de continuar.',
    cc_rejected_card_disabled: 'Tu tarjeta está deshabilitada. Comunicate con tu banco.',
    cc_rejected_card_error: 'No pudimos procesar el pago. Intentá con otra tarjeta.',
    cc_rejected_duplicated_payment: 'Ya realizaste un pago por este monto. Si querés volver a pagar, usá otra tarjeta u otro medio de pago.',
    cc_rejected_high_risk: 'El pago fue rechazado por motivos de seguridad. Probá con otro medio de pago.',
    cc_rejected_max_attempts: 'Alcanzaste el límite de intentos permitidos. Probá con otra tarjeta.',
    cc_rejected_invalid_installments: 'La cantidad de cuotas seleccionadas no es válida para esta tarjeta.',
    cc_rejected_blacklist: 'No pudimos procesar el pago. Probá con otro medio de pago.',
    cc_rejected_other_reason: 'El banco rechazó el pago. Contactate con tu banco o usá otra tarjeta.',
    cc_rejected_by_bank: 'Tu banco rechazó el pago. Contactate con ellos para más información.',
    cc_rejected_card_type_not_allowed: 'El tipo de tarjeta no es aceptado. Probá con otro medio de pago.',

    // Pendientes
    pending_contingency: 'Estamos procesando tu pago. Te avisaremos por email cuando se confirme.',
    pending_review_manual: 'Tu pago está en revisión manual. Te avisaremos cuando tengamos novedades.',
    pending_waiting_payment: 'Estamos esperando la confirmación del pago.',
    pending_capture: 'Tu pago está pendiente de captura.',

    // Aprobados
    accredited: 'Tu pago fue aprobado y acreditado correctamente.',
    partially_refunded: 'Tu pago fue parcialmente reembolsado.',
};

const PaymentResult = ({ defaultStatus }: PaymentResultProps) => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('external_reference');
    const paymentId = searchParams.get('payment_id');
    const status = (searchParams.get('status') || defaultStatus) as PaymentStatus;

    const [statusDetail, setStatusDetail] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) return;

        let cancelled = false;
        let attempts = 0;
        const maxAttempts = 4;
        const delayMs = 2000;

        const fetchOrderDetail = async (): Promise<void> => {
            try {
                const order = await orderService.getOrderById(Number(orderId));

                if (cancelled) return;

                if (order.mercadoPagoStatusDetail) {
                    setStatusDetail(order.mercadoPagoStatusDetail);
                    return;
                }

                // Race condition: el webhook puede no haber llegado aún.
                // Reintentamos un par de veces antes de rendirnos.
                attempts += 1;
                if (attempts < maxAttempts) {
                    setTimeout(fetchOrderDetail, delayMs);
                }
            } catch (error) {
                console.error('Error obteniendo detalle del pago:', error);
            }
        };

        fetchOrderDetail();

        return () => {
            cancelled = true;
        };
    }, [orderId]);

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
    const detailMessage = statusDetail ? STATUS_DETAIL_MESSAGES[statusDetail] : null;
    const displayMessage = detailMessage ?? config.message;

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
                        {displayMessage}
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
