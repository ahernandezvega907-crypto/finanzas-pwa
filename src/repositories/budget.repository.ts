import { supabase } from '../lib/supabase';
import { Budget, CreateBudgetDTO } from '../types/budget';
import { Result, ResultUtils } from '../lib/result';
import { AppError } from '../lib/errors';

export const BudgetRepository = {
  /**
   * Obtiene todos los presupuestos activos del usuario autenticado.
   */
  async getAll(): Promise<Result<Budget[]>> {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) {
        return ResultUtils.fail(
          new AppError(`Error al recuperar presupuestos: ${error.message}`, 'DATABASE_ERROR', error)
        );
      }

      return ResultUtils.ok(data as Budget[]);
    } catch (err) {
      return ResultUtils.fail(
        new AppError('Fallo inesperado de red al cargar el catálogo de presupuestos', 'NETWORK_ERROR', err)
      );
    }
  },

  /**
   * Establece un nuevo tope de presupuesto mensual para una categoría específica.
   */
  async create(budget: CreateBudgetDTO): Promise<Result<Budget>> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        return ResultUtils.fail(
          new AppError('Usuario no autenticado para realizar esta operación', 'AUTH_ERROR', authError)
        );
      }

      const newBudget = {
        ...budget,
        profile_id: authData.user.id,
        current_spent: 0.00 // Todo presupuesto nuevo inicia con gasto cero
      };

      const { data, error } = await supabase
        .from('budgets')
        .insert([newBudget])
        .select()
        .single();

      if (error) {
        return ResultUtils.fail(
          new AppError(`Error al insertar presupuesto: ${error.message}`, 'DATABASE_ERROR', error)
        );
      }

      return ResultUtils.ok(data as Budget);
    } catch (err) {
      return ResultUtils.fail(
        new AppError('Fallo inesperado al intentar registrar el presupuesto', 'UNKNOWN_ERROR', err)
      );
    }
  },

  /**
   * Actualiza el monto gastado acumulado o el límite asignado a un presupuesto existente.
   */
  async updateSpent(id: string, currentSpent: number): Promise<Result<Budget>> {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .update({ current_spent: currentSpent, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return ResultUtils.fail(
          new AppError(`Error al actualizar el acumulado del presupuesto: ${error.message}`, 'DATABASE_ERROR', error)
        );
      }

      return ResultUtils.ok(data as Budget);
    } catch (err) {
      return ResultUtils.fail(
        new AppError('Fallo inesperado al modificar el registro del presupuesto', 'UNKNOWN_ERROR', err)
      );
    }
  }
};