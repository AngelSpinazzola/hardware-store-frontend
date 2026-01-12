import { useNavigate } from "react-router-dom";

interface Category {
    id: string;
    name: string;
    description?: string;
    category: string;
    image: string;
    gridClass: string;
}

const CategoryGrid = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (category: string): void => {
        const encodedCategory = encodeURIComponent(category);
        navigate(`/products?category=${encodedCategory}`);
    };

    const categories: Category[] = [
        {
            id: "gpu",
            name: "Placas de Video",
            category: "Placas de video",
            image: "/images/categories/gpu.webp",
            gridClass: "md:col-span-2 md:row-span-2",
        },
        {
            id: "cpu",
            name: "Procesadores",
            category: "Procesadores",
            image: "/images/categories/cpu.webp",
            gridClass: "md:col-span-1 md:row-span-1",
        },
        {
            id: "ram",
            name: "Memorias RAM",
            category: "Memorias RAM",
            image: "/images/categories/ram.webp",
            gridClass: "md:col-span-1 md:row-span-1",
        },
        {
            id: "mobo",
            name: "Motherboards",
            category: "Mothers",
            image: "/images/categories/mother.webp",
            gridClass: "md:col-span-2 md:row-span-1",
        },
        {
            id: "storage",
            name: "Almacenamiento",
            category: "Almacenamiento",
            image: "/images/categories/almacenamiento.webp",
            gridClass: "md:col-span-1 md:row-span-1",
        },
        {
            id: "case",
            name: "Gabinetes",
            category: "Gabinetes",
            image: "/images/categories/case.webp",
            gridClass: "md:col-span-1 md:row-span-1",
        },
        {
            id: "psu",
            name: "Fuentes",
            category: "Fuentes",
            image: "/images/categories/fuente.webp",
            gridClass: "md:col-span-1 md:row-span-1",
        },
        {
            id: "cooling",
            name: "Refrigeración",
            category: "Refrigeración",
            image: "/images/categories/water.webp",
            gridClass: "md:col-span-1 md:row-span-1",
        },
    ];

    return (
        <section className="py-8 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="w-full max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12 lg:mb-16">
                    <h2 className="text-orange-400 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
                        EXPLORA{" "}
                        <span className="text-gray-800">POR CATEGORÍA</span>
                    </h2>

                    <p className="text-gray-800 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
                        Encontrá exactamente lo que necesitas para tu
                        <span className="text-orange-400 font-semibold">
                            {" "}
                            build perfecto
                        </span>
                    </p>
                </div>

                {/* Grid de Categorías */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-fr">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.category)}
                            className={`group relative overflow-hidden rounded-lg cursor-pointer 
                                transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]
                                ${cat.gridClass} min-h-[180px] sm:min-h-[200px] md:min-h-[220px]`}
                        >
                            {/* Imagen de fondo */}
                            <div className="absolute inset-0">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                {/* Overlay gradiente */}
                                <div className="absolute inset-0 transition-all duration-500 
                                    bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/80 
                                    group-hover:from-gray-800/80 group-hover:to-gray-700/90"
                                />
                            </div>

                            {/* Contenido */}
                            <div className="relative z-10 p-4 sm:p-5 md:p-6 h-full flex flex-col justify-end">
                                <h3 className="font-bold transition-all duration-300 
                                    text-base sm:text-lg md:text-xl lg:text-2xl text-white">
                                    {cat.name}
                                </h3>

                                {/* Indicador de hover - oculto en móvil */}
                                <div className="hidden sm:flex mt-3 md:mt-4 items-center text-orange-400 
                                    opacity-0 group-hover:opacity-100 transition-all duration-300 
                                    transform translate-y-2 group-hover:translate-y-0">
                                    <span className="text-xs md:text-sm font-medium mr-2">
                                        Explorar
                                    </span>
                                    <svg
                                        className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;