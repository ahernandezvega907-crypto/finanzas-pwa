export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  profile_id: string; // Fiel al esquema de la base de datos
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  is_custom: boolean; // Cambiado a snake_case
  created_at: string; // Cambiado a snake_case
}