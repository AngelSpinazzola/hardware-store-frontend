import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const useCartActions = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { removeFromCart, updateQuantity, clearCart } = useCart();

    const incrementQuantity = (productId: number, currentQuantity: number, maxStock: number): void => {
        if (currentQuantity < maxStock) {
            updateQuantity(productId, currentQuantity + 1);
        }
    };

    const decrementQuantity = (productId: number, currentQuantity: number): void => {
        if (currentQuantity > 1) {
            updateQuantity(productId, currentQuantity - 1);
        } else {
            removeFromCart(productId);
        }
    };

    const handleRemoveItem = (productId: number): void => {
        removeFromCart(productId);
    };

    const handleClearCart = async (): Promise<void> => {
        try {
            const { default: Swal } = await import('sweetalert2');

            const result = await Swal.fire({
                title: '¿Vaciar carrito?',
                text: 'Esta acción eliminará todos los productos del carrito',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Sí, vaciar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700',
                    cancelButton: 'bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700',
                    actions: '!gap-3'
                }
            });

            if (result.isConfirmed) {
                clearCart();
                toast.success('¡Carrito vaciado! Todos los productos han sido eliminados');
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const handleCheckout = (): void => {
        if (!isAuthenticated) {
            localStorage.setItem('redirectAfterLogin', '/checkout');
            navigate('/auth');
            return;
        }
        navigate('/checkout');
    };

    const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>): void => {
        const target = e.target as HTMLImageElement;
        const productId = target.dataset.productId;
        target.src = 'https://picsum.photos/96/96?random=' + productId;
    };

    return {
        incrementQuantity,
        decrementQuantity,
        handleRemoveItem,
        handleClearCart,
        handleCheckout,
        handleImageError
    };
};
