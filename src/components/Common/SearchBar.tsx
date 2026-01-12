import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SearchBarProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  placeholder?: string;
}

const SearchBar = ({ 
  searchTerm, 
  setSearchTerm, 
  placeholder = "Buscar productos..." 
}: SearchBarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm || '');
    const [isFocused, setIsFocused] = useState<boolean>(false);

    useEffect(() => {
        if (location.pathname.includes('/products') && setSearchTerm) {
            const handler = setTimeout(() => {
                setSearchTerm(localSearchTerm);
            }, 300);

            return () => clearTimeout(handler);
        }
    }, [localSearchTerm, location.pathname, setSearchTerm]);

    const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const trimmedSearch = localSearchTerm.trim();

        if (trimmedSearch) {
            if (location.pathname === '/' || location.pathname === '/home') {
                navigate(`/products?search=${encodeURIComponent(trimmedSearch)}`);
            } else if (setSearchTerm) {
                setSearchTerm(trimmedSearch);
            }
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setLocalSearchTerm(value);
    };

    const handleFocus = (): void => {
        setIsFocused(true);
    };

    const handleBlur = (): void => {
        setIsFocused(false);
    };

    useEffect(() => {
        if (searchTerm !== undefined) {
            setLocalSearchTerm(searchTerm);
        }
    }, [searchTerm]);

    // Helper para verificar si es desktop
    const isDesktop = (): boolean => {
        return typeof window !== 'undefined' && window.innerWidth >= 768;
    };

    return (
        <div className="relative group">
            <form onSubmit={handleSearch}>
                <div className="relative">
                    {/* Glow effect container - usando variables CSS de NOVA */}
                    <div className={`absolute -inset-1 rounded-sm nova-bg-orange blur transition-all duration-300 ${(isFocused && isDesktop()) ? 'opacity-30' : 'opacity-0'
                        }`}></div>

                    {/* Input container */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={localSearchTerm}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            style={{
                                boxShadow: (isFocused && isDesktop())
                                    ? '0 0 8px rgba(34, 211, 238, 0.2), 0 0 15px rgba(34, 211, 238, 0.1)'
                                    : 'none',
                                border: isFocused
                                    ? isDesktop()
                                        ? '1px solid transparent'
                                        : '1px solid #d1d5db'
                                    : '1px solid #d1d5db'
                            }}
                            className={`w-full pl-4 pr-12 py-2.5 bg-white text-gray-700 placeholder-gray-500 rounded-md text-base transition-all duration-300 focus:outline-none ${isFocused
                                ? 'shadow-lg'
                                : 'border border-nova-gray-700 md:group-hover:border-nova-gray-400'
                                }`}
                        />
                        <svg
                            className="absolute right-4 top-3 w-5 h-5 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SearchBar;