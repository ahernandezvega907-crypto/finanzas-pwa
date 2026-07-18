import { supabase } from "../../../supabaseClient"; // 👈 Apunta a tu cliente global real
import type { Budget, CreateBudgetDTO } from "../../../types/budget"; // 👈 Rutas de tu árbol
import { toDomainBudget } from "../utils/budgetMapper";

export const budgetRepository = {
  async getAll(profileId: string): Promise<Budget[]> {
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(toDomainBudget);
  },

  async create(profileId: string, dto: CreateBudgetDTO): Promise<Budget> {
    const { data, error } = await supabase
      .from("budgets")
      .insert({
        profile_id: profileId,
        category_id: dto.category_id,
        limit_amount: dto.limit_amount,
        period: dto.period,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return toDomainBudget(data);
  },

  async update(id: string, dto: Partial<CreateBudgetDTO>): Promise<Budget> {
    const { data, error } = await supabase
      .from("budgets")
      .update({
        category_id: dto.category_id,
        limit_amount: dto.limit_amount,
        period: dto.period,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return toDomainBudget(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("budgets").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};