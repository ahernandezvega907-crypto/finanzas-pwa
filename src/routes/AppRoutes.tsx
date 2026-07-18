import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageSkeleton } from '../components/ui/PageSkeleton';

// Importaciones perezosas (Lazy Loading con las rutas reales del proyecto)
const Login = lazy(() => import('../pages/Login'));
const TransactionsPage = lazy(() => import('../pages/TransactionsPage'));
const BudgetsPage = lazy(() => import('../pages/Budgets')); // ¡Corregido aquí! Apunta a Budgets.tsx
const ReportsPage = lazy(() => import('../pages/ReportsPage'));

// Loader inicial de pantalla completa (solo para autenticación o carga fría)
const PageLoader = () => (
  <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center text-zinc-400 font-medium">
    Cargando aplicación...
  </div>
);

export const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  // Si está cargando la sesión inicial de Supabase, mostramos el loader principal
  if (loading) {
    return <PageLoader />;
  }

  const isAuthenticated = !!user;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Ruta pública de Login */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} 
        />

        {/* Ruta privada del Dashboard (Transacciones) */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Suspense fallback={<PageSkeleton />}>
                <TransactionsPage />
              </Suspense>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Ruta privada de Presupuestos (Budgets) */}
        <Route 
          path="/budgets" 
          element={
            isAuthenticated ? (
              <Suspense fallback={<PageSkeleton />}>
                <BudgetsPage />
              </Suspense>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Ruta privada de Reportes (Reports) */}
        <Route 
          path="/reports" 
          element={
            isAuthenticated ? (
              <Suspense fallback={<PageSkeleton />}>
                <ReportsPage />
              </Suspense>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Ruta comodín para redirección */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </Suspense>
  );
};