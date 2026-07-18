import { CategoryType } from './category';

export interface Transaction {
  id: string;
  profile_id: string;      // Ajustado con guion bajo
  category_id: string | null; // Ajustado con guion bajo
  amount: number;
  type: CategoryType;
  description: string | null;
  date: string;
  createdAt: string;
  updated_at: string;
}

export interface CreateTransactionDTO {
  category_id: string | null; // Ajustado con guion bajo
  amount: number;
  type: CategoryType;
  description: string | null;
  date: string;
}