import React from 'react';
import { Typography, Paper, Container } from '@mui/material';

export const TermsOfService: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Términos y Condiciones de Uso
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          Última actualización: 11 de agosto de 2026
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          1. Aceptación de los Términos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Al registrarse o hacer uso de MoneyFlow, el usuario acepta de manera íntegra los presentes Términos y Condiciones.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          2. Descargo de Responsabilidad Financiera (Disclaimer)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          MoneyFlow y su asistente virtual AiGuru son herramientas informativas para la gestión y organización personal de presupuestos. <strong>No constituyen asesoramiento financiero, contable, bursátil ni legal certificado.</strong> MoneyFlow no se hace responsable por decisiones financieras, pérdidas de capital o inversiones realizadas por los usuarios basándose en la información proporcionada por la aplicación.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          3. Limitación de Responsabilidad
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          La aplicación se proporciona "tal cual" (as-is). No garantizamos la disponibilidad ininterrumpida del servicio frente a caídas de red o fallos de proveedores de infraestructura externa.
        </Typography>
      </Paper>
    </Container>
  );
};

export default TermsOfService;