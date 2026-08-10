import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Button
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../context/AuthContext';
import { transactionsRepository } from '../features/transactions/repositories/transactions.repository';
import { useNavigate } from 'react-router-dom';

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const data = await transactionsRepository.getAll(user.id);
        
        let totalIncome = 0;
        let totalExpenses = 0;

        data.forEach((tx: any) => {
          const val = Number(tx.amount || 0);
          if (tx.type === 'income') {
            totalIncome += val;
          } else if (tx.type === 'expense') {
            totalExpenses += val;
          }
        });

        setIncome(totalIncome);
        setExpenses(totalExpenses);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user?.id]);

  const balance = income - expenses;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Resumen de tu salud financiera en tiempo real
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/transactions')}
          sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold' }}
        >
          Nueva Transacción
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Balance Total */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, p: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.dark', color: 'primary.contrastText', display: 'flex' }}>
                <AccountBalanceWalletIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Balance Total
                </Typography>
                {loading ? (
                  <Skeleton width={100} height={35} />
                ) : (
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    ₡{balance.toLocaleString()}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Ingresos */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: 3, p: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'success.dark', color: 'common.white', display: 'flex' }}>
                <TrendingUpIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Ingresos
                </Typography>
                {loading ? (
                  <Skeleton width={100} height={35} />
                ) : (
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    ₡{income.toLocaleString()}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gastos */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: 3, p: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'error.dark', color: 'common.white', display: 'flex' }}>
                <TrendingDownIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Gastos
                </Typography>
                {loading ? (
                  <Skeleton width={100} height={35} />
                ) : (
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                    ₡{expenses.toLocaleString()}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardView;