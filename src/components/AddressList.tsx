import { useState, useEffect } from 'react';
import { addressService } from '@/services/addressService';
import AddressModal from './AddressModal';
import { ShippingAddress } from '@/types/address.types';

const AddressList = () => {
    const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async (): Promise<void> => {
        setLoading(true);
        try {
            const data = await addressService.getMyAddresses();
            setAddresses(data);
            setError('');
        } catch (err) {
            const error = err as Error;
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNewAddress = (): void => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const handleEditAddress = (address: ShippingAddress): void => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleDeleteAddress = async (addressId: number): Promise<void> => {
        try {
            const { default: Swal } = await import('sweetalert2');

            const result = await Swal.fire({
                title: '¿Eliminar dirección?',
                text: 'Esta acción no se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mr-3',
                    cancelButton: 'bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700',
                    actions: 'flex flex-row-reverse'
                }
            });

            if (result.isConfirmed) {
                await addressService.deleteAddress(addressId);

                await Swal.fire({
                    title: 'Dirección eliminada',
                    text: 'La dirección ha sido eliminada correctamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

                await loadAddresses();
            }
        } catch (error) {
            console.error('Error deleting address:', error);

            const { default: Swal } = await import('sweetalert2');
            await Swal.fire({
                title: 'Error',
                text: error instanceof Error ? error.message : 'No se pudo eliminar la dirección',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
    };

    const handleModalSave = (): void => {
        loadAddresses();
    };

    if (loading) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-center py-8">
                    <svg className="animate-spin h-8 w-8 nova-text-orange" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-3 text-gray-600">Cargando direcciones...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Mis Direcciones</h2>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {addresses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-700 mb-4">
                                <svg className="h-8 w-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No tenés direcciones guardadas</h3>
                            <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                                Agrega tu primera dirección para poder realizar compras de forma rápida y sencilla.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={handleNewAddress}
                                    className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white nova-bg-primary hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Agregar dirección
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {addresses.map((address) => (
                                <div
                                    key={address.id}
                                    className="relative border rounded-lg p-4 border-gray-200 hover:border-gray-300 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-3 sm:mb-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${address.addressType === 'Casa'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {address.addressType}
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-600 space-y-2 sm:space-y-1">
                                                <div>
                                                    <div className="font-medium text-gray-700 mb-1 sm:inline sm:mr-1">Dirección:</div>
                                                    <div className="sm:inline">{addressService.formatAddressDisplay(address)}</div>
                                                </div>
                                                {address.observations && (
                                                    <div>
                                                        <div className="font-medium text-gray-700 mb-1 sm:inline sm:mr-1">Observaciones:</div>
                                                        <div className="sm:inline">{address.observations}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Botones - responsive layout */}
                                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 ml-6">
                                            <button
                                                onClick={() => handleEditAddress(address)}
                                                className="inline-flex items-center justify-center px-3 py-2 text-xs text-gray-600 bg-gray-100 md:hover:bg-gray-200 rounded-md transition-colors w-full sm:w-auto"
                                                title="Editar dirección"
                                            >
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Editar
                                            </button>
                                        </div>

                                        {/* Botón eliminar - mobile: absolute, desktop: inline */}
                                        <button
                                            onClick={() => handleDeleteAddress(address.id)}
                                            className="absolute bottom-4 right-4 sm:relative sm:bottom-auto sm:right-auto sm:ml-2 inline-flex items-center justify-center w-8 h-8 text-red-600 bg-red-100 md:hover:bg-red-200 rounded-md transition-colors"
                                            title="Eliminar dirección"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {addresses.length > 0 && (
                        <div className="mt-6 sm:flex sm:justify-end">
                            <button
                                onClick={handleNewAddress}
                                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-2 nova-bg-primary text-white rounded-sm sm:rounded-md text-base sm:text-base font-medium md:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Agregar dirección
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleModalSave}
                editingAddress={editingAddress}
            />
        </>
    );
};

export default AddressList;