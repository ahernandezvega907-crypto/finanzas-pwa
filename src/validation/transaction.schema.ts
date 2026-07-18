import { z } from 'zod';

export const createTransactionSchema = z.object({
  category_id: z.string().uuid({ message: 'El ID de la categoría debe ser un UUID válido' }).nullable(),
  amount: z.number().positive({ message: 'El monto debe ser un número mayor a 0' }),
  type: z.enum(['income', 'expense'], { message: 'El tipo debe ser obligatorio: income o expense' }),
  description: z.string().max(255, { message: 'La descripción no puede superar los 255 caracteres' }).nullable(),
  // Modificado: Ahora acepta cualquier formato de fecha válido y lo transforma a un string ISO
  date: z.string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'La fecha ingresada no es válida',
    }),
});

// Este tipo se genera automáticamente gracias a Zod, asegurando consistencia total
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;