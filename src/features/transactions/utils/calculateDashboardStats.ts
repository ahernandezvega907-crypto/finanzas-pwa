import type { Transaction } from "../../../types/transaction";
import type { DashboardStats } from "../types/dashboard";

export function calculateDashboardStats(
  transactions: Transaction[] = []
): DashboardStats {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  let totalIncome = 0;
  let totalExpense = 0;
  const totalTransactions = safeTransactions.length;

  // Una sola pasada para calcular ingresos y gastos de forma lineal
  for (let i = 0; i < totalTransactions; i++) {
    const t = safeTransactions[i];
    if (!t) continue;
    if (t.type === "income") {
      totalIncome += t.amount;
    } else if (t.type === "expense") {
      totalExpense += t.amount;
    }
  }

  const balance = totalIncome - totalExpense;
  const total = totalIncome + totalExpense;

  return {
    totalIncome,
    totalExpense,
    balance,
    totalTransactions,
    incomePercentage: total === 0 ? 0 : (totalIncome / total) * 100,
    expensePercentage: total === 0 ? 0 : (totalExpense / total) * 100,
  };
}