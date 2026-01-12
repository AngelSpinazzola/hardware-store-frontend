import { toast, Id } from 'react-toastify';
import type { ToastCategory } from '@/types/cart.types';

const recentToasts = new Set<string>();

const activeToasts: Record<ToastCategory, Id | null> = {
    cart: null,
    error: null,
    general: null
};

export const showToastOnce = (
    message: string,
    type: 'success' | 'error' = 'success',
    category: ToastCategory = 'general',
    options: any = {}
): void => {
    if (recentToasts.has(message)) return;

    // Dismiss el toast anterior de la misma categoría
    if (activeToasts[category]) {
        toast.dismiss(activeToasts[category]);
    }

    recentToasts.add(message);

    // Remover después de 2 segundos
    setTimeout(() => {
        recentToasts.delete(message);
        if (activeToasts[category]) {
            activeToasts[category] = null;
        }
    }, 2000);

    let toastId: Id;
    if (type === 'success') {
        toastId = toast.success(message, {
            autoClose: options.duration || 1500,
            ...options
        });
    } else {
        toastId = toast.error(message, {
            autoClose: options.duration || 2000,
            ...options
        });
    }

    // Guardar el ID del toast activo
    activeToasts[category] = toastId;
};

export const dismissToast = (category: ToastCategory): void => {
    if (activeToasts[category]) {
        toast.dismiss(activeToasts[category]);
        activeToasts[category] = null;
    }
};

export const dismissAllToasts = (): void => {
    toast.dismiss();
    Object.keys(activeToasts).forEach(key => {
        activeToasts[key as ToastCategory] = null;
    });
};
