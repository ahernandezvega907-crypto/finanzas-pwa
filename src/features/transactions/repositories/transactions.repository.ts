import { supabase } from "../../../lib/supabase";
import type { 
  TransactionRow, 
  CreateTransactionInput, 
  UpdateTransactionInput 
} from "../domain/transaction.types";

class TransactionsRepository {
  async getAll(profileId: string): Promise<TransactionRow[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq("profile_id", profileId)
      .order("transaction_date", { ascending: false });

    if (error) throw error;
    return (data as TransactionRow[]) || [];
  }

  async create(profileId: string, input: CreateTransactionInput): Promise<TransactionRow> {
    const row = {
      profile_id: profileId,
      type: input.type,
      category_id: input.categoryId,
      amount: input.amount,
      description: input.description || null,
      transaction_date: input.date,
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert([row])
      .select()
      .single();

    if (error) throw error;
    return data as TransactionRow;
  }

  async update(profileId: string, input: UpdateTransactionInput): Promise<TransactionRow> {
    const { id, ...updates } = input;
    const row: Record<string, unknown> = {};

    if (updates.type !== undefined) row.type = updates.type;
    if (updates.categoryId !== undefined) row.category_id = updates.categoryId;
    if (updates.amount !== undefined) row.amount = updates.amount;
    if (updates.description !== undefined) row.description = updates.description || null;
    if (updates.date !== undefined) row.transaction_date = updates.date;

    const { data, error } = await supabase
      .from("transactions")
      .update(row)
      .eq("id", id)
      .eq("profile_id", profileId)
      .select()
      .single();

    if (error) throw error;
    return data as TransactionRow;
  }

  async delete(id: string, profileId: string): Promise<void> {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("profile_id", profileId);

    if (error) throw error;
  }
}

export const transactionsRepository = new TransactionsRepository();