import type { Transaction } from "../../../types/transaction";
import type { Budget, BudgetStats } from "../../../types/budget";
import { calculateBudgetStatus } from "./calculateBudgetStatus";

// Genera un mapa hash { [category_id]: totalGastado } en una sola pasada O(n)
export function groupExpensesByCategory(transactions: Transaction[]): Record<string, number> {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const map: Record<string, number> = {};

  const len = safeTransactions.length;
  for (let i = 0; i < len; i++) {
    const t = safeTransactions[i];
    if (t && t.type === "expense" && t.category_id) {
      map[t.category_id] = (map[t.category_id] || 0) + t.amount;
    }
  }

  return map;
}

// Retorna las estadísticas de un presupuesto usando el mapa de gastos ya acumulados O(1)
export function calculateBudgetUsageFromMap(
  budget: Budget,
  expensesMap: Record<string, number>
): BudgetStats {
  const spent = expensesMap[budget.category_id] || 0;
  const remaining = Math.max(0, budget.limit_amount - spent);
  const percentage = budget.limit_amount > 0 ? (spent / budget.limit_amount) * 100 : 0;

  return {
    spent,
    remaining,
    percentage,
    status: calculateBudgetStatus(percentage),
  };
}

// Mantenemos la función original por retrocompatibilidad con componentes viejos, pero optimizada internamente
export function calculateBudgetUsage(
  budget: Budget,
  transactions: Transaction[]
): BudgetStats {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const spent = safeTransactions
    .filter((t) => t && t.category_id === budget.category_id && t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const remaining = Math.max(0, budget.limit_amount - spent);
  const percentage = budget.limit_amount > 0 ? (spent / budget.limit_amount) * 100 : 0;

  return {
    spent,
    remaining,
    percentage,
    status: calculateBudgetStatus(percentage),
  };
}