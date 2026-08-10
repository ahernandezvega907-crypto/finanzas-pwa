import React from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { useOfflineSync } from './hooks/useOfflineSync';

const NetworkStatusBar: React.FC = () => {
  const { isOnline, isSyncing } = useOfflineSync();

  return (
    <>
      {!isOnline && (
        <div style={{
          backgroundColor: '#d97706',
          color: '#ffffff',
          fontSize: '0.75rem',
          textAlign: 'center',
          padding: '6px 12px',
          fontWeight: 500,
          position: 'sticky',
          top: 0,
          zIndex: 9999
        }}>
          ⚠️ Estás en modo fuera de línea. Tus cambios se guardarán localmente y se sincronizarán al reconectar.
        </div>
      )}
      {isSyncing && (
        <div style={{
          backgroundColor: '#2563eb',
          color: '#ffffff',
          fontSize: '0.75rem',
          textAlign: 'center',
          padding: '6px 12px',
          fontWeight: 500,
          position: 'sticky',
          top: 0,
          zIndex: 9999
        }}>
          🔄 Sincronizando datos pendientes con Supabase...
        </div>
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <NetworkStatusBar />
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;