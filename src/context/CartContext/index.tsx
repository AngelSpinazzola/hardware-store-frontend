import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { CartState, CartContextType, Product } from '@/types/cart.types';
import { cartReducer } from './cartReducer';
import { loadCartFromStorage, clearCartStorage, isCartExpired } from './cartStorage';
import { showToastOnce } from './cartToasts';
import { validateProduct, validateQuantity, validateStock, createCartItem } from './cartValidations';

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
    items: [],
    loading: false,
    error: null
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState, loadCartFromStorage);

    useEffect(() => {
        const savedState = loadCartFromStorage();
        dispatch({ type: 'LOAD_CART', payload: savedState.items });
    }, []);

    useEffect(() => {
        if (isCartExpired(30)) {
            clearCartStorage();
            dispatch({ type: 'CLEAR_CART' });
        }
    }, []);

    const addToCart = (product: Product, quantity: number = 1): boolean => {
        try {
            const productValidation = validateProduct(product);
            if (!productValidation.isValid) {
                showToastOnce(productValidation.error!, 'error', 'error');
                return false;
            }

            const quantityValidation = validateQuantity(quantity);
            if (!quantityValidation.isValid) {
                showToastOnce(quantityValidation.error!, 'error', 'error');
                return false;
            }

            const existingItem = state.items.find(item => item.id === product.id);
            const currentQuantity = existingItem ? existingItem.quantity : 0;

            const stockValidation = validateStock(quantity, product.stock, currentQuantity);
            if (!stockValidation.isValid) {
                showToastOnce(stockValidation.error!, 'error', 'error');
                return false;
            }

            const cartItem = createCartItem(product, quantity);
            dispatch({ type: 'ADD_ITEM', payload: cartItem });

            return true;
        } catch {
            showToastOnce('Error al agregar al carrito', 'error', 'error');
            return false;
        }
    };

    const removeFromCart = (productId: number): void => {
        try {
            const item = state.items.find(item => item.id === productId);
            if (item) {
                dispatch({ type: 'REMOVE_ITEM', payload: productId });
                showToastOnce(`Eliminado: ${item.name}`, 'success', 'cart', {
                    duration: 1500,
                });
            }
        } catch {
            showToastOnce('Error al eliminar del carrito', 'error', 'error');
        }
    };

    const updateQuantity = (productId: number, quantity: number): void => {
        try {
            if (quantity <= 0) {
                removeFromCart(productId);
                return;
            }

            const item = state.items.find(item => item.id === productId);
            if (item && quantity > item.stock) {
                showToastOnce(`Solo hay ${item.stock} unidades disponibles`, 'error', 'error');
                return;
            }

            dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
        } catch {
            showToastOnce('Error al actualizar cantidad', 'error', 'error');
        }
    };

    const clearCart = (): void => {
        try {
            dispatch({ type: 'CLEAR_CART' });
        } catch {
            showToastOnce('Error al vaciar carrito', 'error', 'error');
        }
    };

    const getCartTotal = (): number => {
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartItemsCount = (): number => {
        return state.items.reduce((total, item) => total + item.quantity, 0);
    };

    const isInCart = (productId: number): boolean => {
        return state.items.some(item => item.id === productId);
    };

    const getCartItemQuantity = (productId: number): number => {
        const item = state.items.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };

    const cleanExpiredCart = (): void => {
        try {
            clearCartStorage();
            dispatch({ type: 'CLEAR_CART' });
        } catch (error) {
            console.error('Error cleaning expired cart:', error);
        }
    };

    const value: CartContextType = {
        cartItems: state.items,
        loading: state.loading,
        error: state.error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        isInCart,
        getCartItemQuantity,
        cleanExpiredCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de CartProvider');
    }
    return context;
};

export default CartContext;
