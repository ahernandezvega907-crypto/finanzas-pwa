export interface Budget {
  id: string;
  profile_id: string;
  category_id: string;
  amount: number;
  current_spent: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBudgetDTO {
  category_id: string;
  amount: number;
  start_date: string;
  end_date: string;
}