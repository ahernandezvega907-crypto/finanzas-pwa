import { supabase } from '../lib/supabase';
import { Result, ResultUtils } from '../lib/result';
import { AppError } from '../lib/errors';

export const AuthService = {
  /**
   * Cierra la sesión activa del usuario actual.
   */
  async signOut(): Promise<Result<void>> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return ResultUtils.fail(
          new AppError(`Error al cerrar sesión: ${error.message}`, 'AUTH_ERROR', error)
        );
      }
      return ResultUtils.ok(undefined);
    } catch (err) {
      return ResultUtils.fail(
        new AppError('Fallo inesperado durante el proceso de cierre de sesión', 'UNKNOWN_ERROR', err)
      );
    }
  },

  /**
   * Obtiene los datos del usuario actualmente autenticado desde la sesión.
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        return ResultUtils.fail(
          new AppError(`Error al validar usuario activo: ${error.message}`, 'AUTH_ERROR', error)
        );
      }
      return ResultUtils.ok(data.user);
    } catch (err) {
      return ResultUtils.fail(
        new AppError('Error de red crítico al verificar el estado de la sesión', 'NETWORK_ERROR', err)
      );
    }
  }
};