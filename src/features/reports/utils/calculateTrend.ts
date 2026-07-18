import type { TrendReport } from "../types/reports";

export function calculateTrend(
  current: { income: number; expense: number; balance: number },
  previous: { income: number; expense: number; balance: number }
): TrendReport {
  const calcPercent = (curr: number, prev: number): number => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const getDirection = (val: number): "up" | "down" | "flat" => {
    if (val > 0) return "up";
    if (val < 0) return "down";
    return "flat";
  };

  const incomeVariation = calcPercent(current.income, previous.income);
  const expenseVariation = calcPercent(current.expense, previous.expense);
  const balanceVariation = calcPercent(current.balance, previous.balance);

  return {
    incomeVariation,
    incomeDirection: getDirection(incomeVariation),
    expenseVariation,
    expenseDirection: getDirection(expenseVariation),
    balanceVariation,
    balanceDirection: getDirection(balanceVariation),
  };
}