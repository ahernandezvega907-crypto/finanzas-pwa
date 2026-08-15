import React from 'react';
import { ConsentModal } from '../features/auth/components/ConsentModal';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
      </svg>
    ),
  },
  {
    name: 'Transacciones',
    path: '/transactions',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    name: 'Categorías',
    path: '/categories',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    name: 'Presupuestos',
    path: '/budgets',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    name: 'Reportes',
    path: '/reports',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
      </svg>
    ),
  },
  {
    name: 'Asistente IA',
    path: '/ai-guru',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    name: 'Ajustes',
    path: '/settings',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isRouteActive = (itemPath: string) => {
    if (itemPath === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-text-main">
      
      {/* Modal de consentimiento global */}
      <ConsentModal />

      {/* 🖥️ SIDEBAR ESTRUCTURAL (Desktop Viewport) */}
      <aside 
        className="hidden md:flex flex-col w-64 border-r border-border bg-surface px-4 py-6 shrink-0"
        aria-label="Navegación Principal Escritorio"
      >
        <div className="flex items-center gap-2 px-3 mb-8 select-none">
          <div className="h-6 w-6 rounded-md bg-primary shadow-[0_0_12px_rgba(20,241,149,0.3)]" />
          <span className="text-xl font-bold tracking-tight text-primary">MoneyFlow</span>
        </div>

        <nav className="flex-1 space-y-1.5" aria-label="Enlaces del sistema">
          {navigationItems.map((item) => {
            const isActive = isRouteActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  "flex items-center gap-3 w-full px-4 h-11 rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:bg-surface-light hover:text-text-main"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* 📦 ÁREA PRINCIPAL OPERATIVA */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        
        {/* Header Superior Fijo */}
        <header 
          className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 shrink-0 z-10"
          role="banner"
        >
          <div className="md:hidden flex items-center gap-2 select-none">
            <div className="h-5 w-5 rounded bg-primary" />
            <span className="text-lg font-bold text-primary tracking-tight">MoneyFlow</span>
          </div>
          
          <div className="hidden md:block text-xs font-semibold text-text-muted tracking-wider uppercase">
            Sistema de Arquitectura v4.0
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <div 
              className="h-8 w-8 rounded-full bg-border border border-border/40 flex items-center justify-center text-xs font-bold text-text-muted cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Perfil del usuario"
            >
              U
            </div>
          </div>
        </header>

        {/* Contenedor con scroll optimizado */}
        <main 
          className="flex-1 overflow-y-auto p-6 bg-background/50 pb-24 md:pb-6 focus:outline-none"
          id="main-content"
          role="main"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>

      {/* 📱 BOTTOM NAVIGATION (Mobile Viewport) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-md border-t border-border flex items-center justify-around px-2 z-40"
        aria-label="Navegación Móvil Inferior"
      >
        {navigationItems.map((item) => {
          const isActive = isRouteActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full text-center transition-colors duration-200 focus:outline-none",
                isActive ? "text-primary" : "text-text-muted hover:text-text-main"
              )}
            >
              {item.icon}
              <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
};

export default AppLayout;