import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { addressService } from '@/services/addressService';
import ValidatedInput from './ValidatedInput';
import { addressValidators, validateAllFields, JURISDICTIONS } from '@/utils/addressValidation';
import type { CreateAddressData, ShippingAddress } from '@/types/address.types';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    editingAddress?: ShippingAddress | null;
}

const INITIAL_FORM_DATA: CreateAddressData = {
    addressType: 'Casa',
    street: '',
    number: '',
    floor: '',
    apartment: '',
    tower: '',
    betweenStreets: '',
    postalCode: '',
    province: '',
    city: '',
    observations: '',
    authorizedPersonFirstName: '',
    authorizedPersonLastName: '',
    authorizedPersonPhone: '',
    authorizedPersonDni: ''
};

const AddressModal = ({ isOpen, onClose, onSave, editingAddress = null }: AddressModalProps) => {
    const [formData, setFormData] = useState<CreateAddressData>(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            if (editingAddress) {
                setFormData({
                    addressType: editingAddress.addressType || 'Casa',
                    street: editingAddress.street || '',
                    number: editingAddress.number || '',
                    floor: editingAddress.floor || '',
                    apartment: editingAddress.apartment || '',
                    tower: editingAddress.tower || '',
                    betweenStreets: editingAddress.betweenStreets || '',
                    postalCode: editingAddress.postalCode || '',
                    province: editingAddress.province || '',
                    city: editingAddress.city || '',
                    observations: editingAddress.observations || '',
                    authorizedPersonFirstName: editingAddress.authorizedPersonFirstName || '',
                    authorizedPersonLastName: editingAddress.authorizedPersonLastName || '',
                    authorizedPersonPhone: editingAddress.authorizedPersonPhone || '',
                    authorizedPersonDni: editingAddress.authorizedPersonDni || ''
                });
            } else {
                setFormData(INITIAL_FORM_DATA);
            }
            setErrors({});
        }
    }, [isOpen, editingAddress?.id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationErrors = validateAllFields(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            if (editingAddress) {
                await addressService.updateAddress(editingAddress.id, formData);
            } else {
                await addressService.createAddress(formData);
            }
            onSave();
            onClose();
        } catch (err: unknown) {
            const axiosError = err as AxiosError<{ message?: string }>;
            setErrors({ general: axiosError.response?.data?.message || axiosError.message || 'Error al guardar' });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex">
                                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-red-700">{errors.general}</p>
                            </div>
                        </div>
                    )}

                    {/* Tipo de domicilio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de domicilio <span className="text-red-500">*</span>
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="addressType"
                                    value="Casa"
                                    checked={formData.addressType === 'Casa'}
                                    onChange={handleInputChange}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2">Casa</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="addressType"
                                    value="Trabajo"
                                    checked={formData.addressType === 'Trabajo'}
                                    onChange={handleInputChange}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2">Trabajo</span>
                            </label>
                        </div>
                    </div>

                    {/* Datos de quien recibe */}
                    <div className="border-t pt-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Datos de quien recibe</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ValidatedInput
                                label="Nombre"
                                name="authorizedPersonFirstName"
                                value={formData.authorizedPersonFirstName}
                                onChange={handleInputChange}
                                placeholder="Nombre"
                                required
                            />
                            <ValidatedInput
                                label="Apellido"
                                name="authorizedPersonLastName"
                                value={formData.authorizedPersonLastName}
                                onChange={handleInputChange}
                                placeholder="Apellido"
                                required
                            />
                            <ValidatedInput
                                label="Teléfono"
                                name="authorizedPersonPhone"
                                value={formData.authorizedPersonPhone}
                                onChange={handleInputChange}
                                placeholder="11 1234-5678"
                                required
                            />
                            <ValidatedInput
                                label="DNI"
                                name="authorizedPersonDni"
                                value={formData.authorizedPersonDni}
                                onChange={handleInputChange}
                                placeholder="12345678"
                                required
                            />
                        </div>
                    </div>

                    {/* Dirección */}
                    <div className="border-t pt-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Dirección de entrega</h3>
                    </div>

                    {/* Calle y Altura */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ValidatedInput
                            label="Calle"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            validator={addressValidators.street}
                            placeholder="Ej: Av. Corrientes"
                            required
                            className="md:col-span-2"
                        />
                        <ValidatedInput
                            label="Altura"
                            name="number"
                            value={formData.number}
                            onChange={handleInputChange}
                            validator={addressValidators.number}
                            placeholder="1234"
                            required
                            hint="Solo números"
                        />
                    </div>

                    {/* Piso, Depto, Torre */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ValidatedInput
                            label="Piso"
                            name="floor"
                            value={formData.floor || ''}
                            onChange={handleInputChange}
                            validator={addressValidators.floor}
                            placeholder="3"
                        />
                        <ValidatedInput
                            label="Departamento"
                            name="apartment"
                            value={formData.apartment || ''}
                            onChange={handleInputChange}
                            validator={addressValidators.apartment}
                            placeholder="A"
                        />
                        <ValidatedInput
                            label="Torre"
                            name="tower"
                            value={formData.tower || ''}
                            onChange={handleInputChange}
                            placeholder="Norte"
                        />
                    </div>

                    {/* Entre calles */}
                    <ValidatedInput
                        label="Entre calles"
                        name="betweenStreets"
                        value={formData.betweenStreets || ''}
                        onChange={handleInputChange}
                        placeholder="Ej: Entre Callao y Riobamba"
                    />

                    {/* CP y Provincia */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ValidatedInput
                            label="Código Postal"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            validator={addressValidators.postalCode}
                            placeholder="1043"
                            required
                            hint="4-10 caracteres, solo números"
                        />
                        <ValidatedInput
                            label="Provincia/Jurisdicción"
                            name="province"
                            value={formData.province}
                            onChange={handleInputChange}
                            validator={addressValidators.province}
                            type="select"
                            options={JURISDICTIONS}
                            required
                        />
                    </div>

                    {/* Localidad */}
                    <ValidatedInput
                        label="Localidad"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        validator={addressValidators.city}
                        placeholder="Capital Federal"
                        required
                    />

                    {/* Observaciones */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                        <textarea
                            name="observations"
                            value={formData.observations || ''}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-200 focus:border-orange-500 placeholder:text-gray-400"
                            placeholder="Instrucciones adicionales..."
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 md:hover:bg-gray-200 rounded-md transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 nova-bg-primary text-white rounded-md md:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                editingAddress ? 'Actualizar' : 'Guardar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;