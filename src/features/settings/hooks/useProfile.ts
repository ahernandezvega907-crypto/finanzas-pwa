import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth'; 
import { SupabaseProfileRepository } from '../repositories/profile.repository';
import { ProfileService } from '../services/profile.service';
import { ProfileWithSettings, UpdateProfileDTO } from '../types/settings';
import { AppError } from '../../../lib/errors';

export function useProfile() {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<ProfileWithSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AppError | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Instanciamos de forma única el repositorio y servicio
  const repository = useMemo(() => new SupabaseProfileRepository(), []);
  const service = useMemo(() => new ProfileService(repository), [repository]);

  const loadProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    const result = await service.getProfile(user.id);
    
    if (result.success) {
      setProfile(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, [user?.id, service]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateProfile = useCallback(async (dto: UpdateProfileDTO) => {
    if (!user?.id || !profile) return;

    setIsSaving(true);
    setError(null);

    // 1. Guardar estado anterior para rollback
    const oldProfile = { ...profile };

    // 2. Actualización Optimista de la UI
    setProfile({
      ...profile,
      profile: {
        ...profile.profile,
        fullName: dto.fullName,
        avatarUrl: dto.avatarUrl ?? null,
      }
    });

    // 3. Llamar al servicio
    const result = await service.updateProfile(user.id, dto);

    if (!result.success) {
      // 4. Rollback si falla
      setProfile(oldProfile);
      setError(result.error);
    }
    
    setIsSaving(false);
  }, [user?.id, profile, service]);

  return useMemo(() => ({
    profile: profile?.profile ?? null,
    loading,
    error,
    isSaving,
    refresh: loadProfile,
    updateProfile,
  }), [profile, loading, error, isSaving, loadProfile, updateProfile]);
}