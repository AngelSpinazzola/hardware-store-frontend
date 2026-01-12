// Dirección de envío
export interface ShippingAddress {
  id: number;
  addressType: 'Casa' | 'Trabajo';
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  tower?: string;
  postalCode: string;
  province: string;
  city: string;
  betweenStreets?: string;
  observations?: string;
  authorizedPersonFirstName: string;
  authorizedPersonLastName: string;
  authorizedPersonPhone: string;
  authorizedPersonDni: string;
  isDefault?: boolean;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Datos para crear/actualizar dirección
export interface CreateAddressData {
  addressType: 'Casa' | 'Trabajo';
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  tower?: string;
  postalCode: string;
  province: string;
  city: string;
  betweenStreets?: string;
  observations?: string;
  authorizedPersonFirstName: string;
  authorizedPersonLastName: string;
  authorizedPersonPhone: string;
  authorizedPersonDni: string;
}

export interface ReceiverData {
  firstName: string;
  lastName: string;
  phone: string;
  dni: string;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {}

// Validación de dirección
export interface AddressValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// Dirección formateada para mostrar
export interface FormattedAddress {
  line1: string;
  line2: string | null;
  city: string;
  province: string;
  postalCode: string;
  betweenStreets?: string;
  observations?: string;
  receiver: string;
  receiverPhone: string;
  receiverDni: string;
}

// Opciones para selects
export interface SelectOption {
  value: string;
  label: string;
}