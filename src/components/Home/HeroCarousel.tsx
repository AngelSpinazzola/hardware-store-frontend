import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gpuImage from "@/assets/gpuImage.webp";
import gpuImageMobile from "@/assets/gpuImageMobile.webp";
import gpuImage2 from "@/assets/gpuImage-2.webp";
import gpuImageMobile2 from "@/assets/gpuImageMobile-2.webp";
import mothersImages from "@/assets/mothersImage.webp";
import mothersImageMobile from "@/assets/mothersImageMobile.webp";

interface CarouselImage {
    id: number;
    url: string;
    mobileUrl?: string;
    category?: string;
    subcategory?: string; // ← Mantener subcategory (no brand)
    title?: string;
    objectPosition?: string;
    mobileObjectPosition?: string;
}

const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
    const [touchStart, setTouchStart] = useState<number>(0);
    const [touchEnd, setTouchEnd] = useState<number>(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Array de imágenes relacionadas con hardware de PC
    const carouselImages: CarouselImage[] = [
        {
            id: 1,
            url: gpuImage,
            mobileUrl: gpuImageMobile,
            category: "Placas de Video",
            subcategory: "nvidia",
            title: "Placas de Video NVIDIA",
            objectPosition: "center 100%",
            mobileObjectPosition: "center 60%",
        },
        {
            id: 2,
            url: mothersImages,
            mobileUrl: mothersImageMobile,
            category: "Mothers",
            title: "Motherboards Premium",
        },
        {
            id: 3,
            url: gpuImage2,
            mobileUrl: gpuImageMobile2,
            category: "Placas de Video",
            subcategory: "nvidia",
            title: "Placas de Video NVIDIA",
            objectPosition: "center 70%",
            mobileObjectPosition: "center 60%",
        },
    ];

    // Auto-play
    useEffect(() => {
        if (isAutoPlaying) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [isAutoPlaying, carouselImages.length]);

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            prevSlide();
        }
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide(
            (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
        );
    };

    const handleSlideClick = (image: CarouselImage) => {
        const params = new URLSearchParams();

        if (image.category) {
            params.append("category", image.category);
        }
        if (image.subcategory) {
            // ← Usar subcategory
            params.append("subcategory", image.subcategory);
        }

        const queryString = params.toString();
        navigate(`/products${queryString ? `?${queryString}` : ""}`);
    };

    return (
        <div className="w-full px-0 py-4 pt-16 sm:pt-20 md:pt-8 lg:pt-12 md:px-0 md:py-8">
            <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[75vh] overflow-hidden rounded-none md:rounded-lg shadow-lg">
                <div
                    ref={carouselRef}
                    className="relative w-full h-full overflow-hidden rounded-none md:rounded-lg"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {carouselImages.map((image, index) => (
                        <div
                            key={image.id}
                            onClick={() => handleSlideClick(image)}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-out cursor-pointer group ${
                                index === currentSlide
                                    ? "opacity-100"
                                    : "opacity-0"
                            }`}
                        >
                            {/* Imagen mobile */}
                            <img
                                src={image.mobileUrl || image.url}
                                alt={
                                    image.title || `Slide ${index + 1} - Mobile`
                                }
                                className="absolute block w-full h-full object-cover md:hidden group-hover:scale-105 transition-transform duration-500"
                                style={
                                    image.mobileObjectPosition
                                        ? {
                                              objectPosition:
                                                  image.mobileObjectPosition,
                                          }
                                        : undefined
                                }
                            />

                            {/* Imagen desktop */}
                            <img
                                src={image.url}
                                alt={
                                    image.title ||
                                    `Slide ${index + 1} - Desktop`
                                }
                                className="absolute w-full h-full object-cover hidden md:block rounded-lg group-hover:scale-105 transition-transform duration-500"
                                style={
                                    image.objectPosition
                                        ? {
                                              objectPosition:
                                                  image.objectPosition,
                                          }
                                        : undefined
                                }
                            />

                            {/* Overlay hover */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                                <div className="text-white text-center"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controles de navegación - Solo en desktop */}
                <button
                    type="button"
                    className="hidden md:flex absolute top-0 left-0 z-30 items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    onClick={prevSlide}
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none transition-all duration-300">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 6 10"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 1 1 5l4 4"
                            />
                        </svg>
                    </span>
                </button>

                {/* Indicadores de puntos */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
                    {carouselImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? "bg-white w-6 md:w-8"
                                    : "bg-white/50 w-2 hover:bg-white/70"
                            }`}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    className="hidden md:flex absolute top-0 right-0 z-30 items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    onClick={nextSlide}
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none transition-all duration-300">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 6 10"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 9 4-4-4-4"
                            />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    );
};

export default HeroCarousel;
