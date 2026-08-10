import { DBTransaction } from '../repositories/reports.repository';
import { ReportsData, EMPTY_REPORTS, CategoryDistribution, MonthlyTrendData } from '../domain/reports';

export function reportMapper(
  dbTransactions: DBTransaction[],
  categoriesMap: Map<string, { name: string; color?: string }>
): ReportsData {
  if (!dbTransactions || dbTransactions.length === 0) {
    return EMPTY_REPORTS;
  }

  let totalIncome = 0;
  let totalExpense = 0;

  const categoryAggregation: Record<string, { amount: number; color?: string }> = {};
  const monthlyAggregation: Record<string, { income: number; expense: number }> = {};

  // Recorrido único ultra-eficiente
  for (const tx of dbTransactions) {
    const amount = tx.amount || 0;
    
    let categoryName = 'Sin Categoría';
    let categoryColor = '#94a3b8'; 

    if (tx.categories) {
      categoryName = tx.categories.name;
      categoryColor = tx.categories.color || categoryColor;
    } else if (tx.category_id && categoriesMap.has(tx.category_id)) {
      const cached = categoriesMap.get(tx.category_id);
      if (cached) {
        categoryName = cached.name;
        categoryColor = cached.color || categoryColor;
      }
    }

    if (tx.type === 'income') {
      totalIncome += amount;
    } else if (tx.type === 'expense') {
      totalExpense += amount;
      
      if (!categoryAggregation[categoryName]) {
        categoryAggregation[categoryName] = { amount: 0, color: categoryColor };
      }
      categoryAggregation[categoryName].amount += amount;
    }

    const dateObj = new Date(tx.created_at);
    const monthKey = isNaN(dateObj.getTime()) 
      ? 'Indefinido' 
      : dateObj.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });

    if (!monthlyAggregation[monthKey]) {
      monthlyAggregation[monthKey] = { income: 0, expense: 0 };
    }

    if (tx.type === 'income') {
      monthlyAggregation[monthKey].income += amount;
    } else {
      monthlyAggregation[monthKey].expense += amount;
    }
  }

  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.min(100, (balance / totalIncome) * 100)) : 0;

  const categories: CategoryDistribution[] = Object.entries(categoryAggregation).map(
    ([name, data]) => ({
      categoryName: name,
      amount: data.amount,
      color: data.color,
      percentage: totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0,
    })
  ).sort((a, b) => b.amount - a.amount);

  const monthly: MonthlyTrendData[] = Object.entries(monthlyAggregation).map(
    ([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
    })
  );

  return {
    summary: { totalIncome, totalExpense, balance, savingsRate },
    trend: {
      incomeVariation: 0,
      expenseVariation: 0,
      balanceVariation: 0,
      incomeDirection: totalIncome > 0 ? 'up' : 'flat',
      expenseDirection: totalExpense > 0 ? 'up' : 'flat',
      balanceDirection: balance >= 0 ? 'up' : 'down',
    },
    monthly,
    categories,
  };
}