import type { BudgetStatus } from "../../../types/budget";

export function calculateBudgetStatus(percentage: number): BudgetStatus {
  if (percentage >= 100) return "DANGER";
  if (percentage >= 80) return "WARNING";
  return "NORMAL";
}