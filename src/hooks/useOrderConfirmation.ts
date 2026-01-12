// src/pages/OrderConfirmation/useOrderConfirmation.ts
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { toast } from 'react-toastify';

interface UseOrderConfirmationProps {
    orderId: string | undefined;
}

export const useOrderConfirmation = ({ orderId }: UseOrderConfirmationProps) => {
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Query para obtener detalles de la orden
    const {
        data: order,
        isLoading: loading,
        error: queryError
    } = useQuery({
        queryKey: ['order-detail', orderId],
        queryFn: async () => {
            if (!orderId) throw new Error('Order ID is required');
            return await orderService.getOrderById(parseInt(orderId));
        },
        enabled: !!orderId,
        staleTime: 1 * 60 * 1000, // 1 minuto
        retry: 1
    });

    // Mutation para subir comprobante
    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            if (!orderId) throw new Error('Order ID is required');
            return await orderService.uploadPaymentReceipt(parseInt(orderId), file);
        },
        onSuccess: () => {
            toast.success('Comprobante enviado exitosamente');
            
            // Invalidar TODOS los caches relacionados
            queryClient.invalidateQueries({ queryKey: ['order-detail', orderId] });
            queryClient.invalidateQueries({ queryKey: ['user-orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            queryClient.invalidateQueries({ queryKey: ['pending-orders'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
            queryClient.invalidateQueries({ queryKey: ['sales-by-category'] });
            
            // Limpiar archivo seleccionado
            setSelectedFile(null);
        },
        onError: (err: any) => {
            const errorMessage = err.response?.data?.message || 'Error al subir el comprobante';
            toast.error(errorMessage);
        }
    });

    // Handler para seleccionar archivo
    const handleFileSelect = (file: File | null) => {
        if (!file) {
            setSelectedFile(null);
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            toast.error('Solo se permiten archivos JPG, PNG o PDF');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast.error('El archivo no puede exceder 5MB');
            return;
        }

        setSelectedFile(file);
    };

    // Handler para subir comprobante
    const handleUploadReceipt = async () => {
        if (!selectedFile) {
            toast.error('Por favor selecciona un archivo');
            return;
        }

        await uploadMutation.mutateAsync(selectedFile);
    };

    return {
        order,
        loading,
        error: queryError?.message || null,
        selectedFile,
        uploadingReceipt: uploadMutation.isPending,
        uploadSuccess: uploadMutation.isSuccess,
        handleFileSelect,
        handleUploadReceipt
    };
};