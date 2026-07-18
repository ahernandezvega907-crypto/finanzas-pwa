import { z } from 'zod';

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Debe contener al menos 2 caracteres')
    .max(80, 'Máximo 80 caracteres'),

  avatarUrl: z
    .string()
    .url('URL inválida')
    .nullable()
    .optional()
    .or(z.literal('')),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;