import { supabase } from '../../../lib/supabase';
import { AppError } from '../../../lib/errors';
import { Fail, Ok, Result } from '../../../lib/result';
import {
  ProfileWithSettings,
  UpdateProfileDTO,
  UpdateSettingsDTO,
} from '../types/settings';
import {
  mapProfileRow,
  ProfileRow,
} from '../utils/settingsMapper';

export interface IProfileRepository {
  getProfile(userId: string): Promise<Result<ProfileWithSettings>>;
  updateProfile(userId: string, profile: UpdateProfileDTO): Promise<Result<void>>;
  updateSettings(userId: string, settings: UpdateSettingsDTO): Promise<Result<void>>;
}

export class SupabaseProfileRepository implements IProfileRepository {
  async getProfile(userId: string): Promise<Result<ProfileWithSettings>> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return Fail(
        new AppError(
          'DATABASE_ERROR',
          error?.message ?? 'Perfil no encontrado',
          error,
        ),
      );
    }

    return Ok(mapProfileRow(data as ProfileRow));
  }

  async updateProfile(userId: string, profile: UpdateProfileDTO): Promise<Result<void>> {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.fullName,
        avatar_url: profile.avatarUrl ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      return Fail(new AppError('DATABASE_ERROR', error.message, error));
    }

    return Ok(undefined);
  }

  async updateSettings(userId: string, settings: UpdateSettingsDTO): Promise<Result<void>> {
    const { error } = await supabase
      .from('profiles')
      .update({
        preferred_currency: settings.preferredCurrency,
        language: settings.language,
        theme: settings.theme,
        date_format: settings.dateFormat,
        week_start: settings.weekStart,
        budget_cycle_day: settings.budgetCycleDay,
        notifications_enabled: settings.notificationsEnabled,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      return Fail(new AppError('DATABASE_ERROR', error.message, error));
    }

    return Ok(undefined);
  }
}