import { Components, Theme } from '@mui/material/styles';
import { shape } from './shape';

export const components: Components<Omit<Theme, 'components'>> = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: shape.tokens.md,
        textTransform: 'none',
        fontWeight: 600,
        padding: '10px 20px',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: shape.tokens.lg,
        backgroundColor: '#18181B', // Nivel 2
        backgroundImage: 'none',
        border: '1px solid #222226',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: shape.tokens.lg,
        backgroundImage: 'none',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: shape.tokens.xl,
        backgroundColor: '#111113', // Nivel 3
        border: '1px solid #222226',
      },
    },
  },
};