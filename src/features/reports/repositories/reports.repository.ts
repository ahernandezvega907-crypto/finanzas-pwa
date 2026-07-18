import { supabase } from '../../../supabaseClient';
import type { Transaction } from '../../../types/transaction';

export const reportsRepository = {
  /**
   * Obtiene las transacciones filtradas por el perfil del usuario y un rango de fechas.
   */
  async getTransactionsByRange(
    profileId: string,
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', profileId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      throw error;
    }

    return (data as Transaction[]) || [];
  }
};