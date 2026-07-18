import React, { createContext, useState, useCallback, ReactNode, useMemo } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

export interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type: NotificationType) => void;
  dismissNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Eliminar notificación memorizado para mantener referencias estables
  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Mostrar notificación memorizado y seguro
  const showNotification = useCallback((message: string, type: NotificationType) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // El timeout se ejecuta de manera segura. 
    // Nota: Si usas efectos de desmontado en tu ToastContainer, este timeout es un excelente salvavidas.
    const timer = setTimeout(() => {
      dismissNotification(id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [dismissNotification]);

  // Memorizamos el valor del contexto para que no cambie de referencia a menos que
  // el array de notificaciones realmente cambie. ¡Esto salva decenas de re-renders!
  const contextValue = useMemo(() => ({
    notifications,
    showNotification,
    dismissNotification
  }), [notifications, showNotification, dismissNotification]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};