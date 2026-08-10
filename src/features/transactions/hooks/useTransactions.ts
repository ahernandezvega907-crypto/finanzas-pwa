import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Transaction, CreateTransactionInput } from '../domain/transaction.types';
import { TransactionService } from '../services/transactions.service';

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const loadTransactions = useCallback(async () => {
    if (!user?.id) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError(null);
    const result = await TransactionService.getTransactions(user.id);

    if (result.success) {
      setTransactions(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const startEditing = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const cancelEditing = () => {
    setSelectedTransaction(null);
  };

  const createTransaction = async (dto: CreateTransactionInput) => {
    if (!user?.id) {
      setError(new Error('Usuario no autenticado.'));
      return;
    }

    setError(null);
    const tempId = crypto.randomUUID();

    const tempTransaction: Transaction = {
      id: tempId,
      profileId: user.id,
      type: dto.type,
      categoryId: dto.categoryId,
      amount: dto.amount,
      description: dto.description || '',
      date: dto.date,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [tempTransaction, ...prev]);

    const result = await TransactionService.addTransaction(user.id, dto);

    if (result.success) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === tempId ? result.data : t))
      );
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== tempId));
      setError(result.error);
    }
  };

  const updateTransaction = async (id: string, dto: Partial<CreateTransactionInput>) => {
    if (!user?.id) {
      setError(new Error('Usuario no autenticado.'));
      return;
    }

    setError(null);
    const backupTransactions = [...transactions];

    const updatedFields: Partial<Transaction> = {};
    if (dto.amount !== undefined) updatedFields.amount = dto.amount;
    if (dto.type) updatedFields.type = dto.type;
    if (dto.description !== undefined) updatedFields.description = dto.description;
    if (dto.date) updatedFields.date = dto.date;
    if (dto.categoryId) updatedFields.categoryId = dto.categoryId;

    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
    setSelectedTransaction(null);

    const result = await TransactionService.updateTransaction(user.id, id, dto);

    if (!result.success) {
      setTransactions(backupTransactions);
      setError(result.error);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user?.id) {
      setError(new Error('Usuario no autenticado.'));
      return;
    }

    setError(null);
    const backupTransactions = [...transactions];

    setTransactions((prev) => prev.filter((t) => t.id !== id));

    const result = await TransactionService.removeTransaction(user.id, id);

    if (!result.success) {
      setTransactions(backupTransactions);
      setError(result.error);
    }
  };

  return {
    transactions,
    loading,
    error,
    selectedTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    startEditing,
    cancelEditing,
    refreshTransactions: loadTransactions,
  };
}