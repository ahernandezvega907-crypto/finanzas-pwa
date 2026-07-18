import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserProfile, UpdateProfileDTO } from '../types/settings';
import { profileSchema, ProfileFormValues } from '../validation/profile.schema';

interface ProfileFormProps {
  profile: UserProfile;
  isSaving: boolean;
  onSubmit: (dto: UpdateProfileDTO) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  isSaving,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName ?? '',
      avatarUrl: profile.avatarUrl ?? '',
    },
  });

  // Si los datos del perfil cargan después o cambian, reseteamos los valores del formulario
  useEffect(() => {
    reset({
      fullName: profile.fullName ?? '',
      avatarUrl: profile.avatarUrl ?? '',
    });
  }, [profile, reset]);

  const handleFormSubmit = async (values: ProfileFormValues) => {
    await onSubmit({
      fullName: values.fullName,
      avatarUrl: values.avatarUrl || null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm"
    >
      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
        Información del Perfil
      </h3>

      <div className="space-y-4">
        {/* Campo de Nombre Completo */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Nombre Completo
          </label>
          <input
            type="text"
            id="fullName"
            className={`w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.fullName
                ? 'border-red-500 dark:border-red-500/30'
                : 'border-zinc-300 dark:border-zinc-800'
            }`}
            placeholder="Ej. Juan Pérez"
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        {/* Campo de URL de Avatar */}
        <div>
          <label
            htmlFor="avatarUrl"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            URL de la Foto de Perfil (Opcional)
          </label>
          <input
            type="text"
            id="avatarUrl"
            className={`w-full px-3 py-2 border rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.avatarUrl
                ? 'border-red-500 dark:border-red-500/30'
                : 'border-zinc-300 dark:border-zinc-800'
            }`}
            placeholder="https://ejemplo.com/mi-foto.jpg"
            {...register('avatarUrl')}
          />
          {errors.avatarUrl && (
            <p className="mt-1 text-xs text-red-500">{errors.avatarUrl.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving || !isDirty}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 rounded-lg shadow transition duration-150 ease-in-out cursor-pointer disabled:cursor-not-allowed"
        >
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
};