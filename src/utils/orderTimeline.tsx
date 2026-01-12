import type { OrderConfirmationDetail } from '../types';

export interface TimelineStep {
    key: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    date: string | null;
    completed: boolean;
    current: boolean;
    future: boolean;
}

export const getTimelineSteps = (order: OrderConfirmationDetail | null): TimelineStep[] => {
    if (!order) return [];

    const isMercadoPago = order.paymentMethod === 'mercadopago';

    // Timeline para MercadoPago (sin paso de comprobante)
    const mercadoPagoSteps = [
        {
            key: 'pending_payment',
            title: 'Pedido registrado',
            description: 'Esperando pago en MercadoPago',
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            date: order.createdAt
        },
        {
            key: 'payment_approved',
            title: 'Pago confirmado',
            description: 'Preparando tu pedido para envío',
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            ),
            date: order.paymentApprovedAt || null
        },
        {
            key: 'shipped',
            title: 'En camino',
            description: 'Pedido despachado - Seguí tu envío',
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 00-1-1H4a1 1 0 00-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm-10 0a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            date: order.shippedAt || null
        },
        {
            key: 'delivered',
            title: 'Entregado',
            description: '¡Tu pedido llegó a destino!',
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            date: order.deliveredAt || null
        }
    ];

    // Timeline para transferencia bancaria (con paso de comprobante)
    const bankTransferSteps = [
        {
            key: 'pending_payment',
            title: 'Pedido registrado',
            description: 'Esperando comprobante de transferencia',
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            date: order.createdAt
        },
        {
            key: 'payment_submitted',
            title: 'Comprobante recibido',
            description: 'Verificando pago en 24-48 horas',
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            date: order.paymentSubmittedAt || null
        },
        {
            key: 'payment_approved',
            title: 'Pago confirmado',
            description: 'Preparando tu pedido para envío',
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            ),
            date: order.paymentApprovedAt || null
        },
        {
            key: 'shipped',
            title: 'En camino',
            description: 'Pedido despachado - Seguí tu envío',
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 00-1-1H4a1 1 0 00-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm-10 0a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            date: order.shippedAt || null
        },
        {
            key: 'delivered',
            title: 'Entregado',
            description: '¡Tu pedido llegó a destino!',
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            date: order.deliveredAt || null
        }
    ];

    const steps = isMercadoPago ? mercadoPagoSteps : bankTransferSteps;

    // Manejar estados especiales
    if (order.status === 'cancelled') {
        return [
            { ...steps[0], completed: true, current: false, future: false },
            {
                key: 'cancelled',
                title: 'Pedido cancelado',
                description: 'Tu pedido fue cancelado - Contactanos si necesitas ayuda',
                icon: (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ),
                date: null,
                completed: false,
                current: true,
                future: false
            }
        ];
    }

    if (order.status === 'payment_rejected') {
        return [
            { ...steps[0], completed: true, current: false, future: false },
            { ...steps[1], completed: true, current: false, future: false },
            {
                key: 'payment_rejected',
                title: 'Comprobante rechazado',
                description: 'Verifica los datos y volvé a enviarlo',
                icon: (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ),
                date: null,
                completed: false,
                current: true,
                future: false
            }
        ];
    }

    // Flujo normal
    const currentStepIndex = steps.findIndex(step => step.key === order.status);

    return steps.map((step, index) => ({
        ...step,
        completed: index <= currentStepIndex,
        current: index === currentStepIndex,
        future: index > currentStepIndex
    }));
};
