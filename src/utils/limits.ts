import { PLAN_LIMITS, PlanType, PlanLimits } from '../types/subscription';

export interface UsageState {
  totalTransactions: number;
  activeBudgets: number;
  customCategories: number;
  aiQueriesToday: number;
}

export interface LimitCheckResult {
  allowed: boolean;
  reason?: string;
  currentValue: number;
  limitValue: number;
}

export class LimitService {
  private _plan: PlanType;
  private limits: PlanLimits;

  constructor(plan: PlanType = 'free') {
    this._plan = plan;
    this.limits = PLAN_LIMITS[plan];
  }

  public get currentPlan(): PlanType {
    return this._plan;
  }

  public canAddTransaction(currentCount: number): LimitCheckResult {
    if (this.limits.maxTransactions === -1) {
      return { allowed: true, currentValue: currentCount, limitValue: -1 };
    }
    const allowed = currentCount < this.limits.maxTransactions;
    return {
      allowed,
      reason: allowed
        ? undefined
        : `Has alcanzado el límite de ${this.limits.maxTransactions} transacciones del plan gratuito. Actualiza a Premium para registros ilimitados.`,
      currentValue: currentCount,
      limitValue: this.limits.maxTransactions,
    };
  }

  public canCreateBudget(currentCount: number): LimitCheckResult {
    if (this.limits.maxBudgets === -1) {
      return { allowed: true, currentValue: currentCount, limitValue: -1 };
    }
    const allowed = currentCount < this.limits.maxBudgets;
    return {
      allowed,
      reason: allowed
        ? undefined
        : `El plan Gratuito solo permite ${this.limits.maxBudgets} presupuesto activo. Actualiza a Premium para presupuestos ilimitados.`,
      currentValue: currentCount,
      limitValue: this.limits.maxBudgets,
    };
  }

  public canQueryAi(queriesTodayCount: number): LimitCheckResult {
    const allowed = queriesTodayCount < this.limits.dailyAiQueries;
    return {
      allowed,
      reason: allowed
        ? undefined
        : `Alcanzaste tu límite diario de ${this.limits.dailyAiQueries} consultas al Gurú IA. Vuelve mañana o pásate a Premium para 20 consultas diarias.`,
      currentValue: queriesTodayCount,
      limitValue: this.limits.dailyAiQueries,
    };
  }

  public canExport(format: 'csv' | 'pdf' | 'excel'): boolean {
    if (format === 'csv') return this.limits.canExportCsv;
    if (format === 'pdf') return this.limits.canExportPdf;
    if (format === 'excel') return this.limits.canExportExcel;
    return false;
  }
}