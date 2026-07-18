import { z } from "zod";

export const budgetSchema = z.object({
  category_id: z.string().uuid("Debes seleccionar una categoría válida"),
  // Un validador numérico limpio que no causa fricción de tipos
  limit_amount: z
    .number()
    .positive("El límite de presupuesto debe ser mayor a 0"),
  // Un enum directo y universal
  period: z.enum(["monthly", "weekly", "yearly"]),
});

export type BudgetSchemaInput = z.infer<typeof budgetSchema>;