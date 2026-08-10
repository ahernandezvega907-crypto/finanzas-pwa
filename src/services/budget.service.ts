import { BudgetRepository } from '../repositories/budget.repository';
import { Budget, CreateBudgetDTO } from '../types/budget';
import { Result, ResultUtils } from '../lib/result';
import { AppError } from '../lib/errors';

export const BudgetService = {
  /**
   * Recupera todos los presupuestos configurados por el usuario.
   */
  async getBudgets(): Promise<Result<Budget[]>> {
    return await BudgetRepository.getAll();
  },

  /**
   * Crea un nuevo presupuesto verificando los rangos de fechas obligatorios.
   */
  async addBudget(budgetData: CreateBudgetDTO): Promise<Result<Budget>> {
    if (new Date(budgetData.start_date) >= new Date(budgetData.end_date)) {
      return ResultUtils.fail(
        new AppError('La fecha de inicio debe ser estrictamente anterior a la fecha de finalización.', 'VALIDATION_ERROR')
      );
    }
    return await BudgetRepository.create(budgetData);
  },

  /**
   * Incrementa o modifica el gasto acumulado de un presupuesto específico.
   */
  async syncBudgetSpent(id: string, currentSpent: number): Promise<Result<Budget>> {
    if (currentSpent < 0) {
      return ResultUtils.fail(
        new AppError('El gasto acumulado de un presupuesto no puede ser negativo.', 'VALIDATION_ERROR')
      );
    }
    return await BudgetRepository.updateSpent(id, currentSpent);
  }
};