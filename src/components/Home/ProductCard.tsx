import { Link } from 'react-router-dom';
import { productService } from '@/services/productService';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {

    return (
        <div
            className="animate-fade-in-up h-full"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <Link
                to={`/product/${product.id}`}
                className="group bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg h-full flex flex-col"
                style={{ WebkitTapHighlightColor: 'transparent' }}
            >
                {/* Product Image */}
                <div className="aspect-square bg-white overflow-hidden relative flex-shrink-0">
                    <img
                        src={productService.getImageUrl(product.mainImageUrl)}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://picsum.photos/400/400?random=' + product.id;
                        }}
                    />
                    
                    {/* Out of stock overlay */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-gray-900 font-medium mb-1">Sin Stock</div>
                                <div className="text-gray-500 text-sm">Próximamente</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col">
                    {/* Category */}
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        {product.categoryName}
                    </div>

                    {/* Product name */}
                    <h3 className="font-medium text-gray-900 line-clamp-2 leading-tight group-hover:text-gray-700 transition-colors mb-2">
                        {product.name}
                    </h3>

                    {/* Price and stock info */}
                    <div className="flex items-center justify-between pt-2 mt-auto">
                        <div className="space-y-1">
                            <div className="text-lg font-semibold text-gray-900">
                                ${product.price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </div>
                            
                            {product.stock > 0 && (
                                <div className="text-xs text-green-600 font-bold">
                                    En stock
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;