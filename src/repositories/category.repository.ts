import { supabase } from '../lib/supabase';
import { Category } from '../types/category';
import { Result, ResultUtils } from '../lib/result';
import { AppError } from '../lib/errors';

const SELECT_CLAUSE = 'id, name, icon, color, type, profile_id, is_custom';

export class CategoryRepository {
  async getAll(profileId: string): Promise<Result<Category[]>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(SELECT_CLAUSE)
        .or(`profile_id.is.null, profile_id.eq.${profileId}`)
        .order('name', { ascending: true });

      if (error) {
        return ResultUtils.fail(new AppError(error.message, 'DATABASE_ERROR', error));
      }

      return ResultUtils.ok(data as Category[]);
    } catch (err) {
      return ResultUtils.fail(new AppError('Error de red al obtener categorías', 'NETWORK_ERROR', err));
    }
  }

  async create(profileId: string, input: Omit<Category, 'id' | 'profile_id' | 'created_at'>): Promise<Result<Category>> {
    try {
      const newCategory = { ...input, profile_id: profileId, is_custom: true };
      const { data, error } = await supabase
        .from('categories')
        .insert(newCategory)
        .select(SELECT_CLAUSE)
        .single();

      if (error) {
        return ResultUtils.fail(new AppError(error.message, 'DATABASE_ERROR', error));
      }

      return ResultUtils.ok(data as Category);
    } catch (err) {
      return ResultUtils.fail(new AppError('Error inesperado al crear categoría', 'UNKNOWN_ERROR', err));
    }
  }
}

export const categoryRepository = new CategoryRepository();