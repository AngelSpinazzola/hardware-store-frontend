import React from 'react';
import NavBar from '@/components/Common/NavBar';

const ProductDetailLoading: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <NavBar />
            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-orange-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-400 rounded-full animate-spin animation-delay-150"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailLoading;
