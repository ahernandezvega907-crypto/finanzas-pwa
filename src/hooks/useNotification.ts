import { useContext } from 'react';
import { NotificationContext, NotificationContextType } from '../context/NotificationContext';

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification debe usarse dentro de un NotificationProvider');
  return context;
};