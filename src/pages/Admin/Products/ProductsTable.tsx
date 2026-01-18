import { useState } from 'react';
import { productService } from '../../../services/productService';
import { ProductSummary, ProductStatus } from '../../../types/product.types';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ProductsTableProps {
    products: ProductSummary[];
    categories: string[];
    onEdit: (product: ProductSummary) => void;
    onDelete: (productId: number, productName: string) => void;
    updatedProductId?: number | null;
}

export default function ProductsTable({ products, categories, onEdit, onDelete, updatedProductId }: ProductsTableProps) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedStock, setSelectedStock] = useState<string>('');

    // Filtrar productos
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.categoryName === selectedCategory;
        const matchesStatus =
            !selectedStatus ||
            (selectedStatus === 'active' && product.status === ProductStatus.Active) ||
            (selectedStatus === 'inactive' && product.status === ProductStatus.Inactive);
        const matchesStock =
            !selectedStock ||
            (selectedStock === 'low' && product.stock < 10) ||
            (selectedStock === 'medium' && product.stock >= 10 && product.stock <= 50) ||
            (selectedStock === 'high' && product.stock > 50);

        return matchesSearch && matchesCategory && matchesStatus && matchesStock;
    });

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, _productId?: number) => {
        e.currentTarget.src = 'https://via.placeholder.com/150?text=Sin+Imagen';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Filtros */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="relative sm:col-span-2 lg:col-span-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Todos los estados</option>
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                        </select>
                    </div>
                    <div>
                        <select
                            value={selectedStock}
                            onChange={(e) => setSelectedStock(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Todos los stocks</option>
                            <option value="low">Stock bajo (&lt; 10)</option>
                            <option value="medium">Stock medio (10-50)</option>
                            <option value="high">Stock alto (&gt; 50)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Contenido */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || selectedCategory
                            ? 'No se encontraron productos con los filtros aplicados'
                            : 'Comienza creando un nuevo producto'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Vista Desktop - Tabla */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-3 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="px-3 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Precio
                                    </th>
                                    <th className="px-3 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-3 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-3 xl:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className={`transition-colors duration-300 ${
                                            updatedProductId === product.id
                                                ? 'bg-green-50'
                                                : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <td className="px-3 xl:px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 xl:h-12 xl:w-12">
                                                    <img
                                                        className="h-10 w-10 xl:h-12 xl:w-12 rounded-lg object-contain"
                                                        src={productService.getImageUrl(product.mainImageUrl)}
                                                        alt={product.name}
                                                        onError={(e) => handleImageError(e, product.id)}
                                                    />
                                                </div>
                                                <div className="ml-2 xl:ml-4 max-w-[150px] xl:max-w-xs">
                                                    <div className="text-sm font-medium text-gray-900 truncate" title={product.name}>
                                                        {product.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 xl:px-6 py-4">
                                            <span className="inline-flex items-center px-2 xl:px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                                {product.categoryName}
                                            </span>
                                        </td>
                                        <td className="px-3 xl:px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                            ${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-3 xl:px-6 py-4">
                                            <span className={`inline-flex items-center px-2 xl:px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                                                product.stock > 10
                                                    ? 'bg-green-100 text-green-700'
                                                    : product.stock > 0
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-3 xl:px-6 py-4">
                                            <span className={`inline-flex items-center px-2 xl:px-2.5 py-1 rounded-md text-xs font-medium ${
                                                product.status === ProductStatus.Active
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {product.status === ProductStatus.Active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-3 xl:px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end gap-1 xl:gap-2">
                                                <button
                                                    onClick={() => onEdit(product)}
                                                    className="p-1.5 xl:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(product.id, product.name)}
                                                    className="p-1.5 xl:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Vista Mobile - Cards */}
                    <div className="md:hidden divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className={`p-4 transition-colors duration-300 ${
                                    updatedProductId === product.id ? 'bg-green-50' : ''
                                }`}
                            >
                                <div className="flex gap-4">
                                    <img
                                        className="h-20 w-20 rounded-lg object-contain flex-shrink-0"
                                        src={productService.getImageUrl(product.mainImageUrl)}
                                        alt={product.name}
                                        onError={(e) => handleImageError(e, product.id)}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-gray-900 mb-2 truncate" title={product.name}>
                                            {product.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                                {product.categoryName}
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                                product.status === ProductStatus.Active
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {product.status === ProductStatus.Active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    ${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                                </p>
                                                <p className={`text-xs mt-1 ${
                                                    product.stock > 10
                                                        ? 'text-green-600'
                                                        : product.stock > 0
                                                        ? 'text-yellow-600'
                                                        : 'text-red-600'
                                                }`}>
                                                    {product.stock} unidades
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onEdit(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(product.id, product.name)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}