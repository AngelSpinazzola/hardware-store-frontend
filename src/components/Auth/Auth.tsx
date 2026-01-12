import GoogleLoginButton from './GoogleLoginButton';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from "../Common/NavBar";
import type { User } from '../../types';

interface FormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

const Auth = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });

    const { login, register, loading, error, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            handleRedirectAfterLogin();
        }
    }, [isAuthenticated, user, navigate]);

    const handleRedirectAfterLogin = (userFromResponse: User | null = null): void => {
        const redirectPath = localStorage.getItem('redirectAfterLogin');

        // Usar el usuario pasado como parámetro o el del contexto
        const currentUser = userFromResponse || user;

        if (redirectPath) {
            localStorage.removeItem('redirectAfterLogin');
            navigate(redirectPath);
        } else {
            if (currentUser?.role === 'Admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (isLogin) {
            await login({
                email: formData.email,
                password: formData.password
            });
        } else {
            await register(formData);
        }
    };

    // Detectar autocompletado al cargar la página
    useEffect(() => {
        const checkAutofill = (): void => {
            const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
            inputs.forEach(input => {
                const htmlInput = input as HTMLInputElement;
                if (htmlInput.value) {
                    const span = htmlInput.nextElementSibling as HTMLElement;
                    if (span) {
                        span.style.transform = 'translateY(-1.25rem)';
                    }
                }
            });
        };

        // Revisar inmediatamente
        checkAutofill();

        // Revisar después de un delay para autocompletado tardío
        setTimeout(checkAutofill, 100);
        setTimeout(checkAutofill, 300);
    }, []);

    return (
        <>
            <NavBar />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
                    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-200px)]">
                        <div className="max-w-lg w-full">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 relative overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
                                <div className="relative">
                                    <div className="text-center mb-6 sm:mb-8">
                                        <div className="overflow-hidden">
                                            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-2 transform transition-all duration-500 ease-out">
                                                {isLogin ? 'Iniciar sesión' : 'Registrarse'}
                                            </h1>
                                            <p className="text-gray-600 text-sm transform transition-all duration-500 ease-out delay-100">
                                                {isLogin ? 'Accede a tu cuenta para continuar' : '¿No tenés cuenta? Registrate'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative mb-6 sm:mb-8 bg-gray-100 rounded-full p-1 overflow-hidden">
                                        <div
                                            className={`absolute inset-1 w-1/2 bg-white rounded-full shadow-md transform transition-all duration-300 ease-out ${isLogin ? 'translate-x-0' : 'translate-x-[96%]'}`}
                                        ></div>

                                        <div className="relative flex">
                                            <button
                                                type="button"
                                                onClick={() => setIsLogin(true)}
                                                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 relative z-10 ${isLogin
                                                    ? 'text: nova-text-orange'
                                                    : 'text-gray-600 hover:text-gray-800'
                                                    }`}
                                            >
                                                Iniciar sesión
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsLogin(false)}
                                                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 relative z-10 ${!isLogin
                                                    ? 'text: nova-text-orange'
                                                    : 'text-gray-600 hover:text-gray-800'
                                                    }`}
                                            >
                                                Registrarse
                                            </button>
                                        </div>
                                    </div>

                                    {localStorage.getItem('redirectAfterLogin') && (
                                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-blue-800">Continuar compra</h3>
                                                    <p className="text-xs text-blue-700">
                                                        Después de autenticarte, continuarás con tu checkout
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                <span>{error}</span>
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {!isLogin && (
                                            <div className="grid grid-cols-2 gap-4 animate-fadeInUp">
                                                <label htmlFor="firstName" className="relative">
                                                    <input
                                                        type="text"
                                                        id="firstName"
                                                        name="firstName"
                                                        required={!isLogin}
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        className="peer mt-0.5 w-full rounded-xl border-gray-300 shadow-sm sm:text-sm py-3 px-3"
                                                    />
                                                    <span className="absolute top-3 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5">
                                                        Nombre
                                                    </span>
                                                </label>

                                                <label htmlFor="lastName" className="relative">
                                                    <input
                                                        type="text"
                                                        id="lastName"
                                                        name="lastName"
                                                        required={!isLogin}
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        className="peer mt-0.5 w-full rounded-xl border-gray-300 shadow-sm sm:text-sm py-3 px-3"
                                                    />
                                                    <span className="absolute top-3 start-3 -translate-y-5 bg-white px-1 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5">
                                                        Apellido
                                                    </span>
                                                </label>
                                            </div>
                                        )}
                                        <div className="">
                                            <label htmlFor="email" className="relative">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder=""
                                                    className="peer mt-0.5 w-full rounded-xl border-gray-300 shadow-sm sm:text-sm py-3 px-3"
                                                />
                                                <span className="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5">
                                                    Email
                                                </span>
                                            </label>
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="relative">
                                                <input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    required
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    minLength={!isLogin ? 6 : undefined}
                                                    placeholder=""
                                                    className="peer mt-0.5 w-full rounded-xl border-gray-300 shadow-sm sm:text-sm py-3 px-3"
                                                />
                                                <span className="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5">
                                                    Contraseña
                                                </span>
                                            </label>
                                            {!isLogin && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Debe tener al menos 6 caracteres
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3 px-4 nova-bg-primary text-white font-semibold rounded-full shadow-lg hover:shadow-xl md:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    {isLogin ? 'Iniciando sesión...' : 'Registrando...'}
                                                </div>
                                            ) : (
                                                <>
                                                    {localStorage.getItem('redirectAfterLogin') && isLogin ? (
                                                        'Continuar compra'
                                                    ) : isLogin ? (
                                                        'Continuar'
                                                    ) : (
                                                        'Continuar'
                                                    )}
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <div className="mt-6">
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-300" />
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-white text-gray-500">O continúa con</span>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <GoogleLoginButton />
                                        </div>
                                    </div>

                                    <div className="mt-6 sm:mt-8 text-center space-y-4">
                                        {isLogin && (
                                            <Link to="/forgot-password" className="text-sm font-medium transition-colors transform hover:scale-105 inline-block">
                                                ¿Olvidaste tu contraseña?
                                            </Link>
                                        )}

                                        <div className="border-t border-gray-200 pt-4">
                                            <Link
                                                to="/"
                                                className="text-gray-500 hover:text-gray-700 text-sm transition-colors flex items-center justify-center transform hover:scale-105"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                </svg>
                                                Volver a la tienda
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .animate-fadeInUp {
                        animation: fadeInUp 0.6s ease-out forwards;
                    }

                    /* Cambia color de autocompletado a blanco */
                    input:-webkit-autofill,
                    input:-webkit-autofill:hover,
                    input:-webkit-autofill:focus,
                    input:-webkit-autofill:active {
                        -webkit-box-shadow: 0 0 0 30px white inset !important;
                        -webkit-text-fill-color: #111827 !important;
                    }

                    /* Border naranja al hacer focus */
                    input:focus {
                        border-color: var(--nova-orange) !important;
                        box-shadow: 0 0 0 1px var(--nova-orange) !important;
                    }

                    /* Detectar autocompletado y posicionar labels */
                    input:-webkit-autofill + span {
                        transform: translateY(-1.25rem) !important;
                    }
                `}
            </style>
        </>
    );
};

export default Auth;