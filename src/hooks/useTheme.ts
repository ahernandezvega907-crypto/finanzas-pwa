import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '../context/ThemeContext';

/**
 * Hook optimizado para consumir el contexto del tema visual en MoneyFlow.
 * Ofrece una validación rápida en tiempo de ejecución para prevenir usos huérfanos.
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser utilizado obligatoriamente dentro de un ThemeProvider');
  }
  return context;
};