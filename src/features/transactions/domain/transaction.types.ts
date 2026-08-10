// ============================================================
// DOMINIO (camelCase, utilizado en toda la UI)
// ============================================================
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  profileId: string;
  type: TransactionType;
  categoryId: string;
  amount: number;
  description: string;
  date: string;              // YYYY-MM-DD
  createdAt: string;         // timestamp ISO
}

export interface CreateTransactionInput {
  type: TransactionType;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
}

export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {
  id: string;
}

// ============================================================
// PERSISTENCIA (snake_case, igual que la tabla en Supabase)
// ============================================================
export interface TransactionRow {
  id: string;
  profile_id: string;
  type: TransactionType;
  category_id: string;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
}