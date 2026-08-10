import type { Transaction, DBTransaction } from "../types/transaction";

export const transactionMapper = {
  /**
   * Mapea un registro desde la base de datos (Supabase) al modelo de dominio (TypeScript)
   */
  toDomain(row: any): Transaction {
    return {
      id: row.id,
      type: row.type,
      amount: row.amount,
      categoryId: row.category_id || '',
      description: row.description || '',
      date: row.transaction_date || row.date || row.created_at || new Date().toISOString(),
      createdAt: row.created_at || new Date().toISOString(),
    };
  },

  /**
   * Alias de toDomain para compatibilidad
   */
  fromDatabase(row: any): Transaction {
    return this.toDomain(row);
  },

  /**
   * Mapea el modelo de dominio hacia la estructura que espera Supabase (DBTransaction)
   */
  toDatabase(transaction: Partial<Transaction>): DBTransaction {
    const transactionDate = transaction.date || transaction.createdAt || new Date().toISOString();

    const dbRow: DBTransaction = {
      type: transaction.type!,
      amount: transaction.amount!,
      category_id: transaction.categoryId!,
      description: transaction.description || '',
      date: transactionDate,
      created_at: transaction.createdAt || transactionDate,
    };

    if (transaction.id) {
      dbRow.id = transaction.id;
    }

    return dbRow;
  }
};