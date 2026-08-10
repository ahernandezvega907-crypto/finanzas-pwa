import React from 'react';
import { Transaction } from '../domain/transaction.types';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return <div className="text-center py-4 text-gray-500 font-medium">Cargando transacciones...</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-center py-8 text-gray-400">No hay movimientos registrados.</div>;
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">{tx.description}</span>
            <span className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center space-x-4">
            <span
              className={`font-bold ${
                tx.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {tx.type === 'income' ? '+' : '-'} ${tx.amount.toLocaleString()}
            </span>
            
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(tx)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition text-sm font-medium"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(tx.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition text-sm font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};