import type { Transaction } from "../../../types/transaction";
import type { MonthlyReportItem } from "../types/reports";

export function groupTransactionsByMonth(transactions: Transaction[]): MonthlyReportItem[] {
  const monthsMap: Record<string, { income: number; expense: number }> = {};

  transactions.forEach((t) => {
    if (!t.date) return;
    const month = t.date.substring(0, 7);

    if (!monthsMap[month]) {
      monthsMap[month] = { income: 0, expense: 0 };
    }

    if (t.type === "income") {
      monthsMap[month].income += t.amount;
    } else {
      monthsMap[month].expense += t.amount;
    }
  });

  return Object.entries(monthsMap).map(([month, data]) => ({
    month,
    income: data.income,
    expense: data.expense,
    balance: data.income - data.expense, // <-- Propiedad obligatoria añadida
  })) as MonthlyReportItem[];
}