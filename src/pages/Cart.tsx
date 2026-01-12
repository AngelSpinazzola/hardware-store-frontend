import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCartActions } from '../hooks/useCartActions';
import { Footer } from '../components/Common/Footer';
import NavBar from '../components/Common/NavBar';
import EmptyCart from '../components/Cart/EmptyCart';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';
import { isAdmin } from '@/utils/roleHelper';

const Cart = () => {
    const { isAuthenticated, user } = useAuth();
    const { cartItems, getCartTotal, getCartItemsCount } = useCart();
    const {
        incrementQuantity,
        decrementQuantity,
        handleRemoveItem,
        handleClearCart,
        handleCheckout,
        handleImageError
    } = useCartActions();

    if (isAdmin(user)) {
        return (
            <div className="min-h-screen bg-white">
                <NavBar />
                <div className="flex items-center justify-center py-12 px-4">
                    <div className="text-center max-w-md">
                        <h2 className="font-poppins text-xl font-semibold text-gray-800 mb-4">
                            Acceso Restringido
                        </h2>
                        <p className="font-poppins text-sm text-gray-500 mb-6 leading-relaxed">
                            Los administradores no pueden acceder al carrito
                        </p>
                        <Link
                            to="/admin/dashboard"
                            className="font-poppins bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium transition-colors inline-block"
                        >
                            Ir al Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-16">
            <NavBar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                <div className="mb-6 sm:mb-8">
                    <h1 className="font-poppins text-xl sm:text-2xl font-semibold text-gray-800">Mi carrito</h1>
                    <div className="h-px bg-gray-300 w-full mt-2 mb-3"></div>
                </div>

                {cartItems.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-10">
                        {/* Lista de productos */}
                        <div className="lg:col-span-8 space-y-5">
                            {cartItems.map((item, index) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    onIncrement={incrementQuantity}
                                    onDecrement={decrementQuantity}
                                    onRemove={handleRemoveItem}
                                    onImageError={handleImageError}
                                />
                            ))}

                            {/* Botón vaciar carrito */}
                            <div className="flex justify-center sm:justify-left pt-6 pl-0 sm:pl-4">
                                <button
                                    onClick={handleClearCart}
                                    className="font-poppins flex items-center px-6 py-3 bg-white text-red-600 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200 text-sm font-medium shadow-sm"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Vaciar
                                </button>
                            </div>
                        </div>

                        {/* Resumen del carrito */}
                        <div className="mt-16 lg:mt-0 lg:col-span-4">
                            <CartSummary
                                itemsCount={getCartItemsCount()}
                                total={getCartTotal()}
                                isAuthenticated={isAuthenticated}
                                hasItems={cartItems.length > 0}
                                onCheckout={handleCheckout}
                            />
                        </div>
                    </div>
                )}
            </main>
            <div className='lg:mt-24 mt-10'>
                <Footer />
            </div>
        </div>
    );
};

export default Cart;
