import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface FormData {
    firstName: string;
    lastName: string;
}

interface UpdateProfileData {
    firstName: string;
    lastName: string;
}

interface ApiError {
    response?: {
        status: number;
        data?: {
            message?: string;
            errors?: {
                FirstName?: string[];
                LastName?: string[];
            };
        };
    };
}

export const useProfileForm = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!formData.firstName.trim()) {
                setError('El nombre es requerido');
                return;
            }
            if (!formData.lastName.trim()) {
                setError('El apellido es requerido');
                return;
            }

            const updateData: UpdateProfileData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim()
            };

            await updateProfile(updateData);

            setSuccess('¡Perfil actualizado correctamente!');
        } catch (err) {
            const error = err as ApiError;
            if (error.response?.status === 400) {
                if (error.response?.data?.errors) {
                    const validationErrors = error.response.data.errors;
                    if (validationErrors.FirstName) {
                        setError(validationErrors.FirstName[0]);
                    } else if (validationErrors.LastName) {
                        setError(validationErrors.LastName[0]);
                    } else {
                        setError('Por favor verifica los datos ingresados');
                    }
                } else {
                    setError(error.response?.data?.message || 'Datos inválidos');
                }
            } else {
                setError(error.response?.data?.message || 'Error al actualizar el perfil');
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        error,
        success,
        handleInputChange,
        handleSubmit
    };
};
