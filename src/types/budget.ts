export interface Budget {
  id: string;
  profile_id: string;
  category_id: string;
  limit_amount: number;
  period: "monthly" | "weekly" | "yearly";
  created_at: string;
  updated_at: string;
}

export interface CreateBudgetDTO {
  category_id: string;
  limit_amount: number;
  period: "monthly" | "weekly" | "yearly";
}

export type BudgetStatus = "NORMAL" | "WARNING" | "DANGER";

export interface BudgetStats {
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
}