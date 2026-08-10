// ============================================================
// DOMINIO (camelCase, usado en toda la UI)
// ============================================================
export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  profileId: string | null;   // null = categoría global
  name: string;
  type: CategoryType;
  icon: string | null;
  color: string | null;
  isCustom: boolean;
  createdAt: string;
}

// ============================================================
// PERSISTENCIA (snake_case, igual que la tabla en Supabase)
// ============================================================
export interface CategoryRow {
  id: string;
  profile_id: string | null;
  name: string;
  type: CategoryType;
  icon: string | null;
  color: string | null;
  is_custom: boolean;
  created_at: string;
}