import { AppError } from './errors';

export type Result<T> = 
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: AppError };

export const ResultUtils = {
  ok: <T>(data: T): Result<T> => ({
    success: true,
    data,
    error: null,
  }),
  
  fail: <T>(error: AppError): Result<T> => ({
    success: false,
    data: null,
    error,
  }),
};