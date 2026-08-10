import { supabase } from '../lib/supabase';
import { Profile } from '../types/profile';
import { Result, ResultUtils } from '../lib/result';
import { AppError } from '../lib/errors';

export const ProfileRepository = {
  /**
   * Obtiene los datos del perfil del usuario actualmente autenticado.
   */
  async getCurrentProfile(): Promise<Result<Profile>> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        return ResultUtils.fail(
          new AppError('Sesión inválida o expirada', 'AUTH_ERROR', authError)
        );
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (error) {
        return ResultUtils.fail(
          new AppError(`Error al obtener el perfil de la base de datos: ${error.message}`, 'DATABASE_ERROR', error)
        );
      }

      return ResultUtils.ok(data as Profile);
    } catch (err) {
      return ResultUtils.fail(
        new AppError('Fallo de conexión al recuperar el perfil del usuario', 'NETWORK_ERROR', err)
      );
    }
  },

  /**
   * Actualiza los datos editables del perfil del usuario.
   */
  async updateProfile(updates: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>): Promise<Result<Profile>> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        return ResultUtils.fail(
          new AppError('Usuario no autenticado para modificar datos de perfil', 'AUTH_ERROR', authError)
        );
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', authData.user.id)
        .select()
        .single();

      if (error) {
        return ResultUtils.fail(
          new AppError(`Error al actualizar campos del perfil: ${error.message}`, 'DATABASE_ERROR', error)
        );
      }

      return ResultUtils.ok(data as Profile);
    } catch (err) {
      return ResultUtils.fail(
        new AppError('Fallo inesperado al intentar actualizar la información de usuario', 'UNKNOWN_ERROR', err)
      );
    }
  }
};