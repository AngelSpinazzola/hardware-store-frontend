import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/utils/roleHelper';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  blockAdmin?: boolean; 
}

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  blockAdmin = false 
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Verificar si requiere permisos de admin
  if (requireAdmin && !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  if (blockAdmin && isAdmin(user)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;