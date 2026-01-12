import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    HiChartPie,
    HiShoppingBag,
    HiClipboardList,
    HiDocumentText,
    HiCog,
    HiChartBar,
    HiChevronDown,
    HiX
} from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';
import novatechLogo from '@/assets/nova-tech.png';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const location = useLocation();
    const { logout } = useAuth();
    const [analyticsOpen, setAnalyticsOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;
    const isAnalyticsSection = location.pathname.startsWith('/admin/analytics');

    const menuItems = [
        {
            label: 'Dashboard',
            icon: HiChartPie,
            path: '/admin/dashboard',
        },
        {
            label: 'Productos',
            icon: HiShoppingBag,
            path: '/admin/products',
        },
        {
            label: 'Órdenes',
            icon: HiClipboardList,
            path: '/admin/orders',
        },
        {
            label: 'Pagos pendientes',
            icon: HiDocumentText,
            path: '/admin/orders/pending-review',
        },
    ];

    const analyticsItems = [
        {
            label: 'Resumen general',
            path: '/admin/analytics',
        },
        {
            label: 'Ventas por período',
            path: '/admin/analytics/sales',
        },
        {
            label: 'Productos destacados',
            path: '/admin/analytics/top-products',
        },
    ];

    return (
        <aside
            className={`
                fixed top-0 left-0 w-[85%] h-full
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0 z-50' : '-translate-x-full z-30'}
                ${location.pathname.startsWith('/admin') ? 'xl:translate-x-0 xl:w-64 xl:z-30' : ''}
            `}
        >
            <div className="h-full flex flex-col nova-bg-primary border-r border-gray-200 overflow-y-auto">
                {/* Logo Novatech - siempre visible */}
                <div className="flex items-center justify-between px-4 py-4 sm:py-5 border-b border-gray-700/50">
                    <Link to="/" className="flex items-center space-x-2 sm:space-x-3 transition-all duration-300 hover:scale-105">
                        <div className="relative">
                            <img src={novatechLogo} alt="Nova Tech Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                        </div>
                        <div>
                            <div className="text-base sm:text-lg tracking-tight text-white font-bold drop-shadow-lg">
                                <span className="font-semibold">NOVA</span>{' '}
                                <span className="font-semibold text-orange-400">TECH</span>
                            </div>
                            <div className="text-[9px] sm:text-[10px] font-medium text-gray-300 tracking-wider uppercase">
                                HARDWARE STORE
                            </div>
                        </div>
                    </Link>

                    {/* Botón cerrar - solo mobile */}
                    <button
                        onClick={onClose}
                        className="xl:hidden p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col px-3 py-6">
                    {/* Menú superior */}
                    <div className="space-y-0.5">
                        {/* Menu items principales */}
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={onClose}
                                    className={`
                                        group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-md
                                        transition-all duration-200
                                        ${active
                                            ? 'bg-indigo-600 text-gray-200'
                                            : 'text-gray-200 hover:bg-gray-500 hover:text-gray-200'
                                        }
                                    `}
                                >
                                    <Icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${active ? 'text-gray-200' : 'text-gray-200'}`} />
                                    {item.label}
                                </Link>
                            );
                        })}

                        {/* Analytics Section (Colapsable) */}
                        <div>
                            <button
                                onClick={() => setAnalyticsOpen(!analyticsOpen)}
                                className={`
                                    group relative w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg
                                    transition-all duration-200
                                    ${isAnalyticsSection
                                        ? 'bg-indigo-600 text-gray-200'
                                        : 'text-gray-200 hover:bg-gray-500 hover:text-gray-200'
                                    }
                                `}
                            >
                                <div className="flex items-center">
                                    <HiChartBar className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${isAnalyticsSection ? 'text-gray-200' : 'text-gray-200'}`} />
                                    <span>Análisis</span>
                                </div>
                                <div className={`transition-transform duration-200 ${analyticsOpen ? 'rotate-0' : '-rotate-90'}`}>
                                    <HiChevronDown className="w-4 h-4" />
                                </div>
                            </button>

                            {/* Submenu Analytics con animación */}
                            <div className={`
                                overflow-hidden transition-all duration-300 ease-in-out
                                ${analyticsOpen ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'}
                            `}>
                                <div className="ml-8 space-y-0.5">
                                    {analyticsItems.map((item) => {
                                        const active = isActive(item.path);

                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={onClose}
                                                className={`
                                                    flex items-center px-3 py-2 text-sm rounded-lg
                                                    transition-all duration-150
                                                    ${active
                                                        ? 'bg-indigo-600 text-gray-200 font-medium'
                                                        : 'text-gray-200 hover:bg-gray-500 hover:text-gray-200'
                                                    }
                                                `}
                                            >
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Espaciador para empujar hacia abajo */}
                    <div className="flex-1" />

                    {/* Menú inferior */}
                    <div className="space-y-0.5">

                        {/* Configuración */}
                        <Link
                            to="#"
                            className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-200 hover:bg-gray-500 hover:text-gray-200 transition-all duration-200"
                        >
                            <HiCog className="w-5 h-5 mr-3 text-gray-200 transition-transform group-hover:rotate-90 group-hover:scale-110" />
                            Configuración
                        </Link>

                        {/* Cerrar Sesión */}
                        <button
                            onClick={async () => {
                                onClose();
                                await logout();
                            }}
                            className="group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-red-400 hover:bg-gray-500 transition-all duration-200"
                        >
                            <svg className="w-5 h-5 mr-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
}