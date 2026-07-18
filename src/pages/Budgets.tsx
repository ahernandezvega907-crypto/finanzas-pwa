import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../hooks/useAuth"; 
import { useBudgets } from "../features/budgets/hooks/useBudgets";
import { useTransactions } from "../features/transactions/hooks/useTransactions";
import { BudgetForm } from "../features/budgets/components/BudgetForm";
import { BudgetList } from "../features/budgets/components/BudgetList";
import { supabase } from "../supabaseClient"; 
import { Budget } from "../types/budget";
import { Transaction } from "../types/transaction";

interface Category {
  id: string;
  name: string;
}

interface BudgetFormData {
  category_id: string;
  limit_amount: number;
}

const EMPTY_CATEGORIES: Category[] = [];
const EMPTY_BUDGETS: Budget[] = [];
const EMPTY_TRANSACTIONS: Transaction[] = [];

export default function Budgets() {
  const { user } = useAuth();
  const profileId = user?.id;

  const {
    budgets,
    isLoading: budgetsLoading,
    error: budgetsError,
    selectedBudget,
    loadBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    startEditing,
    cancelEditing,
  } = useBudgets();

  const { transactions, loadTransactions } = useTransactions();
  const [categories, setCategories] = useState<Category[]>(EMPTY_CATEGORIES);

  useEffect(() => {
    if (!profileId) return;

    let isMounted = true;
    
    loadBudgets(profileId);
    loadTransactions(profileId);
      
    const fetchCategories = async () => {
      try {
        const { data } = await supabase
          .from("categories")
          .select("id, name");
        if (data && isMounted) {
          setCategories(data as Category[]);
        }
      } catch (err) {
        console.error("Error al obtener categorías:", err);
      }
    };
    
    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [profileId, loadBudgets, loadTransactions]);

  // Garantizamos referencias de datos ultra estables con tipos estrictos
  const safeBudgets = useMemo(() => budgets || EMPTY_BUDGETS, [budgets]);
  const safeTransactions = useMemo(() => transactions || EMPTY_TRANSACTIONS, [transactions]);

  // Callback estable para evitar re-renders en BudgetForm sin usar any
  const handleFormSubmit = useCallback(async (formData: BudgetFormData) => {
    if (!profileId) return;

    if (selectedBudget) {
      await updateBudget(selectedBudget.id, formData);
    } else {
      await createBudget(profileId, formData);
    }
  }, [profileId, selectedBudget, createBudget, updateBudget]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8 px-4 font-sans transition-colors duration-200">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Presupuestos Inteligentes</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Controla tus límites de gasto por categoría</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Columna Izquierda: Listado */}
        <div className="lg:col-span-2 space-y-4">
          {budgetsError && (
            <div className="p-4 rounded-xl bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/50">
              {budgetsError}
            </div>
          )}
          <BudgetList
            budgets={safeBudgets}
            transactions={safeTransactions}
            categories={categories}
            isLoading={budgetsLoading}
            onEdit={startEditing}
            onDelete={deleteBudget}
          />
        </div>

        {/* Columna Derecha: Formulario */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {selectedBudget ? "Editar Presupuesto" : "Crear Presupuesto"}
          </h2>
          <BudgetForm
            onSubmitSuccess={handleFormSubmit}
            isLoading={budgetsLoading}
            categories={categories}
            selectedBudget={selectedBudget}
            onCancelEdit={cancelEditing}
          />
        </section>
      </div>
    </div>
  );
}