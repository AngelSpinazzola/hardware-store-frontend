interface ProductsHeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const ProductsHeader = ({ sidebarOpen, setSidebarOpen }: ProductsHeaderProps) => {
    return (
        <div className="lg:hidden mb-6 pt-2">
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="inline-flex items-center nova-bg-primary text-white gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 focus:outline-none border"
            >
                <span>
                    {sidebarOpen ? 'Cerrar filtros' : 'Categorías'}
                </span>

                {/* Flecha indicadora con color nova-cyan-dark */}
                {!sidebarOpen && (
                    <svg
                        className="w-4 h-4 transition-all duration-200"
                        style={{ color: 'var(--nova-white)' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default ProductsHeader;