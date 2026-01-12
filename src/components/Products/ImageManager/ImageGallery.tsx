import { FormImage } from './useImageManager';

interface ImageGalleryProps {
    images: FormImage[];
    draggedIndex: number | null;
    onDragStart: (e: React.DragEvent, index: number) => void;
    onImageDrop: (e: React.DragEvent, index: number) => void;
    onRemove: (index: number) => void;
}

const ImageGallery = ({
    images,
    draggedIndex,
    onDragStart,
    onImageDrop,
    onRemove
}: ImageGalleryProps) => {
    if (images.length === 0) return null;

    return (
        <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
                Imágenes cargadas ({images.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, index)}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                        }}
                        onDrop={(e) => onImageDrop(e, index)}
                        className={`relative group cursor-move border-2 rounded-lg overflow-hidden transition-all ${
                            draggedIndex === index ? 'opacity-50' : 'hover:border-indigo-300'
                        } ${image.isMain ? 'border-indigo-500' : 'border-gray-300'}`}
                    >
                        <div className="aspect-w-1 aspect-h-1">
                            <img
                                src={image.url}
                                alt={`Producto ${index + 1}`}
                                className="w-full h-32 object-cover"
                            />
                        </div>

                        {/* Overlay con controles */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={() => onRemove(index)}
                                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                                    title="Eliminar imagen"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 space-y-1">
                            {image.isMain && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    Principal
                                </span>
                            )}
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {index + 1}
                            </span>
                        </div>

                        {/* Indicador de drag */}
                        <div className="absolute top-2 right-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
                Arrastra las imágenes para reordenarlas. La primera imagen será la principal.
            </p>
        </div>
    );
};

export default ImageGallery;
