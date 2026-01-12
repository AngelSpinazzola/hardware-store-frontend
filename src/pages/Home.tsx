import { useState, useEffect } from "react";
import { productService } from "../services/productService";
import SecondaryNavBar from "../components/Common/SecondaryNavBar";
import Footer from "../components/Common/Footer";
import CategoryGrid from "../components/Home/CategoryGrid";
import HeroCarousel from "../components/Home/HeroCarousel";
import FeaturedProductsCarousel from "../components/Home/FeaturedProductsCarousel";
import { ProductSummary } from "../types/product.types";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Home = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [featuredProducts, setFeaturedProducts] = useState<ProductSummary[]>([]);
    const { isAuthenticated, user } = useAuth();

    // Mostrar mensaje de bienvenida al iniciar sesión o registrarse
    useEffect(() => {
        const justLoggedIn = sessionStorage.getItem("justLoggedIn");
        const justRegistered = sessionStorage.getItem("justRegistered");

        if (justLoggedIn && isAuthenticated) {
            toast.success(
                `¡Bienvenido${user?.firstName ? `, ${user.firstName}` : ""}!`
            );
            sessionStorage.removeItem("justLoggedIn");
        } else if (justRegistered && isAuthenticated) {
            toast.success(
                `¡Registro exitoso! Bienvenido${
                    user?.firstName ? `, ${user.firstName}` : ""
                }!`
            );
            sessionStorage.removeItem("justRegistered");
        }
    }, [isAuthenticated, user]);

    // Cargar productos destacados
    useEffect(() => {
        loadFeaturedProducts();
    }, []);

    const loadFeaturedProducts = async (): Promise<void> => {
        try {
            setLoading(true);
            const productsResponse = await productService.getAllProducts();

            let productsData: ProductSummary[];
            if (productsResponse?.data && Array.isArray(productsResponse.data)) {
                productsData = productsResponse.data;
            } else if (Array.isArray(productsResponse)) {
                productsData = productsResponse;
            } else {
                productsData = [];
            }

            // Tomar los primeros 10 productos como destacados
            setFeaturedProducts(
                Array.isArray(productsData) ? productsData.slice(0, 10) : []
            );
        } catch (err) {
            toast.error("Error al cargar los productos");
            console.error("Error loading products:", err);
            setFeaturedProducts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <SecondaryNavBar />
            <HeroCarousel />

            {/* Contenedor principal */}
            <div className="w-full">
                {/* Category Grid */}
                <CategoryGrid />

                {/* Featured Products Section */}
                <section className="py-12 md:py-16 lg:py-20 bg-white">
                    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="text-center mb-8 md:mb-12 lg:mb-16">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4">
                                PRODUCTOS <span className="text-orange-400">DESTACADOS</span>
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                                Hardware de élite para{" "}
                                <span className="text-orange-500 font-semibold">gamers exigentes</span>
                            </p>
                        </div>

                        {/* Carousel */}
                        <FeaturedProductsCarousel 
                            products={featuredProducts} 
                            loading={loading} 
                        />
                    </div>
                </section>

                <Footer />
            </div>
        </div>
    );
};

export default Home;