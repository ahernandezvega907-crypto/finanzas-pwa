export interface MonthlyReportItem {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryReportItem {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
  transactionCount: number;
}

export interface TrendReport {
  incomeVariation: number;
  incomeDirection: "up" | "down" | "flat";
  expenseVariation: number;
  expenseDirection: "up" | "down" | "flat";
  balanceVariation: number;
  balanceDirection: "up" | "down" | "flat";
}

export interface ReportsData {
  summary: ReportSummary;
  monthly: MonthlyReportItem[];
  categories: CategoryReportItem[];
  trend: TrendReport;
}