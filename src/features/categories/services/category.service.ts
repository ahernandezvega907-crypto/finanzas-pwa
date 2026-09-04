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

    // Rate limit por ventana (5/min): server-authoritative vía auth.uid()
    // dentro del RPC. Se verifica antes del insert, mismo patrón que
    // transactionsRepository.create(). El límite TOTAL por plan
    // (LimitService.canCreateCategory) sigue viviendo en useCategories.ts,
    // sin cambios — son dos chequeos distintos y complementarios.
    const { data: limitResult, error: limitError } = await supabase.rpc(
      'check_rate_limit',
      { p_action_type: 'category' }
    );

    if (limitError) {
      throw new Error('Error al verificar límite de tasa.');
    }
    if (!limitResult || limitResult.length === 0) {
      throw new Error('No se pudo verificar el límite de tasa.');
    }

    const { allowed, retry_after } = limitResult[0];
    if (!allowed) {
      throw new Error(
        `Estás creando categorías muy rápido. Esperá ${retry_after} segundos e intentá de nuevo.`
      );
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