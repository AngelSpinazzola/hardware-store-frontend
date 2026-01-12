import { useState, useEffect } from 'react';

interface FileViewerProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: number;
    fileType: 'pdf' | 'jpg' | 'png' | 'jpeg';
    fileName?: string;
}

const FileViewer = ({ isOpen, onClose, orderId, fileType, fileName }: FileViewerProps) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && orderId) {
            loadFile();
        }
    }, [isOpen, orderId]);

    const loadFile = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

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
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000/api';
            const response = await fetch(`${apiUrl}/order/${orderId}/download-receipt`, {
                credentials: 'include' // Envía la cookie httpOnly automáticamente
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName || `comprobante_orden_${orderId}`;
                a.click();
                URL.revokeObjectURL(url);
            } else {
                alert('Error al descargar el archivo');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            alert('Error al descargar: ' + errorMessage);
        }
    };

    const cleanup = (): void => {
        if (fileUrl) {
            URL.revokeObjectURL(fileUrl);
            setFileUrl(null);
        }
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            Comprobante de Pago - Orden #{orderId}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {fileType === 'pdf' ? 'Documento PDF' : 'Imagen'}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        {fileUrl && (
                            <button
                                onClick={downloadFile}
                                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Descargar</span>
                            </button>
                        )}
                        <button
                            onClick={cleanup}
                            className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Cargando archivo...</span>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-12">
                            <div className="text-red-600 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar archivo</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={loadFile}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {fileUrl && !loading && !error && (
                        <div className="w-full h-full">
                            {fileType === 'pdf' ? (
                                <iframe
                                    src={fileUrl}
                                    className="w-full h-[600px] border border-gray-300 rounded-lg"
                                    title="Comprobante PDF"
                                />
                            ) : (
                                <div className="text-center">
                                    <img
                                        src={fileUrl}
                                        alt="Comprobante de pago"
                                        className="max-w-full max-h-[600px] mx-auto rounded-lg shadow-lg"
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            {fileType === 'pdf' 
                                ? 'Usa los controles del navegador para navegar por el PDF'
                                : 'Click en "Descargar" para guardar la imagen'
                            }
                        </p>
                        <div className="flex space-x-2">
                            <button
                                onClick={cleanup}
                                className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileViewer;