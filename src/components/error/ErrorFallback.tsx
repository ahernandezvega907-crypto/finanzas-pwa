import React from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 md:px-6">
      <div className="max-w-md w-full rounded-2xl bg-surface border border-border shadow-lg p-8 space-y-6 text-center">
        {/* Icono de advertencia premium */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text">Ups, algo salió mal</h2>
          <p className="text-sm text-text-muted">
            Ha ocurrido un error inesperado en la aplicación. No te preocupes, tus datos financieros están seguros.
          </p>
        </div>

        {/* Detalles del error colapsables (solo para facilitar depuración, limpios en producción) */}
        {(import.meta as any).env?.DEV && (
          <div className="text-left bg-background/50 rounded-lg p-4 overflow-auto max-h-40 border border-border">
            <p className="text-xs font-mono text-destructive font-semibold">
              {error.name}: {error.message}
            </p>
            <pre className="text-[10px] font-mono text-text-muted mt-2 whitespace-pre-wrap">
              {error.stack}
            </pre>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={resetErrorBoundary}
            className="flex-1 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground py-3 px-4 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Reintentar
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="flex-1 rounded-xl bg-surface border border-border hover:bg-background/80 text-text py-3 px-4 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-border"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};