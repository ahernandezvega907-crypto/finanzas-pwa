import { AppError } from './errors';

export type Result<T, E = AppError> = 
  | { success: true; data: T } 
  | { success: false; error: E };

export const Ok = <T>(data: T): Result<T, never> => ({ success: true, data });
export const Fail = <E = AppError>(error: E): Result<never, E> => ({ success: false, error });