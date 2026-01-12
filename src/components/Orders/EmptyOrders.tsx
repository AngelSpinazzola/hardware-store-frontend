import { Link } from 'react-router-dom';

const EmptyOrders = () => {
    return (
        <div className="text-center py-12 px-4">
            <svg className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 font-poppins text-base sm:text-lg font-medium text-gray-900">
                No tenés ordenes aún
            </h3>
            <p className="mt-2 font-poppins text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
                ¡Explora nuestros productos y realizá tu primera compra!
            </p>
            <div className="mt-6">
                <Link
                    to="/products"
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent font-poppins text-sm sm:text-base font-medium rounded-md text-white bg-orange-400 md:hover:bg-orange-500 transition-colors"
                >
                    Explorar productos
                </Link>
            </div>
        </div>
    );
};

export default EmptyOrders;
