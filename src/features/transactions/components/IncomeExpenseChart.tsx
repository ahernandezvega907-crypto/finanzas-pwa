import React, { useMemo } from 'react';
import { useDashboardStats } from "../hooks/useDashboardStats";
import type { Transaction } from "../../../types/transaction";

interface IncomeExpenseChartProps {
  transactions: Transaction[];
}

export const IncomeExpenseChart = React.memo(function IncomeExpenseChart({ 
  transactions 
}: IncomeExpenseChartProps) {
  const stats = useDashboardStats(transactions);

  // === OPTIMIZACIÓN Y CONTROL DE ERRORES: Cálculo seguro de porcentajes ===
  const { incomePercentage, expensePercentage } = useMemo(() => {
    const total = stats.income + stats.expense;
    if (total === 0) {
      return { incomePercentage: 0, expensePercentage: 0 };
    }
    return {
      incomePercentage: (stats.income / total) * 100,
      expensePercentage: (stats.expense / total) * 100,
    };
  }, [stats.income, stats.expense]);

  return (
    <div className="rounded-2xl bg-zinc-900 p-6 border border-zinc-800">
      <h2 className="mb-6 text-lg font-semibold text-white">Flujo financiero</h2>
      <div className="h-5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div className="flex h-full">
          <div
            className="bg-green-500 transition-all duration-500"
            style={{ width: `${incomePercentage}%` }}
          />
          <div
            className="bg-red-500 transition-all duration-500"
            style={{ width: `${expensePercentage}%` }}
          />
        </div>
      </div>
      <div className="mt-5 flex justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Ingresos: {incomePercentage.toFixed(1)}%
        </span>
        <span className="flex items-center gap-1.5 font-medium text-red-400">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Gastos: {expensePercentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
});