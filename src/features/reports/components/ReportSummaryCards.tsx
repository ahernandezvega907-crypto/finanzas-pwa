import React from 'react';
import type { ReportSummary, TrendReport } from '../types/reports';

interface ReportSummaryCardsProps {
  summary?: ReportSummary; // 🛡️ Marcado como opcional para manejo defensivo
  trend?: TrendReport;     // 🛡️ Marcado como opcional para manejo defensivo
}

// 1. Formateador de moneda extraído del render
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

// 2. Helper visual de tendencias extraído del render para evitar recreaciones innecesarias
const renderTrendBadge = (variation: number, direction: 'up' | 'down' | 'flat', isExpense: boolean = false) => {
  if (direction === 'flat' || variation === 0) {
    return (
      <span className="text-xs font-medium text-slate-400">
        Sin cambios vs mes anterior
      </span>
    );
  }

  const isPositive = isExpense ? direction === 'down' : direction === 'up';
  const colorClass = isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10';
  const prefix = direction === 'up' ? '▲' : '▼';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {prefix} {Math.abs(variation)}%
    </span>
  );
};

export const ReportSummaryCards = React.memo(function ReportSummaryCards({ 
  summary, 
  trend 
}: ReportSummaryCardsProps) {
  
  // 🛡️ Early Return: Si los datos globales aún no existen, evitamos lecturas de undefined
  if (!summary || !trend) {
    return null; 
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* CARD: INGRESOS */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-slate-400">Total Ingresos</span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {formatCurrency(summary.totalIncome)}
        </h3>
        {renderTrendBadge(trend.incomeVariation, trend.incomeDirection)}
      </div>

      {/* CARD: GASTOS */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-slate-400">Total Gastos</span>
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {formatCurrency(summary.totalExpense)}
        </h3>
        {renderTrendBadge(trend.expenseVariation, trend.expenseDirection, true)}
      </div>

      {/* CARD: BALANCE */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-slate-400">Balance Neto</span>
          <div className={`p-2 rounded-lg ${summary.balance >= 0 ? 'bg-teal-500/10 text-teal-400' : 'bg-rose-500/10 text-rose-400'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${summary.balance >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
          {formatCurrency(summary.balance)}
        </h3>
        {renderTrendBadge(trend.balanceVariation, trend.balanceDirection)}
      </div>

      {/* CARD: TASA DE AHORRO */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-slate-400">Tasa de Ahorro</span>
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {summary.savingsRate}%
        </h3>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(Math.max(summary.savingsRate, 0), 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
});

export default ReportSummaryCards;