import React from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { useOfflineSync } from './hooks/useOfflineSync';

function App() {
  // Inicializa el escuchador de sincronización en segundo plano global
  useOfflineSync();

  return <AppRoutes />;
}

export default App;