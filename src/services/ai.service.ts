import { supabase } from '../lib/supabase';

export interface FinancialContext {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  budgetsStatus?: { category: string; limit: number; spent: number }[];
}

export async function askAiGuru(userPrompt: string, context?: FinancialContext): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-advice', {
      body: { userPrompt, context },
    });

    if (error) {
      console.error('Error al invocar gemini-advice:', error);
      return 'Lo siento, ocurrió un error al comunicarme con el servidor. Intenta de nuevo.';
    }

    if (data?.error) {
      return data.error;
    }

    return data.text;
  } catch (err) {
    console.error('Error en servicio de IA:', err);
    return 'Ocurrió un error inesperado al procesar tu solicitud.';
  }
}