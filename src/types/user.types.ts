// Usuario
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Customer' | 'Admin';
  createdAt?: string;
  updatedAt?: string;
  isGoogleUser?: boolean;
  avatarUrl?: string;
}

// Credenciales de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Datos de registro
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Datos para actualizar perfil
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Respuesta de autenticación
export interface AuthResponse {
  user: User;
  token: string;
}

// Estado del contexto de autenticación
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Acciones del reducer de autenticación
export type AuthAction =
  | { type: 'INIT_AUTH'; payload: { isAuthenticated: boolean; user: User | null; token: string | null } }
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Tipo para el contexto de autenticación
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>; // ← ESTE ES EL CAMBIO
  clearError: () => void;
  updateProfile: (userData: UpdateProfileData) => Promise<User>;
  googleLogin: (idToken: string) => Promise<{ success: boolean; error?: string }>;
}