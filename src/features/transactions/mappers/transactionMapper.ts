import type { Transaction, TransactionRow } from "../domain/transaction.types";

export const transactionMapper = {
  toDomain(row: TransactionRow): Transaction {
    return {
      id: row.id,
      profileId: row.profile_id,
      type: row.type,
      categoryId: row.category_id,
      amount: Number(row.amount),
      description: row.description || '',
      date: row.date,
      createdAt: row.created_at
    };
  }
};