// Barrel exports para tipos
export type { ApiResponse, ApiError, ApiConfig } from './api.types';

export type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  UpdateProfileData, 
  AuthResponse, 
  AuthState, 
  AuthAction, 
  AuthContextType 
} from './user.types';

export type {
  Product,
  CartItem,
  CartState,
  CartStorageData,
  CartAction,
  ToastOptions,
  ToastCategory,
  CartContextType
} from './cart.types';

export type {
  ShippingAddress,
  CreateAddressData,
  UpdateAddressData,
  AddressValidation,
  FormattedAddress,
  SelectOption
} from './address.types';

export type {
  OrderStatus,
  OrderItem,
  OrderItemWithSubtotal,
  Order,
  OrderConfirmationDetail,
  OrderSummary,
  CreateOrderData,
  CustomerData,
  CustomerValidation,
  CartValidation,
  AdminActionData,
  ShipOrderData,
  UpdateOrderStatusData,
  StatusInfo
} from './order.types';

export type {
  ProductImage,
  ProductDetail,
  ProductSummary,
  ProductListResponse,
  CreateProductData,
  UpdateProductData,
  AddImageData,
  ProductFilters,
  ImageOrder,
  ProductStats,
  MenuItem
} from './product.types';

export type {
  ProductForCategory,
  Subcategory,
  CategoryWithSubcategories,
  TempCategoryStructure,
  SubcategoryRule
} from './category.types';

// Hooks
export type {
  ProductFiltersState,
  ProductFiltersActions,
  UseProductFiltersReturn
} from '../hooks/useProductFilters';