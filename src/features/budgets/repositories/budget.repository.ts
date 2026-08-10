import { supabase } from '../../../lib/supabase';

export interface BudgetRow {
  id?: string;
  profile_id: string;
  category_id: string;
  amount_limit: number;
  start_date: string;
  end_date: string;
  spent_amount?: number;
  categories?: {
    id: string;
    name: string;
  };
}

export const budgetsRepository = {
  async getAll(userId: string): Promise<BudgetRow[]> {
    // 1. Obtener presupuestos del usuario
    const { data: budgets, error: budgetError } = await supabase
      .from('budgets')
      .select(`
        id,
        profile_id,
        category_id,
        amount_limit,
        start_date,
        end_date,
        categories (
          id,
          name
        )
      `)
      .eq('profile_id', userId);

    if (budgetError) throw budgetError;
    if (!budgets || budgets.length === 0) return [];

    // 2. Obtener gastos reales del mes en curso
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const { data: transactions, error: transError } = await supabase
      .from('transactions')
      .select('category_id, amount')
      .eq('profile_id', userId)
      .eq('type', 'expense')
      .gte('transaction_date', firstDay)
      .lte('transaction_date', lastDay);

    if (transError) throw transError;

    // 3. Sumar gastos por categoría
    const spentMap: Record<string, number> = {};
    (transactions || []).forEach((t) => {
      spentMap[t.category_id] = (spentMap[t.category_id] || 0) + Number(t.amount || 0);
    });

    // 4. Inyectar spent_amount calculado
    return budgets.map((b: any) => ({
      ...b,
      spent_amount: spentMap[b.category_id] || 0,
    }));
  },

  async createOrUpdate(budget: BudgetRow) {
    const { data, error } = await supabase
      .from('budgets')
      .upsert([budget], { onConflict: 'profile_id,category_id,start_date' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};