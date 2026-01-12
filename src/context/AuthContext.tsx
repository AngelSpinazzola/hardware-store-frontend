import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';
import { toast } from 'react-toastify';
import type {
    AuthState,
    AuthAction,
    AuthContextType,
    LoginCredentials,
    RegisterData,
    UpdateProfileData,
    User
} from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Estados posibles
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'INIT_AUTH':
            return {
                ...state,
                loading: false,
                isAuthenticated: action.payload.isAuthenticated,
                user: action.payload.user,
                token: action.payload.token,
            };
        case 'LOGIN_START':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                token: null,
                error: action.payload,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: null,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null,
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const initAuth = (): void => {
            const storedUser = authService.getStoredUser();

            if (storedUser) {
                dispatch({
                    type: 'INIT_AUTH',
                    payload: {
                        isAuthenticated: true,
                        user: storedUser,
                        token: 'stored-in-httponly-cookie' // Placeholder para compatibilidad
                    },
                });
            } else {
                dispatch({
                    type: 'INIT_AUTH',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                        token: null
                    },
                });
            }
        };

        initAuth();
    }, []);

    // Escuchar evento de unauthorized (401) del interceptor de axios
    useEffect(() => {
        const handleUnauthorized = () => {
            dispatch({ type: 'LOGOUT' });
            toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        };

        window.addEventListener('unauthorized', handleUnauthorized);
        return () => window.removeEventListener('unauthorized', handleUnauthorized);
    }, []);

    const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
        try {
            dispatch({ type: 'LOGIN_START' });
            const data = await authService.login(credentials);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: data,
            });

            sessionStorage.setItem('justLoggedIn', 'true');

            return { success: true };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error de conexión';
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: errorMessage,
            });
            return { success: false, error: errorMessage };
        }
    };

    const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
        try {
            dispatch({ type: 'LOGIN_START' });
            const data = await authService.register(userData);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: data,
            });

            sessionStorage.setItem('justRegistered', 'true');

            return { success: true };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error de conexión';
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: errorMessage,
            });
            return { success: false, error: errorMessage };
        }
    };

    const googleLogin = async (idToken: string): Promise<{ success: boolean; error?: string }> => {
        try {
            dispatch({ type: 'LOGIN_START' });
            const data = await authService.googleLogin(idToken);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: data,
            });

            sessionStorage.setItem('justLoggedIn', 'true');

            return { success: true };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error de conexión con Google';
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: errorMessage,
            });
            return { success: false, error: errorMessage };
        }
    };

    const updateProfile = async (userData: UpdateProfileData): Promise<User> => {
        try {
            const updatedUser = await authService.updateProfile(userData);
            dispatch({
                type: 'UPDATE_USER',
                payload: updatedUser,
            });
            return updatedUser;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    // Logout ahora es async porque llama al servidor
    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
            dispatch({ type: 'LOGOUT' });
            toast.info('Sesión cerrada correctamente');
        } catch (error) {
            // Si falla el logout del servidor, hacer logout local de todas formas
            console.error('Server logout failed:', error);
            dispatch({ type: 'LOGOUT' });
            toast.info('Sesión cerrada');
        }
    };

    const clearError = (): void => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        clearError,
        updateProfile,
        googleLogin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};