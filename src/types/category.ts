export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  profile_id: string; // Ajustado con guion bajo como en Supabase
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isCustom: boolean;
  createdAt: string;
}