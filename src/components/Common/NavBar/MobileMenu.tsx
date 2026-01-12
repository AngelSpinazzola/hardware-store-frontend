import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
    const { isAuthenticated, user } = useAuth();

    if (!isOpen) return null;

    return (
        <div className="md:hidden nova-bg-primary shadow-2xl fixed top-16 sm:top-20 w-full z-40">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
                {isAuthenticated ? (
                    <>
                        <div>
                            {user?.role?.toLowerCase() === 'admin' && (
                                <span className="inline-block mt-1 px-2 py-1 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold">
                                    Admin
                                </span>
                            )}
                        </div>
                        {user?.role?.toLowerCase() === 'admin' ? (
                            <Link
                                to="/admin/dashboard"
                                className="flex items-center space-x-3 p-3 text-nova-gray-400 hover:text-nova-cyan hover:bg-nova-cyan/10 rounded-xl transition-all duration-200"
                                onClick={onClose}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="space-y-2">
                                <Link to="/" className="flex items-center space-x-3 p-3 text-white nova-hover-subtle rounded-xl" onClick={onClose}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span>Home</span>
                                </Link>
                                <Link to="/products" className="flex items-center space-x-3 p-3 text-white nova-hover-subtle rounded-xl" onClick={onClose}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span>Productos</span>
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-y-2">
                        <Link to="/" className="flex items-center space-x-3 p-3 text-white nova-hover-subtle rounded-xl" onClick={onClose}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Home</span>
                        </Link>
                        <Link to="/products" className="flex items-center space-x-3 p-3 text-white nova-hover-subtle rounded-xl" onClick={onClose}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span>Productos</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileMenu;
