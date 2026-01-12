import { useState } from 'react';
import { productService } from '@/services/productService';
import imageCompression from 'browser-image-compression';

export interface FormImage {
    id: number | string;
    url: string;
    isMain: boolean;
    displayOrder: number;
    isExisting: boolean;
    file: File | null;
}

interface UseImageManagerProps {
    images: FormImage[];
    onImagesChange: (images: FormImage[]) => void;
    productId?: number;
}

const compressionOptions = {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
};

export const useImageManager = ({ images, onImagesChange, productId }: UseImageManagerProps) => {
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [isCompressing, setIsCompressing] = useState<boolean>(false);
    const [compressionProgress, setCompressionProgress] = useState<string>('');

    const validateImageFile = (file: File): string | null => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            return 'Solo se permiten archivos JPG, PNG y WebP';
        }

        if (file.size > maxSize) {
            return 'El archivo es demasiado grande (máximo 10MB antes de comprimir)';
        }

        return null;
    };

    const compressImage = async (file: File): Promise<File> => {
        try {
            const compressedBlob = await imageCompression(file, compressionOptions);

            const originalExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
            const fileName = file.name.replace(/\.[^/.]+$/, '') + '_compressed.' + originalExtension;

            const compressedFile = new File(
                [compressedBlob],
                fileName,
                {
                    type: compressedBlob.type || file.type,
                    lastModified: Date.now()
                }
            );

            return compressedFile;
        } catch (error) {
            console.error('Error al comprimir imagen:', error);
            throw new Error('No se pudo comprimir la imagen');
        }
    };

    const addNewImages = async (files: File[]): Promise<void> => {
        setIsCompressing(true);
        const newImages: FormImage[] = [];

        for (let index = 0; index < files.length; index++) {
            const file = files[index];

            try {
                setCompressionProgress(`Procesando imagen ${index + 1} de ${files.length}...`);

                const error = validateImageFile(file);
                if (error) {
                    alert(`Error en ${file.name}: ${error}`);
                    continue;
                }

                const compressedFile = await compressImage(file);

                if (compressedFile.size > 2 * 1024 * 1024) {
                    alert(`${file.name}: La imagen comprimida aún excede 2MB. Intenta con una imagen más pequeña.`);
                    continue;
                }

                const newImage: FormImage = {
                    id: Date.now() + index,
                    url: URL.createObjectURL(compressedFile),
                    isMain: false,
                    displayOrder: images.length + index,
                    isExisting: false,
                    file: compressedFile
                };

                newImages.push(newImage);
            } catch (error) {
                console.error(`Error procesando ${file.name}:`, error);
                alert(`Error al procesar ${file.name}`);
            }
        }

        setIsCompressing(false);
        setCompressionProgress('');

        if (newImages.length === 0) {
            return;
        }

        const allImages = [...images, ...newImages];
        const updatedImages = allImages.map((img, index) => ({
            ...img,
            displayOrder: index,
            isMain: index === 0
        }));

        onImagesChange(updatedImages);
    };

    const removeImage = async (index: number): Promise<void> => {
        const imageToRemove = images[index];

        if (imageToRemove.isExisting && productId && typeof imageToRemove.id === 'number') {
            try {
                await productService.deleteProductImage(productId, imageToRemove.id);
            } catch (error) {
                console.error('Error deleting image:', error);
                alert('Error al eliminar la imagen');
                return;
            }
        }

        const newImages = images.filter((_, i) => i !== index);

        if (imageToRemove.isMain && newImages.length > 0) {
            newImages[0].isMain = true;
        }

        const updatedImages = newImages.map((img, i) => ({
            ...img,
            displayOrder: i
        }));

        onImagesChange(updatedImages);
    };

    const updateImageOrder = async (reorderedImages: FormImage[]): Promise<void> => {
        if (!productId) return;

        try {
            const imageOrders = reorderedImages
                .filter((img): img is FormImage & { id: number } =>
                    img.isExisting && typeof img.id === 'number'
                )
                .map((img, index) => ({
                    ImageId: img.id,
                    DisplayOrder: index
                }));

            if (imageOrders.length > 0) {
                const updateData = {
                    Images: imageOrders
                };

                await productService.updateImagesOrder(productId, updateData as any);

                const mainImage = reorderedImages.find(img => img.isMain);
                if (mainImage && typeof mainImage.id === 'number') {
                    await productService.setMainImage(productId, mainImage.id);
                }
            }
        } catch (error) {
            console.error('Error updating image order:', error);
        }
    };

    const handleDragStart = (e: React.DragEvent, index: number): void => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent): void => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent): void => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent): void => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        addNewImages(files);
    };

    const handleImageDrop = async (e: React.DragEvent, dropIndex: number): Promise<void> => {
        e.preventDefault();

        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            return;
        }

        const newImages = [...images];
        const draggedImage = newImages[draggedIndex];

        newImages.splice(draggedIndex, 1);
        newImages.splice(dropIndex, 0, draggedImage);

        const updatedImages = newImages.map((img, index) => ({
            ...img,
            displayOrder: index,
            isMain: index === 0
        }));

        onImagesChange(updatedImages);
        setDraggedIndex(null);

        await updateImageOrder(updatedImages);
    };

    return {
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
    };
};
