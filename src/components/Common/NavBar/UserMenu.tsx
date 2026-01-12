import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface UserMenuProps {
    showDropdown: boolean;
    onClose: () => void;
}

const UserMenu = ({ showDropdown, onClose }: UserMenuProps) => {
    const { logout } = useAuth();

    if (!showDropdown) return null;

    return (
        <div className="absolute right-0 mt-2 w-48 md:w-56 nova-bg-primary rounded-xl shadow-2xl border border-gray-800 z-50 overflow-hidden">
            <div className="py-2">
                <Link
                    to="/my-profile"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-white nova-hover-subtle"
                    onClick={onClose}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Mi Perfil</span>
                </Link>

                <Link
                    to="/my-orders"
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-white nova-hover-subtle"
                    onClick={onClose}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Mis Órdenes</span>
                </Link>

                <div className="border-t border-gray-800 mt-2">
                    <button
                        onClick={() => {
                            onClose();
                            logout();
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-white hover:bg-red-900/20 hover:text-red-400 transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserMenu;
