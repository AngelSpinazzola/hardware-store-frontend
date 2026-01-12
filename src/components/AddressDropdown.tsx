import { useState, useEffect } from 'react';
import { addressService } from '@/services/addressService';
import AddressModal from './AddressModal';
import { ShippingAddress } from '@/types/address.types';

interface AddressDropdownProps {
    onAddressSelect: (addressId: number) => void;
    selectedAddressId: number | null;
    error?: string;
    triggerShake?: boolean; 
}

const AddressDropdown = ({ onAddressSelect, selectedAddressId, error, triggerShake }: AddressDropdownProps) => {
    const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadError, setLoadError] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [shouldShake, setShouldShake] = useState(false);

    useEffect(() => {
        loadAddresses();
    }, []);

    useEffect(() => {
        if (triggerShake) {
            setShouldShake(true);
            const timer = setTimeout(() => setShouldShake(false), 500);
            return () => clearTimeout(timer);
        }
    }, [triggerShake]);

    const loadAddresses = async (): Promise<void> => {
        setLoading(true);
        try {
            const data = await addressService.getMyAddresses();
            setAddresses(data);
            setLoadError('');

            // Si hay direcciones y no hay una seleccionada, seleccionar la predeterminada
            if (data.length > 0 && !selectedAddressId) {
                const defaultAddress = data.find(addr => addr.isDefault) || data[0];
                onAddressSelect(defaultAddress.id);
            }
        } catch (err) {
            const error = err as Error;
            setLoadError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSelect = (addressId: number): void => {
        onAddressSelect(addressId);
        setIsOpen(false);
    };

    const handleNewAddress = (): void => {
        setIsModalOpen(true);
        setIsOpen(false);
    };

    const handleModalSave = (): void => {
        loadAddresses();
    };

    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

    if (loading) {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Dirección de Envío *
                </label>
                <div className="flex items-center justify-center py-8 border border-gray-300 rounded-md">
                    <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-2 text-gray-600">Cargando direcciones...</span>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Dirección de Envío *
                </label>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">{loadError}</p>
                    <button
                        onClick={loadAddresses}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                        Intentar nuevamente
                    </button>
                </div>
            </div>
        );
    }

    if (addresses.length === 0) {
        return (
            <>
                <div className={`space-y-4 ${shouldShake ? 'animate-shake' : ''}`}>
                    <div className="border border-gray-300 rounded-md p-4 text-center">
                        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm text-gray-600 mb-3">No tenés direcciones guardadas</p>
                        <button
                            onClick={handleNewAddress}
                            className="inline-flex items-center px-4 py-2 nova-bg-primary text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Crear dirección
                        </button>
                    </div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-yellow-800">
                                    Necesitas crear una dirección de envío para continuar
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <AddressModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleModalSave}
                />
            </>
        );
    }

    const AddressBadge = ({ address }: { address: ShippingAddress }) => (
        <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${address.addressType === 'Casa'
                ? 'bg-green-100 text-green-800'
                : 'bg-purple-100 text-purple-800'
                }`}>
                {address.addressType}
            </span>
            {address.isDefault && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Principal
                </span>
            )}
        </div>
    );

    const AddressDisplay = ({ address }: { address: ShippingAddress }) => (
        <div className="space-y-1">
            <AddressBadge address={address} />
            <div className="text-sm text-gray-800">
                {addressService.formatAddressDisplay(address)}
            </div>
        </div>
    );

    return (
        <>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Dirección de Envío *
                </label>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`relative w-full bg-white border rounded-md pl-3 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                            }`}
                    >
                        {selectedAddress ? (
                            <AddressDisplay address={selectedAddress} />
                        ) : (
                            <span className="text-gray-500">Selecciona una dirección</span>
                        )}

                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </span>
                    </button>

                    {isOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                            {addresses.map((address) => (
                                <button
                                    key={address.id}
                                    type="button"
                                    onClick={() => handleAddressSelect(address.id)}
                                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${selectedAddressId === address.id ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <AddressDisplay address={address} />
                                </button>
                            ))}

                            {/* Opción para crear nueva dirección */}
                            <button
                                type="button"
                                onClick={handleNewAddress}
                                className="w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 border-t border-gray-200 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-sm font-medium">Agregar nueva dirección</span>
                            </button>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="flex items-start gap-2 mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}
            </div>

            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleModalSave}
            />
        </>
    );
};

export default AddressDropdown;