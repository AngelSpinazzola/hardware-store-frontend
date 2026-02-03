import { useState, useRef, useMemo, useCallback } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { productService } from '@/services/productService';
import { ProductDetail as ProductDetailType } from '@/types/product.types';

export const useImageGallery = (product: ProductDetailType | null) => {
    const [activeSlide, setActiveSlide] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const swiperRef = useRef<SwiperType | null>(null);

    const displayImages = useMemo(() => {
        if (!product) return [];

        if (product.images && product.images.length > 0) {
            return product.images
                .filter(img => img.imageUrl && img.imageUrl !== 'string')
                .sort((a, b) => {
                    if (a.isMain) return -1;
                    if (b.isMain) return 1;
                    return a.displayOrder - b.displayOrder;
                })
                .map(img => ({
                    url: img.imageUrl,
                    isMain: img.isMain,
                    id: img.id,
                    displayOrder: img.displayOrder
                }));
        }

        if (product.mainImageUrl) {
            return [{
                url: product.mainImageUrl,
                isMain: true,
                id: 'main',
                displayOrder: 0
            }];
        }

        return [{
            url: `https://picsum.photos/600/600?random=${product.id}`,
            isMain: true,
            id: 'placeholder',
            displayOrder: 0
        }];
    }, [product]);

    const handleImageChange = useCallback((index: number): void => {
        setActiveSlide(index);
        swiperRef.current?.slideTo(index);
    }, []);

    const handleThumbnailHover = useCallback((index: number): void => {
        handleImageChange(index);
    }, [handleImageChange]);

    const handleThumbnailLeave = useCallback((): void => {
        // Mantener la imagen actual
    }, []);

    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackIndex: number): void => {
        e.currentTarget.src = `https://picsum.photos/600/600?random=${fallbackIndex}`;
    }, []);

    const handleThumbnailError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackIndex: number): void => {
        e.currentTarget.src = `https://picsum.photos/80/80?random=${fallbackIndex}`;
    }, []);

    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    const onSlideChange = useCallback((swiper: SwiperType) => {
        setActiveSlide(swiper.activeIndex);
    }, []);

    const onSwiperInit = useCallback((swiper: SwiperType) => {
        swiperRef.current = swiper;
    }, []);

    return {
        activeSlide,
        isModalOpen,
        swiperRef,
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
        productService, // Para acceder a getImageUrl
    };
};