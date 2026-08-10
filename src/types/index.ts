export interface User {
  id: string;
  email?: string;
  created_at: string;
}

// Estos comandos le dicen al index que agarre todo lo de los otros archivos y lo exporte aquí de golpe
// Centralización indexada de tipos de MoneyFlow
export * from './auth';
export * from './category';
export * from './transaction';
export * from './profile';
export * from './budget';
export * from './result';