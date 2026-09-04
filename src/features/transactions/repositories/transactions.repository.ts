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
    // Rate limit por ventana (10/min): server-authoritative, usa auth.uid()
    // internamente en el RPC, no profileId del cliente. profileId acá solo
    // se usa para armar la fila a insertar, no se le pasa al RPC.
    const { data: limitResult, error: limitError } = await supabase.rpc(
      "check_rate_limit",
      { p_action_type: "transaction" }
    );

    if (limitError) {
      throw new Error("Error al verificar límite de tasa.");
    }
    if (!limitResult || limitResult.length === 0) {
      throw new Error("No se pudo verificar el límite de tasa.");
    }

    const { allowed, retry_after } = limitResult[0];
    if (!allowed) {
      throw new Error(
        `Estás creando transacciones muy rápido. Esperá ${retry_after} segundos e intentá de nuevo.`
      );
    }

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