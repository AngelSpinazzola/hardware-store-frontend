import React from 'react';

interface QuantitySelectorProps {
    quantity: number;
    maxQuantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    onChange: (value: number) => void;
    size?: 'sm' | 'md';
    disabled?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    quantity,
    maxQuantity,
    onIncrement,
    onDecrement,
    onChange,
    size = 'md',
    disabled = false,
}) => {
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        onChange(value);
        e.target.value = String(value < 1 ? 1 : value);
    };

    const isMobile = size === 'sm';
    const buttonPadding = isMobile ? 'px-2 py-2' : 'px-3 py-2';
    const inputWidth = isMobile ? 'w-12' : 'w-16';
    const inputPadding = isMobile ? 'py-2' : 'py-3';

    return (
        <div className="flex items-center bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
                onClick={onDecrement}
                disabled={disabled || quantity <= 1}
                className={`${buttonPadding} border-r border-gray-200 transition-colors ${
                    disabled || quantity <= 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="Disminuir cantidad"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
            </button>

            <input
                type="number"
                key={quantity}
                defaultValue={quantity}
                onBlur={handleBlur}
                disabled={disabled}
                className={`${inputWidth} ${inputPadding} text-center font-medium text-gray-900 bg-transparent border-0 focus:outline-none`}
                placeholder="1"
                min="1"
                max={maxQuantity}
                aria-label="Cantidad"
            />

            <button
                onClick={onIncrement}
                disabled={disabled || quantity >= maxQuantity}
                className={`${buttonPadding} border-l border-gray-200 transition-colors ${
                    disabled || quantity >= maxQuantity
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="Aumentar cantidad"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        </div>
    );
};

export default QuantitySelector;
