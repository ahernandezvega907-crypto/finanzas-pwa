import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SinpePaymentModal } from '../components/SinpePaymentModal';

export const Pricing: React.FC = () => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [showSinpeModal, setShowSinpeModal] = useState<boolean>(false);
  const [, setSelectedPlan] = useState<'mensual' | 'anual'>('mensual');

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user?.id) return;
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();

        if (profile) {
          setIsPremium(!!profile.is_premium);
        }
      } catch (err) {
        console.error('Error cargando estado de suscripción:', err);
      }
    };
    fetchSubscriptionStatus();
  }, [user?.id]);

  const handleOpenSinpe = (plan: 'mensual' | 'anual') => {
    setSelectedPlan(plan);
    setShowSinpeModal(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2 }}>
          Planes y Precios
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
          Sin mensualidades forzadas. Elige la opción que impulse tu salud financiera en colones.
        </Typography>
      </Box>

      {/* Grid de Tarjetas */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 4,
          alignItems: 'stretch',
        }}
      >
        {/* Plan Gratis */}
        <Card
          variant="outlined"
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            p: 1,
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 700, mb: 1 }}>
              🆓 Gratis
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 800 }}>
              ₡0
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
              Para siempre
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <List dense>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Hasta 250 transacciones" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="1 presupuesto activo" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="10 categorías personalizadas" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Gurú IA 5 consultas/día" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Exportación CSV" />
              </ListItem>
              <ListItem disableGutters sx={{ opacity: 0.6 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CancelIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Exportación PDF/Excel" />
              </ListItem>
              <ListItem disableGutters sx={{ opacity: 0.6 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CancelIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Reportes avanzados" />
              </ListItem>
            </List>
          </CardContent>

          <CardActions sx={{ p: 2 }}>
            <Button fullWidth variant="outlined" disabled size="large" sx={{ borderRadius: 2 }}>
              {isPremium ? 'Plan Básico' : 'Plan Actual'}
            </Button>
          </CardActions>
        </Card>

        {/* Plan Mensual (Destacado) */}
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            p: 1,
            position: 'relative',
            borderColor: 'primary.main',
            borderWidth: 2,
            borderStyle: 'solid',
            boxShadow: (theme) => `0 0 20px ${theme.palette.primary.main}25`,
          }}
        >
          <Chip
            icon={<StarIcon sx={{ fontSize: '1rem !important', color: '#fff' }} />}
            label="RECOMENDADO"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: -14,
              left: '50%',
              transform: 'translateX(-50%)',
              fontWeight: 800,
              px: 1,
            }}
          />

          <CardContent sx={{ flexGrow: 1, pt: 3 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 700, mb: 1 }}>
              Premium Mensual
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography variant="h3" component="div" sx={{ fontWeight: 800 }}>
                ₡2.990
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 0.5 }}>
                /mes
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
              Facturación mensual vía SINPE
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <List dense sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem' } }}>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Transacciones ilimitadas" sx={{ '& .MuiListItemText-primary': { fontWeight: 700 } }} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Presupuestos ilimitados" sx={{ '& .MuiListItemText-primary': { fontWeight: 700 } }} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Categorías ilimitadas" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Gurú IA 20 consultas/día" sx={{ '& .MuiListItemText-primary': { fontWeight: 700 } }} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Exportación PDF/Excel/CSV" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Reportes avanzados" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Soporte prioritario" />
              </ListItem>
            </List>
          </CardContent>

          <CardActions sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              startIcon={<WorkspacePremiumIcon />}
              onClick={() => handleOpenSinpe('mensual')}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              {isPremium ? 'Renovar Mensual' : 'Elegir Mensual'}
            </Button>
          </CardActions>
        </Card>

        {/* Plan Anual */}
        <Card
          variant="outlined"
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            p: 1,
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 700, mb: 1 }}>
              Premium Anual
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography variant="h3" component="div" sx={{ fontWeight: 800 }}>
                ₡24.900
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 0.5 }}>
                /año
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
              Equivale a ₡2.075/mes (Ahorro del 31%)
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <List dense>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Todo lo del plan mensual" sx={{ '& .MuiListItemText-primary': { fontWeight: 700 } }} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="2 meses GRATIS al año" sx={{ '& .MuiListItemText-primary': { fontWeight: 700 } }} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Gurú IA 20 consultas/día" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Exportación PDF/Excel/CSV" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Acceso anticipado a funciones" />
              </ListItem>
            </List>
          </CardContent>

          <CardActions sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => handleOpenSinpe('anual')}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              {isPremium ? 'Renovar Anual' : 'Elegir Anual'}
            </Button>
          </CardActions>
        </Card>
      </Box>

      {/* Modal de Pago SINPE Móvil */}
      <SinpePaymentModal
        visible={showSinpeModal}
        onClose={() => setShowSinpeModal(false)}
        sinpePhone="89855110"
        sinpeOwner="Armando Hernández"
      />
    </Container>
  );
};

export default Pricing;