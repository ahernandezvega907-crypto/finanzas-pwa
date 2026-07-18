import React from 'react';

interface FinanceSummaryCardProps {
  title: string;
  value: string;
  valueClassName?: string; // <-- Agregamos esta propiedad opcional para solucionar el error
  type: 'income' | 'expense' | 'balance';
}

export const FinanceSummaryCard = React.memo(function FinanceSummaryCard({
  title,
  value,
  valueClassName = '',
  type,
}: FinanceSummaryCardProps) {
  // Un icono o color base rápido según el tipo
  const getBorderColor = () => {
    switch (type) {
      case 'income': return 'border-l-4 border-l-emerald-500';
      case 'expense': return 'border-l-4 border-l-rose-500';
      default: return 'border-l-4 border-l-zinc-400 dark:border-l-zinc-600';
    }
  };

  return (
    <div className={`p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-sm flex flex-col gap-1 ${getBorderColor()}`}>
      <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
        {title}
      </span>
      <span className={`text-2xl font-bold tracking-tight ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
});