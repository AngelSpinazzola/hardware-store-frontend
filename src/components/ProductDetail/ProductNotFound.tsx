import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/Common/NavBar';

interface ProductNotFoundProps {
    error: string;
}

const ProductNotFound: React.FC<ProductNotFoundProps> = ({ error }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <NavBar />
            <div className="max-w-7xl mx-auto bg-white shadow-xl pt-34">
                <div className="flex items-center justify-center min-h-96 text-center px-4">
                    <div className="space-y-6">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                PRODUCTO NO ENCONTRADO
                            </h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <Link
                                to="/products"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver al inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductNotFound;
