import api from './api';
import { Category } from '../types/category.types';

const categoryService = {
  // Obtener todas las categorías
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};

export default categoryService;
