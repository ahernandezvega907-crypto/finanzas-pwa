import type { Transaction } from "../../../types/transaction";
import type { CategoryReportItem } from "../types/reports";

export function groupTransactionsByCategory(
  transactions: Transaction[],
  categoriesMap: Record<string, string>
): CategoryReportItem[] {
  const categoriesData: Record<string, number> = {};
  let totalExpense = 0;

  transactions.forEach((t) => {
    if (t.type !== "expense") return;
    
    // Aseguramos que la clave sea un string válido y nunca null
    const catId = t.category_id || "sin-categoria"; 
    
    if (!categoriesData[catId]) {
      categoriesData[catId] = 0;
    }
    categoriesData[catId] += t.amount;
    totalExpense += t.amount;
  });

  return Object.entries(categoriesData).map(([catId, amount]) => {
    const categoryName = categoriesMap[catId] || "Otros";
    const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;

    return {
      categoryId: catId,
      categoryName: categoryName,
      amount: amount,
      percentage: percentage,
      color: "#000000" // Un valor por defecto para evitar que falte una propiedad requerida
    };
  }) as CategoryReportItem[];
}