import { Link } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import novatechLogo from '@/assets/nova-tech.png';

interface Breadcrumb {
    label: string;
    href?: string;
}

interface AdminTopbarProps {
    onMenuClick: () => void;
    title?: string;
    breadcrumbs?: Breadcrumb[];
}

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
    return (
        <header className="nova-bg-primary shadow-2xl fixed top-0 right-0 left-0 xl:left-64 z-50 h-16 sm:h-20">
            <div className="h-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-full">
                    {/* Left side - Menu button + Logo */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Hamburger menu - visible hasta xl (1280px) */}
                        <button
                            onClick={onMenuClick}
                            className="xl:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            <HiMenu className="w-6 h-6" />
                        </button>

                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 transition-all duration-300 hover:scale-105">
                            <div className="relative">
                                <img src={novatechLogo} alt="Nova Tech Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                            </div>
                            <div>
                                <div className="text-base sm:text-xl tracking-tight text-white font-bold drop-shadow-lg">
                                    <span className="font-semibold">NOVA</span>{' '}
                                    <span className="font-semibold text-orange-400">TECH</span>
                                </div>
                                <div className="hidden sm:block text-[10px] font-medium text-white tracking-wider uppercase drop-shadow-sm">
                                    HARDWARE STORE
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Right side - Actions (opcional para futuras features) */}
                    <div className="flex items-center gap-3">
                        {/* Aquí puedes agregar notificaciones, búsqueda, etc. */}
                    </div>
                </div>
            </div>
        </header>
    );
}