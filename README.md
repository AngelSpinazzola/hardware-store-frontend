# 🛒 NovaTech Store — Frontend

E-commerce moderno para la venta de componentes de hardware para PC, desarrollado con **React 19**, **TypeScript** y **Vite**.

![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/React%20Query-5.90-FF4154?logo=react-query&logoColor=white)

🔗 **Demo en vivo:** [novatech-store.vercel.app](https://novatech-store.vercel.app)
🔗 **Backend (API):** [Repositorio del Backend](https://github.com/AngelSpinazzola/hardware-store-backend-api)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Integraciones](#-integraciones)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Testing](#-testing)
- [Optimizaciones](#-optimizaciones)
- [Seguridad](#-seguridad)

---

## ✨ Características

### Para clientes
- 🔍 **Búsqueda y filtros avanzados** — por texto, categoría jerárquica, marca, plataforma, rango de precio y stock
- 🛍️ **Carrito persistente** en `localStorage` con validación de stock
- 🔐 **Autenticación dual** — JWT tradicional + Google OAuth 2.0
- 🏠 **Múltiples direcciones de envío** — ABM con las 24 provincias argentinas y receptor autorizado (DNI, teléfono)
- 💳 **Dos métodos de pago** — MercadoPago (redirección a checkout oficial) o transferencia bancaria con upload de comprobante
- 📦 **Seguimiento de órdenes** — timeline de estados, tracking y proveedor de envío
- 📄 **Factura descargable** y perfil de usuario editable
- 📱 **Responsive design** — optimizado para mobile, tablet y desktop

### Para administradores
- 📊 **Dashboard analítico** — KPIs de ventas, órdenes e ingresos en tiempo real
- 📈 **Analytics interactivos** — gráficos de ventas por período, top productos, ventas por categoría y órdenes por estado
- 📝 **Gestión de productos** — CRUD completo con upload múltiple, compresión client-side y reordenamiento de imágenes
- 📦 **Gestión de órdenes** — aprobación/rechazo de comprobantes, marcado de envíos con tracking, cancelaciones
- 👥 **Rutas protegidas por rol** — separación entre cliente y admin

---

## 🚀 Tecnologías

### Core
- **React 19.1** — UI library con las últimas features (concurrent rendering, transitions)
- **TypeScript 5.9** — type safety con modo strict
- **Vite 7.0** — build tool ultra-rápido con HMR

### Estado y datos
- **TanStack React Query 5.90** — server state management con caching inteligente
- **React Context API** + `useReducer` — estado global (Auth, Cart)
- **React Router DOM 7.6** — routing y navegación

### UI y estilos
- **Tailwind CSS 3.4** — utility-first CSS framework
- **Headless UI 2.2** — componentes accesibles sin estilos
- **Heroicons** + **React Icons** — íconos SVG
- **Flowbite React** — componentes UI adicionales
- **Swiper** — carruseles touch-friendly

### Visualización de datos
- **ApexCharts 5.3** + **Recharts** — gráficos interactivos para el dashboard

### Autenticación y pagos
- **@react-oauth/google** — Google OAuth 2.0
- **JWT** — tokens enviados vía cookies httpOnly
- **MercadoPago API** — pasarela de pagos integrada

### Utilidades
- **Axios 1.10** — cliente HTTP con interceptores
- **browser-image-compression** — compresión de imágenes client-side
- **SweetAlert2** — diálogos elegantes
- **react-toastify** — notificaciones toast
- **lodash** — utilidades funcionales

### Testing
- **Vitest 4.0** — framework de testing ultra-rápido
- **React Testing Library** — testing centrado en el usuario
- **jsdom** — DOM implementation para tests

---

## 🔌 Integraciones

- **💳 MercadoPago API** — integración completa con la pasarela de pagos
- **🌐 Google OAuth 2.0** — autenticación con cuentas de Google
- **🔐 JWT Authentication** — tokens en cookies httpOnly
- **📊 REST API** — consumo con Axios y TanStack React Query

---

## 📁 Estructura del Proyecto

```
frontend/
├── public/                      # Archivos estáticos
│   └── images/
│       └── categories/          # Imágenes de categorías (WebP optimizado)
├── src/
│   ├── assets/                  # Logos e imágenes del código
│   ├── components/              # Componentes React por dominio
│   │   ├── Auth/               # Login, registro, Google OAuth
│   │   ├── Cart/               # Carrito y checkout
│   │   ├── Checkout/           # Flujo de compra
│   │   ├── Common/             # NavBar, Footer, ProtectedRoute
│   │   ├── Home/               # Hero, carrusel, categorías
│   │   ├── Orders/             # Tarjetas, timeline, upload
│   │   ├── Products/           # Grid, filtros, galería
│   │   └── ...
│   ├── config/                 # Configuraciones centralizadas
│   ├── context/                # Estado global
│   │   ├── AuthContext.tsx
│   │   └── CartContext/        # Modularizado: reducer, storage, validations
│   ├── hooks/                  # Custom hooks (14+)
│   ├── pages/                  # Páginas y rutas
│   │   ├── Admin/             # Dashboard, Products, Orders, Analytics
│   │   ├── Home.tsx
│   │   ├── ProductsPage.tsx
│   │   └── ...
│   ├── services/              # Capa de API (authService, productService, etc.)
│   ├── types/                 # Definiciones TypeScript
│   ├── utils/                 # Funciones utilitarias
│   ├── test/                  # Configuración de testing
│   ├── App.tsx                # Componente raíz con routing
│   └── main.tsx               # Entry point
├── .env.example               # Template de variables de entorno
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── vitest.config.ts
```

---

## 🏗️ Arquitectura

Arquitectura **en capas** con separación estricta de responsabilidades:

- **Presentación** — componentes organizados por dominio
- **Estado** — Context API + `useReducer` (global) y React Query (server state)
- **Servicios** — abstracciones de API con Axios
- **Hooks** — lógica reutilizable encapsulada
- **Tipos** — TypeScript strict por dominio

### Patrones aplicados
- ✅ **Context + Reducer Pattern** — para estado global
- ✅ **Custom Hooks Pattern** — encapsulación de lógica
- ✅ **Service Layer Pattern** — abstracciones de API
- ✅ **Protected Routes** — control de acceso por roles
- ✅ **Compound Components** — descomposición de componentes complejos

### State management
```
┌─────────────────────────┐
│  Local State (useState) │ → UI, formularios
├─────────────────────────┤
│  Context API            │ → Auth, Cart
├─────────────────────────┤
│  React Query            │ → Server state, caching
├─────────────────────────┤
│  URL State              │ → Filtros, paginación
└─────────────────────────┘
```

---

## 📦 Requisitos Previos

- **Node.js** ≥ 18
- **npm** ≥ 9 (o pnpm / yarn)
- Backend corriendo en local (ver [repositorio del backend](https://github.com/AngelSpinazzola/hardware-store-backend-api))
- **Google OAuth Client ID** — [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

---

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/AngelSpinazzola/hardware-store-frontend.git
cd hardware-store-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Levantar el servidor de desarrollo
npm run dev
```

La app estará disponible en [http://localhost:5173](http://localhost:5173).

---

## ⚙️ Configuración

Copiar `.env.example` a `.env.local` y completar:

```env
# URL base de la API del backend
VITE_API_BASE_URL=http://localhost:10000/api

# Google OAuth Client ID
# Obtener en: https://console.cloud.google.com/apis/credentials
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 📜 Scripts Disponibles

```bash
npm run dev           # Servidor de desarrollo (http://localhost:5173)
npm run dev:local     # Servidor de desarrollo con modo development explícito
npm run build         # Build de producción
npm run build:local   # Build en modo development
npm run preview       # Preview del build
npm run lint          # Linter (ESLint)
npm run test          # Ejecutar tests
npm run test:watch    # Tests en modo watch
npm run test:ui       # UI interactiva de Vitest
npm run test:coverage # Reporte de cobertura
```

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Modo watch
npm run test:watch

# UI interactiva
npm run test:ui

# Cobertura
npm run test:coverage
```

Estructura de tests:
```
src/
├── components/
│   └── Common/
│       └── QuantitySelector.test.tsx
└── test/
    ├── setup.ts
    └── vitest.d.ts
```

---

## ⚡ Optimizaciones

### Performance
- ✅ **Code splitting** manual por chunks (vendor, router, UI, charts, utils)
- ✅ **Lazy loading** de componentes y rutas
- ✅ **Image optimization** — WebP + compresión client-side
- ✅ **React Query** — caching inteligente de datos del servidor
- ✅ **Debouncing** en filtros y búsqueda (300ms)
- ✅ **Memoization** — `useMemo` y `useCallback` en operaciones costosas

### SEO y accesibilidad
- ✅ Meta tags dinámicos
- ✅ HTML semántico
- ✅ ARIA labels en componentes interactivos
- ✅ Keyboard navigation

---

## 🛡️ Seguridad

- ✅ **JWT Authentication** en cookies httpOnly (mitigación XSS)
- ✅ **Google OAuth 2.0** — flujo seguro con ID tokens
- ✅ **Protected Routes** — control de acceso por roles
- ✅ **Input sanitization** — validación de formularios
- ✅ **HTTPS only** en producción
- ✅ **Integración segura con MercadoPago** — sin manejo directo de datos sensibles

---

## 👤 Autor

**Angel Spinazzola**

- GitHub: [@AngelSpinazzola](https://github.com/AngelSpinazzola)

---

⭐️ Si este proyecto te resultó útil, considera darle una estrella en GitHub.
