# 🛒 Hardware Store - Frontend

E-commerce moderno para venta de componentes de hardware para PC, desarrollado con React, TypeScript y Vite.

## 🔑 Integraciones Principales

- **💳 MercadoPago API** - Integración completa con pasarela de pagos de MercadoPago
- **🔐 JWT Authentication** - Sistema de autenticación basado en JSON Web Tokens
- **🌐 Google OAuth 2.0** - Autenticación con cuentas de Google (@react-oauth/google)
- **📊 REST API Backend** - Consumo de API RESTful con Axios y TanStack React Query

## 📋 Tabla de Contenidos

- [Integraciones Principales](#-integraciones-principales)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
  - [Arquitectura](#arquitectura)
  - [Patrones de Diseño](#patrones-de-diseño)
  - [State Management](#state-management)
- [Testing](#-testing)
- [Optimizaciones Aplicadas](#-optimizaciones-aplicadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Scripts Disponibles](#-scripts-disponibles)

## ✨ Características

### Para Usuarios
- 🔍 **Búsqueda y Filtros Avanzados** - Búsqueda por texto, categoría, marca, precio y más
- 🛍️ **Carrito de Compras** - Gestión completa del carrito con persistencia en localStorage
- 🔐 **Autenticación Segura** - Sistema JWT + Google OAuth 2.0 para login tradicional o con cuenta de Google
- 📦 **Gestión de Órdenes** - Seguimiento completo de pedidos y estado de envío
- 💳 **Pasarela de Pagos MercadoPago** - Procesamiento de pagos con MercadoPago API + opción de transferencia bancaria
- 📱 **Responsive Design** - Experiencia optimizada para mobile, tablet y desktop
- 🎨 **UI Moderna** - Interfaz limpia con Tailwind CSS

### Para Administradores
- 📊 **Dashboard Analítico** - Métricas de ventas, productos top y estadísticas en tiempo real
- 📝 **Gestión de Productos** - CRUD completo con carga de imágenes y compresión automática
- 📦 **Gestión de Órdenes** - Administración de estados de pedidos, comprobantes de pago y tracking
- 👥 **Control de Usuarios** - Administración de roles (admin/user) con rutas protegidas
- 📈 **Analytics** - Gráficos interactivos con ApexCharts y Recharts
- 🖼️ **Optimización de Imágenes** - Compresión automática de imágenes con browser-image-compression

## 🚀 Tecnologías

### Core
- **React 19.1.0** 
- **TypeScript 5.9.2** 
- **Vite 7.0.4**

### Estado y Datos
- **TanStack React Query 5.90.6** - Server state management con caching inteligente
- **React Context API** - Estado global (Auth, Cart)
- **React Router DOM 7.6.3** - Routing y navegación

### UI y Estilos
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Headless UI 2.2.7** - Componentes accesibles sin estilos
- **Heroicons 2.2.0** - Íconos SVG
- **Flowbite React 0.12.9** - Componentes UI adicionales
- **Swiper** - Carruseles touch-friendly

### Visualización de Datos
- **ApexCharts 5.3.5** - Gráficos interactivos
- **Recharts** - Gráficos alternativos

### Autenticación y Pagos
- **@react-oauth/google 0.12.2** - Google OAuth 2.0 integration
- **JWT (JSON Web Tokens)** - Sistema de autenticación con tokens
- **MercadoPago API** - Pasarela de pagos integrada

### Utilities
- **Axios 1.10.0** - Cliente HTTP
- **browser-image-compression 2.0.2** - Compresión de imágenes del lado del cliente
- **SweetAlert2** - Diálogos y alertas elegantes
- **react-toastify** - Notificaciones toast

### Testing
- **Vitest 4.0.15** - Framework de testing
- **React Testing Library** - Testing de componentes
- **jsdom** - DOM implementation para tests

## 📁 Estructura del Proyecto

```
frontend/
├── public/                      # Archivos estáticos
│   └── images/
│       └── categories/          # Imágenes de categorías (optimizadas WebP)
├── src/
│   ├── assets/                  # Assets (logos, imágenes del código)
│   ├── components/              # Componentes React
│   │   ├── Auth/               # Componentes de autenticación
│   │   ├── Cart/               # Componentes del carrito
│   │   ├── Checkout/           # Flujo de checkout
│   │   ├── Common/             # Componentes compartidos (NavBar, Footer)
│   │   ├── Home/               # Componentes de página inicio
│   │   ├── Orders/             # Componentes de órdenes
│   │   ├── Products/           # Grid, filtros y componentes de productos
│   │   └── ...                 # Otros componentes por dominio
│   ├── config/                 # Configuraciones centralizadas
│   │   ├── constants.ts        # Constantes de la app
│   │   ├── productsConfig.ts   # Config de productos
│   │   └── subcategories.ts    # Config de subcategorías
│   ├── context/                # React Context (estado global)
│   │   ├── AuthContext.tsx     # Contexto de autenticación
│   │   └── CartContext/        # Contexto del carrito (modularizado)
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useAuth.ts         # Hook de autenticación
│   │   ├── useCart.ts         # Hook del carrito
│   │   ├── useProductFilters.ts # Filtros de productos
│   │   └── ...                # 14+ hooks especializados
│   ├── pages/                  # Páginas/Rutas principales
│   │   ├── Admin/             # Páginas administrativas
│   │   ├── Home.tsx           # Página de inicio
│   │   ├── ProductsPage.tsx   # Listado de productos
│   │   └── ...                # Otras páginas
│   ├── services/              # Capa de servicios (API calls)
│   │   ├── api.ts            # Configuración de Axios
│   │   ├── authService.ts    # Servicios de autenticación
│   │   ├── productService.ts # Servicios de productos
│   │   └── ...               # Otros servicios
│   ├── types/                 # Definiciones de TypeScript
│   │   ├── index.ts          # Barrel exports
│   │   ├── product.types.ts  # Tipos de productos
│   │   ├── user.types.ts     # Tipos de usuario
│   │   └── ...               # Otros tipos
│   ├── utils/                 # Funciones utilitarias
│   ├── test/                  # Configuración de testing
│   ├── App.tsx               # Componente raíz con routing
│   ├── main.tsx              # Entry point
│   └── index.css             # Estilos globales
├── .env.example              # Template de variables de entorno
├── .gitignore               # Archivos ignorados por Git
├── index.html               # HTML principal
├── package.json             # Dependencias y scripts
├── tsconfig.json            # Configuración de TypeScript
├── vite.config.ts           # Configuración de Vite
└── vitest.config.ts         # Configuración de Vitest
```

### Arquitectura

El proyecto sigue una **arquitectura por capas** con separación clara de responsabilidades:

- **Capa de Presentación**: Componentes React organizados por dominio
- **Capa de Estado**: Context API con reducers + React Query para server state
- **Capa de Servicios**: Abstracciones de API con Axios
- **Capa de Hooks**: Lógica reutilizable encapsulada
- **Capa de Tipos**: TypeScript strict para type safety

### Principios Aplicados

- ✅ **SOLID** - Single Responsibility, Open/Closed, Dependency Inversion
- ✅ **DRY** - Don't Repeat Yourself
- ✅ **Separation of Concerns** - Componentes, lógica y datos separados
- ✅ **TypeScript Strict Mode** - Type safety completo

### Patrones de Diseño

- **Context + Reducer Pattern** - Para estado global (Auth, Cart)
- **Custom Hooks Pattern** - Encapsulación de lógica reutilizable
- **Service Layer Pattern** - Abstracciones de API
- **Compound Components** - Componentes complejos descompuestos
- **Protected Routes** - Control de acceso por roles

### Convenciones de Código

- **Componentes**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useProductFilters.ts`)
- **Services**: camelCase (`authService.ts`)
- **Tipos**: PascalCase (`User`, `Product`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### State Management

```
┌─────────────────────────┐
│  Local State (useState) │ → UI state, formularios
├─────────────────────────┤
│  Context API            │ → Auth, Cart (estado global)
├─────────────────────────┤
│  React Query            │ → Server state, caching
├─────────────────────────┤
│  URL State              │ → Filtros, paginación
└─────────────────────────┘
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests con UI interactiva
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test -- --watch

# Ejecutar un test específico
npm run test -- ProductCard.test.tsx
```

### Estructura de Tests

```
src/
├── components/
│   └── Common/
│       └── QuantitySelector.test.tsx
└── test/
    ├── setup.ts              # Configuración global de tests
    └── vitest.d.ts           # Tipos de Vitest
```

## 📝 Optimizaciones Aplicadas

### Performance
- ✅ **Code Splitting** - Chunks manuales por vendor, router, UI
- ✅ **Lazy Loading** - Componentes y rutas cargados bajo demanda
- ✅ **Image Optimization** - WebP format, compresión automática client-side
- ✅ **React Query** - Para guardado en cache
- ✅ **Debouncing** - En filtros y búsqueda (300ms)
- ✅ **Memoization** - `useMemo` y `useCallback` en operaciones costosas

### SEO y Accesibilidad
- ✅ **Meta tags** - Título y descripción dinámicos
- ✅ **Semantic HTML** - Uso correcto de etiquetas semánticas
- ✅ **ARIA labels** - Para componentes interactivos
- ✅ **Keyboard navigation** - Soporte completo de teclado

### Seguridad
- ✅ **JWT Authentication** - Tokens de autenticación con expiración automática
- ✅ **Google OAuth 2.0** - Autenticación segura mediante Google
- ✅ **Protected Routes** - Control de acceso basado en roles (admin/user)
- ✅ **XSS Protection** - Sanitización de inputs del usuario
- ✅ **Secure Payment Flow** - Integración segura con MercadoPago API
- ✅ **HTTPS Only** - Comunicación encriptada en producción


⭐️ Si este proyecto te resultó útil, considera darle una estrella en GitHub
