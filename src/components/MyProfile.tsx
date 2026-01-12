import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/Common/NavBar';
import AddressList from '@/components/AddressList';
import ProfileForm from '@/components/Profile/ProfileForm';
import ProfileInfo from '@/components/Profile/ProfileInfo';
import { useProfileForm } from '@/hooks/useProfileForm';
import { isAdmin } from '@/utils/roleHelper';

type ActiveTab = 'profile' | 'addresses';

const MyProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const {
    formData,
    loading,
    error,
    success,
    handleInputChange,
    handleSubmit
  } = useProfileForm();

  // Verificar autenticación
  if (!isAuthenticated || isAdmin(user)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center py-60">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {!isAuthenticated ? 'Acceso Requerido' : 'Acceso Restringido'}
            </h2>
            <p className="text-gray-600 mb-6">
              {!isAuthenticated
                ? 'Debes iniciar sesión para ver tu perfil'
                : 'Los administradores gestionan perfiles desde el panel de administración'
              }
            </p>
            <Link
              to={!isAuthenticated ? "/login" : "/admin/dashboard"}
              className="bg-indigo-600 text-white px-10 py-4 rounded-md hover:bg-indigo-700"
            >
              {!isAuthenticated ? 'Iniciar Sesión' : 'Ir al Dashboard'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="mb-8">
          <h1 className="font-poppins text-xl sm:text-2xl font-semibold text-gray-800">Mi cuenta</h1>
          <div className="h-px bg-gray-300 w-full mt-2 mb-3"></div>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Administra tu información personal y direcciones</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-4 sm:space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                ? 'bg-nova-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              style={activeTab === 'profile' ? { borderBottomColor: 'var(--bg-nova-primary)' } : {}}
            >
              Información Personal
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'addresses'
                ? 'bg-nova-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              style={activeTab === 'addresses' ? { borderBottomColor: 'var(--bg-nova-primary)' } : {}}
            >
              Mis Direcciones
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <>
            <ProfileForm
              formData={formData}
              loading={loading}
              error={error}
              success={success}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />
            <ProfileInfo />
          </>
        )}

        {/* Tab de Direcciones */}
        {activeTab === 'addresses' && <AddressList />}
      </main>
    </div>
  );
};

export default MyProfile;
