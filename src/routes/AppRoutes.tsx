import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import AppLayout from '../layouts/AppLayout';
import { Box, CircularProgress } from '@mui/material';

// Importaciones Lazy
const LandingPage = lazy(() => import('../pages/LandingPage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Transactions = lazy(() => import('../pages/Transactions'));
const Categories = lazy(() =>
  import('../features/categories/components/CategoryManager').then((m) => ({
    default: m.CategoryManager,
  }))
);
const Budgets = lazy(() => import('../pages/Budgets'));
const Reports = lazy(() => import('../pages/Reports'));
const Settings = lazy(() => import('../pages/Settings'));
const AiGuru = lazy(() => import('../pages/AiGuru'));
const Support = lazy(() => import('../pages/Support'));
const Pricing = lazy(() => import('../pages/Pricing'));
const AdminSubscriptions = lazy(() => import('../pages/AdminSubscriptions'));
const Login = lazy(() => import('../pages/Login'));
const PinLock = lazy(() => import('../pages/PinLock'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('../pages/TermsOfService'));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <CircularProgress color="primary" />
  </Box>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pin" element={<PinLock />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

        {/* Rutas Protegidas dentro del Layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/soporte" element={<Support />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/admin" element={<AdminSubscriptions />} />
          <Route path="/ai-guru" element={<AiGuru />} />
        </Route>

        {/* Redirección final */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;