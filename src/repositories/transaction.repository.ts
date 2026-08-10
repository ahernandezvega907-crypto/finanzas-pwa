import { supabase } from '../lib/supabase';
import { Transaction, CreateTransactionDTO } from '../types/transaction';
import { Result, ResultUtils } from '../lib/result';
import { AppError } from '../lib/errors';

export const TransactionRepository = {
  /**
   * Obtiene todas las transacciones del usuario autenticado ordenadas por fecha descendente.
   */
  async getAll(): Promise<Result<Transaction[]>> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (error) {
        return ResultUtils.fail(
          new AppError(`Error al obtener transacciones: ${error.message}`, 'DATABASE_ERROR', error)
        );
      }

      return ResultUtils.ok(data as Transaction[]);
    } catch (err) {
      return ResultUtils.fail(
        new AppError('Fallo inesperado de red al recuperar transacciones', 'NETWORK_ERROR', err)
      );
    }
  },

  /**
   * Inserta una nueva transacción vinculada automáticamente al perfil del usuario activo.
   */
  async create(transaction: CreateTransactionDTO): Promise<Result<Transaction>> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        return ResultUtils.fail(
          new AppError('Usuario no autenticado para realizar esta operación', 'AUTH_ERROR', authError)
        );
      }

      const newTransaction = {
        ...transaction,
        profile_id: authData.user.id,
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([newTransaction])
        .select()
        .single();

      if (error) {
        return ResultUtils.fail(
          new AppError(`Error al insertar transacción: ${error.message}`, 'DATABASE_ERROR', error)
        );
      }

      return ResultUtils.ok(data as Transaction);
    } catch (err) {
      return ResultUtils.fail(
        new AppError('Fallo inesperado al intentar registrar la transacción', 'UNKNOWN_ERROR', err)
      );
    }
  },

  /**
   * Actualiza una transacción existente por su ID.
   */
  async update(id: string, dto: CreateTransactionDTO): Promise<Result<Transaction>> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          category_id: dto.category_id,
          amount: dto.amount,
          type: dto.type,
          description: dto.description,
          date: dto.date,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return ResultUtils.fail(
          new AppError(`Error al actualizar transacción: ${error.message}`, 'DATABASE_ERROR', error)
        );
      }

      return ResultUtils.ok(data as Transaction);
    } catch (err) {
      return ResultUtils.fail(
        new AppError('Fallo inesperado al actualizar la transacción', 'UNKNOWN_ERROR', err)
      );
    }
  },

  /**
   * Elimina una transacción específica por su ID.
   */
  async delete(id: string): Promise<Result<void>> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        return ResultUtils.fail(
          new AppError(`Error al eliminar transacción: ${error.message}`, 'DATABASE_ERROR', error)
        );
      }

      return ResultUtils.ok(undefined);
    } catch (err) {
      return ResultUtils.fail(
        new AppError('Fallo inesperado al intentar eliminar la transacción', 'UNKNOWN_ERROR', err)
      );
    }
  }
};