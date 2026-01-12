import type { User } from '@/types';

/**
 * Verifica si un usuario tiene rol de administrador
 * @param user - Usuario a verificar
 * @returns true si el usuario es administrador
 */
export const isAdmin = (user: User | null | undefined): boolean => {
  return user?.role?.toLowerCase() === 'admin';
};

/**
 * Verifica si un usuario tiene rol de cliente
 * @param user - Usuario a verificar
 * @returns true si el usuario es cliente
 */
export const isCustomer = (user: User | null | undefined): boolean => {
  return user?.role?.toLowerCase() === 'customer';
};

/**
 * Verifica si un usuario tiene un rol específico
 * @param user - Usuario a verificar
 * @param role - Rol a verificar (case-insensitive)
 * @returns true si el usuario tiene el rol especificado
 */
export const hasRole = (user: User | null | undefined, role: string): boolean => {
  return user?.role?.toLowerCase() === role.toLowerCase();
};
