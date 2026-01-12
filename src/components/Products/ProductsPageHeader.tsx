import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";

type LayoutType = "grid" | "list";

interface ProductsPageHeaderProps {
    // Botones mobile
    onCategoriesClick: () => void;
    onFiltersClick: () => void;

    // Layout toggle
    layout: LayoutType;
    onLayoutChange: (layout: LayoutType) => void;

    // Mostrar solo botones desktop (sin categorías/filtros)
    desktopOnly?: boolean;
}

const ProductsPageHeader = ({
    onCategoriesClick,
    onFiltersClick,
    layout,
    onLayoutChange,
    desktopOnly = false,
}: ProductsPageHeaderProps) => {
    return (
        <>
            {/* Botones de Categorías, Filtros y Vista para MOBILE */}
            {!desktopOnly && (
                <div className="lg:hidden mb-4 flex items-center gap-2">
                    {/* Botón Categorías */}
                    <button
                        onClick={onCategoriesClick}
                        className="flex items-center justify-center gap-2 px-3 py-2 nova-bg-primary text-white rounded-lg md:hover:bg-gray-800 transition-colors"
                    >
                        <span className="font-medium text-sm">Categorías</span>
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>

                    {/* Botón Filtros */}
                    <button
                        onClick={onFiltersClick}
                        className="relative flex items-center justify-center gap-2 px-3 py-2 nova-bg-primary text-white rounded-lg md:hover:bg-gray-800 transition-colors"
                        aria-label="Abrir filtros"
                    >
                        <span className="font-medium text-sm">Filtros</span>
                        <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                        </svg>
                    </button>

                    {/* Espaciador */}
                    <div className="flex-1"></div>

                    {/* Botones de Vista (Grid/List) */}
                    <button
                        onClick={() => onLayoutChange("grid")}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                            layout === "grid"
                                ? "nova-bg-primary text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onLayoutChange("list")}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                            layout === "list"
                                ? "nova-bg-primary text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        <ListBulletIcon className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Botones de Vista para DESKTOP */}
            <div className="hidden lg:flex lg:justify-end mb-6">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onLayoutChange("grid")}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                            layout === "grid"
                                ? "bg-gray-800  text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                        }`}
                    >
                        <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onLayoutChange("list")}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                            layout === "list"
                                ? "bg-gray-800 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                        }`}
                    >
                        <ListBulletIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProductsPageHeader;
