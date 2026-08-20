import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Psychology as PsychologyIcon,
  AccountBalanceWallet as WalletIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: '#0B0F19',
        color: '#FFFFFF',
        overflowX: 'hidden',
        overflowY: 'auto',
        pb: 8,
      }}
    >
      {/* Banner Superior Promocional */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: '#FFFFFF',
          py: 1,
          px: 2,
          textAlign: 'center',
          fontSize: { xs: '0.8rem', sm: '0.9rem' },
          fontWeight: 600,
        }}
      >
        🔥 Lanzamiento: Plan Premium Anual por ₡24.900{' '}
        <Typography
          component="span"
          onClick={() => navigate('/login?mode=register')}
          sx={{
            textDecoration: 'underline',
            cursor: 'pointer',
            fontWeight: 700,
            ml: 1,
          }}
        >
          Crear cuenta gratis
        </Typography>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 8 }, textAlign: 'center' }}>
        <Chip
          icon={<StarIcon sx={{ color: '#FFD700 !important' }} />}
          label="Diseñado para Costa Rica 🇨🇷"
          sx={{
            bgcolor: 'rgba(99, 102, 241, 0.15)',
            color: '#818CF8',
            fontWeight: 600,
            mb: 3,
            border: '1px solid rgba(99, 102, 241, 0.3)',
          }}
        />

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.2rem', sm: '3.5rem', md: '4.5rem' },
            fontWeight: 800,
            lineHeight: 1.15,
            mb: 3,
            letterSpacing: '-0.02em',
          }}
        >
          Controla tus finanzas en{' '}
          <Typography
            component="span"
            variant="inherit"
            sx={{
              background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            colones con IA
          </Typography>
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: '#9CA3AF',
            maxWidth: 700,
            mx: 'auto',
            mb: 5,
            fontWeight: 400,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            lineHeight: 1.6,
          }}
        >
          La PWA diseñada para Costa Rica. Presupuesta, gestiona tus transacciones y consulta con tu Gurú IA en tiempo real.
        </Typography>

        {/* Botones principales corregidos */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            alignItems: 'center',
            mb: 6,
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login?mode=register')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 4,
              py: 1.8,
              fontSize: '1.05rem',
              fontWeight: 700,
              borderRadius: 3,
              textTransform: 'none',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            🚀 Probar gratis
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              const el = document.getElementById('features');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            sx={{
              px: 4,
              py: 1.8,
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#FFFFFF',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              textTransform: 'none',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                borderColor: '#FFFFFF',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            ▶ Ver características
          </Button>
        </Box>

        {/* Feature Badges */}
        <Grid container spacing={2} sx={{ maxWidth: 800, mx: 'auto', justifyContent: 'center' }}>
          {[
            { icon: <SecurityIcon color="primary" />, text: 'Cifrado HTTPS' },
            { icon: <SpeedIcon color="primary" />, text: 'PWA Multiplataforma' },
            { icon: <WalletIcon color="primary" />, text: 'PIN Local' },
            { icon: <CheckCircleIcon color="primary" />, text: 'Actualizaciones Auto' },
          ].map((item, idx) => (
            <Grid key={idx} sx={{ width: { xs: '50%', sm: '25%' }, p: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {item.icon}
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  {item.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Grid de Características */}
      <Container id="features" maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            fontSize: { xs: '1.8rem', sm: '2.5rem' },
            fontWeight: 700,
            mb: 2,
          }}
        >
          Todo lo que necesitas para tu control financiero
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', color: '#9CA3AF', mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          Herramientas ágiles y sencillas adaptadas a la moneda y necesidades del mercado costarricense.
        </Typography>

        <Grid container spacing={3}>
          {[
            {
              icon: <PsychologyIcon sx={{ fontSize: 40, color: '#818CF8' }} />,
              title: 'Gurú IA Integrado',
              desc: 'Obtén análisis inmediatos de tus hábitos de gasto y consejos de ahorro personalizados con IA.',
            },
            {
              icon: <WalletIcon sx={{ fontSize: 40, color: '#C084FC' }} />,
              title: 'Límites e Ingresos en Colones',
              desc: 'Visualiza tus saldos, categorías y presupuestos adaptados 100% al formato financiero en ₡.',
            },
            {
              icon: <SpeedIcon sx={{ fontSize: 40, color: '#34D399' }} />,
              title: 'Sincronización Rápida',
              desc: 'Accede como PWA desde tu teléfono o computadora de forma fluida y sin interrupciones.',
            },
          ].map((feat, idx) => (
            <Grid key={idx} sx={{ width: { xs: '100%', md: '33.33%' }, p: 1.5 }}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 4,
                  p: 1,
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feat.icon}</Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#FFFFFF' }}>
                    {feat.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9CA3AF', lineHeight: 1.6 }}>
                    {feat.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Planes y Precios */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            fontSize: { xs: '1.8rem', sm: '2.5rem' },
            fontWeight: 700,
            mb: 6,
          }}
        >
          Planes y Precios
        </Typography>

        <Grid container spacing={4} sx={{ justifyContent: 'center', alignItems: 'stretch' }}>
          {/* Plan Free */}
          <Grid sx={{ width: { xs: '100%', md: '45%' }, p: 2 }}>
            <Card
              sx={{
                height: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.02)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 4,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                  Plan Gratuito
                </Typography>
                <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3 }}>
                  Ideal para empezar a organizar tu presupuesto personal.
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 3 }}>
                  ₡0 <Typography component="span" variant="body1" sx={{ color: '#9CA3AF' }}>/ siempre</Typography>
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 4 }}>
                  {[
                    'Hasta 250 transacciones',
                    '1 Presupuesto activo',
                    '5 Consultas diarias a Gurú IA',
                    'Exportación CSV estándar',
                  ].map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ color: '#818CF8', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#D1D5DB' }}>{item}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>

              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => navigate('/login?mode=register')}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  textTransform: 'none',
                }}
              >
                Comenzar gratis
              </Button>
            </Card>
          </Grid>

          {/* Plan Premium */}
          <Grid sx={{ width: { xs: '100%', md: '45%' }, p: 2 }}>
            <Card
              sx={{
                height: '100%',
                bgcolor: 'rgba(99, 102, 241, 0.05)',
                borderColor: '#6366F1',
                borderRadius: 4,
                p: 2,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Chip
                label="MÁS POPULAR"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: '#6366F1',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}
              />

              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 1 }}>
                  Plan Premium
                </Typography>
                <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3 }}>
                  Acceso sin límites para una gestión financiera avanzada.
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 3 }}>
                  ₡24.900 <Typography component="span" variant="body1" sx={{ color: '#9CA3AF' }}>/ año</Typography>
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 4 }}>
                  {[
                    'Transacciones ilimitadas',
                    'Presupuestos ilimitados',
                    '20 Consultas diarias a Gurú IA',
                    'Exportación PDF y Excel (Próximamente)',
                    'Soporte prioritario por WhatsApp',
                  ].map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ color: '#34D399', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>{item}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate('/pricing')}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 700,
                  textTransform: 'none',
                }}
              >
                Obtener Premium
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;