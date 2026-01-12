import React from 'react';

interface BrandSelectorProps {
    brands: string[];
    selectedBrand: string | undefined;
    isNewBrand: boolean;
    newBrandValue: string;
    onBrandChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onNewBrandChange: (value: string) => void;
    error?: string;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({
    brands,
    selectedBrand,
    isNewBrand,
    newBrandValue,
    onBrandChange,
    onNewBrandChange,
    error,
}) => {
    return (
        <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                Marca <span className="text-red-500">*</span>
            </label>
            <select
                id="brand"
                name="brand"
                value={isNewBrand ? 'nueva' : (selectedBrand || '')}
                onChange={onBrandChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    error ? 'border-red-500' : ''
                }`}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'brand-error' : undefined}
            >
                <option value="">Seleccionar marca</option>
                {brands.map(brand => (
                    <option key={brand} value={brand}>
                        {brand}
                    </option>
                ))}
                <option value="nueva">+ Crear nueva marca</option>
            </select>

            {isNewBrand && (
                <input
                    type="text"
                    value={newBrandValue}
                    onChange={(e) => onNewBrandChange(e.target.value)}
                    placeholder="Ingrese nueva marca"
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    aria-label="Nueva marca"
                />
            )}

            {error && (
                <p id="brand-error" className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default BrandSelector;
