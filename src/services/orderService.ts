import api from './api';
import type {
  Order,
  OrderSummary,
  OrderStatus,
  OrderConfirmationDetail,
  CreateOrderData,
  CustomerData,
  CustomerValidation,
  CartValidation,
  ShipOrderData,
  UpdateOrderStatusData,
} from '@/types/order.types';
import type { CartItem } from '@/types/cart.types';

class OrderService {
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await api.post<Order>('/order', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw this.handleError(error);
    }
  }

  // Cambia el tipo de retorno:
  async getOrderById(id: number): Promise<OrderConfirmationDetail> {
    try {
      const response = await api.get<OrderConfirmationDetail>(`/order/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting order:', error);
      throw this.handleError(error);
    }
  }

  async getMyOrders(): Promise<OrderSummary[]> {
    try {
      const response = await api.get<OrderSummary[]>('/order/my-orders');
      return response.data;
    } catch (error) {
      console.error('Error getting my orders:', error);
      throw this.handleError(error);
    }
  }

  async getAllOrders(): Promise<OrderSummary[]> {
    try {
      const response = await api.get<OrderSummary[]>('/order');
      return response.data;
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw this.handleError(error);
    }
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    try {
      const response = await api.get<Order[]>(`/order/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error getting orders by status:', error);
      throw this.handleError(error);
    }
  }

  async uploadPaymentReceipt(orderId: number, file: File): Promise<Order> {
    try {
      const formData = new FormData();
      formData.append('receiptFile', file);

      const response = await api.post<Order>(`/order/${orderId}/payment-receipt`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading payment receipt:', error);
      throw this.handleError(error);
    }
  }

  async getOrdersPendingReview(): Promise<OrderSummary[]> {
    try {
      const response = await api.get<OrderSummary[]>('/order/pending-review');
      return response.data;
    } catch (error) {
      console.error('Error getting pending orders:', error);
      throw this.handleError(error);
    }
  }

  async approvePayment(orderId: number, adminNotes: string = ''): Promise<Order> {
    try {
      const response = await api.put<Order>(`/order/${orderId}/approve-payment`, {
        adminNotes
      });
      return response.data;
    } catch (error) {
      console.error('Error approving payment:', error);
      throw this.handleError(error);
    }
  }

  async rejectPayment(orderId: number, adminNotes: string): Promise<Order> {
    try {
      const response = await api.put<Order>(`/order/${orderId}/reject-payment`, {
        adminNotes
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting payment:', error);
      throw this.handleError(error);
    }
  }

  async markAsShipped(orderId: number, data: ShipOrderData): Promise<Order> {
    try {
      const response = await api.put<Order>(`/order/${orderId}/mark-shipped`, data);
      return response.data;
    } catch (error) {
      console.error('Error marking as shipped:', error);
      throw this.handleError(error);
    }
  }

  async markAsDelivered(orderId: number, adminNotes: string = ''): Promise<Order> {
    try {
      const response = await api.put<Order>(`/order/${orderId}/mark-delivered`, {
        adminNotes
      });
      return response.data;
    } catch (error) {
      console.error('Error marking as delivered:', error);
      throw this.handleError(error);
    }
  }

  // Obtiene URL del comprobante de pago
  async getPaymentReceipt(orderId: number): Promise<{ url: string }> {
    try {
      const response = await api.get<{ url: string }>(`/order/${orderId}/payment-receipt`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment receipt:', error);
      throw this.handleError(error);
    }
  }

  async updateOrderStatus(orderId: number, data: UpdateOrderStatusData): Promise<Order> {
    try {
      const response = await api.put<Order>(`/order/${orderId}/status`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    return new Error('Error de conexión. Intenta nuevamente.');
  }

  // Formatea datos de orden para el API
  formatOrderData(
    cartItems: CartItem[],
    customerData: CustomerData,
    selectedAddressId: number,
    receiverData?: {
      firstName: string;
      lastName: string;
      dni: string;
      phone: string;
    }
  ): Omit<CreateOrderData, 'paymentMethod'> {
    return {
      customerName: customerData.name,
      shippingAddressId: selectedAddressId,
      // Datos del receptor (si se proporcionan)
      receiverFirstName: receiverData?.firstName,
      receiverLastName: receiverData?.lastName,
      receiverDni: receiverData?.dni,
      receiverPhone: receiverData?.phone,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };
  }

  // Calcula total (útil para validaciones del frontend)
  calculateTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Valida datos del cliente
  validateCustomerData(customerData: CustomerData): CustomerValidation {
    const errors: Record<string, string> = {};

    // Valida nombre
    if (!customerData.name?.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (customerData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (customerData.name.trim().length > 100) {
      errors.name = 'El nombre no puede exceder 100 caracteres';
    } else if (!/^[a-zA-ZáéíóúñÁÉÍÓÚÑüÜ\s\-\.]+$/.test(customerData.name.trim())) {
      errors.name = 'El nombre solo puede contener letras, espacios, guiones y puntos';
    }

    // Valida email
    if (!customerData.email?.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      errors.email = 'El email no es válido';
    }

    // Valida teléfono 
    if (customerData.phone?.trim()) {
      const phone = customerData.phone.trim();

      // Debe tener entre 8 y 20 caracteres
      if (phone.length < 8 || phone.length > 20) {
        errors.phone = 'El teléfono debe tener entre 8 y 20 caracteres';
      }
      // Solo puede contener números, espacios, guiones, paréntesis y el signo +
      else if (!/^[\d\s\-\+\(\)]{8,20}$/.test(phone)) {
        errors.phone = 'Formato de teléfono inválido. Ej: +54 11 1234-5678 o 1234567890';
      }
      // No puede tener solo números repetidos
      else if (/^(\d)\1+$/.test(phone.replace(/[\s\-\+\(\)]/g, ''))) {
        errors.phone = 'El teléfono no puede tener solo números repetidos';
      }
      // No puede ser muy largo sin espacios/guiones
      else {
        const digitsOnly = phone.replace(/[\s\-\+\(\)]/g, '');
        if (digitsOnly.length > 15) {
          errors.phone = 'El teléfono tiene demasiados dígitos';
        } else if (digitsOnly.length < 7) {
          errors.phone = 'El teléfono debe tener al menos 7 dígitos';
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Valida carrito antes del checkout
  validateCart(cartItems: CartItem[]): CartValidation {
    if (!cartItems || cartItems.length === 0) {
      return {
        isValid: false,
        message: 'El carrito está vacío'
      };
    }

    for (const item of cartItems) {
      if (item.quantity <= 0) {
        return {
          isValid: false,
          message: `Cantidad inválida para ${item.name}`
        };
      }

      if (item.quantity > item.stock) {
        return {
          isValid: false,
          message: `Stock insuficiente para ${item.name}. Disponible: ${item.stock}`
        };
      }
    }

    return {
      isValid: true,
      message: 'Carrito válido'
    };
  }

  // Formatea fecha para mostrar
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // Formatea precio
  formatPrice(price: number | undefined | null): string {
    if (price == null) return '0';
    return Math.round(parseFloat(price.toString())).toLocaleString('es-AR');
  }

  getStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      'pending_payment': 'text-yellow-600 bg-yellow-50',
      'payment_submitted': 'text-blue-600 bg-blue-50',
      'payment_approved': 'text-green-600 bg-green-50',
      'payment_rejected': 'text-red-600 bg-red-50',
      'shipped': 'text-purple-600 bg-purple-50',
      'delivered': 'text-green-700 bg-green-100',
      'cancelled': 'text-red-600 bg-red-50',
      'pending': 'text-yellow-600 bg-yellow-50',
      'completed': 'text-green-600 bg-green-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  }

  getStatusText(status: OrderStatus): string {
    const texts: Record<OrderStatus, string> = {
      'pending_payment': 'Esperando comprobante',
      'payment_submitted': 'Comprobante en revisión',
      'payment_approved': 'Pago aprobado',
      'payment_rejected': 'Comprobante rechazado',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado',
      'pending': 'Pendiente',
      'completed': 'Completada'
    };
    return texts[status] || status;
  }

  getStatusDescription(status: OrderStatus): string {
    const descriptions: Record<OrderStatus, string> = {
      'pending_payment': 'Adjunta tu comprobante de pago para continuar',
      'payment_submitted': 'Estamos revisando tu comprobante de pago',
      'payment_approved': 'Tu pago fue aprobado. Preparando envío',
      'payment_rejected': 'Tu comprobante fue rechazado. Intenta nuevamente',
      'shipped': 'Tu pedido está en camino',
      'delivered': 'Tu pedido fue entregado exitosamente',
      'cancelled': 'Esta orden fue cancelada',
      'pending': '',
      'completed': ''
    };
    return descriptions[status] || '';
  }

  canUploadReceipt(status: OrderStatus): boolean {
    return status === 'pending_payment' || status === 'payment_rejected';
  }

  canAdminModify(status: OrderStatus): boolean {
    return ['payment_submitted', 'payment_approved', 'shipped'].includes(status);
  }

  async downloadReceipt(orderId: number): Promise<boolean> {
    try {
      const response = await api.get(`/order/${orderId}/download-receipt`, {
        responseType: 'blob' // ← Importante para archivos
      });

      // Crear descarga automática
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprobante_orden_${orderId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error downloading receipt:', error);
      throw error;
    }
  }

  async getReceiptViewUrl(orderId: number): Promise<string> {
    try {
      // El endpoint /view-receipt usa la cookie httpOnly automáticamente
      return `${api.defaults.baseURL}/order/${orderId}/view-receipt`;
    } catch (error) {
      throw error;
    }
  }

  async cancelOrder(orderId: number): Promise<void> {
    try {
      const response = await api.delete(`/order/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw this.handleError(error);
    }
  }

  canCancelOrder(status: OrderStatus): boolean {
    return status === 'pending_payment' || status === 'payment_rejected';
  }

  // MercadoPago integration
  async createMercadoPagoPayment(orderId: number, backUrl: string): Promise<{
    preferenceId: string;
    initPoint: string;
    sandboxInitPoint: string;
  }> {
    try {
      const response = await api.post(`/Payment/mercadopago/create`, {
        orderId,
        backUrl
      });
      return response.data;
    } catch (error) {
      console.error('Error creating MercadoPago payment:', error);
      throw this.handleError(error);
    }
  }

  redirectToMercadoPago(paymentResponse: { initPoint: string; sandboxInitPoint: string }): void {
    // PRODUCCIÓN: Pagos reales con límite de ARS $500 para demostración
    const checkoutUrl = paymentResponse.initPoint;

    window.location.href = checkoutUrl;
  }

  canPayWithMercadoPago(status: OrderStatus): boolean {
    return status === 'pending_payment' || status === 'payment_rejected';
  }
}

export const orderService = new OrderService();