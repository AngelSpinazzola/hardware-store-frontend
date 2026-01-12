import { Link } from 'react-router-dom';

const SecondaryNavBar = () => {
    return (
        <nav className="hidden md:block bg-white sticky top-16 sm:top-20 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Desktop Version */}
                <div className="flex items-center justify-center space-x-8 py-3">

                    {/* Categorías Dropdown */}
                    <Link
                        to="/products"
                        className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-nova-cyan font-medium transition-colors"
                    >
                        <span>Productos</span>
                    </Link>

                    {/* Links directos */}
                    <Link
                        to="/products?category=Placas%20de%20video"
                        className="px-4 py-2 text-gray-700 hover:text-nova-cyan font-semibold transition-colors"
                    >
                        Placas de Video
                    </Link>

                    <Link
                        to="/products?category=Monitores"
                        className="px-4 py-2 text-gray-700 hover:text-nova-cyan font-semibold transition-colors"
                    >
                        Monitores
                    </Link>

                    <Link
                        to="/products?offers=true"
                        className="px-4 py-2 text-gray-700 hover:text-nova-cyan font-semibold transition-colors"
                    >
                        Ofertas
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default SecondaryNavBar;