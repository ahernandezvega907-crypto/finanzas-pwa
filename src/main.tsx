/// <reference types="vite/client" />
import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppErrorBoundary } from './components/error'; // 👈 Importamos nuestro escudo de calidad
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FinanceProvider } from './context/FinanceContext';
import { ToastContainer } from './components/ui/ToastContainer';
import './styles/globals.css';

const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ThemeProvider>
          <FinanceProvider>
            {children}
          </FinanceProvider>
        </ThemeProvider>
      </AuthProvider>
    </NotificationProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary> {/* 👈 Blindamos absolutamente todo el árbol contra crashes de renderizado */}
      <BrowserRouter>
        <AppStateProvider>
          <App />
          <ToastContainer />
        </AppStateProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
);