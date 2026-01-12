import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

// Common Components
import ScrollToTop from '@/components/Common/ScrollToTop';
import NavBar from '@/components/Common/NavBar';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

// Layout
import AdminSidebar from '@/pages/Admin/Layout/AdminSidebar';

// Public Pages
import Home from '@/pages/Home';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Auth from '@/components/Auth/Auth';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Customer Pages
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import PaymentResult from '@/pages/PaymentResult';
import MyOrders from '@/pages/MyOrders';
import MyProfile from '@/components/MyProfile';
import Invoice from '@/components/Invoice';

// Admin Pages
import AdminDashboard from '@/pages/Admin/Dashboard/AdminDashboard';
import ProductManagement from '@/pages/Admin/Products/ProductManagement';
import AdminOrders from '@/pages/Admin/Orders/AdminOrders';
import AdminOrderDetail from '@/pages/Admin/Orders/AdminOrderDetail';
import AdminPendingOrders from '@/pages/Admin/Orders/AdminPendingOrders';
import AnalyticsDashboard from './pages/Admin/Analytics/AnalyticsDashboard';
import SalesAnalytics from './pages/Admin/Analytics/SalesAnalytics';
import TopProductsAnalytics from '@/pages/Admin/Analytics/TopProductsAnalytics';

// Config
import { toastConfig } from '@/config/toast.config';

// Componente interno que maneja NavBar y Sidebar
function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isProductsRoute = location.pathname.startsWith('/products');
  const hideNavBarRoutes = ['/auth', '/login', '/register'];
  const shouldShowNavBar = !hideNavBarRoutes.includes(location.pathname) && !location.pathname.startsWith('/invoice');

  useEffect(() => {
    const handleResize = () => {
      // Si es desktop (>= 1280px) y NO estamos en rutas admin, cerrar sidebar
      if (window.innerWidth >= 1280 && !isAdminRoute && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen, isAdminRoute]);

  return (
    <>
      {/* NavBar global */}
      {shouldShowNavBar && !isProductsRoute && !isAdminRoute && (
        <NavBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          showSearch={location.pathname === '/'}
        />
      )}

      {/* Admin Sidebar + Overlay + Burger button */}
      {(isAdminRoute || (user?.role?.toLowerCase() === 'admin' && sidebarOpen)) && (
        <>
          <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-gray-900/50 xl:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          {/* Burger button - solo mobile/tablet en rutas admin */}
          {isAdminRoute && !sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="xl:hidden fixed top-4 left-4 z-40 p-3 nova-bg-primary text-white rounded-lg shadow-lg hover:scale-105 transition-transform"
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </>
      )}

      {/* Main Container */}
      <div className={`min-h-screen ${isAdminRoute ? 'xl:pl-64' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:categoryName" element={<ProductsPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* Customer Protected Routes */}
          <Route path="/checkout" element={<ProtectedRoute blockAdmin><Checkout /></ProtectedRoute>} />
          <Route path="/order-confirmation/:orderId" element={<ProtectedRoute blockAdmin><OrderConfirmation /></ProtectedRoute>} />
          <Route path="/payment/success" element={<ProtectedRoute blockAdmin><PaymentResult defaultStatus="success" /></ProtectedRoute>} />
          <Route path="/payment/failure" element={<ProtectedRoute blockAdmin><PaymentResult defaultStatus="failure" /></ProtectedRoute>} />
          <Route path="/payment/pending" element={<ProtectedRoute blockAdmin><PaymentResult defaultStatus="pending" /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute blockAdmin><MyOrders /></ProtectedRoute>} />
          <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
          <Route path="/invoice/:orderId" element={<Invoice />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute requireAdmin><ProductManagement /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/orders/pending-review" element={<ProtectedRoute requireAdmin><AdminPendingOrders /></ProtectedRoute>} />
          <Route path="/admin/orders/pending-payment" element={<ProtectedRoute requireAdmin><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/orders/payment-approved" element={<ProtectedRoute requireAdmin><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/orders/shipped" element={<ProtectedRoute requireAdmin><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/order/:orderId" element={<ProtectedRoute requireAdmin><AdminOrderDetail /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><AnalyticsDashboard /></ProtectedRoute>} />
          <Route path="/admin/analytics/sales" element={<ProtectedRoute requireAdmin><SalesAnalytics /></ProtectedRoute>} />
          <Route path="/admin/analytics/top-products" element={<ProtectedRoute requireAdmin><TopProductsAnalytics /></ProtectedRoute>} />

          {/* Redirects */}
          <Route path="/customer/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
          <Route path="/wishlist" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ToastContainer {...toastConfig} />
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <div className="App mobile-safe">
              <AppContent />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;