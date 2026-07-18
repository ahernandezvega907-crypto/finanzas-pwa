import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'El nombre no puede superar los 50 caracteres'),
  type: z.enum(['income', 'expense'], { message: 'El tipo debe ser income o expense' }),
  icon: z.string().min(1, 'El ícono es obligatorio').max(30),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, { message: 'El color debe ser un formato HEX válido (ej. #10b981)' }),
  is_custom: z.boolean().default(true),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;