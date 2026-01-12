import { useImageManager, FormImage } from './useImageManager';
import ImageDropzone from './ImageDropzone';
import ImageGallery from './ImageGallery';

interface ImageManagerProps {
    images: FormImage[];
    onImagesChange: (images: FormImage[]) => void;
    productId?: number;
    errors?: { images?: string };
}

const ImageManager = ({ images, onImagesChange, productId, errors }: ImageManagerProps) => {
    const {
        isDragOver,
        draggedIndex,
        isCompressing,
        compressionProgress,
        addNewImages,
        removeImage,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleImageDrop
    } = useImageManager({ images, onImagesChange, productId });

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
                Imágenes del producto <span className="text-gray-500">(opcional)</span>
            </label>

            <ImageDropzone
                isDragOver={isDragOver}
                isCompressing={isCompressing}
                compressionProgress={compressionProgress}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFileSelect={addNewImages}
            />

            {errors?.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}

            <ImageGallery
                images={images}
                draggedIndex={draggedIndex}
                onDragStart={handleDragStart}
                onImageDrop={handleImageDrop}
                onRemove={removeImage}
            />
        </div>
    );
};

export default ImageManager;
export type { FormImage };
