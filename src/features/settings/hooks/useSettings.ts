import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { SupabaseProfileRepository } from '../repositories/profile.repository';
import { ProfileService } from '../services/profile.service';
import { ProfileWithSettings, UpdateSettingsDTO } from '../types/settings';
import { AppError } from '../../../lib/errors';

export function useSettings() {
  const { user } = useAuth();

  const [profileWithSettings, setProfileWithSettings] = useState<ProfileWithSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AppError | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const repository = useMemo(() => new SupabaseProfileRepository(), []);
  const service = useMemo(() => new ProfileService(repository), [repository]);

  const loadSettings = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await service.getProfile(user.id);

    if (result.success) {
      setProfileWithSettings(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, [user?.id, service]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = useCallback(async (dto: UpdateSettingsDTO) => {
    if (!user?.id || !profileWithSettings) return;

    setIsSaving(true);
    setError(null);

    const oldState = { ...profileWithSettings };

    // Actualización optimista
    setProfileWithSettings({
      ...profileWithSettings,
      settings: { ...dto }
    });

    const result = await service.updateSettings(user.id, dto);

    if (!result.success) {
      // Rollback
      setProfileWithSettings(oldState);
      setError(result.error);
    }

    setIsSaving(false);
  }, [user?.id, profileWithSettings, service]);

  return useMemo(() => ({
    settings: profileWithSettings?.settings ?? null,
    loading,
    error,
    isSaving,
    refresh: loadSettings,
    updateSettings,
  }), [profileWithSettings, loading, error, isSaving, loadSettings, updateSettings]);
}