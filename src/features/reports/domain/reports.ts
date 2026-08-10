export type TrendDirection = 'up' | 'down' | 'flat';

export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
}

export interface ReportTrend {
  incomeVariation: number;
  expenseVariation: number;
  balanceVariation: number;
  incomeDirection: TrendDirection;
  expenseDirection: TrendDirection;
  balanceDirection: TrendDirection;
}

export interface MonthlyTrendData {
  month: string; // Ej: "Ene", "Feb" o "2026-07"
  income: number;
  expense: number;
}

export interface CategoryDistribution {
  categoryName: string;
  amount: number;
  percentage: number;
  color?: string;
}

export interface ReportsData {
  summary: ReportSummary;
  trend: ReportTrend;
  monthly: MonthlyTrendData[];
  categories: CategoryDistribution[];
}

/**
 * Estado inicial seguro y consistente (Null Object Pattern)
 * Elimina la necesidad de validaciones opcionales (`?.`) en la capa de UI.
 */
export const EMPTY_REPORTS: ReportsData = {
  summary: {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    savingsRate: 0,
  },
  trend: {
    incomeVariation: 0,
    expenseVariation: 0,
    balanceVariation: 0,
    incomeDirection: 'flat',
    expenseDirection: 'flat',
    balanceDirection: 'flat',
  },
  monthly: [],
  categories: [],
};