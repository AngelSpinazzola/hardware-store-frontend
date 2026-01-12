import { ChangeEvent } from 'react';
import { ReceiverFormData, FormErrors } from '@/hooks/useCheckoutForm';
import AddressDropdown from '../AddressDropdown';

interface ReceiverFormProps {
    receiverData: ReceiverFormData;
    selectedAddressId: number | null;
    errors: FormErrors;
    shakeAddress: boolean;
    touchedFields: Record<string, boolean>;
    onReceiverInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onAddressSelect: (addressId: number) => void;
}

const ReceiverForm = ({
    receiverData,
    selectedAddressId,
    errors,
    shakeAddress,
    touchedFields,
    onReceiverInputChange,
    onAddressSelect
}: ReceiverFormProps) => {
    return (
        <div className="bg-gray-100  rounded-sm p-6 space-y-8">
            {/* Datos de quien recibe */}
            <div>
                <h2 className="font-poppins text-lg font-medium text-gray-900 mb-6">Datos de quien recibe</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="receiverFirstName" className="block text-sm font-medium text-gray-700 font-poppins">
                            Nombre *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="receiverFirstName"
                                name="firstName"
                                value={receiverData.firstName}
                                onChange={onReceiverInputChange}
                                className={`mt-1 block w-full rounded-md shadow-sm font-poppins pr-10 ${
                                    touchedFields.firstName && errors.receiverFirstName
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : touchedFields.firstName && receiverData.firstName && !errors.receiverFirstName && receiverData.firstName.trim().length >= 2
                                        ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="Nombre de quien recibe"
                            />
                            {touchedFields.firstName && receiverData.firstName && !errors.receiverFirstName && receiverData.firstName.trim().length >= 2 && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        {touchedFields.firstName && errors.receiverFirstName ? (
                            <p className="mt-1 text-sm text-red-600 font-poppins">{errors.receiverFirstName}</p>
                        ) : touchedFields.firstName && receiverData.firstName && !errors.receiverFirstName && receiverData.firstName.trim().length >= 2 ? (
                            <p className="mt-1 text-sm text-green-600 font-poppins">Nombre válido</p>
                        ) : (
                            <p className="mt-1 text-sm text-gray-500 font-poppins">Mínimo 2 caracteres</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="receiverLastName" className="block text-sm font-medium text-gray-700 font-poppins">
                            Apellido *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="receiverLastName"
                                name="lastName"
                                value={receiverData.lastName}
                                onChange={onReceiverInputChange}
                                className={`mt-1 block w-full rounded-md shadow-sm font-poppins pr-10 ${
                                    touchedFields.lastName && errors.receiverLastName
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : touchedFields.lastName && receiverData.lastName && !errors.receiverLastName && receiverData.lastName.trim().length >= 2
                                        ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="Apellido de quien recibe"
                            />
                            {touchedFields.lastName && receiverData.lastName && !errors.receiverLastName && receiverData.lastName.trim().length >= 2 && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        {touchedFields.lastName && errors.receiverLastName ? (
                            <p className="mt-1 text-sm text-red-600 font-poppins">{errors.receiverLastName}</p>
                        ) : touchedFields.lastName && receiverData.lastName && !errors.receiverLastName && receiverData.lastName.trim().length >= 2 ? (
                            <p className="mt-1 text-sm text-green-600 font-poppins">Apellido válido</p>
                        ) : (
                            <p className="mt-1 text-sm text-gray-500 font-poppins">Mínimo 2 caracteres</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="receiverDni" className="block text-sm font-medium text-gray-700 font-poppins">
                            DNI *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="receiverDni"
                                name="dni"
                                value={receiverData.dni}
                                onChange={onReceiverInputChange}
                                maxLength={8}
                                inputMode="numeric"
                                className={`mt-1 block w-full rounded-md shadow-sm font-poppins pr-10 ${
                                    touchedFields.dni && errors.receiverDni
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : touchedFields.dni && receiverData.dni && !errors.receiverDni && receiverData.dni.length >= 7
                                        ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="12345678"
                            />
                            {touchedFields.dni && receiverData.dni && !errors.receiverDni && receiverData.dni.length >= 7 && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        {touchedFields.dni && errors.receiverDni ? (
                            <p className="mt-1 text-sm text-red-600 font-poppins">{errors.receiverDni}</p>
                        ) : touchedFields.dni && receiverData.dni && !errors.receiverDni && receiverData.dni.length >= 7 ? (
                            <p className="mt-1 text-sm text-green-600 font-poppins">DNI válido</p>
                        ) : (
                            <p className="mt-1 text-sm text-gray-500 font-poppins">7 u 8 dígitos, sin puntos ni guiones</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="receiverPhone" className="block text-sm font-medium text-gray-700 font-poppins">
                            Teléfono *
                        </label>
                        <div className="relative">
                            <input
                                type="tel"
                                id="receiverPhone"
                                name="phone"
                                value={receiverData.phone}
                                onChange={onReceiverInputChange}
                                className={`mt-1 block w-full rounded-md shadow-sm font-poppins pr-10 ${
                                    touchedFields.phone && errors.receiverPhone
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : touchedFields.phone && receiverData.phone && !errors.receiverPhone && receiverData.phone.replace(/\D/g, '').length >= 10
                                        ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                                placeholder="11 1234-5678"
                            />
                            {touchedFields.phone && receiverData.phone && !errors.receiverPhone && receiverData.phone.replace(/\D/g, '').length >= 10 && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        {touchedFields.phone && errors.receiverPhone ? (
                            <p className="mt-1 text-sm text-red-600 font-poppins">{errors.receiverPhone}</p>
                        ) : touchedFields.phone && receiverData.phone && !errors.receiverPhone && receiverData.phone.replace(/\D/g, '').length >= 10 ? (
                            <p className="mt-1 text-sm text-green-600 font-poppins">Teléfono válido</p>
                        ) : (
                            <p className="mt-1 text-sm text-gray-500 font-poppins">Ej: 11 1234-5678 o +54 11 1234-5678</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Dirección de envío */}
            <div>
                <h2 className="font-poppins text-lg font-medium text-gray-900 mb-6">Dirección de envío</h2>
                <AddressDropdown
                    onAddressSelect={onAddressSelect}
                    selectedAddressId={selectedAddressId}
                    error={errors.address}
                    triggerShake={shakeAddress}
                />
            </div>
        </div>
    );
};

export default ReceiverForm;
