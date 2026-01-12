import type { ShippingAddress } from './address.types';

// Estados de orden
export type OrderStatus = 
  | 'pending_payment'
  | 'payment_submitted' 
  | 'payment_approved'
  | 'payment_rejected'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'pending'
  | 'completed';

// Item de orden
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productImageUrl?: string;
}

// Orden completa
export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  paymentReceiptUrl?: string;
  paymentMethod?: string;
  trackingNumber?: string;
  shippingProvider?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  userId?: number;
  expiresAt?: string;
}

// Extender OrderItem para incluir subtotal
export interface OrderItemWithSubtotal extends OrderItem {
  subtotal: number;
}

export interface OrderConfirmationDetail extends Order {
  total: number; // alias de totalAmount
  authorizedPersonFirstName: string;
  authorizedPersonLastName: string;
  authorizedPersonDni: string;
  authorizedPersonPhone: string;
  shippingStreet: string;
  shippingNumber: string;
  shippingFloor?: string;
  shippingApartment?: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostalCode: string;
  shippingObservations?: string;
  orderItems: OrderItemWithSubtotal[];
  paymentMethod?: string;
  paymentSubmittedAt?: string;
  paymentApprovedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrderSummary {
  id: number;
  userId?: number;
  customerName: string;
  customerEmail?: string;
  total: number;
  status: OrderStatus;
  statusDescription: string;
  hasPaymentReceipt: boolean;
  paymentReceiptUrl?: string;
  paymentReceiptUploadedAt?: string;
  trackingNumber?: string;
  createdAt: string;
  itemsCount: number;
  shippingCity?: string;
  shippingProvince?: string;
}


export interface CreateOrderData {
  customerName: string;
  shippingAddressId: number;
  // Datos del receptor
  receiverFirstName?: string;
  receiverLastName?: string;
  receiverDni?: string;
  receiverPhone?: string;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  paymentMethod: 'bank_transfer' | 'mercadopago';
}

// Datos del cliente para checkout
export interface CustomerData {
  name: string;
  email: string;
  phone?: string;
}

// Validación de datos del cliente
export interface CustomerValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// Validación del carrito
export interface CartValidation {
  isValid: boolean;
  message: string;
}

// Acciones de admin
export interface AdminActionData {
  adminNotes?: string;
}

export interface ShipOrderData extends AdminActionData {
  trackingNumber: string;
  shippingProvider: string;
}

export interface UpdateOrderStatusData extends AdminActionData {
  status: OrderStatus;
}

// Información de estados
export interface StatusInfo {
  color: string;
  text: string;
  description: string;
}