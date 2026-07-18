interface BudgetAlertProps {
  percentage: number;
}

export function BudgetAlert({ percentage }: BudgetAlertProps) {
  if (percentage < 80) return null;

  const isExceeded = percentage >= 100;

  return (
    <div
      className={`mt-3 flex items-center gap-2 rounded-lg p-3 text-sm font-medium transition-all ${
        isExceeded
          ? "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50"
          : "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
      }`}
    >
      <span>{isExceeded ? "🚨" : "⚠️"}</span>
      <span>
        {isExceeded
          ? `Límite excedido (${percentage.toFixed(1)}% utilizado)`
          : `Cuidado: Has consumido el ${percentage.toFixed(1)}% de tu presupuesto.`}
      </span>
    </div>
  );
}