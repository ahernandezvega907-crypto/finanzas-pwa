import { useMemo } from "react";
import type { Transaction } from "../../../types/transaction";
import type { Budget, BudgetStats } from "../../../types/budget";
import { calculateBudgetUsage, calculateBudgetUsageFromMap } from "../utils/calculateBudgetUsage";

export function useBudgetStats(
  budget: Budget, 
  transactions: Transaction[],
  expensesMap?: Record<string, number> // Parámetro opcional para inyectar optimización O(1)
): BudgetStats {
  return useMemo(() => {
    if (expensesMap) {
      return calculateBudgetUsageFromMap(budget, expensesMap);
    }
    return calculateBudgetUsage(budget, transactions);
  }, [budget, transactions, expensesMap]);
}