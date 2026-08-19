export type PlanType = 'free' | 'premium';

export interface UserSubscription {
  plan: PlanType;
  status: 'active' | 'trialing' | 'canceled' | 'past_due';
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface PlanLimits {
  maxTransactions: number; // -1 para ilimitado
  maxBudgets: number;      // -1 para ilimitado
  maxCategories: number;   // -1 para ilimitado
  dailyAiQueries: number;  // Máximo diario
  canExportPdf: boolean;
  canExportExcel: boolean;
  canExportCsv: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxTransactions: 250,
    maxBudgets: 1,
    maxCategories: 10,
    dailyAiQueries: 5,
    canExportPdf: false,
    canExportExcel: false,
    canExportCsv: true,
  },
  premium: {
    maxTransactions: -1,
    maxBudgets: -1,
    maxCategories: -1,
    dailyAiQueries: 20,
    canExportPdf: true,
    canExportExcel: true,
    canExportCsv: true,
  },
};