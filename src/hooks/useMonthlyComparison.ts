import { useMemo } from 'react';

interface UseMonthlyComparisonParams {
  transactions: any[];
  categories: any[];
}

export interface CategoryComparison {
  category: string;
  currentAmount: number;
  previousAmount: number;
  changePercent: number | null;
}

export interface MonthlyComparisonResult {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  highestExpenseCat: string;
  maxExpense: number;
  previousMonthExpenses: number;
  expenseChangePercent: number | null;
  categoryComparisons: CategoryComparison[];
}

export function useMonthlyComparison({
  transactions,
  categories,
}: UseMonthlyComparisonParams): MonthlyComparisonResult {
  return useMemo(() => {
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    const summarizeMonth = (monthKey: string) => {
      let income = 0;
      let expense = 0;
      const catMap: Record<string, number> = {};

      transactions.forEach((tx: any) => {
        const txDate = tx.date ? String(tx.date).slice(0, 7) : '';
        if (txDate !== monthKey) return;

        const amt = Number(tx.amount) || 0;
        if (tx.type === 'income') {
          income += amt;
        } else if (tx.type === 'expense') {
          expense += amt;
          const catId = tx.category_id || tx.categoryId;
          const catObj = categories.find((c: any) => c.id === catId);
          const catName = catObj ? catObj.name : 'Otros';
          catMap[catName] = (catMap[catName] || 0) + amt;
        }
      });

      let highestExpenseCat = 'Ninguna';
      let maxExpense = 0;
      Object.entries(catMap).forEach(([cat, amt]) => {
        if (amt > maxExpense) {
          maxExpense = amt;
          highestExpenseCat = cat;
        }
      });

      return { income, expense, balance: income - expense, catMap, highestExpenseCat, maxExpense };
    };

    const current = summarizeMonth(currentMonthKey);
    const previous = summarizeMonth(previousMonthKey);

    const expenseChangePercent =
      previous.expense > 0
        ? Math.round(((current.expense - previous.expense) / previous.expense) * 100)
        : null;

    const allCategories = new Set([...Object.keys(current.catMap), ...Object.keys(previous.catMap)]);
    const categoryComparisons: CategoryComparison[] = Array.from(allCategories).map((cat) => {
      const currentAmount = current.catMap[cat] || 0;
      const previousAmount = previous.catMap[cat] || 0;
      const changePercent =
        previousAmount > 0 ? Math.round(((currentAmount - previousAmount) / previousAmount) * 100) : null;
      return { category: cat, currentAmount, previousAmount, changePercent };
    });

    return {
      totalIncome: current.income,
      totalExpenses: current.expense,
      balance: current.balance,
      highestExpenseCat: current.highestExpenseCat,
      maxExpense: current.maxExpense,
      previousMonthExpenses: previous.expense,
      expenseChangePercent,
      categoryComparisons,
    };
  }, [transactions, categories]);
}

export default useMonthlyComparison;