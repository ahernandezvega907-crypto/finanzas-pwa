import { useEffect } from 'react';
import { useTransactions } from '../features/transactions/hooks/useTransactions';
import { TransactionForm } from '../features/transactions/components/TransactionForm';
import { TransactionList } from '../features/transactions/components/TransactionList';
// Importa tu hook de autenticación real aquí (ej. useAuth o de un context)
// import { useAuth } from '../hooks/useAuth'; 

export default function Transactions() {
  // === CONFIGURACIÓN DE USUARIO ===
  // Si usas un hook de autenticación real, descomenta la línea de abajo:
  // const { user } = useAuth();
  // const profileId = user?.id;
  
  // Por ahora utilizaremos un ID simulado para asegurar que no se rompa el compilador:
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

  // === CARGA INICIAL DE DATOS ===
  useEffect(() => {
    if (profileId) {
      loadTransactions(profileId);
    }
  }, [profileId, loadTransactions]);

  // === CONTROLADORES DE ACCIÓN (SUBMIT) ===
  const handleFormSubmit = async (data: any) => {
    if (!profileId) return;

    if (selectedTransaction) {
      // Si hay una transacción seleccionada en el estado del hook, actualizamos
      await updateTransaction(selectedTransaction.id, data);
    } else {
      // De lo contrario, creamos una nueva
      await createTransaction(profileId, data);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Encabezado */}
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
          Mis Movimientos
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Controla tus ingresos y gastos de forma simple y optimizada.
        </p>
      </div>

      {/* Grid Responsivo: Formulario a la izquierda / Lista a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Columna Formulario (Ancho de 5/12 en escritorio) */}
        <div className="lg:col-span-5 sticky lg:top-6">
          <TransactionForm
            onSubmitSuccess={handleFormSubmit}
            isLoading={isLoading}
            transaction={selectedTransaction}
            onCancelEdit={cancelEditing}
          />
        </div>

        {/* Columna Historial (Ancho de 7/12 en escritorio) */}
        <div className="lg:col-span-7 bg-zinc-50/50 dark:bg-zinc-950/30 rounded-2xl p-4 lg:p-6 border border-zinc-100 dark:border-zinc-900/50">
          <TransactionList
            transactions={transactions}
            isLoading={isLoading && transactions.length === 0} // Muestra spinner solo en la carga inicial
            error={error}
            onEdit={startEditing}
            onDelete={deleteTransaction}
          />
        </div>

      </div>
    </div>
  );
}