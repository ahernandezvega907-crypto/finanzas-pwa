import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

import { useTransactions } from '../features/transactions/hooks/useTransactions';
import { useCategories } from '../features/categories/hooks/useCategories';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#64748b'];

export const Dashboard: React.FC = () => {
  const { transactions, loading, error } = useTransactions();
  const { categoriesQuery } = useCategories();
  const categories = categoriesQuery?.data || [];

  // 1. Cálculo de Totales
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((tx: any) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        income += amt;
      } else if (tx.type === 'expense') {
        expense += amt;
      }
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [transactions]);

  // 2. Agrupación de Gastos por Categoría para el Gráfico Circular
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};

    transactions
      .filter((tx: any) => tx.type === 'expense')
      .forEach((tx: any) => {
        const catId = tx.category_id || tx.categoryId;
        const catObj = categories.find((c: any) => c.id === catId);
        const catName = catObj ? catObj.name : 'Otros';
        const amt = Number(tx.amount) || 0;

        map[catName] = (map[catName] || 0) + amt;
      });

    return Object.keys(map).map((name) => ({
      name,
      value: map[name],
    }));
  }, [transactions, categories]);

  // 3. Datos de Comparativa para el Gráfico de Barras
  const summaryBarData = useMemo(() => {
    return [
      { name: 'Ingresos', Monto: totalIncome },
      { name: 'Gastos', Monto: totalExpense },
    ];
  }, [totalIncome, totalExpense]);

  const formatCurrency = (amount: number) => {
    return `₡${amount.toLocaleString('es-CR', { minimumFractionDigits: 0 })}`;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Dashboard General
      </Typography>

      {error && navigator.onLine && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {typeof error === 'string' ? error : (error as any).message || 'Error al cargar los datos.'}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Tarjetas Resumen */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, bgcolor: balance >= 0 ? 'background.paper' : '#2d1a1a' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: balance >= 0 ? 'rgba(99, 102, 241, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: balance >= 0 ? 'primary.main' : 'error.main',
                    display: 'flex',
                  }}
                >
                  <AccountBalanceWalletIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Balance Disponible
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: balance >= 0 ? 'text.primary' : 'error.main' }}>
                    {formatCurrency(balance)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', color: 'success.main', display: 'flex' }}>
                  <TrendingUpIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Ingresos Totales
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {formatCurrency(totalIncome)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', color: 'error.main', display: 'flex' }}>
                  <TrendingDownIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Gastos Totales
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                    {formatCurrency(totalExpense)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Sección de Gráficos */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {/* Gráfico 1: Desglose por Categoría */}
            <Paper sx={{ p: 3, borderRadius: 3, minHeight: 380 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Gastos por Categoría
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {categoryData.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
                  <Typography color="text.secondary">No hay gastos suficientes para graficar.</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(Number(value) || 0)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Paper>

            {/* Gráfico 2: Comparativa Ingresos vs Gastos */}
            <Paper sx={{ p: 3, borderRadius: 3, minHeight: 380 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Comparativa Flujo de Caja
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={summaryBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(val) => `₡${val}`} />
                  <Tooltip formatter={(value: any) => formatCurrency(Number(value) || 0)} />
                  <Bar dataKey="Monto" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Dashboard;