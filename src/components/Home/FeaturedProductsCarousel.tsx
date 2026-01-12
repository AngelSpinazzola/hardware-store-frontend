import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import ProductCard from "./ProductCard";
import { ProductSummary } from "@/types/product.types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface FeaturedProductsCarouselProps {
    products: ProductSummary[];
    loading: boolean;
}

const FeaturedProductsCarousel = ({
    products,
    loading,
}: FeaturedProductsCarouselProps) => {
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const handleSlideChange = (swiper: SwiperType) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };
    if (loading) {
        return (
            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-gray-100 rounded-2xl h-80 md:h-96 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                    No hay productos destacados disponibles
                </p>
            </div>
        );
    }

    return (
        <div className="relative w-full">
<Swiper
    modules={[Navigation, Pagination, Autoplay]}
    navigation={{
        nextEl: '.swiper-button-next-custom',
        prevEl: '.swiper-button-prev-custom',
    }}
    onSwiper={handleSlideChange}
    onSlideChange={handleSlideChange}
    spaceBetween={12}
    slidesPerView={2.5}
    slidesPerGroup={2}
    touchEventsTarget="container"
    preventClicks={true}
    preventClicksPropagation={true}
    threshold={5}
    breakpoints={{
        640: {
            slidesPerView: 2.5,
            slidesPerGroup: 2,
            spaceBetween: 16,
        },
        768: {
            slidesPerView: 3.5,
            slidesPerGroup: 3,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 4.5,
            slidesPerGroup: 4,
            spaceBetween: 24,
        },
        1280: {
            slidesPerView: 5.5,
            slidesPerGroup: 5,
            spaceBetween: 24,
        },
    }}
                className="featured-products-swiper"
            >
                {products.map((product, index) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard product={product} index={index} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            {products.length > 5 && (
                <>
                    <button
                        className={`swiper-button-prev-custom hidden md:flex absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 z-10
                            w-12 h-12 bg-orange-400/90 backdrop-blur rounded-full
                            items-center justify-center text-white hover:bg-orange-500
                            transition-all duration-300 group shadow-lg hover:shadow-xl
                            ${isBeginning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <svg
                            className="w-6 h-6 group-hover:-translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button
                        className={`swiper-button-next-custom hidden md:flex absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 z-10
                            w-12 h-12 bg-orange-400/90 backdrop-blur rounded-full
                            items-center justify-center text-white hover:bg-orange-500
                            transition-all duration-300 group shadow-lg hover:shadow-xl
                            ${isEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <svg
                            className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </>
            )}

            <style>{`
                .featured-products-swiper {
                    padding: 20px 8px 50px 8px;
                    margin: -20px -8px -50px -8px;
                }

                .featured-products-swiper .swiper-wrapper {
                    align-items: stretch;
                }

                .featured-products-swiper .swiper-slide {
                    height: auto;
                }

                .featured-products-swiper .swiper-pagination {
                    bottom: 10px;
                }

                .featured-products-swiper .swiper-pagination-bullet {
                    background: #d1d5db;
                    opacity: 1;
                    width: 8px;
                    height: 8px;
                    transition: all 0.3s ease;
                }

                .featured-products-swiper .swiper-pagination-bullet-active {
                    background: #ff882c;
                    width: 24px;
                    border-radius: 4px;
                }

                .featured-products-swiper .swiper-pagination-bullet:hover {
                    background: #9ca3af;
                }

                @media (max-width: 768px) {
                    .featured-products-swiper {
                        padding: 10px 4px 40px 4px;
                        margin: -10px -4px -40px -4px;
                    }
                }
            `}</style>
        </div>
    );
};

export default FeaturedProductsCarousel;
