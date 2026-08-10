import React from 'react';
import { useNotification } from '../../hooks/useNotification';

export const ToastContainer: React.FC = () => {
  const { notifications, dismissNotification } = useNotification();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none" 
      role="status" 
      aria-live="polite"
    >
      {notifications?.map((n: { id: string; message: string; type: string }) => (
        <div
          key={n.id}
          className={`pointer-events-auto p-4 rounded-xl shadow-xl border text-sm font-medium transition-all duration-300 flex justify-between items-center bg-zinc-900/95 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 ${
            n.type === 'success' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-950/25' :
            n.type === 'error' ? 'text-red-400 border-red-500/20 bg-red-950/25' :
            n.type === 'warning' ? 'text-amber-400 border-amber-500/20 bg-amber-950/25' :
            'text-zinc-200 border-zinc-800'
          }`}
        >
          <span>{n.message}</span>
          <button 
            onClick={() => dismissNotification(n.id)} 
            className="ml-4 text-zinc-500 hover:text-zinc-200 transition-colors duration-150 text-base font-bold cursor-pointer p-1" 
            aria-label="Cerrar notificación"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};