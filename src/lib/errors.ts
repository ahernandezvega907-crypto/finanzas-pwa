export type AppErrorType = 
  | 'AUTH_ERROR' 
  | 'DATABASE_ERROR' 
  | 'VALIDATION_ERROR' 
  | 'NOT_FOUND' 
  | 'NETWORK_ERROR' 
  | 'UNKNOWN_ERROR';

export class AppError extends Error {
  public readonly type: AppErrorType;
  public readonly originalError?: unknown;

  constructor(message: string, type: AppErrorType = 'UNKNOWN_ERROR', originalError?: unknown) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
    
    // Casteo preventivo a 'any' para evitar que TypeScript se queje en el navegador
    const errorConstructor = Error as any;
    if (errorConstructor.captureStackTrace) {
      errorConstructor.captureStackTrace(this, AppError);
    }
  }
}