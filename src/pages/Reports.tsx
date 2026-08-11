import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import TableChartIcon from '@mui/icons-material/TableChart';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

import { useTransactions } from '../features/transactions/hooks/useTransactions';
import { useCategories } from '../features/categories/hooks/useCategories';

export const Reports: React.FC = () => {
  const { transactions, loading } = useTransactions();
  const { categoriesQuery } = useCategories();
  const categories = categoriesQuery?.data || [];

  const [filterType, setFilterType] = useState<string>('all');

  // Transacciones filtradas por tipo
  const filteredTransactions = useMemo(() => {
    if (filterType === 'all') return transactions;
    return transactions.filter((tx: any) => tx.type === filterType);
  }, [transactions, filterType]);

  // Agrupación de saldos por fecha para el gráfico de área
  const timelineData = useMemo(() => {
    const sorted = [...transactions].sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dateMap: Record<string, { income: number; expense: number }> = {};

    sorted.forEach((tx: any) => {
      const dateKey = tx.date ? tx.date.split('T')[0] : 'Sin fecha';
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { income: 0, expense: 0 };
      }
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        dateMap[dateKey].income += amt;
      } else if (tx.type === 'expense') {
        dateMap[dateKey].expense += amt;
      }
    });

    return Object.keys(dateMap).map((date) => ({
      date,
      Ingresos: dateMap[date].income,
      Gastos: dateMap[date].expense,
    }));
  }, [transactions]);

  // Función para exportar las transacciones filtradas a CSV
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['ID', 'Fecha', 'Tipo', 'Monto (CRC)', 'Categoría', 'Descripción'];
    const rows = filteredTransactions.map((tx: any) => {
      const catObj = categories.find((c: any) => c.id === (tx.category_id || tx.categoryId));
      const catName = catObj ? catObj.name : 'Sin Categoría';
      return [
        tx.id,
        tx.date ? tx.date.split('T')[0] : '',
        tx.type === 'income' ? 'Ingreso' : 'Gasto',
        tx.amount,
        `"${catName}"`,
        `"${(tx.description || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_finanzas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount: number) => {
    return `₡${amount.toLocaleString('es-CR', { minimumFractionDigits: 0 })}`;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1100, margin: '0 auto' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Reportes y Exportación
        </Typography>

        <Button
          variant="contained"
          color="success"
          startIcon={<DownloadIcon />}
          onClick={exportToCSV}
          disabled={filteredTransactions.length === 0}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Exportar a CSV
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Gráfico de Tendencia Temporal */}
          <Paper sx={{ p: 3, borderRadius: 3, mb: 4, boxShadow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Evolución Temporal de Flujos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {timelineData.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                No hay transacciones registradas para mostrar tendencias.
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(val) => `₡${val}`} />
                  <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value) || 0)} />
                  <Area
                    type="monotone"
                    dataKey="Ingresos"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorIngresos)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Gastos"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#colorGastos)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Paper>

          {/* Panel de Resumen de Exportación */}
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Vista Previa de Datos a Exportar
              </Typography>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Filtrar por Tipo</InputLabel>
                <Select
                  value={filterType}
                  label="Filtrar por Tipo"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="income">Ingresos</MenuItem>
                  <MenuItem value="expense">Gastos</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TableChartIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Total de registros seleccionados: {filteredTransactions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Presiona "Exportar a CSV" para descargar el reporte compatible con Microsoft Excel o Google Sheets.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default Reports;