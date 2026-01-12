import React from 'react';

const PLATFORM_REQUIRED_CATEGORIES = ['Mothers', 'Procesadores', 'Placas de Video'];

interface PlatformSelectorProps {
    category: string;
    selectedPlatform: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
    category,
    selectedPlatform,
    onChange,
    error,
}) => {
    // Solo mostrar si la categoría requiere plataforma
    if (!PLATFORM_REQUIRED_CATEGORIES.includes(category)) {
        return null;
    }

    // Definir qué plataformas mostrar según la categoría
    const isGPUCategory = category === 'Placas de Video';
    const showIntel = !isGPUCategory; // Intel solo para Procesadores y Mothers
    const showAMD = true; // AMD siempre disponible
    const showNvidia = isGPUCategory; // NVIDIA solo para Placas de Video

    return (
        <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                Plataforma <span className="text-red-500">*</span>
            </label>
            <select
                id="platform"
                name="platform"
                value={selectedPlatform}
                onChange={onChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    error ? 'border-red-500' : ''
                }`}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'platform-error' : undefined}
            >
                <option value="">Seleccionar plataforma</option>
                {showIntel && <option value="Intel">Intel</option>}
                {showAMD && <option value="AMD">AMD</option>}
                {showNvidia && <option value="NVIDIA">NVIDIA</option>}
            </select>

            {error && (
                <p id="platform-error" className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default PlatformSelector;
export { PLATFORM_REQUIRED_CATEGORIES };
