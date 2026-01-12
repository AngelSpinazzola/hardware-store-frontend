import { orderService } from '../../services/orderService';

interface ReceiptUploadSectionProps {
    orderTotal: number;
    selectedFile: File | null;
    uploadingReceipt: boolean;
    uploadSuccess: boolean;
    onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onUploadReceipt: () => void;
}

const ReceiptUploadSection = ({
    orderTotal,
    selectedFile,
    uploadingReceipt,
    uploadSuccess,
    onFileSelect,
    onUploadReceipt
}: ReceiptUploadSectionProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="font-poppins text-lg font-semibold text-gray-800 mb-6">
                Comprobante de pago
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-poppins text-sm font-semibold text-blue-800 mb-2">
                    Instrucciones para el pago:
                </h3>
                <div className="font-poppins text-sm text-blue-700 space-y-1 leading-relaxed">
                    <p>• Realiza una transferencia bancaria por <strong className="font-bold tabular-nums">${orderService.formatPrice(orderTotal)}</strong></p>
                    <p>• Adjunta tu comprobante de pago (JPG, PNG o PDF)</p>
                    <p>• Una vez enviado, revisaremos tu comprobante en 24-48 horas</p>
                </div>
            </div>

            {uploadSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-poppins text-sm text-green-800 font-medium">
                            Comprobante enviado exitosamente
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative sm:w-42">
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={onFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="block w-full bg-white text-orange-500 py-3 px-4 rounded-lg text-center font-poppins font-medium cursor-pointer border-2 border-dashed border-orange-500"
                            >
                                Subir comprobante
                            </label>
                        </div>
                        <p className="font-poppins text-xs text-gray-500 mt-1 sm:mt-5 sm:ml-2">
                            Formatos permitidos: JPG, PNG, PDF (máx. 5MB)
                        </p>
                        <div className="hidden sm:block sm:flex-1"></div>
                        <button
                            onClick={onUploadReceipt}
                            disabled={!selectedFile || uploadingReceipt}
                            className="bg-orange-400 text-white py-3 px-6 rounded-lg font-poppins font-medium md:hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {uploadingReceipt ? 'Subiendo...' : 'Enviar comprobante'}
                        </button>
                    </div>
                </div>

                {selectedFile && (
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-poppins text-sm text-gray-600">
                            <span className="font-semibold">{selectedFile.name}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceiptUploadSection;
