import { useState } from 'react';
import { useProducts } from './useProducts';
import AdminLayout from '../Layout/AdminLayout';
import ProductsStats from './ProductsStats';
import ProductsTable from './ProductsTable';
import ProductForm from '../../../components/Products/ProductForm';
import { ProductDetail, ProductSummary } from '../../../types/product.types';

export default function ProductManagement() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductDetail | null>(null);
    const [updatedProductId, setUpdatedProductId] = useState<number | null>(null);

    const {
        products,
        loading,
        error,
        categories,
        handleDeleteProduct,
        getProductById
    } = useProducts();

    const handleEditProduct = async (product: ProductSummary) => {
        try {
            const fullProduct = await getProductById(product.id);
            setEditingProduct(fullProduct);
            setShowCreateForm(true);
        } catch (error) {
            console.error('Error loading product for edit:', error);
            alert('Error al cargar el producto');
        }
    };

    const handleCreateNew = () => {
        setEditingProduct(null);
        setShowCreateForm(true);
    };

    // ProductForm ya invalida el cache, React Query refetch automáticamente
    const handleFormClose = () => {
        setShowCreateForm(false);
        setEditingProduct(null);
    };

    const handleFormSuccess = (productId?: number) => {
        setShowCreateForm(false);
        setEditingProduct(null);

        if (productId) {
            setUpdatedProductId(productId);
            setTimeout(() => setUpdatedProductId(null), 2000);
        }
    };

    const handleFormCancel = () => {
        setShowCreateForm(false);
        setEditingProduct(null);
    };

    if (loading) {
        return (
            <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando productos...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                <div className="text-center py-12">
                    <div className="text-red-600 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar productos</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            {/* Header con botón crear */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
                    <p className="text-gray-600 mt-1">Administra el catálogo de productos</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Crear Producto
                </button>
            </div>

            {/* Stats Cards */}
            <ProductsStats products={products} />

            {/* Tabla de productos */}
            <ProductsTable
                products={products}
                categories={categories}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                updatedProductId={updatedProductId}
            />

            {/* Modal para crear/editar producto */}
            {showCreateForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={handleFormClose}
                        ></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
                                    </h3>
                                    <button
                                        onClick={handleFormClose}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <ProductForm
                                    product={editingProduct}
                                    onSuccess={handleFormSuccess}
                                    onCancel={handleFormCancel}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}