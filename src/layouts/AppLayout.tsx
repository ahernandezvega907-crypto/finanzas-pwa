import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { cn } from '../utils/cn';

export const AppLayout: React.FC = () => {
  // Configuración de navegación centralizada
  const navItems = [
    { to: '/', label: 'Panel', icon: '📊' },
    { to: '/transacciones', label: 'Historial', icon: '💸' },
    { to: '/presupuestos', label: 'Metas', icon: '🎯' },
    { to: '/reportes', label: 'Informes', icon: '📈' },
    { to: '/configuracion', label: 'Ajustes', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-main antialiased selection:bg-primary/30">
      
      {/* HEADER SUPERIOR FIJO (Desktop & Mobile) */}
      <header role="banner" className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-b-border h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-primary text-xl font-bold tracking-tight">MoneyFlow</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Avatar Temporal */}
          <div className="w-8 h-8 rounded-full bg-surface-light border border-border flex items-center justify-center text-xs font-bold text-secondary" aria-label="Perfil de usuario">
            U
          </div>
        </div>
      </header>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 pt-6 pb-24 md:pb-6">
        
        {/* Placeholder Estructural para futuro Sidebar (Desktop) */}
        <aside role="complementary" className="hidden md:block w-64 pr-6 shrink-0 border-r border-border min-h-[calc(100vh-6rem)]">
          <nav className="flex flex-col gap-1" aria-label="Navegación de escritorio">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 h-11 text-sm font-medium rounded-md transition-all duration-200",
                    isActive 
                      ? "bg-surface text-primary border-l-2 border-primary font-bold shadow-[inset_0_0_10px_rgba(20,241,149,0.05)]" 
                      : "text-text-muted hover:bg-surface-light hover:text-text-main"
                  )
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* CONTENEDOR DINÁMICO DE RUTAS */}
        <main role="main" className="flex-1 w-full md:pl-6 focus:outline-none" tabIndex={-1}>
          <Outlet />
        </main>
      </div>

      {/* BOTTOM NAVIGATION (Solo Mobile / Fijo Inferior) */}
      <nav role="navigation" aria-label="Navegación móvil" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-lg border-t border-border h-16 px-2 flex items-center justify-around pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 text-[10px] font-medium transition-all duration-200",
                isActive ? "text-primary scale-105 font-bold" : "text-text-muted hover:text-text-main"
              )
            }
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

    </div>
  );
};