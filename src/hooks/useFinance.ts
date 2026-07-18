import { useContext } from 'react';
import { FinanceContext, FinanceContextType } from '../context/FinanceContext';

/**
 * Hook optimizado para consumir el estado transaccional de MoneyFlow.
 * Proporciona acceso rápido y tipado a transacciones y cálculos financieros de alto rendimiento.
 */
export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance debe ser utilizado obligatoriamente dentro de un FinanceProvider');
  }
  return context;
};