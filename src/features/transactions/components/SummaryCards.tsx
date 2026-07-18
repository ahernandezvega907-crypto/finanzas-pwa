import React, { useMemo } from 'react';
import { FinanceSummaryCard } from './FinanceSummaryCard';
import { DashboardStats } from '../hooks/useDashboardStats';

interface SummaryCardsProps {
  stats: DashboardStats;
}

// Formateador global fuera del componente para no recrearlo
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

export const SummaryCards = React.memo(function SummaryCards({ stats }: SummaryCardsProps) {
  const { income, expense, balance } = stats;

  // Formateamos los valores de forma memoizada para comparaciones ultra rápidas de strings primitivas
  const formattedBalance = useMemo(() => formatCurrency(balance), [balance]);
  const formattedIncome = useMemo(() => formatCurrency(income), [income]);
  const formattedExpense = useMemo(() => formatCurrency(expense), [expense]);

  const balanceColor = balance >= 0 
    ? 'text-emerald-600 dark:text-emerald-400' 
    : 'text-rose-600 dark:text-rose-400';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FinanceSummaryCard
        title="Balance General"
        value={formattedBalance}
        valueClassName={balanceColor}
        type="balance"
      />
      <FinanceSummaryCard
        title="Total Ingresos"
        value={formattedIncome}
        valueClassName="text-emerald-600 dark:text-emerald-400"
        type="income"
      />
      <FinanceSummaryCard
        title="Total Gastos"
        value={formattedExpense}
        valueClassName="text-rose-600 dark:text-rose-400"
        type="expense"
      />
    </div>
  );
});