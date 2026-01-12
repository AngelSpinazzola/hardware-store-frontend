interface PaymentLoadingOverlayProps {
    paymentMethod: 'bank_transfer' | 'mercadopago';
}

const PaymentLoadingOverlay = ({ paymentMethod }: PaymentLoadingOverlayProps) => {
    if (paymentMethod !== 'mercadopago') {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
                {/* Logo de MercadoPago */}
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                </div>

                {/* Spinner animado */}
                <div className="mb-6">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
                </div>

                {/* Texto */}
                <h3 className="font-poppins text-xl font-semibold text-gray-800 mb-2">
                    Preparando tu pago
                </h3>
                <p className="font-poppins text-sm text-gray-600 mb-4">
                    Estamos configurando tu pago con MercadoPago. En unos segundos serás redirigido...
                </p>

                {/* Indicador de pasos */}
                <div className="flex justify-center space-x-2 mt-6">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>

                {/* Mensaje de seguridad */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="font-poppins text-xs text-gray-500 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Conexión segura con MercadoPago
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentLoadingOverlay;
