import React, { useCallback } from 'react';
import { Budget } from '../../../types/budget';

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  categoryName: string;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export const BudgetCard = React.memo(function BudgetCard({
  budget,
  spent,
  categoryName,
  onEdit,
  onDelete,
}: BudgetCardProps) {
  
  // === OPTIMIZACIÓN: Callbacks estables que no se recrean si el objeto budget no cambia ===
  const handleEdit = useCallback(() => {
    onEdit(budget);
  }, [onEdit, budget]);

  const handleDelete = useCallback(() => {
    onDelete(budget.id);
  }, [onDelete, budget.id]);

  // CORRECCIÓN: Uso estricto del límite numérico configurado en la base de datos
  const progress = budget.limit_amount > 0 
    ? Math.min((spent / budget.limit_amount) * 100, 100) 
    : 0;

  return (
    <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-sm flex flex-col gap-3 transition-colors duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">{categoryName}</h4>
          <p className="text-xs text-zinc-400">Límite: ${budget.limit_amount}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleEdit} 
            className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          >
            Editar
          </button>
          <button 
            onClick={handleDelete} 
            className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out ${
            progress >= 100 ? 'bg-rose-500' : progress >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
          }`} 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>Gastado: ${spent}</span>
        <span className={progress >= 100 ? 'text-rose-500 font-bold' : ''}>
          {progress.toFixed(0)}%
        </span>
      </div>
    </div>
  );
});