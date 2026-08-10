import { transactionsRepository } from '../repositories/transactions.repository';
import { Transaction, CreateTransactionInput } from '../domain/transaction.types';
import { transactionMapper } from '../mappers/transactionMapper';
import { Result, ResultUtils } from '../../../lib/result';
import { AppError } from '../../../lib/errors';

export const TransactionService = {
  /**
   * Obtiene las transacciones mapeándolas de persistencia (Row) a dominio
   */
  async getTransactions(profileId: string): Promise<Result<Transaction[]>> {
    try {
      const rows = await transactionsRepository.getAll(profileId);
      const domainTransactions = rows.map(row => transactionMapper.toDomain(row));
      return ResultUtils.ok(domainTransactions);
    } catch (error: any) {
      return ResultUtils.fail(
        new AppError(error.message || 'Error al obtener transacciones', 'DATABASE_ERROR')
      );
    }
  },

  /**
   * Crea una transacción validando la lógica de negocio y convirtiendo el resultado
   */
  async addTransaction(
    profileId: string,
    transactionData: CreateTransactionInput
  ): Promise<Result<Transaction>> {
    if (transactionData.amount <= 0) {
      return ResultUtils.fail(
        new AppError('El monto debe ser mayor a cero.', 'VALIDATION_ERROR')
      );
    }

    try {
      const row = await transactionsRepository.create(profileId, transactionData);
      const domainTransaction = transactionMapper.toDomain(row);
      return ResultUtils.ok(domainTransaction);
    } catch (error: any) {
      return ResultUtils.fail(
        new AppError(error.message || 'Error al crear la transacción', 'DATABASE_ERROR')
      );
    }
  },

  /**
   * Actualiza una transacción parcial o total con validaciones de negocio
   */
  async updateTransaction(
    profileId: string,
    id: string,
    transactionData: Partial<CreateTransactionInput>
  ): Promise<Result<Transaction>> {
    if (transactionData.amount !== undefined && transactionData.amount <= 0) {
      return ResultUtils.fail(
        new AppError('El monto debe ser mayor a cero.', 'VALIDATION_ERROR')
      );
    }

    try {
      const row = await transactionsRepository.update(profileId, {
        id,
        ...transactionData
      });
      const domainTransaction = transactionMapper.toDomain(row);
      return ResultUtils.ok(domainTransaction);
    } catch (error: any) {
      return ResultUtils.fail(
        new AppError(error.message || 'Error al actualizar la transacción', 'DATABASE_ERROR')
      );
    }
  },

  /**
   * Elimina una transacción físicamente de la persistencia
   */
  async removeTransaction(profileId: string, id: string): Promise<Result<void>> {
    if (!id) {
      return ResultUtils.fail(
        new AppError('Se requiere un ID válido.', 'VALIDATION_ERROR')
      );
    }

    try {
      await transactionsRepository.delete(id, profileId);
      return ResultUtils.ok(undefined);
    } catch (error: any) {
      return ResultUtils.fail(
        new AppError(error.message || 'Error al eliminar la transacción', 'DATABASE_ERROR')
      );
    }
  }
};