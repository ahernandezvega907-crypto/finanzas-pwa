import { z } from 'zod';

export const createTransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, 'La categoría es obligatoria'),
  amount: z.coerce.number().positive('El monto debe ser mayor que cero'),
  description: z.string().trim().max(255).default('').transform(v => v.trim()),
  date: z.string().min(1, 'La fecha es obligatoria').refine(val => !isNaN(Date.parse(val)), {
    message: 'Fecha inválida',
  }),
});

export const updateTransactionSchema = createTransactionSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreateTransactionForm = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionForm = z.infer<typeof updateTransactionSchema>;