import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import type { MonthlyReportItem } from '../types/reports';

interface IncomeVsExpenseChartProps {
  data?: MonthlyReportItem[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatMonth = (value: string) => {
  try {
    const [year, month] = value.split('-');
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
  } catch {
    return value;
  }
};

export const IncomeVsExpenseChart = React.memo(function IncomeVsExpenseChart({ data }: IncomeVsExpenseChartProps) {
  return (
    <div className="w-full h-[350px] bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <h4 className="text-base font-semibold text-white mb-4">Evolución Mensual (Ingresos vs Gastos)</h4>
      <div className="w-full h-[280px]">
        {!data ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm animate-pulse">
            Cargando gráfico de evolución...
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
            Sin datos en el periodo seleccionado
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatMonth}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontFamily: 'inherit',
                }}
                formatter={(value: any) => [formatCurrency(Number(value)), '']}
                labelFormatter={(label: any) => `Periodo: ${formatMonth(String(label))}`}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
              />
              <Bar
                name="Ingresos"
                dataKey="income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                name="Gastos"
                dataKey="expense"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
});

export default IncomeVsExpenseChart;