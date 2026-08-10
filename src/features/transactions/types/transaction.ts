export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: string;
  description: string;
  date: string;
  createdAt: string;
}

// Interfaz para lo que espera Supabase en snake_case
export interface DBTransaction {
  id?: string;
  user_id?: string;
  type: 'income' | 'expense';
  amount: number;
  category_id: string;
  description: string;
  date: string;
  created_at?: string;
}