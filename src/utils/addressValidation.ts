export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const PROVINCES = [
  'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
  'Tierra del Fuego', 'Tucumán'
];

export const JURISDICTIONS = ['CABA', ...PROVINCES];

export const addressValidators = {
  street: (value: string): ValidationResult => {
    if (!value.trim()) return { isValid: false, message: 'La calle es requerida' };
    if (value.length < 2) return { isValid: false, message: 'Mínimo 2 caracteres' };
    if (value.length > 100) return { isValid: false, message: 'Máximo 100 caracteres' };
    return { isValid: true };
  },

  number: (value: string): ValidationResult => {
    if (!value.trim()) return { isValid: false, message: 'La altura es requerida' };
    if (!/^\d+$/.test(value.trim())) return { isValid: false, message: 'Solo números permitidos' };
    if (value.length > 10) return { isValid: false, message: 'Máximo 10 dígitos' };
    return { isValid: true };
  },

  postalCode: (value: string): ValidationResult => {
    if (!value.trim()) return { isValid: false, message: 'El código postal es requerido' };
    if (value.length < 4) return { isValid: false, message: 'Mínimo 4 dígitos' };
    if (value.length > 10) return { isValid: false, message: 'Máximo 10 caracteres' };
    if (!/^[\d\s-]{4,10}$/.test(value)) return { isValid: false, message: 'Solo números, espacios y guiones' };
    return { isValid: true };
  },

  province: (value: string): ValidationResult => {
    if (!value.trim()) return { isValid: false, message: 'Selecciona una provincia' };
    if (!JURISDICTIONS.includes(value)) return { isValid: false, message: 'Provincia no válida' };
    return { isValid: true };
  },

  city: (value: string): ValidationResult => {
    if (!value.trim()) return { isValid: false, message: 'La localidad es requerida' };
    if (value.length < 2) return { isValid: false, message: 'Mínimo 2 caracteres' };
    if (value.length > 100) return { isValid: false, message: 'Máximo 100 caracteres' };
    return { isValid: true };
  },

  floor: (value: string): ValidationResult => {
    if (value && value.length > 5) return { isValid: false, message: 'Máximo 5 caracteres' };
    if (value && !/^[\w\-\s]*$/.test(value)) return { isValid: false, message: 'Caracteres inválidos' };
    return { isValid: true };
  },

  apartment: (value: string): ValidationResult => {
    if (value && value.length > 10) return { isValid: false, message: 'Máximo 10 caracteres' };
    if (value && !/^[\w\-\s]*$/.test(value)) return { isValid: false, message: 'Caracteres inválidos' };
    return { isValid: true };
  }
};

export const validateAllFields = (formData: any): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.entries(addressValidators).forEach(([field, validator]) => {
    const result = validator(formData[field] || '');
    if (!result.isValid) {
      errors[field] = result.message || 'Campo inválido';
    }
  });

  return errors;
};