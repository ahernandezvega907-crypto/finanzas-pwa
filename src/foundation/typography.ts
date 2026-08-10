import { TypographyOptions } from '@mui/material/styles/createTypography';

export const typography: TypographyOptions = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: { // Nivel 1: Información Crítica (Balance, Patrimonio)
    fontSize: '2.25rem',
    fontWeight: 700,
    letterSpacing: '-0.05em',
  },
  h2: { // Nivel 2: Indicadores (Ingresos, Gastos, Presupuestos)
    fontSize: '1.5rem',
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  body1: { // Nivel 3: Detalle / Texto principal
    fontSize: '0.875rem',
    fontWeight: 400,
  },
  body2: { // Nivel 3: Texto auxiliar / Fechas / Categorías
    fontSize: '0.75rem',
    color: '#a1a1aa',
  },
};