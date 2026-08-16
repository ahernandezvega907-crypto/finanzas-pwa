import React from 'react';
import {
  Box,
  Container,
  Divider,
  Paper,
  Typography,
} from '@mui/material';

export const PrivacyPolicy: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Política de Privacidad
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Versión: 2026-08-11 · Última actualización: 15 de agosto de 2026
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          En MoneyFlow nos comprometemos a proteger la privacidad de tus datos personales conforme
          a la Ley 8968 de Protección de la Persona frente al Tratamiento de sus Datos Personales
          de Costa Rica. Este documento explica qué datos recopilamos, cómo los usamos y qué
          derechos te asisten.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          1. Datos que recolectamos y para qué los usamos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Recopilamos y tratamos los siguientes datos personales con las finalidades indicadas:
        </Typography>

        <Box component="ul" sx={{ pl: 3, mt: 0, mb: 2, color: 'text.secondary' }}>
          <li>
            <Typography variant="body2" color="text.secondary">
              <strong>Correo electrónico:</strong> como identificador de acceso y para
              comunicaciones esenciales de la cuenta.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              <strong>Transacciones financieras:</strong> ingresos, gastos, montos, categorías,
              descripciones y fechas, con el fin de mostrar tu historial, calcular presupuestos,
              generar reportes y ofrecer recomendaciones personalizadas.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              <strong>Presupuestos y categorías personalizadas:</strong> para permitirte gestionar
              tus límites de gasto y organizar tus movimientos.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              <strong>Historial de uso del Gurú IA:</strong> consultas y resúmenes financieros
              utilizados únicamente para generar respuestas contextuales.
            </Typography>
          </li>
        </Box>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          2. Transferencia de datos al proveedor de IA (Groq)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Para el funcionamiento del asistente Gurú IA, MoneyFlow envía un resumen de tus datos
          financieros (ingresos totales, gastos totales, saldo mensual y categoría de mayor gasto)
          a Groq, un proveedor externo de inteligencia artificial.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Esta es la <strong>única transferencia de datos a un tercero</strong> y se realiza
          exclusivamente para generar recomendaciones personalizadas. Groq actúa como encargado del
          tratamiento y no utiliza tus datos para fines propios. No enviamos información bancaria
          ni credenciales de acceso.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          3. Base legal del tratamiento
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          El tratamiento de tus datos personales se fundamenta en tu <strong>consentimiento
          informado y expreso</strong>, otorgado al aceptar esta Política de Privacidad durante el
          registro en la aplicación.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          4. Derechos ARCO
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Como titular de los datos, tienes derecho a:
        </Typography>

        <Box component="ul" sx={{ pl: 3, mt: 0, mb: 2, color: 'text.secondary' }}>
          <li>
            <Typography variant="body2" color="text.secondary">
              <strong>Acceso:</strong> consultar los datos que te damos.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              <strong>Rectificación:</strong> corregir información inexacta.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              <strong>Cancelación:</strong> eliminar tu cuenta y todos tus datos.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              <strong>Oposición:</strong> oponerte al tratamiento para fines específicos.
            </Typography>
          </li>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          La <strong>cancelación</strong> de tu cuenta y de todos tus datos está disponible
          directamente en <strong>Ajustes → Zona de Peligro → Eliminar mi cuenta
          permanentemente</strong>. Esta acción es irreversible.
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Para ejercer los derechos de acceso, rectificación u oposición, o si no puedes realizar
          la cancelación desde la app, escríbenos a:{" "}
          <strong>[ahernandezvega907@gmail.com]</strong>.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          5. Plazo de respuesta
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Atenderemos tus solicitudes en un plazo máximo de <strong>5 días hábiles</strong>, de
          conformidad con la Ley 8968 y la normativa costarricense aplicable.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          6. No comercialización de datos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          MoneyFlow <strong>no vende, no alquila, no cede ni comercializa</strong> tus datos
          personales con terceros. Los únicos usos son los descritos en esta política y son
          necesarios para la prestación del servicio.
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          7. Versión y actualización
        </Typography>
        <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
          8. Responsable del tratamiento de datos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <strong>Responsable:</strong> Armando Hernández Vega<br />
          <strong>Cédula:</strong> 155812418621<br />
          <strong>Contacto:</strong> ahernandezvega907@gmail.com
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Esta es la versión 2026-08-11 de la Política de Privacidad. Cualquier cambio sustancial
          será comunicado mediante el modal de consentimiento y requerirá una nueva aceptación.
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4 }}>
          Este documento es un borrador funcional. Debe ser revisado y validado por un abogado
          costarricense antes de su publicación.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;