import { AppError } from './errors';

export function getUserFriendlyError(error: unknown): string {
  if (error instanceof AppError) {
    switch (error.type) {
      case 'AUTH_ERROR':
        return 'Tu sesión expiró o no tienes permisos. Inicia sesión nuevamente.';
      case 'VALIDATION_ERROR':
        return error.message || 'Revisa los datos ingresados.';
      case 'NOT_FOUND':
        return 'No se encontró el elemento solicitado.';
      case 'NETWORK_ERROR':
        return 'No pudimos conectar con el servidor. Revisa tu conexión a internet.';
      case 'DATABASE_ERROR':
        if (error.message.toLowerCase().includes('violates foreign key')) {
          return 'La categoría seleccionada no es válida. Elige otra categoría.';
        }
        if (error.message.toLowerCase().includes('duplicate key')) {
          return 'Ya existe un elemento con ese nombre. Prueba con otro.';
        }
        return 'Ocurrió un error al guardar los datos. Intenta nuevamente.';
      default:
        return 'Ocurrió un error inesperado. Intenta nuevamente.';
    }
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('fetch') || msg.includes('network')) {
      return 'No pudimos conectar con el servidor. Revisa tu conexión a internet.';
    }
    if (msg.includes('violates foreign key') || msg.includes('constraint')) {
      return 'La categoría seleccionada no es válida. Elige otra categoría.';
    }
    if (msg.includes('duplicate key') || msg.includes('already exists')) {
      return 'Ya existe un elemento con ese nombre. Prueba con otro.';
    }
    if (msg.includes('row-level security') || msg.includes('rls')) {
      return 'No tienes permiso para realizar esta acción.';
    }
    return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }

  return 'Ocurrió un error inesperado. Intenta nuevamente.';
}