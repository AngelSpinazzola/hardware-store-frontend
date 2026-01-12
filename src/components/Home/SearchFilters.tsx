import { toast } from 'react-toastify';

interface PriceRange {
    min: string;
    max: string;
}

interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    priceRange: PriceRange;
    setPriceRange: (range: PriceRange | ((prev: PriceRange) => PriceRange)) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    categories: string[];
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    productsCount: number;
    hasActiveFilters: boolean;
    clearFilters: () => void;
}

const SearchFilters = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    categories,
    showFilters,
    setShowFilters,
    productsCount,
    hasActiveFilters
}: SearchFiltersProps) => {
    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setPriceRange({ min: '', max: '' });
        setSortBy('name');
        setShowFilters(false);
        toast.success('Filtros limpiados');
    };

    return (
        <section id="search-section" className="bg-white border-t border-gray-200 py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Explora Nuestros Productos
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Encuentra exactamente lo que buscas con nuestros filtros inteligentes
                    </p>
                </div>

                {/* Search bar */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 text-lg font-medium placeholder-gray-500 focus:outline-none focus:border-gray-900 transition-colors"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Results info and filters toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <span className="text-gray-900 font-medium">
                            {productsCount} productos encontrados
                        </span>
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="text-sm text-gray-600 hover:text-gray-900 underline"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                    
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="sm:hidden flex items-center space-x-2 bg-gray-100 px-4 py-2 text-gray-900 font-medium hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                        </svg>
                        <span>Filtros</span>
                    </button>
                </div>

                {/* Filters */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ${showFilters ? 'block' : 'hidden sm:grid'}`}>
                    
                    {/* Category filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Categoría
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full p-3 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Precio
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                className="p-3 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                className="p-3 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Sort by */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Ordenar por
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full p-3 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                        >
                            <option value="name">Nombre</option>
                            <option value="price-asc">Precio: Menor a Mayor</option>
                            <option value="price-desc">Precio: Mayor a Menor</option>
                            <option value="stock">Stock</option>
                        </select>
                    </div>

                    {/* Mobile actions */}
                    <div className="sm:hidden space-y-2">
                        <button
                            onClick={() => setShowFilters(false)}
                            className="w-full bg-black text-white px-4 py-3 font-medium hover:bg-gray-800 transition-colors"
                        >
                            Aplicar Filtros
                        </button>
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="w-full bg-gray-200 text-gray-900 px-4 py-3 font-medium hover:bg-gray-300 transition-colors"
                            >
                                Limpiar Filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* Category quick filters */}
                {categories.length > 0 && (
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-gray-900 mb-4">Categorías populares:</p>
                        <div className="flex flex-wrap gap-2">
                            {categories.slice(0, 6).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                                    className={
                                        selectedCategory === category
                                            ? 'px-4 py-2 text-sm font-medium transition-colors bg-black text-white'
                                            : 'px-4 py-2 text-sm font-medium transition-colors bg-gray-100 text-gray-900 hover:bg-gray-200'
                                    }
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SearchFilters;