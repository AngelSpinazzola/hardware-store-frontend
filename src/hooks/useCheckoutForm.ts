import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';

export interface ReceiverFormData {
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
}

export interface FormErrors {
    address?: string;
    receiverFirstName?: string;
    receiverLastName?: string;
    receiverDni?: string;
    receiverPhone?: string;
    paymentMethod?: string;
}

// Validadores
const validateDni = (dni: string): { isValid: boolean; message: string } => {
    const cleaned = dni.replace(/\D/g, ''); // Solo números

    if (!cleaned) {
        return { isValid: false, message: 'El DNI es requerido' };
    }

    if (cleaned.length < 7 || cleaned.length > 8) {
        return { isValid: false, message: 'El DNI debe tener 7 u 8 dígitos' };
    }

    if (cleaned.startsWith('-') || dni.includes('-')) {
        return { isValid: false, message: 'El DNI no puede contener números negativos' };
    }

    return { isValid: true, message: '' };
};

const validatePhone = (phone: string): { isValid: boolean; message: string } => {
    const cleaned = phone.replace(/[\s\-+()]/g, ''); // Remover espacios, guiones, +, paréntesis

    if (!cleaned) {
        return { isValid: false, message: 'El teléfono es requerido' };
    }

    if (!/^\d+$/.test(cleaned)) {
        return { isValid: false, message: 'El teléfono solo puede contener números' };
    }

    if (phone.includes('--') || phone.startsWith('-')) {
        return { isValid: false, message: 'Formato de teléfono inválido' };
    }

    if (cleaned.length < 10) {
        return { isValid: false, message: 'El teléfono debe tener al menos 10 dígitos' };
    }

    if (cleaned.length > 15) {
        return { isValid: false, message: 'El teléfono no puede tener más de 15 dígitos' };
    }

    return { isValid: true, message: '' };
};

export const useCheckoutForm = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems, clearCart } = useCart();

    const [receiverData, setReceiverData] = useState<ReceiverFormData>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        dni: '',
        phone: ''
    });

    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'mercadopago'>('bank_transfer');
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [orderCompleted, setOrderCompleted] = useState(false);
    const [shakeAddress, setShakeAddress] = useState(false);
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (cartItems.length === 0 && !loading && !orderCompleted) {
            navigate('/cart');
        }
    }, [cartItems, navigate, loading, orderCompleted]);

    const handleReceiverInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        // Marcar campo como tocado
        if (!touchedFields[name]) {
            setTouchedFields(prev => ({
                ...prev,
                [name]: true
            }));
        }

        // Limitar input según el campo
        let sanitizedValue = value;

        if (name === 'dni') {
            // Solo permitir números para DNI (sin negativos)
            sanitizedValue = value.replace(/\D/g, '').slice(0, 8);
        } else if (name === 'phone') {
            // Permitir números, espacios, guiones, + y paréntesis para teléfono
            sanitizedValue = value.replace(/[^\d\s\-+()]/g, '').slice(0, 20);
        }

        setReceiverData(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));

        // Validación en tiempo real
        if (name === 'dni' && sanitizedValue) {
            const validation = validateDni(sanitizedValue);
            setErrors(prev => ({
                ...prev,
                receiverDni: validation.isValid ? '' : validation.message
            }));
        } else if (name === 'phone' && sanitizedValue) {
            const validation = validatePhone(sanitizedValue);
            setErrors(prev => ({
                ...prev,
                receiverPhone: validation.isValid ? '' : validation.message
            }));
        } else if (name === 'firstName' && sanitizedValue) {
            if (sanitizedValue.trim().length < 2) {
                setErrors(prev => ({
                    ...prev,
                    receiverFirstName: 'El nombre debe tener al menos 2 caracteres'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    receiverFirstName: ''
                }));
            }
        } else if (name === 'lastName' && sanitizedValue) {
            if (sanitizedValue.trim().length < 2) {
                setErrors(prev => ({
                    ...prev,
                    receiverLastName: 'El apellido debe tener al menos 2 caracteres'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    receiverLastName: ''
                }));
            }
        } else if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleAddressSelect = (addressId: number): void => {
        setSelectedAddressId(addressId);
        if (errors.address) {
            setErrors(prev => ({
                ...prev,
                address: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!selectedAddressId) {
            newErrors.address = 'Debes seleccionar una dirección de envío';
        }

        if (!receiverData.firstName.trim()) {
            newErrors.receiverFirstName = 'El nombre del receptor es requerido';
        } else if (receiverData.firstName.trim().length < 2) {
            newErrors.receiverFirstName = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!receiverData.lastName.trim()) {
            newErrors.receiverLastName = 'El apellido del receptor es requerido';
        } else if (receiverData.lastName.trim().length < 2) {
            newErrors.receiverLastName = 'El apellido debe tener al menos 2 caracteres';
        }

        const dniValidation = validateDni(receiverData.dni);
        if (!dniValidation.isValid) {
            newErrors.receiverDni = dniValidation.message;
        }

        const phoneValidation = validatePhone(receiverData.phone);
        if (!phoneValidation.isValid) {
            newErrors.receiverPhone = phoneValidation.message;
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            if (!selectedAddressId) {
                setShakeAddress(prev => !prev);
            }
            return;
        }

        setLoading(true);

        try {
            const cartValidation = orderService.validateCart(cartItems);
            if (!cartValidation.isValid) {
                toast.error(cartValidation.message);
                return;
            }

            const customerData = {
                name: `${user?.firstName} ${user?.lastName}`,
                email: user?.email || '',
                phone: ''
            };

            const orderData = {
                ...orderService.formatOrderData(
                    cartItems,
                    customerData,
                    selectedAddressId!,
                    receiverData
                ),
                paymentMethod
            };

            const createdOrder = await orderService.createOrder(orderData);
            clearCart(false);
            setOrderCompleted(true);

            // Flujo según método de pago
            if (paymentMethod === 'mercadopago') {
                // Crear preferencia de pago y redirigir automáticamente a MercadoPago
                const backUrl = `${window.location.origin}/payment`;
                const paymentResponse = await orderService.createMercadoPagoPayment(createdOrder.id, backUrl);
                orderService.redirectToMercadoPago(paymentResponse);
                // No hace falta setLoading(false) porque redirigimos
            } else {
                // Transferencia bancaria: ir a página de confirmación
                localStorage.setItem(`order_success_${createdOrder.id}`, 'true');
                navigate(`/order-confirmation/${createdOrder.id}`);
            }

        } catch (error) {
            console.error('Error en checkout:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al procesar la orden';
            toast.error(errorMessage, {
                autoClose: 5000,
            });
            setLoading(false);
        }
    };

    return {
        receiverData,
        selectedAddressId,
        paymentMethod,
        loading,
        errors,
        shakeAddress,
        touchedFields,
        handleReceiverInputChange,
        handleAddressSelect,
        setPaymentMethod,
        handleSubmit
    };
};
