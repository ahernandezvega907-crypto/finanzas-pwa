import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined';

const FAQ_ITEMS = [
  {
    q: '¿Cómo restablezco mi contraseña?',
    a: 'Desde la pantalla de inicio de sesión, Supabase enviará un enlace de restablecimiento a tu correo electrónico si ya estás registrado.',
  },
  {
    q: '¿Cómo elimino mi cuenta?',
    a: 'Ve a Ajustes → Zona de Peligro → Eliminar mi cuenta permanentemente. Esta acción borra todos tus datos de forma irreversible.',
  },
  {
    q: '¿El Gurú IA es un asesor financiero real?',
    a: 'No. Es un asistente informativo basado en IA. Sus respuestas no constituyen asesoramiento financiero certificado.',
  },
];

export const Support: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Soporte y Ayuda
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          ¿Tienes dudas o necesitas ayuda con MoneyFlow? Aquí encontrarás respuestas rápidas y cómo contactarnos.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <EmailIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Contacto directo
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Escríbenos y te responderemos lo antes posible.
        </Typography>
        <Button
          variant="contained"
          href="mailto:ahernandezvega907@gmail.com?subject=Soporte%20MoneyFlow"
          startIcon={<EmailIcon />}
          sx={{ fontWeight: 700, borderRadius: 2, mb: 4 }}
        >
          Enviar correo de soporte
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <HelpOutlineIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Preguntas frecuentes
          </Typography>
        </Box>

        <Box component="ul" sx={{ pl: 3, mt: 1, mb: 3, color: 'text.secondary' }}>
          {FAQ_ITEMS.map((item) => (
            <li key={item.q}>
              <Typography variant="body2" color="text.secondary">
                <strong>{item.q}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {item.a}
              </Typography>
            </li>
          ))}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          También puedes consultar nuestros documentos legales:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/privacy-policy')}
            sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
          >
            Política de Privacidad
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/terms-of-service')}
            sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
          >
            Términos y Condiciones
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Support;