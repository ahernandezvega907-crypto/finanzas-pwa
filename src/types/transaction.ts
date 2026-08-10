import { CategoryType } from './category';

export interface Transaction {
  id: string;
  profileId: string;
  type: 'income' | 'expense';
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface CreateTransactionDTO {
  category_id: string | null;
  amount: number;
  type: CategoryType;
  description: string | null;
  date: string;
}