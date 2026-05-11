import { Link } from 'react-router-dom';
import NavBar from '@/components/Common/NavBar';
import Footer from '@/components/Common/Footer';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ProductNotFound = () => {
    return (
        <div className="min-h-screen bg-white pt-16">
            <NavBar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-24">
                    <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-8">
                        <MagnifyingGlassIcon className="w-16 h-16 text-gray-400" />
                    </div>

                    <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                        PRODUCTO <span className="nova-text-orange">NO ENCONTRADO</span>
                    </h1>

                    <p className="font-poppins text-gray-500 text-sm sm:text-base mb-8 max-w-sm mx-auto leading-relaxed">
                        El producto que buscás no existe o fue eliminado. Explorá nuestro catálogo para encontrar lo que necesitás.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            to="/products"
                            className="inline-flex items-center px-6 py-3 nova-bg-orange text-white font-poppins font-semibold rounded-lg transition-all duration-300 hover:bg-orange-500 hover:shadow-lg hover:scale-105"
                        >
                            Ver catálogo
                        </Link>
                        <Link
                            to="/"
                            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-poppins font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductNotFound;
