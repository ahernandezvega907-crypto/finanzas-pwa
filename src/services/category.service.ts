import { categoryRepository } from '../repositories/category.repository';
import { Category } from '../types/category';
import { Result, ResultUtils } from '../lib/result';
import { AppError } from '../lib/errors';

export class CategoryService {
  async getCategories(profileId: string): Promise<Result<Category[]>> {
    return categoryRepository.getAll(profileId);
  }

  async addCustomCategory(
    profileId: string,
    data: Omit<Category, 'id' | 'profile_id' | 'created_at'>
  ): Promise<Result<Category>> {
    if (!data.name?.trim()) {
      return ResultUtils.fail(new AppError('El nombre de la categoría es obligatorio', 'VALIDATION_ERROR'));
    }
    return categoryRepository.create(profileId, data);
  }
}

export const categoryService = new CategoryService();