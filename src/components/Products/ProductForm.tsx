import { ProductDetail } from '@/types/product.types';
import ImageManager from '../Products/ImageManager';
import FormInput from '@/components/Forms/FormInput';
import PriceInput from '@/components/Forms/PriceInput';
import CategorySelector from '@/components/Forms/CategorySelector';
import BrandSelector from '@/components/Forms/BrandSelector';
import PlatformSelector from '@/components/Forms/PlatformSelector';
import { useProductForm } from '@/hooks/useProductForm';
import { useProductFormData } from '@/hooks/useProductFormData';

interface ProductFormProps {
    product?: ProductDetail | null;
    onSuccess?: (productId?: number) => void;
    onCancel: () => void;
}

const ProductForm = ({ product, onSuccess, onCancel }: ProductFormProps) => {
    // Custom hooks para lógica
    const formLogic = useProductForm(product, onSuccess);
    const formData = useProductFormData(product);

    const {
        formData: form,
        loading,
        errors,
        handleInputChange,
        handlePriceChange,
        handleSubmit,
        getInputValue,
    } = formLogic;

    const {
        categories,
        brands,
        images,
        setImages,
        isNewBrand,
        setIsNewBrand,
        newBrand,
        setNewBrand,
        reloadData,
    } = formData;

    const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const selectedValue = e.target.value;

        if (selectedValue === 'nueva') {
            setIsNewBrand(true);
            setNewBrand('');
            handleInputChange({
                target: { name: 'brand', value: '', type: 'text' }
            } as any);
        } else {
            setIsNewBrand(false);
            setNewBrand('');
            handleInputChange({
                target: { name: 'brand', value: selectedValue, type: 'text' }
            } as any);
        }
    };

    const onFormSubmit = (e: React.FormEvent) => {
        handleSubmit(e, images, isNewBrand, newBrand, reloadData);
    };

    return (
        <form onSubmit={onFormSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    label="Nombre del producto"
                    name="name"
                    placeholder="Ej: RTX 4090 Gaming"
                    required
                    value={getInputValue('name')}
                    onChange={handleInputChange}
                    error={errors.name}
                />

                <CategorySelector
                    categories={categories}
                    selectedCategoryId={form.categoryId}
                    onCategoryChange={handleInputChange}
                    error={errors.categoryId}
                />

                <BrandSelector
                    brands={brands}
                    selectedBrand={form.brand}
                    isNewBrand={isNewBrand}
                    newBrandValue={newBrand}
                    onBrandChange={handleBrandChange}
                    onNewBrandChange={setNewBrand}
                    error={errors.brand}
                />

                <FormInput
                    label="Modelo"
                    name="model"
                    placeholder="Ej: ROG Strix Gaming OC"
                    value={getInputValue('model')}
                    onChange={handleInputChange}
                    error={errors.model}
                />

                <PlatformSelector
                    category={categories.find(c => c.id === form.categoryId)?.name || ''}
                    selectedPlatform={form.platform || ''}
                    onChange={handleInputChange}
                    error={errors.platform}
                />

                <PriceInput
                    label="Precio"
                    name="price"
                    required
                    value={form.price}
                    onChange={handlePriceChange}
                    error={errors.price}
                />

                <FormInput
                    label="Stock"
                    name="stock"
                    type="number"
                    placeholder="0"
                    min="0"
                    required
                    value={getInputValue('stock', 'number')}
                    onChange={handleInputChange}
                    error={errors.stock}
                />
            </div>

            {/* Descripción */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descripción{' '}
                    <span className="text-gray-500">
                        ({(form.description?.length || 0)}/1000 caracteres)
                    </span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={3}
                    maxLength={1000}
                    value={form.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Describe las características del producto..."
                />
            </div>

            {/* Estado del producto */}
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                </label>
                <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value={0}>Activo (visible en la tienda)</option>
                    <option value={1}>Inactivo (oculto temporalmente)</option>
                </select>
            </div>

            {/* Gestión de imágenes */}
            <ImageManager
                images={images}
                onImagesChange={setImages}
                productId={product?.id}
                errors={{ images: errors.images }}
            />

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                >
                    {loading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear')} Producto
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
