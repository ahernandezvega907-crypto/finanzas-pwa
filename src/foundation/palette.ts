import { PaletteOptions } from '@mui/material/styles';

export const palette: PaletteOptions = {
  mode: 'dark',
  background: {
    default: '#09090B', // Fondo Nivel 0
    paper: '#111113',   // Surface Nivel 1
  },
  primary: {
    main: '#a855f7', // Púrpura base
  },
  secondary: {
    main: '#71717a',
  },
  success: {
    main: '#10b981', // Verde MoneyFlow
  },
  warning: {
    main: '#f59e0b', // Ámbar
  },
  error: {
    main: '#ef4444', // Rojo Crítico
  },
  premium: {
    main: '#6366f1', // Morado Premium
    light: '#818cf8',
    dark: '#4f46e5',
    contrastText: '#ffffff',
  },
  text: {
    primary: '#fafafa',
    secondary: '#a1a1aa',
    disabled: '#52525b',
  },
  divider: '#222226', // Border / Hover Nivel
};

export const customTokens = {
  surface: '#111113',
  card: '#18181B',     // Card Nivel 2
  border: '#222226',   // Hover Nivel 2
  income: '#10b981',
  expense: '#ef4444',
  balance: '#fafafa',
  premium: '#6366f1',
};