import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';

export interface Budget {
  id?: string;
  category_id: string;
  category_name?: string;
  amount_limit: number;
  spent_amount: number;
  remaining_amount: number;
  profile_id?: string;
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Obtener presupuestos configurados con nombre de categoría
      const { data: budgetData, error: bErr } = await supabase
        .from('budgets')
        .select(`
          id,
          category_id,
          amount_limit,
          profile_id,
          categories (
            name,
            type
          )
        `);

      if (bErr) throw bErr;

      // 2. Obtener gastos del mes actual
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const { data: txData, error: txErr } = await supabase
        .from('transactions')
        .select('category_id, amount')
        .eq('type', 'expense')
        .gte('transaction_date', startOfMonth.slice(0, 10))
        .lte('transaction_date', endOfMonth.slice(0, 10));

      if (txErr) throw txErr;

      // 3. Mapear la suma de gastos por categoría
      const spentMap: Record<string, number> = {};
      (txData || []).forEach((tx: any) => {
        const catId = tx.category_id;
        spentMap[catId] = (spentMap[catId] || 0) + Number(tx.amount || 0);
      });

      // 4. Formatear presupuestos combinados
      const formattedBudgets: Budget[] = (budgetData || []).map((item: any) => {
        const spent = spentMap[item.category_id] || 0;
        const limit = Number(item.amount_limit) || 0;
        return {
          id: item.id,
          category_id: item.category_id,
          category_name: item.categories?.name || 'Categoría desconocida',
          amount_limit: limit,
          spent_amount: spent,
          remaining_amount: limit - spent,
        };
      });

      setBudgets(formattedBudgets);
    } catch (err: any) {
      console.error('Error al cargar presupuestos inteligentes:', err.message);
      setError('No se pudieron calcular los presupuestos actuales.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const saveBudget = async (categoryId: string, amountLimit: number) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuario no autenticado');

      const { data, error: upsertErr } = await supabase
        .from('budgets')
        .upsert(
          [
            {
              profile_id: userData.user.id,
              category_id: categoryId,
              amount_limit: amountLimit,
            },
          ],
          { onConflict: 'profile_id, category_id' }
        )
        .select();

      if (upsertErr) throw upsertErr;

      await fetchBudgets();
      return { success: true, data };
    } catch (err: any) {
      console.error('Error al guardar presupuesto:', err.message);
      return { success: false, error: err.message };
    }
  };

  return { budgets, loading, error, refetch: fetchBudgets, saveBudget };
}