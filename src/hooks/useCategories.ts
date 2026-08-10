import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  profile_id?: string | null;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchErr } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (fetchErr) throw fetchErr;
      setCategories(data || []);
    } catch (err: any) {
      console.error('Error al cargar categorías:', err.message);
      setError('No se pudieron cargar las categorías.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (name: string, type: 'income' | 'expense', color?: string, icon?: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuario no autenticado');

      const newCategory = {
        name,
        type,
        color: color || '#1976d2',
        icon: icon || 'Folder',
        profile_id: userData.user.id,
      };

      const { data, error: insertErr } = await supabase
        .from('categories')
        .insert([newCategory])
        .select()
        .single();

      if (insertErr) throw insertErr;

      setCategories((prev) => [...prev, data]);
      return { success: true, data };
    } catch (err: any) {
      console.error('Error al agregar categoría:', err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error: deleteErr } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (deleteErr) throw deleteErr;

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return { success: true };
    } catch (err: any) {
      console.error('Error al eliminar categoría:', err.message);
      return { success: false, error: err.message };
    }
  };

  return { categories, loading, error, refetch: fetchCategories, addCategory, deleteCategory };
}