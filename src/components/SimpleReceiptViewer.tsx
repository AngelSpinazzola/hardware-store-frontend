import { useState, useEffect } from 'react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Order } from '@/types/order.types';

interface SimpleReceiptViewerProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: number;
    fileType: 'pdf' | 'jpg' | 'png' | 'jpeg';
    order: Order;
}

const SimpleReceiptViewer = ({ 
    isOpen, 
    onClose, 
    orderId, 
    fileType, 
    order 
}: SimpleReceiptViewerProps) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        // Detectar móvil
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isOpen && orderId) {
            loadFile();
        }
    }, [isOpen, orderId]);

    const loadFile = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            
            // Para móvil, usar URL directa si está disponible
            if (isMobile && order?.paymentReceiptUrl) {
                setFileUrl(order.paymentReceiptUrl);
                return;
            }

            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000/api';
            const response = await fetch(`${apiUrl}/order/${orderId}/view-receipt`, {
                credentials: 'include' // Envía la cookie httpOnly automáticamente
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setFileUrl(url);
            } else {
                throw new Error('Error al cargar el archivo');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = async (): Promise<void> => {
        try {
            // Para móvil, usar enlace directo como en AdminPendingOrders
            if (isMobile) {
                // Obtener la URL directa del comprobante (como en AdminPendingOrders)
                const directUrl = order?.paymentReceiptUrl;
                if (directUrl) {
                    // Abrir directamente la URL de Cloudinary
                    window.open(directUrl, '_blank');
                } else {
                    alert('URL del comprobante no disponible');
                }
                return;
            }

            // Para desktop, método blob normal
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000/api';
            const response = await fetch(`${apiUrl}/order/${orderId}/view-receipt`, {
                credentials: 'include' // Envía la cookie httpOnly automáticamente
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `comprobante_orden_${orderId}.${fileType === 'pdf' ? 'pdf' : 'jpg'}`;
                a.click();
                URL.revokeObjectURL(url);
            } else {
                alert('Error al descargar el archivo');
            }
        } catch (err) {
            console.error('Error downloading:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            alert('Error al descargar: ' + errorMessage);
        }
    };

    const handleClose = (): void => {
        if (fileUrl) {
            URL.revokeObjectURL(fileUrl);
            setFileUrl(null);
        }
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg sm:text-2xl font-bold">Comprobante de Pago</h2>
                            <p className="text-sm sm:text-base text-blue-100 mt-1">
                                Orden #{orderId} • {order?.customerName}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={downloadFile}
                                className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl px-3 py-2 transition-colors"
                                disabled={!fileUrl || loading}
                            >
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">Descargar</span>
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-6 bg-gray-50">
                    {loading && (
                        <div className="h-full flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-600">Cargando comprobante...</p>
                        </div>
                    )}

                    {error && (
                        <div className="h-full flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
                            <p className="text-gray-600 mb-4 text-center">{error}</p>
                            <button
                                onClick={loadFile}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {fileUrl && !loading && !error && (
                        <div className="h-full bg-white rounded-xl shadow-inner overflow-hidden">
                            {fileType === 'pdf' ? (
                                // Mostrar interfaz diferente para PDF en móvil
                                isMobile ? (
                                    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Documento PDF</h3>
                                        <p className="text-gray-600 mb-6 text-sm leading-relaxed max-w-sm">
                                            Los PDFs no se pueden visualizar en dispositivos móviles. 
                                            Usa el botón "Descargar" arriba para verlo en tu aplicación de documentos.
                                        </p>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm">
                                            <div className="flex items-center gap-2 text-blue-800 text-sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-medium">Tip:</span>
                                            </div>
                                            <p className="text-blue-700 text-sm mt-1">
                                                Usa el botón "Descargar" en la parte superior para abrir el PDF en tu app de documentos.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    // Desktop: iframe normal
                                    <iframe
                                        src={fileUrl}
                                        className="w-full h-full border-0"
                                        title="Comprobante PDF"
                                    />
                                )
                            ) : (
                                // Imágenes: funcionan igual en móvil y desktop
                                <div className="w-full h-full flex items-center justify-center p-4">
                                    <img
                                        src={fileUrl}
                                        alt="Comprobante de pago"
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t bg-white px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">{fileType === 'pdf' ? 'PDF' : 'Imagen'}</span>
                            • ${order?.totalAmount?.toFixed(2)}
                        </div>
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleReceiptViewer;