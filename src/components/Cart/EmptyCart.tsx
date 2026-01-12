import { Link } from 'react-router-dom';
import { ShoppingCartIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const EmptyCart = () => {
    return (
        <div className="text-center py-20">
            <div className="relative mb-8">
                {/* Contenedor principal */}
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-200 to-purple-50 rounded-full flex items-center justify-center shadow-lg border border-indigo-100">
                    <ShoppingCartIcon className="w-16 h-16 text-orange-500" />
                </div>

                {/* Elementos decorativos flotantes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute w-2 h-2 bg-indigo-200 rounded-full animate-float opacity-40 left-1/4 top-1/4" />
                    <div className="absolute w-1 h-1 bg-purple-200 rounded-full animate-float opacity-50 right-1/4 top-1/3" />
                    <div className="absolute w-3 h-3 bg-pink-200 rounded-full animate-float opacity-30 right-1/5 bottom-2/5" />
                </div>
            </div>

            {/* Contenido de texto */}
            <h3 className="font-poppins text-2xl font-bold text-gray-800 mb-3">
                Tu carrito está vacío
            </h3>

            <p className="font-poppins text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                ¡Es hora de armar tu setup gaming!
            </p>

            {/* Botón principal */}
            <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 nova-bg-orange text-white font-poppins font-semibold rounded-lg transition-all duration-300 md:hover:bg-orange-500 hover:shadow-lg hover:scale-105"
            >
                <ArrowRightIcon className="w-5 h-5 mr-2" />
                Explorar Productos
            </Link>
        </div>
    );
};

export default EmptyCart;
