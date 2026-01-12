import React, { useState, useEffect } from 'react';
import { ProductSummary } from '@/types/product.types';

interface PriceRangeFilterProps {
    minPrice: number | null;
    maxPrice: number | null;
    onPriceChange: (min: number | null, max: number | null) => void;
    allProducts: ProductSummary[];
    selectedCategory: string | null;
}

const PriceRangeFilter = ({
    minPrice,
    maxPrice,
    onPriceChange,
    allProducts,
    selectedCategory
}: PriceRangeFilterProps) => {
    // Calcular rango de precios disponible primero
    const getPriceRange = () => {
        if (!allProducts || allProducts.length === 0) return { min: 0, max: 0 };

        let filteredProducts = allProducts;

        if (selectedCategory) {
            filteredProducts = allProducts.filter(product =>
                product.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        if (filteredProducts.length === 0) return { min: 0, max: 0 };

        const prices = filteredProducts.map(product => product.price).filter(price => price > 0);
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        return { min, max };
    };

    const priceRange = getPriceRange();

    const [localMinPrice, setLocalMinPrice] = useState<number>(minPrice || priceRange.min);
    const [localMaxPrice, setLocalMaxPrice] = useState<number>(maxPrice || priceRange.max);

    // Sincronizar con props cuando cambien externamente
    useEffect(() => {
        setLocalMinPrice(minPrice || priceRange.min);
        setLocalMaxPrice(maxPrice || priceRange.max);
    }, [minPrice, maxPrice, priceRange.min, priceRange.max]);

    const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value <= localMaxPrice) {
            setLocalMinPrice(value);
        }
    };

    const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= localMinPrice) {
            setLocalMaxPrice(value);
        }
    };

    const handleSliderMouseUp = () => {
        const minVal = localMinPrice === priceRange.min ? null : localMinPrice;
        const maxVal = localMaxPrice === priceRange.max ? null : localMaxPrice;
        onPriceChange(minVal, maxVal);
    };

    const getMinPercent = () => {
        return ((localMinPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
    };

    const getMaxPercent = () => {
        return ((localMaxPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (priceRange.min === priceRange.max) {
        return null;
    }

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-semibold text-gray-200 lg:text-gray-800">Rango de precios</h4>
            </div>

            <div className="space-y-4 px-2">
                {/* Valores seleccionados */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-100 lg:text-gray-600 font-medium">{formatPrice(localMinPrice)}</span>
                    <span className="text-gray-300 lg:text-gray-400">-</span>
                    <span className="text-gray-100 lg:text-gray-600 font-medium">{formatPrice(localMaxPrice)}</span>
                </div>

                {/* Dual Range Slider */}
                <div className="relative h-2">
                    {/* Track */}
                    <div className="absolute w-full h-2 bg-gray-500 rounded-full"></div>

                    {/* Active Range */}
                    <div
                        className="absolute h-2 bg-gray-300 rounded-full"
                        style={{
                            left: `${getMinPercent()}%`,
                            right: `${100 - getMaxPercent()}%`
                        }}
                    ></div>

                    {/* Min Slider */}
                    <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        value={localMinPrice}
                        onChange={handleMinSliderChange}
                        onMouseUp={handleSliderMouseUp}
                        onTouchEnd={handleSliderMouseUp}
                        className="price-range-slider"
                    />

                    {/* Max Slider */}
                    <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        value={localMaxPrice}
                        onChange={handleMaxSliderChange}
                        onMouseUp={handleSliderMouseUp}
                        onTouchEnd={handleSliderMouseUp}
                        className="price-range-slider"
                    />
                </div>

                {/* Rango disponible */}
                <div className="text-xs text-gray-200 lg:text-gray-500 text-center">
                    Disponible: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                </div>
            </div>

            <style>{`
                .price-range-slider {
                    position: absolute;
                    width: 100%;
                    height: 8px;
                    appearance: none;
                    background: transparent;
                    pointer-events: none;
                }

                .price-range-slider::-webkit-slider-thumb {
                    appearance: none;
                    pointer-events: auto;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #696663 !important;
                    border: 2px solid #696663 !important;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                }

                .price-range-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                }

                .price-range-slider::-moz-range-thumb {
                    appearance: none;
                    pointer-events: auto;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #696663 !important;
                    border: 2px solid #696663 !important;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                }

                .price-range-slider::-moz-range-thumb:hover {
                    transform: scale(1.1);
                }

                /* Mobile - color naranja para contraste en sidebar oscuro */
                @media (max-width: 1023px) {
                    .price-range-slider::-webkit-slider-thumb {
                        background: #ff882c !important;
                        border: 2px solid #ff882c !important;
                    }

                    .price-range-slider::-moz-range-thumb {
                        background: #ff882c !important;
                        border: 2px solid #ff882c !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default PriceRangeFilter;