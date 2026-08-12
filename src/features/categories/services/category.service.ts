import { supabase } from '../../../lib/supabase';
import type { Category } from '../../../types/category';

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado.');
    }

    const { data, error } = await supabase
      .from('categories')
      .select('id, name, icon, color, type, profile_id')
      .eq('profile_id', user.id)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Error al obtener las categorías: ${error.message}`);
    }

    return data as Category[];
  },

  async createCategory(
    category: Omit<Category, 'id' | 'created_at'>
  ): Promise<Category> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado.');
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          name: category.name,
          profile_id: user.id,
          icon: category.icon || 'category',
          color: category.color || '#3B82F6',
          type: category.type || 'expense',
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear la categoría: ${error.message}`);
    }

    return data as Category;
  },

  async updateCategory(
    id: string,
    updates: Partial<Category>
  ): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar la categoría: ${error.message}`);
    }

    return data as Category;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      throw new Error(`Error al eliminar la categoría: ${error.message}`);
    }
  },
};