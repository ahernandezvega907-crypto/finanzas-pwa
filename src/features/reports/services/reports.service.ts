import { reportsRepository } from "../repositories/reports.repository";
import { reportMapper } from "../utils/reportMapper";
import { calculateTrend } from "../utils/calculateTrend";
import type { ReportsData } from "../types/reports";
import type { Transaction } from "../../../types/transaction";

export interface CompleteReportsPayload {
  reportsData: ReportsData;
  rawTransactions: Transaction[];
}

export const reportsService = {
  /**
   * Obtiene los datos procesados y las transacciones crudas en un único viaje de red.
   */
  async getReportsData(
    profileId: string,
    startDate: Date,
    endDate: Date,
    categoriesMap: Record<string, string>
  ): Promise<CompleteReportsPayload> {
    const formattedStart = startDate.toISOString().split("T")[0];
    const formattedEnd = endDate.toISOString().split("T")[0];

    // 1. Obtener transacciones del rango seleccionado (UNA SOLA VEZ)
    const transactions = await reportsRepository.getTransactionsByRange(
      profileId,
      formattedStart,
      formattedEnd
    );

    // 2. Mapear los datos analíticos base
    const reportsData = reportMapper(transactions, categoriesMap);

    // 3. Calcular la tendencia comparando el mes actual frente al anterior
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0];
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0];

    try {
      const [currentMonthTx, previousMonthTx] = await Promise.all([
        reportsRepository.getTransactionsByRange(profileId, currentMonthStart, currentMonthEnd),
        reportsRepository.getTransactionsByRange(profileId, prevMonthStart, prevMonthEnd),
      ]);

      const currentTotals = currentMonthTx.reduce(
        (acc, t) => {
          if (t.type === "income") acc.income += t.amount;
          else acc.expense += t.amount;
          acc.balance = acc.income - acc.expense;
          return acc;
        },
        { income: 0, expense: 0, balance: 0 }
      );

      const previousTotals = previousMonthTx.reduce(
        (acc, t) => {
          if (t.type === "income") acc.income += t.amount;
          else acc.expense += t.amount;
          acc.balance = acc.income - acc.expense;
          return acc;
        },
        { income: 0, expense: 0, balance: 0 }
      );

      reportsData.trend = calculateTrend(currentTotals, previousTotals);
    } catch (error) {
      console.warn("No se pudieron calcular las tendencias mensuales:", error);
    }

    return {
      reportsData,
      rawTransactions: transactions // Reutilizamos el mismo array descargado para evitar otra consulta de red
    };
  },

  /**
   * Mantenemos el método por compatibilidad por si es llamado de forma aislada
   */
  async getRawTransactionsForExport(
    profileId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    return await reportsRepository.getTransactionsByRange(
      profileId,
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0]
    );
  }
};