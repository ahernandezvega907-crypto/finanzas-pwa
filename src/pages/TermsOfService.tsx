import React from 'react';
import {
  Box,
  Container,
  Divider,
  Paper,
  Typography,
} from '@mui/material';

export const TermsOfService: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Términos y Condiciones de Uso
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Última actualización: 15 de agosto de 2026
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Estos Términos y Condiciones regulan el acceso y uso de MoneyFlow, una aplicación web
          progresiva (PWA) de finanzas personales para la gestión de ingresos, gastos,
          presupuestos y categorías personalizadas. Al registrarte o utilizar la aplicación,
          aceptas estos términos de forma íntegra.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          1. Descripción del servicio
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          MoneyFlow es una herramienta de gestión financiera personal. No constituye asesoría
          financiera, contable, bursátil ni legal certificada. La aplicación te permite registrar
          y organizar tus movimientos, configurar presupuestos y obtener reportes con base en la
          información que tú mismo ingresas.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          2. Responsabilidades del usuario
        </Typography>
        <Box component="ul" sx={{ pl: 3, mt: 0, mb: 2, color: 'text.secondary' }}>
          <li>
            <Typography variant="body2" color="text.secondary">
              Eres responsable de la <strong>veracidad</strong> de los datos que ingresas en la
              aplicación.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Eres responsable de mantener la <strong>confidencialidad</strong> de tu correo,
              contraseña y PIN de acceso.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              Debes usar la aplicación para fines lícitos y no intentar vulnerar la seguridad o
              acceder a datos de otros usuarios.
            </Typography>
          </li>
        </Box>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          3. Limitación de responsabilidad
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          El asistente virtual Gurú IA puede ofrecer sugerencias generales basadas en tus datos,
          pero <strong>no reemplaza la asesoría financiera, legal o fiscal profesional</strong>.
          MoneyFlow no se hace responsable por decisiones financieras, pérdidas de capital o
          inversiones realizadas por los usuarios con base en la información mostrada por la
          aplicación.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          La aplicación se proporciona “tal cual” (as-is). No garantizamos la disponibilidad
          ininterrumpida del servicio frente a caídas de red, fallos de infraestructura externa o
          mantenimientos programados.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          4. Eliminación de cuenta
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Puedes eliminar tu cuenta en cualquier momento desde <strong>Ajustes → Zona de Peligro →
          Eliminar mi cuenta permanentemente</strong>. Esta acción es <strong>permanente e
          irreversible</strong>: elimina todas tus transacciones, presupuestos, categorías y tu
          cuenta de acceso.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          5. Ley aplicable y jurisdicción
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Estos Términos se rigen por las leyes de la República de Costa Rica. Cualquier
          controversia derivada del uso de la aplicación se someterá a la jurisdicción de los
          tribunales de Costa Rica, salvo que la ley disponga lo contrario.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          6. Contacto de soporte
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Para consultas sobre estos Términos o para solicitar asistencia, escríbenos a:{" "}
          <strong>[ahernandezvega907@gmail.com]</strong>.
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4 }}>
          Desarrollado y administrado por Armando Hernández Vega · Este documento es un borrador
          funcional y debe ser revisado por un abogado costarricense antes de su publicación.
        </Typography>
      </Paper>
    </Container>
  );
};

export default TermsOfService;