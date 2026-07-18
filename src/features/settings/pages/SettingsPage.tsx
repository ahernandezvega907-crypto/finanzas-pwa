import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle } from 'lucide-react';
import { z } from 'zod';

// Hooks de negocio
import { useProfile } from '../hooks/useProfile';
import { useSettings } from '../hooks/useSettings';

// Componentes Presentacionales y Selectores
import { ProfileCard } from '../components/ProfileCard';
import { ProfileForm } from '../components/ProfileForm';
import { CurrencySelector } from '../components/CurrencySelector';
import { ThemeSelector } from '../components/ThemeSelector';
import { LanguageSelector } from '../components/LanguageSelector';
import { NotificationSettings } from '../components/NotificationSettings';

// Esquemas de Validación
import { profileSchema, ProfileFormValues } from '../validation/profile.schema';
import { settingsSchema } from '../validation/settings.schema'; 
import { UpdateSettingsDTO } from '../types/settings';

// Inferimos el tipo exacto generado por el esquema de Zod
type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  // 1. Inicialización de los Hooks de Negocio
  const profileHook = useProfile();
  const settingsHook = useSettings();

  // 2. Formulario Independiente para el Perfil
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      avatarUrl: '',
    },
  });

  // 3. Formulario Independiente para las Preferencias usando el tipo inferido de Zod
  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      preferredCurrency: 'CRC',
      language: 'es',
      theme: 'system',
      dateFormat: 'DD/MM/YYYY',
      weekStart: 1,
      budgetCycleDay: 1,
      notificationsEnabled: true,
    },
  });

  // 4. Sincronización e Hidratación del Perfil (vía reset)
  useEffect(() => {
    if (profileHook.profile) {
      profileForm.reset({
        fullName: profileHook.profile.fullName ?? '',
        avatarUrl: profileHook.profile.avatarUrl ?? '',
      });
    }
  }, [profileHook.profile, profileForm]);

  // 5. Sincronización e Hidratación de Preferencias (vía reset con casting seguro)
  useEffect(() => {
    if (settingsHook.settings) {
      settingsForm.reset(settingsHook.settings as unknown as SettingsFormValues);
    }
  }, [settingsHook.settings, settingsForm]);

  // Manejadores de Envío (Delegación directa a los hooks)
  const onProfileSubmit = async (values: ProfileFormValues) => {
    await profileHook.updateProfile({
      fullName: values.fullName,
      avatarUrl: values.avatarUrl || null,
    });
  };

  const onSettingsSubmit = async (values: SettingsFormValues) => {
    // Convertimos los valores validados al tipo DTO que espera el servicio de forma segura
    await settingsHook.updateSettings(values as unknown as UpdateSettingsDTO);
  };

  // 6. Estado de Carga Global Inicial (Spinner Premium)
  if (profileHook.loading || settingsHook.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Cargando configuraciones de MoneyFlow...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-6 pb-12 animate-fade-in">
      {/* Encabezado Principal */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Configuración
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Gestiona tu información personal, preferencias de interfaz y notificaciones.
        </p>
      </div>

      {/* Layout Grid: 1 columna en móvil, 2 columnas a partir de XL (1280px) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: PERFIL */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Mi Perfil
            </h2>
          </div>

          {/* Tarjeta de visualización rápida */}
          {profileHook.profile && <ProfileCard profile={profileHook.profile} />}

          {/* Feedback de error contextual para Perfil */}
          {profileHook.error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Error al actualizar perfil:</span>{' '}
                {profileHook.error.message}
              </div>
            </div>
          )}

          {/* Formulario de edición */}
          {profileHook.profile && (
            <ProfileForm
              profile={profileHook.profile}
              isSaving={profileHook.isSaving}
              onSubmit={onProfileSubmit}
            />
          )}
        </div>

        {/* COLUMNA DERECHA: PREFERENCIAS */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Preferencias de la Aplicación
          </h2>

          {/* Feedback de error contextual para Preferencias */}
          {settingsHook.error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Error al guardar preferencias:</span>{' '}
                {settingsHook.error.message}
              </div>
            </div>
          )}

          <form
            onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}
            className="space-y-6 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg"
          >
            {/* Controladores Desacoplados mediante Controller */}
            <Controller
              control={settingsForm.control}
              name="preferredCurrency"
              render={({ field }) => (
                <CurrencySelector
                  value={field.value}
                  onChange={field.onChange}
                  disabled={settingsHook.isSaving}
                />
              )}
            />

            <Controller
              control={settingsForm.control}
              name="theme"
              render={({ field }) => (
                <ThemeSelector
                  value={field.value}
                  onChange={field.onChange}
                  disabled={settingsHook.isSaving}
                />
              )}
            />

            <Controller
              control={settingsForm.control}
              name="language"
              render={({ field }) => (
                <LanguageSelector
                  value={field.value}
                  onChange={field.onChange}
                  disabled={settingsHook.isSaving}
                />
              )}
            />

            <Controller
              control={settingsForm.control}
              name="notificationsEnabled"
              render={({ field }) => (
                <NotificationSettings
                  value={{ notificationsEnabled: field.value }}
                  onChange={(val) => field.onChange(val.notificationsEnabled)}
                  disabled={settingsHook.isSaving}
                />
              )}
            />

            {/* Acciones del Formulario de Preferencias */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-xs text-zinc-400">
                Los cambios se aplican de inmediato en tu sesión actual.
              </p>
              <button
                type="submit"
                disabled={settingsHook.isSaving || !settingsForm.formState.isDirty}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 rounded-xl shadow transition duration-150 ease-in-out cursor-pointer disabled:cursor-not-allowed"
              >
                {settingsHook.isSaving && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {settingsHook.isSaving ? 'Guardando...' : 'Guardar Preferencias'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}