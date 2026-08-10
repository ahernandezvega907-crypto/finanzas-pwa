import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Chip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuth } from '../context/AuthContext';
import { transactionsRepository } from '../features/transactions/repositories/transactions.repository';
import { exportExcel } from '../features/reports/utils/exportExcel';

interface CategorySummary {
  categoryName: string;
  totalSpent: number;
  transactionCount: number;
}

export const ReportsView: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categorySummaries, setCategorySummaries] = useState<CategorySummary[]>([]);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const data = await transactionsRepository.getAll(user.id);
        setTransactions(data);

        // Agrupar gastos por categoría
        const summaryMap: Record<string, { totalSpent: number; count: number }> = {};

        data.forEach((tx: any) => {
          if (tx.type === 'expense') {
            const catName = tx.categories?.name || 'Sin Categoría';
            const amount = Number(tx.amount || 0);

            if (!summaryMap[catName]) {
              summaryMap[catName] = { totalSpent: 0, count: 0 };
            }
            summaryMap[catName].totalSpent += amount;
            summaryMap[catName].count += 1;
          }
        });

        const summaryArray: CategorySummary[] = Object.keys(summaryMap).map((catName) => ({
          categoryName: catName,
          totalSpent: summaryMap[catName].totalSpent,
          transactionCount: summaryMap[catName].count,
        }));

        setCategorySummaries(summaryArray);
      } catch (err) {
        console.error('Error cargando reportes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [user?.id]);

  const handleExport = () => {
    if (transactions.length === 0) return;
    exportExcel(transactions, {
      transaction_date: 'Fecha',
      type: 'Tipo',
      amount: 'Monto',
      description: 'Descripción'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Reportes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Análisis detallado y exportación de transacciones
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={loading || transactions.length === 0}
          sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold' }}
        >
          Exportar Excel
        </Button>
      </Box>

      {/* Tabla Resumen por Categoría */}
      <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Gastos por Categoría
          </Typography>

          {loading ? (
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          ) : categorySummaries.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              No hay transacciones de gasto registradas para generar el reporte.
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Transacciones</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Gastado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categorySummaries.map((row) => (
                    <TableRow key={row.categoryName} hover>
                      <TableCell component="th" scope="row">
                        <Chip label={row.categoryName} size="small" variant="outlined" color="primary" />
                      </TableCell>
                      <TableCell align="center">{row.transactionCount}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                        ₡{row.totalSpent.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ReportsView;