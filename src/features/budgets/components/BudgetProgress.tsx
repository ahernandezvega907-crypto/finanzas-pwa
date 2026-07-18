interface BudgetProgressProps {
  percentage: number;
}

export function BudgetProgress({ percentage }: BudgetProgressProps) {
  const safePercentage = Math.min(100, Math.max(0, percentage));

  const getProgressColor = () => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="h-3 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
      <div
        className={`h-full transition-all duration-500 ${getProgressColor()}`}
        style={{ width: `${safePercentage}%` }}
      />
    </div>
  );
}