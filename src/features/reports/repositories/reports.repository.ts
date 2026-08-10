import { supabase } from '../../../lib/supabase';
import { Result } from '../../../types/result';

export interface DBTransaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category_id: string;
  created_at: string;
  categories: {
    name: string;
    color?: string;
  } | null;
}

export class ReportsRepository {
  /**
   * Obtiene las transacciones de un usuario en un rango de fechas.
   */
  async getTransactionsByRange(
    profileId: string,
    startDate: string,
    endDate: string
  ): Promise<Result<DBTransaction[]>> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          type,
          category_id,
          created_at,
          categories (
            name,
            color
          )
        `)
        .eq('profile_id', profileId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) {
        return {
          success: false,
          error: { message: error.message, code: error.code }
        };
      }

      return { 
        success: true, 
        data: (data as unknown as DBTransaction[]) || [] 
      };
    } catch (err) {
      return {
        success: false,
        error: { 
          message: err instanceof Error ? err.message : 'Error inesperado en el repositorio de reportes' 
        }
      };
    }
  }
}

// Instancia única exportada para resolver el error de Vite
export const reportsRepository = new ReportsRepository();