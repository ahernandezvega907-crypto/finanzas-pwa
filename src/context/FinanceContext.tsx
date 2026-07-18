import React, { createContext, useState, ReactNode, useMemo, useCallback } from 'react';

export interface TransactionToken {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface FinanceContextType {
  transactions: TransactionToken[];
  isSyncing: boolean;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  addTransaction: (transaction: Omit<TransactionToken, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  syncData: () => Promise<void>;
}

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<TransactionToken[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Operaciones de mutación de estado atómicas y estables
  const addTransaction = useCallback((newTx: Omit<TransactionToken, 'id'>) => {
    setTransactions((prev) => [
      ...prev,
      {
        ...newTx,
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      },
    ]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  const syncData = useCallback(async () => {
    setIsSyncing(true);
    try {
      // Punto de anclaje listo para llamadas en tiempo real de Supabase gRPC / WebSockets o IndexedDB
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // 💡 NIVEL 3: Selectores Derivados Memoizados de alto rendimiento.
  // Solo se recalculan si el array de transacciones cambia de referencia.
  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        if (tx.type === 'income') {
          acc.income += tx.amount;
        } else {
          acc.expenses += tx.amount;
        }
        return acc;
      },
      { income: 0, expenses: 0 }
    );
  }, [transactions]);

  const balance = useMemo(() => {
    return totals.income - totals.expenses;
  }, [totals]);

  // Generación del value del proveedor altamente estable
  const contextValue = useMemo<FinanceContextType>(() => ({
    transactions,
    isSyncing,
    totalIncome: totals.income,
    totalExpenses: totals.expenses,
    balance,
    addTransaction,
    deleteTransaction,
    syncData,
  }), [transactions, isSyncing, totals, balance, addTransaction, deleteTransaction, syncData]);

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
};