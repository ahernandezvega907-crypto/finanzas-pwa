import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';
import type { Category } from '../../../types/category';
import { usePremium } from '../../../hooks/usePremium';
import { LimitService } from '../../../utils/limits';

export function useCategories() {
  const queryClient = useQueryClient();
  const { isPremium } = usePremium();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAllCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: (category: Omit<Category, 'id' | 'created_at'>) => {
      const currentCount = categoriesQuery.data?.length || 0;
      const limitService = new LimitService(isPremium ? 'premium' : 'free');
      const limitCheck = limitService.canCreateCategory(currentCount);
      if (!limitCheck.allowed) {
        return Promise.reject(new Error(limitCheck.reason));
      }
      return categoryService.createCategory(category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Category>;
    }) => categoryService.updateCategory(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    categoriesQuery,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  };
}