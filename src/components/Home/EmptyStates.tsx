interface EmptyStatesProps {
    type: 'error' | 'no-results';
    hasActiveFilters?: boolean;
    onClearFilters?: () => void;
    onRetry?: () => void;
}

const EmptyStates = ({ type, hasActiveFilters = false, onClearFilters, onRetry }: EmptyStatesProps) => {
    const renderErrorState = () => (
        <div className="text-center py-16 sm:py-20">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 sm:p-12 max-w-md mx-auto shadow-2xl border border-white/20">
                <div className="text-red-500 mb-6">
                    <svg className="mx-auto h-16 sm:h-20 w-16 sm:w-20 mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                        ¡Ups! Algo salió mal
                    </h3>
                    <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                        No pudimos cargar los productos en este momento. Por favor, intenta de nuevo.
                    </p>
                </div>
                
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
                    >
                        Intentar de Nuevo
                    </button>
                )}
            </div>
        </div>
    );

    const renderNoResultsState = () => (
        <div className="text-center py-16 sm:py-20">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 sm:p-12 max-w-lg mx-auto shadow-2xl border border-white/20">
                <div className="mb-6 sm:mb-8">
                    <svg className="mx-auto h-20 sm:h-24 w-20 sm:w-24 text-gray-300 mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                        {hasActiveFilters ? '¡No encontramos nada!' : 'No hay productos disponibles'}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                        {hasActiveFilters
                            ? 'Intenta ajustar los filtros o buscar algo diferente para descubrir productos increíbles'
                            : 'Parece que no hay productos disponibles en este momento, pero regresa pronto'
                        }
                    </p>
                </div>
                
                {hasActiveFilters && onClearFilters && (
                    <button
                        onClick={onClearFilters}
                        className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
                    >
                        Ver Todos los Productos
                    </button>
                )}
            </div>
        </div>
    );

    switch (type) {
        case 'error':
            return renderErrorState();
        case 'no-results':
            return renderNoResultsState();
        default:
            return null;
    }
};

export default EmptyStates;