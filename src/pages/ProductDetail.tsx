import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/Common/NavBar';
import ImageViewerModal from '../components/Products/ImageViewerModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Footer from '@/components/Common/Footer';
import { useProductDetail } from '@/hooks/useProductDetail';
import { useImageGallery } from '@/hooks/useImageGallery';
import ProductDetailLoading from '@/components/ProductDetail/ProductDetailLoading';
import ProductNotFound from '@/components/ProductDetail/ProductNotFound';
import ProductBreadcrumbs from '@/components/ProductDetail/ProductBreadcrumbs';
import QuantitySelector from '@/components/Common/QuantitySelector';
import { isAdmin } from '@/utils/roleHelper';

const ProductDetail = () => {
    const { user } = useAuth();

    // Custom hooks - Toda la lógica está aquí
    const {
        product,
        loading,
        error,
        quantity,
        handleAddToCart,
        incrementQuantity,
        decrementQuantity,
        handleQuantityChange,
        buildCategoryUrl,
        buildSubcategoryUrl,
        buildAllProductsUrl,
        productSubcategory,
    } = useProductDetail();

    const {
        activeSlide,
        isModalOpen,
        displayImages,
        handleImageChange,
        handleThumbnailHover,
        handleThumbnailLeave,
        handleImageError,
        handleThumbnailError,
        openModal,
        closeModal,
        onSlideChange,
        onSwiperInit,
        productService,
    } = useImageGallery(product);

    if (loading) {
        return <ProductDetailLoading />;
    }

    if (error || !product) {
        return <ProductNotFound error={error || 'Producto no encontrado'} />;
    }

    return (
        <div className="min-h-screen">
            <NavBar />

            <div className="max-w-7xl mx-auto bg-white pt-12 lg:pt-24">
                <div className="px-4 sm:px-6 lg:px-8 py-12">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">

                        {/* Image Gallery */}
                        <div className="flex flex-col space-y-4">
                            {/* Category Navigation */}
                            <ProductBreadcrumbs
                                category={product.categoryName}
                                subcategory={productSubcategory}
                                buildAllProductsUrl={buildAllProductsUrl}
                                buildCategoryUrl={buildCategoryUrl}
                                buildSubcategoryUrl={buildSubcategoryUrl}
                            />

                            {/* Main Image */}
                            <div className="relative">
                                <div className="rounded-2xl overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 z-10"></div>

                                    <Swiper
                                        modules={[Navigation]}
                                        spaceBetween={10}
                                        slidesPerView={1}
                                        navigation={{
                                            nextEl: '.swiper-button-next-custom',
                                            prevEl: '.swiper-button-prev-custom',
                                        }}
                                        onSwiper={onSwiperInit}
                                        onSlideChange={onSlideChange}
                                        className="h-96 lg:h-[500px]"
                                    >
                                        {displayImages.map((image, index) => (
                                            <SwiperSlide key={image.id}>
                                                <img
                                                    src={productService.getImageUrl(image.url)}
                                                    alt={`${product.name} - Imagen ${index + 1}`}
                                                    className="w-full h-full object-contain bg-white p-8 cursor-pointer hover:scale-105 transition-transform duration-200"
                                                    onError={(e) => handleImageError(e, product.id + index)}
                                                    onClick={openModal}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    {displayImages.length > 1 && (
                                        <>
                                            <div className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/20 backdrop-blur-md text-white rounded-full hidden lg:flex items-center justify-center hover:bg-black/40 transition-all duration-200 cursor-pointer z-20 group">
                                                <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </div>
                                            <div className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/20 backdrop-blur-md text-white rounded-full hidden lg:flex items-center justify-center hover:bg-black/40 transition-all duration-200 cursor-pointer z-20 group">
                                                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnails FUERA del contenedor con overflow-hidden */}
                            {displayImages.length > 1 && (
                                <div className="hidden lg:flex space-x-3 overflow-x-auto pb-2 scrollbar-hide mt-6 pt-2 px-1">
                                    {displayImages.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onMouseEnter={() => handleThumbnailHover(index)}
                                            onMouseLeave={handleThumbnailLeave}
                                            onClick={() => handleImageChange(index)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-all duration-300 cursor-pointer relative group bg-white p-1 ${activeSlide === index
                                                ? 'border-orange-500 shadow-lg transform scale-105'
                                                : 'border-gray-200 hover:border-purple-300 hover:shadow-md hover:scale-105'
                                                }`}
                                            style={{ overflow: 'visible' }} // Forzar overflow visible
                                        >
                                            <img
                                                src={productService.getImageUrl(image.url)}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-contain rounded-sm"
                                                onError={(e) => handleThumbnailError(e, product.id + index)}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product info */}
                        <div className="mt-12 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl lg:text-3xl font-normal text-gray-800 leading-tight font-oswald">
                                    {product.name}
                                </h2>

                                <div className="flex items-baseline space-x-4">
                                    <span className="text-3xl lg:text-4xl bg-clip-text text-blue-800">
                                        ${product.price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </span>
                                    {(product as any).originalPrice && (product as any).originalPrice > product.price && (
                                        <span className="text-lg text-gray-500 line-through">
                                            ${(product as any).originalPrice.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-4">
                                {/* En móvil: selector de cantidad a la izquierda, disponibilidad a la derecha */}
                                <div className="flex items-center justify-between">
                                    {/* Selector de cantidad - Solo en móvil */}
                                    {product.stock > 0 && user?.role !== 'Admin' && (
                                        <div className="flex items-center gap-3 lg:hidden">
                                            <QuantitySelector
                                                quantity={quantity}
                                                maxQuantity={product.stock}
                                                onIncrement={incrementQuantity}
                                                onDecrement={decrementQuantity}
                                                onChange={handleQuantityChange}
                                                size="sm"
                                            />
                                        </div>
                                    )}

                                    {/* Disponibilidad */}
                                    <div className="flex flex-col items-end lg:items-start lg:flex-row lg:justify-between lg:w-full">
                                        <span className="text-sm font-medium text-gray-600 lg:inline">Stock</span>
                                        <span className={`font-semibold text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Selector de cantidad en desktop */}
                            {product.stock > 0 && user?.role !== 'Admin' && (
                                <div className="hidden lg:flex items-end gap-4">
                                    <div className="flex items-center gap-3">
                                        <QuantitySelector
                                            quantity={quantity}
                                            maxQuantity={product.stock}
                                            onIncrement={incrementQuantity}
                                            onDecrement={decrementQuantity}
                                            onChange={handleQuantityChange}
                                            size="md"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <button
                                            onClick={handleAddToCart}
                                            className="w-full bg-gray-800 text-white py-3 px-3 rounded-lg font-normal text-base shadow-xl hover:bg-gray-900 flex items-center justify-center space-x-3 group"
                                        >
                                            <ShoppingCartIcon className="w-5 h-5" />
                                            <span>Agregar</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Botón de comprar en móvil - ancho completo */}
                            {product.stock > 0 && user?.role !== 'Admin' && (
                                <div className="lg:hidden">
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-gray-800 text-white py-3 px-3 rounded-lg font-normal text-base flex items-center justify-center space-x-3 group"
                                    >
                                        <ShoppingCartIcon className="w-5 h-5" />
                                        <span>Agregar</span>
                                    </button>
                                </div>
                            )}

                            {product.description && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        Descripción
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {isAdmin(user) && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-blue-900 mb-2">Modo Administrador</h3>
                                            <p className="text-blue-800 mb-4">
                                                Estás viendo este producto como administrador. Los clientes pueden agregar productos al carrito desde esta vista.
                                            </p>
                                            <Link
                                                to="/admin/products"
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Gestionar productos
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className='pt-20'>
                <Footer />
            </div>

            {isModalOpen && (
                <ImageViewerModal
                    images={displayImages.map(img => ({
                        url: productService.getImageUrl(img.url),
                        id: img.id
                    }))}
                    currentIndex={activeSlide}
                    onClose={closeModal}
                    onNavigate={handleImageChange}
                />
            )}

            <style>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }

                .swiper-button-next,
                .swiper-button-prev {
                    display: none !important;
                }
                
                .animation-delay-150 {
                    animation-delay: 150ms;
                }
                
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                input:focus {
                outline: none !important;
                box-shadow: none !important;
                }
                `}</style>
        </div>
    );
};

export default ProductDetail;