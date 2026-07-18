import React, { useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryReportItem } from '../types/reports';

interface CategoryDistributionChartProps {
  data: CategoryReportItem[];
}

// 1. Constante de colores estática fuera del componente
const COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#10b981', // Emerald
];

// 2. Formateador estático extraído fuera del renderizado
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

// 3. Envoltura estricta con React.memo
export const CategoryDistributionChart = React.memo(function CategoryDistributionChart({ 
  data 
}: CategoryDistributionChartProps) {

  // 4. Formateador de tooltip con referencia estable para evitar parpadeos en Recharts
  const tooltipFormatter = useCallback((value: unknown) => {
    return [formatCurrency(Number(value)), ''];
  }, []);

  return (
    <div className="w-full h-[350px] bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <h4 className="text-base font-semibold text-white mb-2">Distribución de Gastos</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 h-[280px] items-center">
        {data.length === 0 ? (
          <div className="col-span-2 w-full h-full flex items-center justify-center text-slate-500 text-sm">
            Sin datos de gastos en este periodo
          </div>
        ) : (
          <>
            {/* Gráfico circular */}
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="amount"
                    nameKey="categoryName"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={tooltipFormatter}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Listado de leyendas con scroll si son demasiadas */}
            <div className="overflow-y-auto max-h-[220px] pr-2 space-y-2">
              {data.map((item, index) => {
                const color = COLORS[index % COLORS.length];
                return (
                  <div key={item.categoryId} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-slate-300 font-medium truncate">{item.categoryName}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-white font-semibold">{formatCurrency(item.amount)}</span>
                      <span className="text-slate-500 ml-1.5">({item.percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default CategoryDistributionChart;