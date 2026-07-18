import React, { useMemo, useCallback, lazy, Suspense } from 'react';
import { useReports } from '../features/reports/hooks/useReports';
import ReportSummaryCards from '../features/reports/components/ReportSummaryCards';

// Importación dinámica (Lazy Load) de componentes de gráficos pesados
const IncomeVsExpenseChart = lazy(() => import('../features/reports/components/IncomeVsExpenseChart'));
const CategoryDistributionChart = lazy(() => import('../features/reports/components/CategoryDistributionChart'));

// Skeleton Loader para evitar saltos bruscos de maquetación (CLS) durante la carga perezosa
function ChartSkeleton() {
  return (
    <div className="w-full h-[350px] bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse">
      <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
      <div className="h-[250px] bg-slate-950/50 rounded-xl" />
    </div>
  );
}

export default function Reports() {
  // Mapa de categorías memoizado para evitar recrear referencias
  const emptyCategoriesMap = useMemo(() => ({}), []);

  // Consumimos el hook de reportes pasándole las dependencias estables.
  // Ahora extraemos también las fechas directamente del hook como fuente de verdad.
  const { 
    reports, 
    loading, 
    error, 
    startDate,
    endDate,
    setDateRange,
    exportToCsv, 
    exportToExcel, 
    exportToPdf 
  } = useReports(emptyCategoriesMap);

  // Sincronizamos las fechas manuales directamente en el estado único del hook
  const handleDateChange = useCallback((type: 'start' | 'end', value: string) => {
    const parsedDate = new Date(value);
    if (isNaN(parsedDate.getTime())) return;

    if (type === 'start') {
      setDateRange(parsedDate, endDate);
    } else {
      setDateRange(startDate, parsedDate);
    }
  }, [startDate, endDate, setDateRange]);

  // Manejador para cambiar los rangos de fecha rápidos directamente en el hook
  const handlePresetChange = useCallback((days: number) => {
    const end = new Date();
    const start = new Date();
    if (days === 0) {
      // Mes actual (día 1 del mes en curso)
      start.setDate(1);
    } else {
      start.setDate(end.getDate() - days);
    }
    setDateRange(start, end);
  }, [setDateRange]);

  return (
    <div className="space-y-6 pb-12">
      {/* CABECERA Y FILTROS DE FECHA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Reportes Analíticos</h2>
          <p className="text-sm text-slate-400">Gráficos y análisis profundo de tus flujos financieros.</p>
        </div>

        {/* selectores rápidos de fecha */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handlePresetChange(0)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            Este Mes
          </button>
          <button
            onClick={() => handlePresetChange(30)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            Últimos 30 días
          </button>
          <button
            onClick={() => handlePresetChange(90)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            Trimestre
          </button>

          {/* Exportación */}
          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-800 pl-3">
            <button
              onClick={exportToCsv}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              title="Exportar a CSV"
              disabled={loading || !reports}
            >
              CSV
            </button>
            <button
              onClick={exportToExcel}
              className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-all text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              title="Exportar a Excel"
              disabled={loading || !reports}
            >
              Excel
            </button>
            <button
              onClick={exportToPdf}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              title="Exportar a PDF"
              disabled={loading || !reports}
            >
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* RANGO DE FECHAS MANUAL */}
      <div className="flex flex-wrap gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 items-center">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-500">Desde</span>
          <input
            type="date"
            value={startDate.toISOString().split('T')[0]}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-500">Hasta</span>
          <input
            type="date"
            value={endDate.toISOString().split('T')[0]}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* ESTADOS: CARGANDO / ERROR */}
      {loading && (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Calculando estadísticas financieras...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center text-sm">
          ⚠️ Ocurrió un error al procesar el reporte: {error}
        </div>
      )}

      {/* PANEL PRINCIPAL DE REPORTES */}
      {!loading && !error && reports && (
        <div className="space-y-6">
          {/* Fila 1: Tarjetas de Sumarios */}
          <ReportSummaryCards summary={reports.summary} trend={reports.trend} />

          {/* Fila 2: Gráficos de Análisis con carga perezosa administrada por Suspense */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<ChartSkeleton />}>
              <IncomeVsExpenseChart data={reports.monthly} />
            </Suspense>
            
            <Suspense fallback={<ChartSkeleton />}>
              <CategoryDistributionChart data={reports.categories} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}