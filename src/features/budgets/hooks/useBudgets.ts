import { useState, useCallback, useMemo } from 'react';
import { Budget } from '../../../types/budget';

// Si tienes un tipo específico para la creación/edición de presupuestos, úsalo aquí. 
// De lo contrario, definimos una estructura estricta para omitir 'any'.
interface BudgetFormData {
  category_id: string;
  limit_amount: number;
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  const loadBudgets = useCallback(async (profileId: string) => {
    setIsLoading(true);
    try {
      // Tu lógica real de carga con Supabase u offline va aquí...
    } catch (err: any) {
      setError(err.message || 'Error al cargar presupuestos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBudget = useCallback(async (profileId: string, data: BudgetFormData) => {
    setIsLoading(true);
    try {
      // Tu lógica real de creación va aquí...
    } catch (err: any) {
      setError(err.message || 'Error al crear presupuesto');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateBudget = useCallback(async (id: string, data: Partial<BudgetFormData>) => {
    setIsLoading(true);
    try {
      // Tu lógica real de actualización va aquí...
    } catch (err: any) {
      setError(err.message || 'Error al actualizar presupuesto');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteBudget = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // Tu lógica real de borrado va aquí...
    } catch (err: any) {
      setError(err.message || 'Error al eliminar presupuesto');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startEditing = useCallback((budget: Budget) => {
    setSelectedBudget(budget);
  }, []);

  const cancelEditing = useCallback(() => {
    setSelectedBudget(null);
  }, []);

  // === RETORNO TOTALMENTE MEMOIZADO ===
  return useMemo(
    () => ({
      budgets,
      isLoading,
      error,
      selectedBudget,
      loadBudgets,
      createBudget,
      updateBudget,
      deleteBudget,
      startEditing,
      cancelEditing,
    }),
    [
      budgets,
      isLoading,
      error,
      selectedBudget,
      loadBudgets,
      createBudget,
      updateBudget,
      deleteBudget,
      startEditing,
      cancelEditing,
    ]
  );
}