import { useState, useEffect, useCallback } from 'react';
import { reportsService } from '../services/reports.service';
import { ReportsData, EMPTY_REPORTS } from '../domain/reports';

export function useReports(
  profileId: string | undefined, // Tipado explícito limpio
  startDate: string,
  endDate: string,
  categoriesMap: Map<string, { name: string; color?: string }>
) {
  const [reports, setReports] = useState<ReportsData>(EMPTY_REPORTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    if (!profileId) {
      setError('No se detectó un perfil de usuario válido.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await reportsService.getReportsByPeriod(
      profileId,
      startDate,
      endDate,
      categoriesMap
    );

    if (result.success) {
      setReports(result.data);
    } else {
      setError(result.error.message);
      setReports(EMPTY_REPORTS);
    }
    setLoading(false);
  }, [profileId, startDate, endDate, categoriesMap]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    error,
    refetch: fetchReports
  };
}