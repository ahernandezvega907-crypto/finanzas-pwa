import React, { useState, useCallback, useMemo } from 'react';
import { Transaction } from '../../../types/transaction';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void; // Alineado de forma sincrónica para el flujo optimista
}

export const TransactionItem = React.memo(function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const isIncome = transaction.type === 'income';

  // Memoización del formateo de fecha intacta
  const formattedDate = useMemo(() => {
    if (!transaction.date) return '';
    try {
      return new Date(transaction.date).toLocaleDateString('es-ES', { 
        timeZone: 'UTC',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  }, [transaction.date]);

  // Callbacks de acción
  const handleEditClick = useCallback(() => {
    onEdit(transaction);
  }, [onEdit, transaction]);

  const handleDeleteClick = useCallback(() => {
    setIsConfirmingDelete(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmingDelete(false);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    onDelete(transaction.id);
    setIsConfirmingDelete(false);
  }, [onDelete, transaction.id]);

  return (
    <div
      className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 border-l-4 rounded-r-2xl shadow-sm transition-all duration-150 hover:shadow-md dark:border-zinc-800"
      style={{ borderLeftColor: isIncome ? '#10b981' : '#ef4444' }}
    >
      {isConfirmingDelete ? (
        <div className="flex w-full justify-between items-center py-1">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            ¿Eliminar movimiento?
          </span>
          <div className="flex space-x-2">
            <button
              onClick={handleCancelDelete}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
            >
              Eliminar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 min-w-0 pr-4">
            <p className="font-bold text-zinc-800 dark:text-zinc-100 truncate">
              {transaction.description || (isIncome ? 'Ingreso sin descripción' : 'Gasto sin descripción')}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              {formattedDate}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div
              className={`font-extrabold shrink-0 ${
                isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {isIncome ? '+' : '-'}₡{transaction.amount.toFixed(2)}
            </div>

            <div className="flex space-x-1 shrink-0">
              <button
                onClick={handleEditClick}
                title="Editar"
                className="p-2 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
              >
                ✏️
              </button>
              <button
                onClick={handleDeleteClick}
                title="Eliminar"
                className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});