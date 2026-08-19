import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Link as MuiLink,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import PinIcon from '@mui/icons-material/Pin';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import { SinpePaymentModal } from '../components/SinpePaymentModal';

export const LandingPage: React.FC = () => {
  const [showSinpeModal, setShowSinpeModal] = useState<boolean>(false);

  return (
    <Box sx={{ bgcolor: '#0b0f19', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Announcement Bar */}
      <Box
        sx={{
          background: 'linear-gradient(90deg, #6366f1, #a855f7)',
          color: '#ffffff',
          py: 1,
          px: 2,
          textAlign: 'center',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        🔥 Lanzamiento: Plan Premium Anual por ₡24.900{' '}
        <MuiLink
          href="https://finanzas-pwa-roan.vercel.app/login"
          sx={{ color: '#ffffff', textDecoration: 'underline', ml: 1 }}
        >
          Crear cuenta gratis
        </MuiLink>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        {/* Hero */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 2 }}>
            Controla tus finanzas en{' '}
            <Box component="span" sx={{ color: '#6366f1' }}>
              colones
            </Box>{' '}
            con IA
          </Typography>
          <Typography variant="h6" sx={{ color: '#9ca3af', maxWidth: 600, mx: 'auto', mb: 4 }}>
            La PWA diseñada para Costa Rica. Presupuesta, gestiona tus transacciones y consulta con tu Gurú IA en tiempo real.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              href="https://finanzas-pwa-roan.vercel.app/login"
              sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' }, px: 4 }}
            >
              🚀 Probar gratis
            </Button>
            <Button variant="outlined" size="large" href="#precios" sx={{ color: '#f3f4f6', borderColor: '#1f2937' }}>
              ▶ Ver características
            </Button>
          </Box>
        </Box>

        {/* Feature Badges */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#111827',
            border: '1px solid #1f2937',
            p: 3,
            borderRadius: 3,
            mb: 8,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
              textAlign: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <LockIcon sx={{ color: '#6366f1' }} />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Cifrado HTTPS
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <PhoneIphoneIcon sx={{ color: '#6366f1' }} />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                PWA Multiplataforma
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <PinIcon sx={{ color: '#6366f1' }} />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                PIN Local
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <SystemUpdateIcon sx={{ color: '#6366f1' }} />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Actualizaciones Auto
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Pricing Section */}
        <Box id="precios" sx={{ mb: 8 }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
            Planes y Precios
          </Typography>
          <Typography variant="body1" align="center" sx={{ color: '#9ca3af', mb: 5 }}>
            Sin cobros ocultos. Diseñado a la medida del mercado de Costa Rica.
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              alignItems: 'stretch',
            }}
          >
            {/* Free Plan */}
            <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', color: '#f3f4f6', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>🆓 Gratis</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, my: 1 }}>₡0</Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af' }}>Para siempre</Typography>
                <List sx={{ mt: 2 }}>
                  {['Hasta 250 transacciones', '1 presupuesto activo', '10 categorías personalizadas', 'Exportación CSV', 'Gurú IA 5 consultas/día'].map((text) => (
                    <ListItem key={text} disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}><CheckIcon sx={{ color: '#10b981', fontSize: 18 }} /></ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{text}</Typography>}
                      />
                    </ListItem>
                  ))}
                  {['Exportación PDF/Excel', 'Reportes avanzados'].map((text) => (
                    <ListItem key={text} disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}><CloseIcon sx={{ color: '#ef4444', fontSize: 18 }} /></ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#6b7280' }}>{text}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <Box sx={{ p: 3, pt: 0 }}>
                <Button fullWidth variant="outlined" href="https://finanzas-pwa-roan.vercel.app/login" sx={{ color: '#f3f4f6', borderColor: '#1f2937' }}>
                  Comenzar gratis
                </Button>
              </Box>
            </Card>

            {/* Premium Monthly Plan */}
            <Card sx={{ bgcolor: '#111827', border: '2px solid #6366f1', color: '#f3f4f6', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <Chip icon={<StarIcon sx={{ fontSize: '1rem !important', color: '#fff' }} />} label="RECOMENDADO" size="small" sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', bgcolor: '#6366f1', color: '#fff', fontWeight: 'bold' }} />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Premium Mensual</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, my: 1 }}>₡2.990<Typography component="span" variant="body1">/mes</Typography></Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af' }}>Facturación mensual vía SINPE</Typography>
                <List sx={{ mt: 2 }}>
                  {['Transacciones ilimitadas', 'Presupuestos ilimitados', 'Categorías ilimitadas', 'Gurú IA 20 consultas/día', 'Exportación PDF/Excel', 'Reportes avanzados', 'Soporte prioritario'].map((text) => (
                    <ListItem key={text} disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}><CheckIcon sx={{ color: '#10b981', fontSize: 18 }} /></ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{text}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <Box sx={{ p: 3, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setShowSinpeModal(true)}
                  sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}
                >
                  Elegir Mensual
                </Button>
              </Box>
            </Card>

            {/* Premium Annual Plan */}
            <Card sx={{ bgcolor: '#111827', border: '1px solid #1f2937', color: '#f3f4f6', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Premium Anual</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, my: 1 }}>₡24.900<Typography component="span" variant="body1">/año</Typography></Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af' }}>Equivale a ₡2.075/mes (31% ahorro)</Typography>
                <List sx={{ mt: 2 }}>
                  {['Todo lo del plan mensual', '2 meses gratis al año', 'Ahorro del 31%', 'Gurú IA 20 consultas/día', 'Exportación PDF/Excel', 'Acceso anticipado'].map((text) => (
                    <ListItem key={text} disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}><CheckIcon sx={{ color: '#10b981', fontSize: 18 }} /></ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{text}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <Box sx={{ p: 3, pt: 0 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setShowSinpeModal(true)}
                  sx={{ color: '#f3f4f6', borderColor: '#1f2937' }}
                >
                  Elegir Anual
                </Button>
              </Box>
            </Card>
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#1f2937', my: 4 }} />

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', color: '#9ca3af', fontSize: '0.875rem' }}>
          <Typography variant="body2">© 2026 MoneyFlow Guru. Todos los derechos reservados.</Typography>
          <Box>
            <MuiLink href="https://finanzas-pwa-roan.vercel.app/privacy-policy" sx={{ color: '#9ca3af', ml: 2, textDecoration: 'none' }}>
              Política de Privacidad
            </MuiLink>
            <MuiLink href="https://finanzas-pwa-roan.vercel.app/terms-of-service" sx={{ color: '#9ca3af', ml: 2, textDecoration: 'none' }}>
              Términos de Uso
            </MuiLink>
          </Box>
        </Box>
      </Container>

      {/* Modal de Pago SINPE Móvil */}
      <SinpePaymentModal
        visible={showSinpeModal}
        onClose={() => setShowSinpeModal(false)}
        sinpePhone="89855110"
        sinpeOwner="Armando Hernández"
      />
    </Box>
  );
};

export default LandingPage;