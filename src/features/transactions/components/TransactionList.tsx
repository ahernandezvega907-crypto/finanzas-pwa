import React, { useMemo } from 'react';
import { Transaction } from '../../../types/transaction';
import { TransactionItem } from './TransactionItem'; 

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => Promise<void>;
}

export const TransactionList = React.memo(function TransactionList({
  transactions,
  isLoading,
  error,
  onEdit,
  onDelete,
}: TransactionListProps) {
  
  // Limita el renderizado del DOM a las últimas 100 transacciones si la lista se vuelve masiva.
  // Esto previene degradación de rendimiento en dispositivos móviles antiguos.
  const visibleTransactions = useMemo(() => {
    return transactions.slice(0, 100);
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400 animate-pulse font-medium">
        Cargando transacciones...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-zinc-900/50 dark:text-red-400 text-center border border-red-100 dark:border-red-950/50">
        ⚠️ Error: {error}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-zinc-800 rounded-2xl p-6">
        <p className="text-gray-500 dark:text-gray-400 font-medium">No hay transacciones registradas aún.</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Los movimientos que agregues aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-md mx-auto mt-6">
      <div className="flex justify-between items-baseline px-1">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          Historial de Movimientos
        </h3>
        {transactions.length > 100 && (
          <span className="text-xs text-gray-400">
            Mostrando últimas 100
          </span>
        )}
      </div>
      
      <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {visibleTransactions.map((tx) => (
          <TransactionItem
            key={tx.id}
            transaction={tx}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
});