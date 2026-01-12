/**
 * Configuración centralizada para la página de productos
 */
export const PRODUCTS_CONFIG = {
    // Tiempos y delays
    INITIALIZATION_BUFFER_TIME: 1000, // 1 segundo
    MANUAL_FILTER_DELAY: 100,
    URL_UPDATE_DELAY: 150,
    DEBOUNCE_DELAY: 300,

    // Breakpoints para skeleton loading
    SKELETON_ITEMS: {
        MOBILE: 3,
        TABLET: 4,
        DESKTOP: 6
    },

    // Configuración de grid responsivo
    GRID_CLASSES: {
        BASE: 'grid gap-8 mb-12',
        RESPONSIVE: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }
} as const;

/**
 * Funciones de utilidad para productos
 */
export const PRODUCTS_UTILS = {
    /**
     * Generar ID único para ejecución
     */
    generateExecutionId: (): string => Math.random().toString(36),

    /**
     * Verificar si han pasado suficientes milisegundos desde la inicialización
     */
    hasEnoughTimePassed: (minTime: number = PRODUCTS_CONFIG.INITIALIZATION_BUFFER_TIME): boolean => {
        return Date.now() - ((window as any).lastInitTime || 0) >= minTime;
    },

    /**
     * Construir URL de producto con filtros
     */
    buildProductUrl: (productId: number | string, searchParams: URLSearchParams): string => {
        const currentFilters = searchParams.toString();
        return `/product/${productId}${currentFilters ? `?from=products&${currentFilters}` : '?from=products'}`;
    },

    /**
     * Formatear precio para mostrar
     */
    formatPrice: (price: number): string => `$${price.toLocaleString('es-AR')}`,

    /**
     * Generar mensaje de paginación
     */
    getPaginationMessage: (currentCount: number, totalCount: number): string => 
        `Mostrando ${currentCount} de ${totalCount.toLocaleString()} productos`,

    /**
     * Generar mensaje de "cargar más"
     */
    getLoadMoreMessage: (remaining: number): string => 
        `Cargar más productos (${remaining} restantes)`
};