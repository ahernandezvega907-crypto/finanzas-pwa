import React, { useMemo } from 'react';
import { Budget } from '../../../types/budget';
import { Transaction } from '../../../types/transaction';
import { BudgetCard } from './BudgetCard';

interface Category {
  id: string;
  name: string;
}

interface BudgetListProps {
  budgets: Budget[];
  transactions: Transaction[];
  categories: Category[];
  isLoading?: boolean;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

// Envolvemos todo el listado en React.memo para evitar re-renders si el componente padre cambia por otra razón
export const BudgetList = React.memo(function BudgetList({
  budgets,
  transactions,
  categories,
  isLoading,
  onEdit,
  onDelete,
}: BudgetListProps) {
  
  // === OPTIMIZACIÓN: HashMap O(1) para evitar búsquedas repetitivas con .find() ===
  const categoryMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c.name]));
  }, [categories]);

  // === OPTIMIZACIÓN: Agrupación de gastos pre-calculada en O(N) de forma estable ===
  const expensesMap = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i];
      if (tx.type === 'expense' && tx.category_id) {
        const current = map.get(tx.category_id) || 0;
        map.set(tx.category_id, current + tx.amount);
      }
    }
    return map;
  }, [transactions]);

  if (isLoading && budgets.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        Cargando presupuestos...
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        No hay presupuestos configurados aún.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {budgets.map((budget) => {
        const spent = expensesMap.get(budget.category_id) || 0;
        const categoryName = categoryMap.get(budget.category_id) ?? 'Categoría';

        return (
          <BudgetCard
            key={budget.id}
            budget={budget}
            spent={spent}
            categoryName={categoryName}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
});