import { useState, useCallback, useMemo } from 'react';
import { Transaction, CreateTransactionDTO } from '../../../types/transaction';
import { SupabaseTransactionRepository } from '../../../repositories/transaction.repository';

const repository = new SupabaseTransactionRepository();

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // 1. Cargar transacciones (Protegido contra excepciones inesperadas)
  const loadTransactions = useCallback(async (profileId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await repository.getAllByProfile(profileId);
      
      if (result.success) {
        setTransactions(result.data || []);
      } else {
        setError(result.error?.message || 'Error al cargar las transacciones');
      }
    } catch (err: any) {
      setError(err.message || 'Excepción al obtener transacciones de base de datos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Crear transacción (UI Optimista)
  const createTransaction = useCallback(async (profileId: string, dto: CreateTransactionDTO) => {
    setError(null);
    
    const tempId = crypto.randomUUID();
    const tempTransaction: Transaction = {
      id: tempId,
      profile_id: profileId,
      category_id: dto.category_id,
      amount: dto.amount,
      type: dto.type,
      description: dto.description,
      date: dto.date,
      createdAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTransactions((prev) => [tempTransaction, ...prev]);

    try {
      const result = await repository.create(profileId, dto);

      if (result.success && result.data) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === tempId ? result.data! : t))
        );
      } else {
        setTransactions((prev) => prev.filter((t) => t.id !== tempId));
        setError('No se pudo guardar la transacción. Se revirtieron los cambios.');
      }
    } catch {
      setTransactions((prev) => prev.filter((t) => t.id !== tempId));
      setError('Excepción de red al guardar. Se restauró el historial.');
    }
  }, []);

  // 3. Editar transacción (UI Optimista)
  const updateTransaction = useCallback(async (id: string, dto: CreateTransactionDTO) => {
    setError(null);
    let previousTransactions: Transaction[] = [];

    setTransactions((prev) => {
      previousTransactions = [...prev]; 
      return prev.map((t) => (t.id === id ? { ...t, ...dto } : t));
    });
    
    setSelectedTransaction(null);

    try {
      const result = await repository.update(id, dto);

      if (!result.success) {
        setTransactions(previousTransactions);
        setError('Error al actualizar la transacción. Se restauraron los datos.');
      }
    } catch {
      setTransactions(previousTransactions);
      setError('Fallo de red al actualizar la transacción.');
    }
  }, []);

  // 4. Eliminar transacción (UI Optimista)
  const deleteTransaction = useCallback(async (id: string) => {
    setError(null);
    let previousTransactions: Transaction[] = [];

    setTransactions((prev) => {
      previousTransactions = [...prev]; 
      return prev.filter((t) => t.id !== id);
    });

    try {
      const result = await repository.delete(id);

      if (!result.success) {
        setTransactions(previousTransactions);
        setError('No se pudo eliminar la transacción de la base de datos.');
      }
    } catch {
      setTransactions(previousTransactions);
      setError('Fallo de red al eliminar la transacción.');
    }
  }, []);

  const startEditing = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
  }, []);

  const cancelEditing = useCallback(() => {
    setSelectedTransaction(null);
  }, []);

  return useMemo(() => ({
    transactions,
    isLoading,
    error,
    selectedTransaction,
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    startEditing,
    cancelEditing,
  }), [
    transactions,
    isLoading,
    error,
    selectedTransaction,
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    startEditing,
    cancelEditing
  ]);
};