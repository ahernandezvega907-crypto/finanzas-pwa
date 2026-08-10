import { createTheme } from '@mui/material/styles';
import colors from './colors';
import radius from './radius';
import { spacing } from './spacing';
import { typography } from './typography';

// 1. Exportación de tu Design System original (para mantener compatibilidad)
export const DesignSystem = {
  colors,
  spacing,
  radius,
  typography,
} as const;

export type AppTheme = typeof DesignSystem;

// 2. Creación del Tema oficial de Material UI
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    primary: {
      main: colors.primary.main,
      contrastText: colors.primary.contrastText,
    },
    success: {
      main: colors.success.main,
      contrastText: colors.success.contrastText,
    },
    error: {
      main: colors.error.main,
      contrastText: colors.error.contrastText,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    divider: colors.divider,
  },
  shape: {
    borderRadius: 16, // 16px para el estilo móvil nativo
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          borderRadius: radius.xxl,
          border: `1px solid ${colors.divider}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          transition: 'all 0.25s ease',
          '&:hover': {
            boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.xxl,
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 44,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(79,70,229,0.35)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius.xxl,
          '& fieldset': {
            borderColor: colors.divider,
          },
          '&:hover fieldset': {
            borderColor: colors.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.primary.main,
            borderWidth: 2,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// 3. Exportación por defecto obligatoria para main.tsx
export default theme;