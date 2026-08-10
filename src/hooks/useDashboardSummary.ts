import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

export function useDashboardSummary() {
  const [summary, setSummary] = useState<DashboardSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: transactions, error: fetchErr } = await supabase
        .from('transactions')
        .select('amount, type');

      if (fetchErr) throw fetchErr;

      let income = 0;
      let expenses = 0;

      (transactions || []).forEach((t: { amount: number; type: 'income' | 'expense' }) => {
        const val = Number(t.amount) || 0;
        if (t.type === 'income') {
          income += val;
        } else if (t.type === 'expense') {
          expenses += val;
        }
      });

      setSummary({
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses,
        transactionCount: transactions?.length || 0,
      });
    } catch (err: any) {
      console.error('Error al obtener datos del dashboard:', err.message);
      setError('No se pudieron calcular las finanzas actuales.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
}