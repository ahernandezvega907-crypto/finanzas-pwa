import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Hooks de la feature
import { useTransactions } from '../features/transactions/hooks/useTransactions';
import { useDashboardStats } from '../features/transactions/hooks/useDashboardStats'; 
// Componentes de la feature
import { TransactionForm } from '../features/transactions/components/TransactionForm';
import { TransactionList } from '../features/transactions/components/TransactionList';
import { SummaryCards } from '../features/transactions/components/SummaryCards';
import { IncomeExpenseChart } from '../features/transactions/components/IncomeExpenseChart';
// Auth global
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const activeProfileId = user?.id;

  // Extraemos todas las funciones de nuestro hook
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
    cancelEditing
  } = useTransactions();

  // === SOLUCIÓN TYPE ERROR: Calculamos las estadísticas usando el hook unificado ===
  const dashboardStats = useDashboardStats(transactions || []);

  useEffect(() => {
    if (activeProfileId) {
      loadTransactions(activeProfileId);
    }
  }, [activeProfileId, loadTransactions]);

  // Maneja tanto la creación como la actualización
  const handleFormSubmit = async (formData: any) => {
    if (!activeProfileId) return;

    const dateOnly = formData.date.split('T')[0]; 

    const formattedData = {
      ...formData,
      date: dateOnly,
      category_id: formData.category_id && formData.category_id.trim() !== "" ? formData.category_id : null,
      amount: parseFloat(formData.amount),
    };
    
    if (selectedTransaction) {
      // Si hay una transacción seleccionada, disparamos la actualización
      await updateTransaction(selectedTransaction.id, formattedData);
    } else {
      // Si no, es una creación normal
      await createTransaction(activeProfileId, formattedData);
    }
  };

  // Maneja el Cierre de Sesión forzado para regresar al Login
  const handleLogout = async () => {
    if (signOut) {
      await signOut();
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 py-8 px-4 font-sans transition-colors duration-200">
      
      {/* 1. Cabecera */}
      <header className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Flujo de dinero</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Panel de Control de Transacciones</p>
        </div>
        <button
          onClick={handleLogout}
          className="self-start sm:self-center bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-sm transition-colors duration-150"
        >
          Cerrar Sesión
        </button>
      </header>

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 2. Tarjetas de Resumen (CORREGIDO: Pasamos "stats" en lugar de "transactions") */}
        <SummaryCards stats={dashboardStats} />

        {/* 3. Estructura de contenido en tres columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Columna Izquierda/Central (Gráfico e Historial) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gráfico Dinámico */}
            <IncomeExpenseChart transactions={transactions || []} />
            
            <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Historial de Actividad</h2>
              <TransactionList 
                transactions={transactions || []} 
                isLoading={isLoading} 
                error={error} 
                onEdit={startEditing}
                onDelete={deleteTransaction}
              />
            </section>
          </div>

          {/* Columna Derecha (Formulario para Registrar/Editar) */}
          {/* CORREGIDO: El contenedor no tiene títulos duplicados ya que TransactionForm se encarga de mostrar su propio encabezado */}
          <section className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm sticky lg:top-6">
            <TransactionForm 
              onSubmitSuccess={handleFormSubmit} 
              isLoading={isLoading} 
              transaction={selectedTransaction}
              onCancelEdit={cancelEditing}
            />
          </section>

        </div>
      </div>
    </div>
  );
}