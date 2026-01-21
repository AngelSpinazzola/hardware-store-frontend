import React, { useState, useEffect } from 'react';

interface PriceInputProps {
    label: string;
    name: string;
    value: number;
    onChange: (value: number) => void;
    error?: string;
    required?: boolean;
    placeholder?: string;
}

// Convierte número a formato argentino
const formatToArgentine = (num: number): string => {
    if (num === 0) return '';

    const parts = num.toFixed(2).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const decimalPart = parts[1];

    // Si los decimales son 00, no los mostramos
    if (decimalPart === '00') {
        return integerPart;
    }

    return `${integerPart},${decimalPart}`;
};

// Parsea formato argentino a número
const parseArgentineFormat = (str: string): number => {
    if (!str || str.trim() === '') return 0;

    // Remueve puntos de miles y reemplaza coma decimal por punto
    const normalized = str
        .replace(/\./g, '')  // Quita puntos de miles
        .replace(',', '.');   // Cambia coma decimal a punto

    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
};

// Valida que el input sea válido para formato argentino
const isValidInput = (str: string): boolean => {
    // Permite: dígitos, puntos (miles), una coma (decimal) seguida de hasta 2 decimales
    // Ejemplos válidos: "1650000", "1.650.000", "1650000,85", "1.650.000,85"
    const regex = /^[\d.]+(?:,\d{0,2})?$/;
    return regex.test(str);
};

const PriceInput: React.FC<PriceInputProps> = ({
    label,
    name,
    value,
    onChange,
    error,
    required = false,
    placeholder = "Ej: 1.650.000,25"
}) => {
    const [displayValue, setDisplayValue] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);

    // Sincroniza el valor externo con el display cuando no está enfocado
    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(formatToArgentine(value));
        }
    }, [value, isFocused]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Permite borrar completamente
        if (inputValue === '') {
            setDisplayValue('');
            onChange(0);
            return;
        }

        // Valida el formato antes de aceptar
        if (isValidInput(inputValue)) {
            setDisplayValue(inputValue);
            const numericValue = parseArgentineFormat(inputValue);
            onChange(numericValue);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        // Al perder foco, formatea el valor correctamente
        const numericValue = parseArgentineFormat(displayValue);
        setDisplayValue(formatToArgentine(numericValue));
        onChange(numericValue);
    };

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    $
                </span>
                <input
                    type="text"
                    id={name}
                    name={name}
                    value={displayValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                        error ? 'border-red-500' : ''
                    }`}
                    placeholder={placeholder}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${name}-error` : undefined}
                    inputMode="decimal"
                />
            </div>
            {error && (
                <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default PriceInput;
