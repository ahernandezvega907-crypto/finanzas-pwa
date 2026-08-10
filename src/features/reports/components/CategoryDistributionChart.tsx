import React, { useCallback, useMemo } from 'react';
import { Card, Typography, Box, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryReportItem } from '../types/reports';

interface CategoryDistributionChartProps {
  data?: CategoryReportItem[]; // 🛡️ Opcional para tolerar estados de carga iniciales
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(value);
};

export const CategoryDistributionChart = React.memo(function CategoryDistributionChart({ 
  data 
}: CategoryDistributionChartProps) {
  const theme = useTheme();

  // 1. Paleta dinámica con fallbacks seguros (??) en caso de que theme.custom no esté inicializado todavía
  const CHART_COLORS = useMemo(() => [
    theme.custom?.premium ?? '#8b5cf6',
    theme.custom?.income ?? '#10b981',
    theme.palette.primary.main,
    theme.custom?.warning ?? '#f59e0b',
    theme.palette.secondary.main,
    theme.custom?.expense ?? '#f43f5e',
  ], [theme]);

  const tooltipFormatter = useCallback((value: unknown) => {
    return [formatCurrency(Number(value)), ''];
  }, []);

  // 🛡️ Early Return: Si 'data' no se ha definido (llamada asíncrona activa), mostramos un esqueleto visual
  if (!data) {
    return (
      <Card
        sx={{
          width: '100%',
          height: 350,
          backgroundColor: theme.custom?.card ?? 'background.paper',
          border: `1px solid ${theme.custom?.border ?? 'divider'}`,
          borderRadius: `${theme.shape.borderRadius}px`,
          p: 3,
          boxShadow: theme.shadows[1],
        }}
      >
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 4, height: 240, alignItems: 'center' }}>
          <Skeleton variant="circular" width={160} height={160} />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Skeleton variant="rectangular" height={20} />
            <Skeleton variant="rectangular" height={20} />
            <Skeleton variant="rectangular" height={20} />
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        width: '100%',
        height: 350,
        backgroundColor: theme.custom?.card ?? 'background.paper',
        border: `1px solid ${theme.custom?.border ?? 'divider'}`,
        borderRadius: `${theme.shape.borderRadius}px`,
        p: 3,
        boxShadow: theme.shadows[1],
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: '1rem',
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 1,
        }}
      >
        Distribución de Gastos
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          height: 280,
          alignItems: 'center',
        }}
      >
        {data.length === 0 ? (
          <Box
            sx={{
              gridColumn: 'span 2',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.text.secondary,
              fontSize: '0.875rem',
            }}
          >
            Sin datos de gastos en este periodo
          </Box>
        ) : (
          <>
            {/* Gráfico circular */}
            <Box sx={{ width: '100%', height: 220 }}>
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
                    {data.map((item, index) => (
                      <Cell 
                        key={`pie-cell-${item.categoryId ?? item.categoryName ?? index}`} // 🛡️ Respaldo de clave único contra undefined
                        fill={CHART_COLORS[index % CHART_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.custom?.surface ?? '#0f172a',
                      border: `1px solid ${theme.custom?.border ?? '#334155'}`,
                      borderRadius: `${theme.shape.borderRadius}px`,
                      color: theme.palette.text.primary,
                    }}
                    formatter={tooltipFormatter}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Listado de leyendas con scroll */}
            <Box
              sx={{
                overflowY: 'auto',
                maxHeight: 220,
                pr: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: theme.custom?.border ?? 'divider', borderRadius: '4px' }
              }}
            >
              {data.map((item, index) => {
                const color = CHART_COLORS[index % CHART_COLORS.length];
                return (
                  <Box
                    key={`legend-row-${item.categoryId ?? item.categoryName ?? index}`} // 🛡️ Respaldo idéntico para corregir el warning de Styled(div)
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                      <Box
                        component="span"
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          flexShrink: 0,
                          backgroundColor: color,
                        }}
                      />
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          fontSize: '0.75rem',
                          color: theme.palette.text.secondary,
                          fontWeight: 500,
                        }}
                      >
                        {item.categoryName}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '0.75rem',
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(item.amount)}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '0.75rem',
                          color: theme.palette.text.secondary,
                          ml: 1,
                        }}
                      >
                        ({item.percentage}%)
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </>
        )}
      </Box>
    </Card>
  );
});

export default CategoryDistributionChart;