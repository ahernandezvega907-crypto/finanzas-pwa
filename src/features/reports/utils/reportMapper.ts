import type { Transaction } from "../../../types/transaction";
import type { ReportsData } from "../types/reports";
import { groupTransactionsByMonth } from "./groupTransactionsByMonth";
import { groupTransactionsByCategory } from "./groupTransactionsByCategory";

export function reportMapper(
  transactions: Transaction[],
  categoriesMap: Record<string, string>
): ReportsData {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }
  });

  const balance = totalIncome - totalExpense;
  const monthlyData = groupTransactionsByMonth(transactions);
  const categoryData = groupTransactionsByCategory(transactions, categoriesMap);

  return {
    totalIncome,
    totalExpense,
    balance,
    monthlyData,
    categoryData,
    trend: {}
  } as unknown as ReportsData; // Forzamos el casteo para unificarlo con la firma del servicio
}