import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';

import type { MenuItem } from '../../types/product.types';

const CategorySidebar = () => {
    const [menuStructure, setMenuStructure] = useState<MenuItem[]>([]);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadMenuStructure();
    }, []);

    const loadMenuStructure = async () => {
        try {
            setLoading(true);
            const structure = await productService.getMenuStructure();
            setMenuStructure(structure);
        } catch (error) {
            console.error('Error loading menu structure:', error);
            setMenuStructure([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (categoryName: string) => {
        setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
    };

    const toggleMobileMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isMenuOpen) setExpandedCategory(null);
    };

    const toggleDesktopMenu = () => {
        setIsDesktopMenuOpen(!isDesktopMenuOpen);
        if (!isDesktopMenuOpen) setExpandedCategory(null);
    };

    const closeMenus = () => {
        setIsMenuOpen(false);
        setExpandedCategory(null);
    };

    const navigateToProducts = (category: string, brand?: string) => {
        let path = '/';
        const params = new URLSearchParams();
        
        if (category) {
            params.append('category', category);
        }
        if (brand) {
            params.append('brand', brand);
        }
        
        if (params.toString()) {
            path += '?' + params.toString();
        }
        
        navigate(path);
        closeMenus();
        
        setTimeout(() => {
            const productsSection = document.getElementById('all-products-section');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    if (loading) {
        return (
            <>
                {/* Mobile Loading */}
                <div className="lg:hidden bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 sticky top-16 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <div className="h-14 bg-gray-200 rounded-xl animate-pulse"></div>
                    </div>
                </div>
                
                {/* Desktop Loading */}
                <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-full">
                    <div className="p-4">
                        <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Mobile Menu */}
            <div className="lg:hidden bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <button
                        onClick={toggleMobileMenu}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all duration-300 border border-blue-200 shadow-sm"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-gray-800">Categorías</div>
                                <div className="text-sm text-blue-600">Explorar productos</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 hidden sm:block">Toca para expandir</span>
                            <svg 
                                className={`w-5 h-5 text-blue-600 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>

                    {/* Mobile Dropdown */}
                    {isMenuOpen && (
                        <div className="absolute top-full left-4 right-4 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
                            <div className="p-5 space-y-4">
                                {menuStructure.map((category, index) => (
                                    <div key={category.name} className={`${index !== 0 ? 'border-t border-gray-100 pt-4' : ''}`}>
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => navigateToProducts(category.name)}
                                                className="flex-1 text-left py-3 px-4 text-base font-semibold text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                            >
                                                {category.name}
                                            </button>
                                            {category.subcategories && category.subcategories.length > 0 && (
                                                <button
                                                    onClick={() => toggleCategory(category.name)}
                                                    className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                                                >
                                                    <svg
                                                        className={`w-5 h-5 text-gray-400 transition-transform ${
                                                            expandedCategory === category.name ? 'rotate-180' : ''
                                                        }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>

                                        {expandedCategory === category.name && category.subcategories && category.subcategories.length > 0 && (
                                            <div className="ml-4 mt-3 space-y-2 bg-gray-50 rounded-xl p-3">
                                                {category.subcategories.map((subcategory) => (
                                                    <button
                                                        key={subcategory.name}
                                                        onClick={() => navigateToProducts(category.name, subcategory.name)}
                                                        className="block w-full text-left text-sm text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 border border-transparent hover:border-blue-200"
                                                    >
                                                        <span className="text-blue-500 mr-2">•</span>
                                                        {subcategory.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop Sidebar - Centrado */}
            <div className="hidden lg:block fixed left-1/2 transform -translate-x-1/2 top-20 z-30">
                <div className="w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Desktop Header */}
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
                        <button
                            onClick={toggleDesktopMenu}
                            className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-gray-800">Explorar Categorías</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDesktopMenuOpen ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    {/* Desktop Categories List */}
                    {isDesktopMenuOpen && (
                        <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                            {menuStructure.map((category) => (
                                <div key={category.name} className="border border-gray-100 rounded-lg overflow-hidden bg-white hover:shadow-sm transition-shadow">
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => navigateToProducts(category.name)}
                                            className="flex-1 text-left py-3 px-4 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                        >
                                            {category.name}
                                        </button>
                                        {category.subcategories && category.subcategories.length > 0 && (
                                            <button
                                                onClick={() => toggleCategory(category.name)}
                                                className="p-3 hover:bg-gray-100 transition-colors"
                                            >
                                                <svg
                                                    className={`w-4 h-4 text-gray-400 transition-transform ${
                                                        expandedCategory === category.name ? 'rotate-180' : ''
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {expandedCategory === category.name && category.subcategories && category.subcategories.length > 0 && (
                                        <div className="bg-gray-50 border-t border-gray-100 p-3 space-y-1">
                                            {category.subcategories.map((subcategory) => (
                                                <button
                                                    key={subcategory.name}
                                                    onClick={() => navigateToProducts(category.name, subcategory.name)}
                                                    className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 py-2 px-3 rounded-md hover:bg-blue-50 transition-colors"
                                                >
                                                    • {subcategory.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Overlay */}
            {isMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-30 z-30 top-16"
                    onClick={closeMenus}
                />
            )}
        </>
    );
};

export default CategorySidebar;