import React from 'react';
import { Typography, Paper, Container } from '@mui/material';

export const PrivacyPolicy: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Política de Privacidad
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          Última actualización: 11 de agosto de 2026
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          1. Información que Recopilamos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          MoneyFlow recopila la información proporcionada voluntariamente por el usuario: correo electrónico, registro de ingresos, gastos, categorías e historial de conversaciones con el asistente virtual (AiGuru).
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          2. Uso de Datos e Inteligencia Artificial
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sus datos financieros son procesados localmente y almacenados en servidores seguros (Supabase). Las consultas enviadas al módulo AiGuru son procesadas por modelos de inteligencia artificial para generar recomendaciones contextuales. Sus datos no son vendidos a terceros ni utilizados para entrenamiento público de modelos.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          3. Derechos del Usuario (ARCO)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Usted tiene derecho a acceder, rectificar, exportar en formato CSV o solicitar la eliminación permanente de todos sus datos almacenados en la plataforma desde la sección de Ajustes o mediante contacto directo.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;