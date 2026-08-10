import {
  CreateTransactionInput,
  Transaction,
  UpdateTransactionInput,
} from '../domain/transaction.types';
import { Result } from '../domain/result';

export interface TransactionRepository {
  getAll(): Promise<Result<Transaction[]>>;
  getById(id: string): Promise<Result<Transaction>>;
  create(input: CreateTransactionInput): Promise<Result<Transaction>>;
  update(input: UpdateTransactionInput): Promise<Result<Transaction>>;
  delete(id: string): Promise<Result<void>>;
}