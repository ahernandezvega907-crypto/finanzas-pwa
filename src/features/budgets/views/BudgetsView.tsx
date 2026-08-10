import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Skeleton,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { BudgetModal, BudgetFormData } from '../components/BudgetModal';
import { budgetsRepository, BudgetRow } from '../repositories/budget.repository';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';

interface CategoryOption {
  id: string;
  name: string;
}

export const BudgetsView: React.FC = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('id, name');
      
      if (catError) throw catError;
      setCategories(catData || []);

      const budgetData = await budgetsRepository.getAll(user.id);
      setBudgets(budgetData);
    } catch (err: any) {
      console.error('Error cargando presupuestos:', err);
      setError(err.message || 'Error al cargar los presupuestos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleCreateBudget = async (formData: BudgetFormData) => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const [year, month] = formData.period.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      const newBudget: BudgetRow = {
        profile_id: user.id,
        category_id: formData.categoryId,
        amount_limit: formData.amountLimit,
        start_date: startDate,
        end_date: endDate,
      };

      await budgetsRepository.createOrUpdate(newBudget);
      await fetchData();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error al guardar presupuesto:', err);
      alert('Error al guardar el presupuesto: ' + (err.message || 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
            Presupuestos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consumo en tiempo real para el mes en curso
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.2,
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: 3,
          }}
        >
          Establecer Límite
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Grid container spacing={2}>
          {[1, 2].map((i) => (
            <Grid item xs={12} key={i}>
              <Skeleton variant="rounded" height={100} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : budgets.length === 0 ? (
        <Card
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 4,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography color="text.secondary">
            No has configurado límites de presupuesto aún. Haz clic en "Establecer Límite" para crear el primero.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {budgets.map((budget) => {
            const limit = budget.amount_limit || 0;
            const spent = budget.spent_amount || 0;
            const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
            const categoryName = budget.categories?.name || 'Categoría';

            return (
              <Grid item xs={12} key={budget.id || budget.category_id}>
                <Card sx={{ borderRadius: 3, p: 2 }}>
                  <CardContent sx={{ p: '16px !important' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {categoryName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₡{spent.toLocaleString()} / ₡{limit.toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      color={percentage >= 100 ? 'error' : percentage >= 80 ? 'warning' : 'primary'}
                      sx={{ height: 10, borderRadius: 5, my: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {percentage.toFixed(0)}% consumido
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <BudgetModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateBudget}
        categories={categories}
        loading={saving}
      />
    </Container>
  );
};

export default BudgetsView;