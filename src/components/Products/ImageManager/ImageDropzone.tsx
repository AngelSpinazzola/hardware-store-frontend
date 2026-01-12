interface ImageDropzoneProps {
    isDragOver: boolean;
    isCompressing: boolean;
    compressionProgress: string;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onFileSelect: (files: File[]) => void;
}

const ImageDropzone = ({
    isDragOver,
    isCompressing,
    compressionProgress,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileSelect
}: ImageDropzoneProps) => {
    return (
        <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
            } ${isCompressing ? 'opacity-50 pointer-events-none' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {isCompressing ? (
                <div className="mt-4">
                    <div className="inline-flex items-center space-x-2">
                        <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                        <span className="text-indigo-600 font-medium">{compressionProgress}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Comprimiendo imágenes para optimizar el tamaño...
                    </p>
                </div>
            ) : (
                <>
                    <div className="mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="text-indigo-600 font-medium hover:text-indigo-500">
                                Haz click para seleccionar
                            </span>
                            <span className="text-gray-500"> o arrastra imágenes aquí</span>
                        </label>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => onFileSelect(Array.from(e.target.files || []))}
                            className="sr-only"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, WebP - Se comprimirán automáticamente a ~1.5MB
                    </p>
                </>
            )}
        </div>
    );
};

export default ImageDropzone;
