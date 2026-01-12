import type { CartItem, CartStorageData, CartState } from '@/types/cart.types';

const CART_STORAGE_KEY = 'gametech_cart';

const initialState: CartState = {
    items: [],
    loading: false,
    error: null
};

export const loadCartFromStorage = (): CartState => {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            const parsedCart: CartStorageData = JSON.parse(savedCart);
            if (Array.isArray(parsedCart.items)) {
                return {
                    ...initialState,
                    items: parsedCart.items
                };
            }
        }
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
    }
    return initialState;
};

export const saveCartToStorage = (cartItems: CartItem[]): void => {
    try {
        const cartData: CartStorageData = {
            items: cartItems,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

export const clearCartStorage = (): void => {
    try {
        localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing cart from localStorage:', error);
    }
};

export const isCartExpired = (days: number = 30): boolean => {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            const parsedCart: CartStorageData = JSON.parse(savedCart);
            const timestamp = new Date(parsedCart.timestamp);
            const now = new Date();
            const daysDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24);
            return daysDiff > days;
        }
    } catch (error) {
        console.error('Error checking cart age:', error);
    }
    return false;
};
