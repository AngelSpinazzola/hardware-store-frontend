import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import type { ProductSummary } from "../../types";
import { ProductStatus } from "../../types/product.types";
import { isAdmin } from "@/utils/roleHelper";

type LayoutType = "grid" | "list";

interface ProductGridProps {
    products?: ProductSummary[];
    onProductClick: (product: ProductSummary) => void;
    layout: LayoutType;
}

interface ProductCardProps {
    product: ProductSummary;
}

const ProductGrid = ({
    products = [],
    onProductClick,
    layout,
}: ProductGridProps) => {
    const { addToCart, getCartItemQuantity } = useCart();
    const { user } = useAuth();

    const getImageUrl = (imageUrl: string): string => {
        return (
            imageUrl ||
            `https://picsum.photos/400/400?random=${Math.floor(
                Math.random() * 1000
            )}`
        );
    };

    const formatPriceInteger = (price: number): string => {
        return Math.floor(price).toLocaleString('es-AR');
    };

    const formatPriceDecimals = (price: number): string => {
        return (price % 1).toFixed(2).substring(2);
    };

    const handleAddToCart = (
        product: ProductSummary,
        e: React.MouseEvent<HTMLButtonElement>
    ): void => {
        e.stopPropagation();
        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            mainImageUrl: product.mainImageUrl,
            stock: product.stock,
            status: product.status,
            category: product.categoryName,
        };
        addToCart(cartProduct, 1);
        e.currentTarget.blur();
    };

    const ProductCard = ({ product }: ProductCardProps) => {
        const quantityInCart = getCartItemQuantity(product.id);
        const availableStock = product.stock - quantityInCart;
        const isOutOfStock = availableStock <= 0;

        return (
            <div
                className="group cursor-pointer w-full h-full"
                onClick={() => onProductClick(product)}
            >
                <div className="rounded-xl border border-gray-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-44 sm:h-56 w-full mb-4 p-6 sm:p-8 pb-0">
                        <img
                            src={getImageUrl(product.mainImageUrl)}
                            alt={product.name}
                            className="mx-auto h-full w-full object-contain"
                            onError={(
                                e: React.SyntheticEvent<HTMLImageElement, Event>
                            ) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://picsum.photos/400/400?random=${product.id}`;
                            }}
                        />
                    </div>

                    <div className="border-b border-gray-300"></div>

                    <div className="flex-1 flex flex-col">
                        <div className="p-3 sm:p-6 pt-2 sm:pt-4 pb-0">
                            <p className="text-xl font-medium text-blue-800 text-left mb-4 tabular-nums">
                                ${formatPriceInteger(product.price)}
                                <span className="text-sm align-super">{formatPriceDecimals(product.price)}</span>
                            </p>
                            <h3
                                className="text-sm font-normal leading-5 text-[var(--nova-primary)] hover:text-[var(--nova-accent)] transition-colors"
                                style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    height: "2.5rem",
                                }}
                            >
                                {product.name}
                            </h3>
                        </div>

                        {!isAdmin(user) && (
                            <div className="px-6 pb-5">
                                <button
                                    onClick={(e) => handleAddToCart(product, e)}
                                    disabled={
                                        isOutOfStock ||
                                        product.status !== ProductStatus.Active
                                    }
                                    className="hidden md:flex w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-600 text-gray-100 text-sm font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors items-center justify-center gap-2"
                                    style={{
                                        WebkitTapHighlightColor: "transparent",
                                    }}
                                    title={
                                        isOutOfStock
                                            ? "Sin stock"
                                            : "Agregar al carrito"
                                    }
                                >
                                    <ShoppingCartIcon className="w-4 h-4" />
                                    <span>{isOutOfStock ? 'Sin stock' : 'Agregar'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const ListCard = ({ product }: ProductCardProps) => {
        const quantityInCart = getCartItemQuantity(product.id);
        const availableStock = product.stock - quantityInCart;
        const isOutOfStock = availableStock <= 0;

        return (
            <div
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => onProductClick(product)}
            >
                <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 flex-shrink-0">
                        <img
                            src={getImageUrl(product.mainImageUrl)}
                            alt={product.name}
                            className="h-full w-full object-contain rounded-lg"
                            onError={(
                                e: React.SyntheticEvent<HTMLImageElement, Event>
                            ) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://picsum.photos/400/400?random=${product.id}`;
                            }}
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-medium font-normal text-[var(--nova-primary)] truncate mb-1">
                            {product.name}
                        </h3>

                        <div className="flex items-center justify-between">
                            <span className="text-xl font-medium text-blue-800 tabular-nums">
                                ${formatPriceInteger(product.price)}
                                <span className="text-sm align-super">{formatPriceDecimals(product.price)}</span>
                            </span>
                            {!isAdmin(user) && (
                                <button
                                    onClick={(e) => handleAddToCart(product, e)}
                                    disabled={
                                        isOutOfStock ||
                                        product.status !== ProductStatus.Active
                                    }
                                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed transition-colors active:scale-95 focus:outline-none"
                                    style={{
                                        WebkitTapHighlightColor: "transparent",
                                    }}
                                    title={
                                        isOutOfStock
                                            ? "Sin stock"
                                            : "Agregar al carrito"
                                    }
                                >
                                    <ShoppingCartIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div
                className={
                    layout === "grid"
                        ? "mb-12 grid gap-2 grid-cols-2 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch"
                        : "mb-12 space-y-4"
                }
            >
                {products.map((product) =>
                    layout === "grid" ? (
                        <ProductCard key={product.id} product={product} />
                    ) : (
                        <ListCard key={product.id} product={product} />
                    )
                )}
            </div>

            <style>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default ProductGrid;
