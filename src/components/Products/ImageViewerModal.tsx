import { useEffect, useRef } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

interface ImageViewerModalProps {
  images: Array<{ url: string; id: string | number }>;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImageViewerModal({ 
  images, 
  currentIndex, 
  onClose, 
  onNavigate 
}: ImageViewerModalProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(currentIndex);
    }
  }, [currentIndex]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        aria-label="Cerrar"
      >
        <XMarkIcon className="w-6 h-6 text-white" />
      </button>

      {/* Contador de imágenes */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Swiper Container */}
      <div 
        className="w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Swiper
          modules={[Navigation, Keyboard]}
          initialSlide={currentIndex}
          spaceBetween={0}
          slidesPerView={1}
          keyboard={{ enabled: true }}
          navigation={{
            prevEl: '.modal-swiper-button-prev',
            nextEl: '.modal-swiper-button-next',
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            onNavigate(swiper.activeIndex);
          }}
          className="w-full h-full flex items-center"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id} className="flex items-center justify-center h-full">
              <img
                src={image.url}
                alt={`Imagen ${index + 1}`}
                className="max-w-full max-h-[90vh] object-contain px-4"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Botones de navegación solo en desktop */}
        {images.length > 1 && (
          <>
            <button
              className="modal-swiper-button-prev hidden lg:flex absolute left-4 top-1/2 transform -translate-y-1/2 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center transition-colors"
              aria-label="Imagen anterior"
            >
              <ChevronLeftIcon className="w-8 h-8 text-white" />
            </button>
            
            <button
              className="modal-swiper-button-next hidden lg:flex absolute right-4 top-1/2 transform -translate-y-1/2 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center transition-colors"
              aria-label="Imagen siguiente"
            >
              <ChevronRightIcon className="w-8 h-8 text-white" />
            </button>
          </>
        )}
      </div>

      <style>{`
        .swiper {
          display: flex;
          align-items: center;
        }
        
        .swiper-wrapper {
          align-items: center;
        }
        
        .swiper-slide {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}