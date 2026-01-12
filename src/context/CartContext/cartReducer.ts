import type { CartState, CartAction, CartItem } from '@/types/cart.types';
import { saveCartToStorage } from './cartStorage';

export const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'LOAD_CART':
            return {
                ...state,
                items: action.payload,
                loading: false
            };

        case 'ADD_ITEM': {
            const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
            let updatedItems: CartItem[];

            if (existingItemIndex >= 0) {
                updatedItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: Math.min(item.quantity + action.payload.quantity, item.stock) }
                        : item
                );
            } else {
                updatedItems = [...state.items, { ...action.payload }];
            }

            saveCartToStorage(updatedItems);

            return {
                ...state,
                items: updatedItems
            };
        }

        case 'REMOVE_ITEM': {
            const filteredItems = state.items.filter(item => item.id !== action.payload);
            saveCartToStorage(filteredItems);

            return {
                ...state,
                items: filteredItems
            };
        }

        case 'UPDATE_QUANTITY': {
            const updatedQuantityItems = state.items.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: Math.min(Math.max(1, action.payload.quantity), item.stock) }
                    : item
            );
            saveCartToStorage(updatedQuantityItems);

            return {
                ...state,
                items: updatedQuantityItems
            };
        }

        case 'CLEAR_CART':
            saveCartToStorage([]);
            return {
                ...state,
                items: []
            };

        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        default:
            return state;
    }
};
