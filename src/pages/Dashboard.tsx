import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { useTransactions } from '../features/transactions/hooks/useTransactions';

export const Dashboard: React.FC = () => {
  const { transactions, loading, error } = useTransactions();

  // Cálculo de totales agregados
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

  const formatCurrency = (amount: number) => {
    return `₡${amount.toLocaleString('es-CR', { minimumFractionDigits: 0 })}`;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Dashboard General
      </Typography>

      {/* Manejo de error offline/red */}
      {error && navigator.onLine && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {typeof error === 'string' ? error : (error as any).message || 'Error al cargar los datos del Dashboard.'}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Tarjeta 1: Balance Total */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, bgcolor: balance >= 0 ? 'background.paper' : '#2d1a1a' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: balance >= 0 ? 'primary.soft' : 'error.soft',
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
          </Grid>

          {/* Tarjeta 2: Ingresos Totales */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(46, 125, 50, 0.1)', color: 'success.main', display: 'flex' }}>
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
          </Grid>

          {/* Tarjeta 3: Gastos Totales */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', color: 'error.main', display: 'flex' }}>
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
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;