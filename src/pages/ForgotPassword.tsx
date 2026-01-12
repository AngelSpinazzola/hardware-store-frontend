import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import NavBar from '../components/Common/NavBar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      setEmailSent(true);
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 lg:pt-52 pt-36">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {!emailSent ? (
              <>
                <h1 className="text-2xl font-semibold text-gray-700 mb-2">
                  ¿Olvidaste tu contraseña?
                </h1>
                <p className="text-gray-600 text-sm mb-6">
                  Ingresa tu email y te enviaremos instrucciones
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <label htmlFor="email" className="relative">
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=""
                      className="peer w-full rounded-xl border-gray-300 shadow-sm text-sm py-3 px-3"
                    />
                    <span className="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5">
                      Email
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 nova-bg-primary text-white font-semibold rounded-full shadow-lg hover:shadow-xl md:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Enviando...' : 'Enviar instrucciones'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/auth" className="text-sm text-gray-600 hover:text-gray-800">
                    Volver al inicio de sesión
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Correo enviado
                </h2>
                <p className="text-gray-600 mb-6">
                  Revisa tu bandeja de entrada para continuar
                </p>
                <Link to="/auth" className="text-sm text-gray-600 hover:text-gray-800">
                  Volver al inicio de sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;