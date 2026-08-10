import { reportsRepository } from '../repositories/reports.repository';
import { reportMapper } from '../mappers/report.mapper'; // Ajusta la ruta a tu mapper si varía
import { Result } from '../../../types/result';
import { ReportsData } from '../domain/reports';

export class ReportsService {
  async getReportsByPeriod(
    profileId: string,
    startDate: string,
    endDate: string,
    categoriesMap: Map<string, { name: string; color?: string }>
  ): Promise<Result<ReportsData>> {
    
    // 1. Llamada al repositorio con el contrato unificado
    const result = await reportsRepository.getTransactionsByRange(
      profileId,
      startDate,
      endDate
    );

    // 2. Control seguro del patrón Result antes del mapeo
    if (!result.success) {
      return {
        success: false,
        error: { message: `Error al obtener reportes: ${result.error.message}` }
      };
    }

    // 3. Extracción limpia de los datos crudos
    const transactions = result.data;

    try {
      // 4. Mapeo seguro hacia el modelo de dominio
      const reportsData = reportMapper(transactions, categoriesMap);
      
      return {
        success: true,
        data: reportsData
      };
    } catch (err) {
      return {
        success: false,
        error: { 
          message: err instanceof Error ? err.message : 'Error durante el procesamiento analítico de datos.' 
        }
      };
    }
  }
}

export const reportsService = new ReportsService();