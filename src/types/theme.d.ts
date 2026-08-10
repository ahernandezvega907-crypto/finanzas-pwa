import '@mui/material/styles';

interface CustomThemeTokens {
  surface: string;
  card: string;
  border: string;
  income: string;
  expense: string;
  balance: string;
  premium: string;
  warning: string;
}

declare module '@mui/material/styles' {
  interface Theme {
    custom: CustomThemeTokens;   // obligatorio, sin ?
  }
  interface ThemeOptions {
    custom?: Partial<CustomThemeTokens>;
  }
}