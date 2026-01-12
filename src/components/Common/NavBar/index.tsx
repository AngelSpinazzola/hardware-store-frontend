import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SearchBar from '../SearchBar';
import CartButton from './CartButton';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import novatechLogo from '@/assets/nova-tech.png';
import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { isAdmin } from '@/utils/roleHelper';
import '@/App.css';

interface NavBarProps {
    searchTerm?: string;
    setSearchTerm?: (term: string) => void;
    showSearch?: boolean;
    sidebarOpen?: boolean;
    setSidebarOpen?: (open: boolean) => void;
}

const NavBar = ({
    searchTerm = '',
    setSearchTerm = () => { },
    showSearch = false,
    sidebarOpen = false,
    setSidebarOpen
}: NavBarProps) => {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const isAdminRoute = location.pathname.startsWith('/admin');

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (showDropdown && !target.closest('.dropdown-container')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown]);

    const SearchButton = () => (
        <button
            onClick={() => {
                setShowMobileSearch(!showMobileSearch);
                if (isMobileMenuOpen) setIsMobileMenuOpen(false);
            }}
            className="p-2 text-white md:hover:text-nova-cyan transition-all duration-300"
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                <i className={`fas fa-search text-lg absolute transition-opacity duration-500 ${showMobileSearch ? 'opacity-0' : 'opacity-100'}`}></i>
                <i className={`fas fa-times text-lg absolute transition-opacity duration-500 ${showMobileSearch ? 'opacity-100' : 'opacity-0'}`}></i>
            </div>
        </button>
    );

    return (
        <>
            <header className="nova-bg-primary shadow-2xl fixed top-0 w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">

                        {/* Mobile burger menu */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => {
                                    if (isAdmin(user) && setSidebarOpen) {
                                        setSidebarOpen(!sidebarOpen);
                                    } else {
                                        setIsMobileMenuOpen(!isMobileMenuOpen);
                                    }
                                }}
                                className="md:hidden p-2 text-white transition-all duration-300"
                            >
                                <div className="relative w-6 h-6 flex items-center justify-center">
                                    <div className={`absolute inset-0 transition-opacity duration-300 ${(isAdminRoute ? sidebarOpen : isMobileMenuOpen) ? 'opacity-0' : 'opacity-100'}`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </div>
                                    <div className={`absolute inset-0 transition-opacity duration-300 ${(isAdminRoute ? sidebarOpen : isMobileMenuOpen) ? 'opacity-100' : 'opacity-0'}`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Logo */}
                        <Link to="/" onClick={handleLogoClick} className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 md:mr-auto md:ml-0 -ml-5">
                            <div className="relative group">
                                <div>
                                    <img src={novatechLogo} alt="Nova Tech Logo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
                                </div>
                            </div>

                            <div>
                                <div className="hidden sm:block">
                                    <div className="text-xl lg:text-xl tracking-tight text-white font-bold drop-shadow-lg">
                                        <span className="font-semibold">NOVA</span>{' '}
                                        <span className="font-semibold text-orange-400">TECH</span>
                                    </div>
                                    <div className="text-xs font-normal text-white tracking-wider uppercase drop-shadow-sm">
                                        HARDWARE STORE
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Search Bar Desktop */}
                        {showSearch && (
                            <div className="flex-1 max-w-2xl ml-3 mr-20 hidden md:block">
                                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Buscar productos..." />
                            </div>
                        )}

                        {/* Desktop User Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            {!isAdmin(user) && <CartButton />}

                            {isAuthenticated ? (
                                <>
                                    {isAdmin(user) ? (
                                        <div className="flex items-center space-x-4">
                                            <Link
                                                to="/admin/dashboard"
                                                className="flex items-center gap-2 bg-white text-gray-800 px-5 py-2.5 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors duration-200 shadow-sm"
                                            >
                                                <Squares2X2Icon className="w-5 h-5 text-gray-800" />
                                                <span>Dashboard</span>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="relative dropdown-container">
                                            <button onClick={() => setShowDropdown(!showDropdown)} className="p-2 text-white hover:text-orange-500 transition-all duration-200">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </button>
                                            <UserMenu showDropdown={showDropdown} onClose={() => setShowDropdown(false)} />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/auth" className="p-2 text-white hover:text-orange-500 transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Actions */}
                        <div className="md:hidden flex items-center space-x-2">
                            {showSearch && <SearchButton />}
                            {!isAdmin(user) && <CartButton />}

                            {isAuthenticated && !isAdmin(user) && (
                                <div className="relative dropdown-container">
                                    <button onClick={() => setShowDropdown(!showDropdown)} className="p-2 text-white md:hover:text-nova-cyan transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </button>
                                    <UserMenu showDropdown={showDropdown} onClose={() => setShowDropdown(false)} />
                                </div>
                            )}

                            {!isAuthenticated && (
                                <Link to="/auth" className="p-2 text-white hover:text-orange-500 hover:scale-110 transition-all duration-200">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {showMobileSearch && showSearch && (
                    <div className="md:hidden bg-nova-primary border-gray-800 p-4">
                        <div className="max-w-7xl mx-auto">
                            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Buscar productos.." />
                        </div>
                    </div>
                )}

            </header>

            {/* Mobile Menu */}
            {!isAdminRoute && <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />}
        </>
    );
};

export default NavBar;