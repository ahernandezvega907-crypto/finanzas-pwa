export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
}

export interface TrendReport {
  incomeVariation: number;
  incomeDirection: 'up' | 'down' | 'flat';
  expenseVariation: number;
  expenseDirection: 'up' | 'down' | 'flat';
  balanceVariation: number;
  balanceDirection: 'up' | 'down' | 'flat';
}

export interface MonthlyReportItem {
  month: string;
  income: number;
  expense: number;
  balance: number;          // ✅ Añadido para satisfacer contrato
  transactionCount?: number; // ✅ Opcional para tolerar dominio de Supabase
}

export interface CategoryReportItem {
  categoryId: string;        // ✅ Requerido para claves estructuradas
  categoryName: string;
  amount: number;
  percentage: number;
}