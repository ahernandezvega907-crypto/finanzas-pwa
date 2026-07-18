export type ErrorCode = 
  | 'AUTH_ERROR' 
  | 'DATABASE_ERROR' 
  | 'VALIDATION_ERROR' 
  | 'NOT_FOUND' 
  | 'UNKNOWN_ERROR';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}