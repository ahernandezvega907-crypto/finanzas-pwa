import React from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useTransactionForm } from '../hooks/useTransactionForm';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { SummaryCards } from '../components/SummaryCards';

const MOCK_CATEGORIES = [
  { id: '11111111-2222-3333-4444-555555555555', name: 'Salario', type: 'income' as const },
  { id: '22222222-3333-4444-5555-666666666666', name: 'Inversiones', type: 'income' as const },
  { id: '33333333-4444-5555-6666-777777777777', name: 'Alimentación', type: 'expense' as const },
  { id: '44444444-5555-6666-7777-888888888888', name: 'Transporte', type: 'expense' as const },
  { id: '55555555-6666-7777-8888-999999999999', name: 'Entretenimiento', type: 'expense' as const },
];

export const TransactionsView: React.FC = () => {
  const { 
    transactions, 
    loading, 
    error, 
    createTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();

  // Extraemos los métodos del hook de formulario
  const methods = useTransactionForm();
  
  // Estado local para sincronizar el formulario en modo edición
  const [editingTransaction, setEditingTransaction] = React.useState<any>(null);

  // Computamos dinámicamente el objeto stats (DashboardStats) requerido por SummaryCards
  const dashboardStats = React.useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        const amount = Number(tx.amount);
        if (tx.type === 'income') {
          acc.income += amount;
        } else if (tx.type === 'expense') {
          acc.expense += amount;
        }
        acc.balance = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }, [transactions]);

  const handleCreateSubmit = async (dto: any) => {
    await createTransaction(dto);
  };

  const handleUpdateSubmit = async (id: string, dto: any) => {
  // Le pasamos al hook los dos argumentos individuales que te exige textualmente
  await updateTransaction(id, dto);
  setEditingTransaction(null);
};

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
  };

  const handleCancel = () => {
    setEditingTransaction(null);
  };

  const errorMessage = error ? (typeof error === 'string' ? error : error.message) : null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Corregido: Agregamos la prop 'stats' obligatoria con los cálculos en tiempo real */}
      <div className="mb-6">
        <SummaryCards stats={dashboardStats} isLoading={loading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        <div className="md:col-span-1 sticky top-6">
          <TransactionForm
            transaction={editingTransaction}
            categories={MOCK_CATEGORIES}
            onCreate={handleCreateSubmit}
            onUpdate={handleUpdateSubmit}
            onCancel={handleCancel}
          />
        </div>

        <div className="md:col-span-2 bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl p-2 md:p-4 border border-zinc-150 dark:border-zinc-900">
          <TransactionList
            transactions={transactions}
            isLoading={loading}
            error={errorMessage}
            onEdit={handleEdit}
            onDelete={deleteTransaction}
          />
        </div>

      </div>
    </div>
  );
};