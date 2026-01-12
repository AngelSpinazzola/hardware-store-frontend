import { useState } from 'react';

interface ValidatedInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  validator?: (value: string) => { isValid: boolean; message?: string };
  type?: 'text' | 'select';
  options?: string[];
  placeholder?: string;
  required?: boolean;
  hint?: string;
  className?: string;
}

const ValidatedInput = ({
  label,
  name,
  value,
  onChange,
  validator,
  type = 'text',
  options = [],
  placeholder,
  required = false,
  hint,
  className = ''
}: ValidatedInputProps) => {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const handleBlur = () => {
    // Solo validar si el campo fue modificado
    if (isDirty && validator) {
      setTouched(true);
      const result = validator(value);
      setError(result.isValid ? '' : result.message || '');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setIsDirty(true);
    onChange(e);

    // Limpiar error si estaba tocado
    if (touched && validator) {
      const result = validator(e.target.value);
      setError(result.isValid ? '' : result.message || '');
    }
  };

  const getStatusClasses = () => {
    if (!touched) return 'border-gray-300 focus:border-orange-500 focus:ring-orange-200';
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-200';
    if (value) return 'border-green-500 focus:border-green-500 focus:ring-green-200';
    return 'border-gray-300 focus:border-orange-500 focus:ring-orange-200';
  };

  const showSuccess = touched && !error && value;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {type === 'select' ? (
          <select
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none transition-colors ${getStatusClasses()}`}
          >
            <option value="">Selecciona una opción</option>
            {options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none transition-colors placeholder:text-gray-400 ${getStatusClasses()}`}
          />
        )}
        
        {showSuccess && type !== 'select' && (
          <svg className="absolute right-3 top-2.5 w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {hint && !error && (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
};

export default ValidatedInput;