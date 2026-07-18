import { useMemo } from 'react';
import { Transaction } from '../../../types/transaction';

export interface DashboardStats {
  income: number;
  expense: number;
  balance: number;
}

const EMPTY_STATS: DashboardStats = {
  income: 0,
  expense: 0,
  balance: 0,
};

// Evitamos recrear arrays vacíos en memoria
const EMPTY_ARRAY: readonly Transaction[] = [];

export function calculateDashboardStats(transactions: readonly Transaction[]): DashboardStats {
  if (!transactions.length) return EMPTY_STATS;

  let income = 0;
  let expense = 0;

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];
    if (tx.type === 'income') {
      income += tx.amount;
    } else if (tx.type === 'expense') {
      expense += tx.amount;
    }
  }

  return {
    income,
    expense,
    balance: income - expense,
  };
}

export function useDashboardStats(transactions: readonly Transaction[] = EMPTY_ARRAY): DashboardStats {
  return useMemo(
    () => calculateDashboardStats(transactions),
    [transactions]
  );
}