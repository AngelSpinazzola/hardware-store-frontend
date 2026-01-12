import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import NavBar from '../components/Common/NavBar';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      toast.error('Token inválido');
      navigate('/auth');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.resetPassword(token, newPassword);
      toast.success(response.message);
      setTimeout(() => navigate('/auth'), 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-14">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-semibold text-gray-700 mb-2">
              Nueva contraseña
            </h1>
            <p className="text-gray-600 text-sm mb-6">
              Ingresa tu nueva contraseña
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label htmlFor="newPassword" className="relative">
                <input
                  type="password"
                  id="newPassword"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  placeholder=""
                  className="peer w-full rounded-xl border-gray-300 shadow-sm text-sm py-3 px-3"
                />
                <span className="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5">
                  Nueva contraseña
                </span>
              </label>

              <label htmlFor="confirmPassword" className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  placeholder=""
                  className="peer w-full rounded-xl border-gray-300 shadow-sm text-sm py-3 px-3"
                />
                <span className="absolute inset-y-0 start-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5">
                  Confirmar contraseña
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 nova-bg-primary text-white font-semibold rounded-full shadow-lg hover:shadow-xl md:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;