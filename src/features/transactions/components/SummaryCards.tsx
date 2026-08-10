import React, { useMemo } from 'react';
import { DashboardStats } from '../hooks/useDashboardStats';

interface SummaryCardsProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

// Subcomponente interno estilizado 100% con Tailwind CSS
const SummaryCard: React.FC<{
  title: string;
  value: string;
  variant: 'balance' | 'income' | 'expense';
  isNegative?: boolean;
}> = ({ title, value, variant, isNegative }) => {
  // Asignamos colores semánticos dinámicos según el tipo de tarjeta
  const valueColorClass = useMemo(() => {
    if (variant === 'income') return 'text-emerald-600 dark:text-emerald-400';
    if (variant === 'expense') return 'text-rose-600 dark:text-rose-400';
    if (variant === 'balance') {
      return isNegative ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-900 dark:text-zinc-50';
    }
    return 'text-zinc-900 dark:text-zinc-50';
  }, [variant, isNegative]);

  return (
    <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-1.5 min-h-[106px] transition-all shadow-sm">
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {title}
      </span>
      <span className={`text-2xl font-bold tracking-tight ${valueColorClass}`}>
        {value}
      </span>
    </div>
  );
};

export const SummaryCards = React.memo(function SummaryCards({ stats, isLoading = false }: SummaryCardsProps) {
  const { income, expense, balance } = stats;

  const formattedBalance = useMemo(() => formatCurrency(balance), [balance]);
  const formattedIncome = useMemo(() => formatCurrency(income), [income]);
  const formattedExpense = useMemo(() => formatCurrency(expense), [expense]);

  const isNegativeBalance = balance < 0;

  // === RENDERIZADO DE SKELETONS CON TAILWIND (Evita el CLS con animación nativa pulse) ===
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from(new Array(3)).map((_, index) => (
          <div
            key={index}
            className="p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3 min-h-[106px]"
          >
            {/* Esqueleto del título */}
            <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            {/* Esqueleto del monto principal */}
            <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard
        title="Balance General"
        value={formattedBalance}
        variant="balance"
        isNegative={isNegativeBalance}
      />
      <SummaryCard
        title="Total Ingresos"
        value={formattedIncome}
        variant="income"
      />
      <SummaryCard
        title="Total Gastos"
        value={formattedExpense}
        variant="expense"
      />
    </div>
  );
});