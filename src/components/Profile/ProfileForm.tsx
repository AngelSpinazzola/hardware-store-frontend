import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProfileFormProps {
    formData: {
        firstName: string;
        lastName: string;
    };
    loading: boolean;
    error: string;
    success: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => void;
}

const ProfileForm = ({
    formData,
    loading,
    error,
    success,
    onInputChange,
    onSubmit
}: ProfileFormProps) => {
    const { user } = useAuth();

    return (
        <>
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Información Personal</h2>
                </div>

                <div className="p-6">
                    <div className="space-y-6">
                        {/* Información no editable */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-gray-500">El email no se puede modificar</p>
                        </div>

                        {/* Información editable */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={onInputChange}
                                    required
                                    maxLength={50}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-200 focus:border-orange-500 placeholder:text-gray-400"
                                    placeholder="Tu nombre"
                                />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Apellido *
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={onInputChange}
                                    required
                                    maxLength={50}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-200 focus:border-orange-500 placeholder:text-gray-400"
                                    placeholder="Tu apellido"
                                />
                            </div>
                        </div>

                        {/* Mensajes de error y éxito */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex">
                                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex">
                                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-green-700">{success}</p>
                                </div>
                            </div>
                        )}

                        {/* Botón Guardar */}
                        <div className="pt-4">
                            <div className="w-full sm:w-auto sm:flex sm:justify-end">
                                <button
                                    type="button"
                                    onClick={onSubmit}
                                    disabled={loading}
                                    className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-2 nova-bg-primary text-white rounded-md text-base sm:text-base font-medium md:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar Cambios'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón Volver al inicio */}
            <div className="mt-6">
                <Link
                    to="/"
                    className="text-gray-600 md:hover:text-gray-900 font-medium text-sm sm:text-base flex items-center justify-center sm:justify-start"
                >
                    ← Volver al inicio
                </Link>
            </div>
        </>
    );
};

export default ProfileForm;
