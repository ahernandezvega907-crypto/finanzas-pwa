import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext';

/**
 * Hook optimizado para consumir el contexto de autenticación de MoneyFlow.
 * Garantiza un tipado estricto y aserciones rápidas en desarrollo si se usa fuera del proveedor.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado obligatoriamente dentro de un AuthProvider');
  }
  return context;
};