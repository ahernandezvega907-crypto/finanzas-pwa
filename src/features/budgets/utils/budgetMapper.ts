import type { Budget } from "../../../types/budget";

export function toDomainBudget(raw: any): Budget {
  return {
    id: raw.id,
    profile_id: raw.profile_id,
    category_id: raw.category_id,
    limit_amount: Number(raw.limit_amount),
    period: raw.period,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}