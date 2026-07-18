import { useState, useEffect, useMemo, useCallback } from "react";
import { reportsService } from "../services/reports.service";
import { exportCsv } from "../utils/exportCsv";
import { exportExcel } from "../utils/exportExcel";
import { exportPdf } from "../utils/exportPdf";
import type { ReportsData } from "../types/reports";
import type { Transaction } from "../../../types/transaction";
import { supabase } from "../../../supabaseClient";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface UseReportsResult {
  reports: ReportsData | null;
  rawTransactions: Transaction[];
  loading: boolean;
  error: string | null;
  startDate: Date;
  endDate: Date;
  setDateRange: (start: Date, end: Date) => void;
  exportToCsv: () => void;
  exportToExcel: () => void;
  exportToPdf: () => void;
}

export function useReports(categoriesMap: Record<string, string>): UseReportsResult {
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [rawTransactions, setRawTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Unificamos el rango en un solo estado para garantizar actualizaciones atómicas
  const [dateRange, setDateRangeState] = useState<DateRange>(() => {
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      startDate: start,
      endDate: new Date()
    };
  });

  const setDateRange = useCallback((start: Date, end: Date) => {
    setDateRangeState({ startDate: start, endDate: end });
  }, []);

  // Hashing seguro de categoriesMap para evitar re-renders por desalineación de referencias
  const categoriesMapHash = useMemo(() => JSON.stringify(categoriesMap), [categoriesMap]);

  // Serialización de las fechas para que el useEffect reaccione únicamente al valor temporal real
  const dateRangeHash = useMemo(() => {
    return `${dateRange.startDate.getTime()}-${dateRange.endDate.getTime()}`;
  }, [dateRange]);

  useEffect(() => {
    let isMounted = true;

    async function fetchReports() {
      setLoading(true);
      setError(null);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          throw new Error("No se pudo identificar al usuario activo.");
        }

        const parsedCategoriesMap = JSON.parse(categoriesMapHash);

        // Una sola llamada unificada al servicio para traer reportes y transacciones crudas
        const { reportsData, rawTransactions: rawTx } = await reportsService.getReportsData(
          user.id,
          dateRange.startDate,
          dateRange.endDate,
          parsedCategoriesMap
        );

        if (isMounted) {
          setReports(reportsData);
          setRawTransactions(rawTx);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Error desconocido cargando reportes.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchReports();

    return () => {
      isMounted = false;
    };
  }, [dateRangeHash, categoriesMapHash]); // Dependencias ultra estables basadas en primitivos serializados

  // Memorizamos las funciones de exportación de forma blindada contra cambios de referencia de categoriesMap
  const exportToCsv = useCallback(() => {
    const activeCategoriesMap = JSON.parse(categoriesMapHash);
    exportCsv(rawTransactions, activeCategoriesMap);
  }, [rawTransactions, categoriesMapHash]);

  const exportToExcel = useCallback(() => {
    const activeCategoriesMap = JSON.parse(categoriesMapHash);
    exportExcel(rawTransactions, activeCategoriesMap);
  }, [rawTransactions, categoriesMapHash]);

  const exportToPdf = useCallback(() => {
    const activeCategoriesMap = JSON.parse(categoriesMapHash);
    exportPdf(rawTransactions, activeCategoriesMap);
  }, [rawTransactions, categoriesMapHash]);

  return {
    reports,
    rawTransactions,
    loading,
    error,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    setDateRange,
    exportToCsv,
    exportToExcel,
    exportToPdf,
  };
}