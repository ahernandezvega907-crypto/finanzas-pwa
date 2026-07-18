import { z } from 'zod';

export const settingsSchema = z.object({
  preferredCurrency: z.enum(['CRC', 'USD', 'EUR']),

  language: z.enum(['es', 'en']),

  theme: z.enum(['light', 'dark', 'system']),

  dateFormat: z.enum([
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY-MM-DD',
  ]),

  weekStart: z
    .number()
    .int()
    .min(0)
    .max(6),

  budgetCycleDay: z
    .number()
    .int()
    .min(1)
    .max(28),

  notificationsEnabled: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;