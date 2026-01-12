import { ProductStatus } from './product.types';

// Producto básico (lo que viene de la API)
export interface Product {
  id: number;
  name: string;
  price: number;
  mainImageUrl: string;
  stock: number;
  status: ProductStatus;
  description?: string;
  categoryId?: number;
  categoryName?: string;
}

// Item en el carrito
export interface CartItem {
  id: number;
  name: string;
  price: number;
  mainImageUrl: string;
  stock: number;
  quantity: number;
}

// Estado del carrito
export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

// Datos guardados en localStorage
export interface CartStorageData {
  items: CartItem[];
  timestamp: string;
}

// Acciones del reducer del carrito
export type CartAction =
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Opciones para toasts
export interface ToastOptions {
  duration?: number;
  position?: 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left';
  style?: Record<string, any>;
}

// Categorías de toasts
export type ToastCategory = 'cart' | 'error' | 'general';

// Tipo del contexto del carrito
export interface CartContextType {
  // Estado
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;

  // Acciones
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: (showNotification?: boolean) => void;

  // Utilidades
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  isInCart: (productId: number) => boolean;
  getCartItemQuantity: (productId: number) => number;

  // Funciones avanzadas
  cleanExpiredCart: () => void;
}