import { useEffect } from 'react';
import { useTransactions } from '../features/transactions/hooks/useTransactions';
import { useDashboardStats } from '../features/transactions/hooks/useDashboardStats';
import { SummaryCards } from '../features/transactions/components/SummaryCards';
import { TransactionForm } from '../features/transactions/components/TransactionForm';
import { TransactionList } from '../features/transactions/components/TransactionList';

// Fallback estático constante
const EMPTY_TRANSACTIONS: any[] = [];

export default function TransactionsPage() {
  const profileId = '00000000-0000-0000-0000-000000000000';

  const {
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
  } = useTransactions();

  // === CARGA DE DATOS ===
  useEffect(() => {
    if (profileId) {
      loadTransactions(profileId);
    }
  }, [profileId, loadTransactions]);

  // === FALLBACK SIMPLE ===
  const safeTransactions = transactions ?? EMPTY_TRANSACTIONS;

  // === SINGLE SOURCE OF TRUTH PARA ESTADÍSTICAS ===
  const dashboardStats = useDashboardStats(safeTransactions);

  // === CONTROLADORES DE ACCIÓN ===
  const handleFormSubmit = async (formData: any) => {
    if (!profileId) return;

    const formattedData = {
      ...formData,
      date: formData.date, 
    };

    if (selectedTransaction) {
      await updateTransaction(selectedTransaction.id, formattedData);
    } else {
      await createTransaction(profileId, formattedData);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-zinc-950 py-8 px-4 font-sans transition-colors duration-200">
      
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 1. Cabecera limpia */}
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Flujo de dinero</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gestión de Finanzas Personales</p>
        </header>

        {/* 2. Resumen unificado */}
        <div className="w-full">
          <SummaryCards stats={dashboardStats} />
        </div>

        {/* 3. Grid de Trabajo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Columna del Formulario */}
          <section className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm sticky lg:top-6">
            <TransactionForm
              onSubmitSuccess={handleFormSubmit}
              isLoading={isLoading}
              transaction={selectedTransaction}
              onCancelEdit={cancelEditing}
            />
          </section>

          {/* Columna de la Lista */}
          <section className="lg:col-span-2 bg-white dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Historial de Actividad</h2>
            <TransactionList
              transactions={safeTransactions}
              isLoading={isLoading && safeTransactions.length === 0}
              error={error}
              onEdit={startEditing}
              onDelete={deleteTransaction}
            />
          </section>

        </div>
      </div>
    </div>
  );
}