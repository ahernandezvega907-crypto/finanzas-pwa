import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, LogOut } from 'lucide-react';

interface PinLockProps {
  onSuccess?: () => void;
}

export const PinLock: React.FC<PinLockProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { setIsPinLocked, signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError('');
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const verifyPin = (enteredPin: string) => {
    if (!user?.id) {
      setError('No se pudo verificar la sesión. Inicia sesión de nuevo.');
      return;
    }

    const validPin = localStorage.getItem(`app_pin_code_${user.id}`);

    if (!validPin) {
      setError('No tienes un PIN configurado. Ve a Ajustes para crear uno.');
      setPin('');
      return;
    }

    if (enteredPin === validPin) {
      setIsPinLocked(false);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setError('PIN incorrecto. Intenta de nuevo.');
      setPin('');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsPinLocked(false);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
          <Lock className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-text-main mb-2">Aplicación Bloqueada</h1>
        <p className="text-sm text-text-muted mb-8 text-center">
          Ingresa tu PIN de 4 dígitos para acceder a tus datos financieros.
        </p>

        {/* Indicadores de PIN */}
        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3].map(index => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                pin.length > index
                  ? 'bg-primary border-primary scale-110'
                  : 'border-border bg-transparent'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-6 font-medium animate-shake text-center">
            {error}
          </p>
        )}

        {/* Teclado numérico */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[280px] mb-8">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="w-16 h-16 rounded-full bg-surface border border-border text-2xl font-semibold text-text-main flex items-center justify-center hover:bg-surface-hover active:scale-95 transition-all mx-auto shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="w-16 h-16 rounded-full bg-surface border border-border text-text-muted flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 active:scale-95 transition-all mx-auto"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="w-16 h-16 rounded-full bg-surface border border-border text-2xl font-semibold text-text-main flex items-center justify-center hover:bg-surface-hover active:scale-95 transition-all mx-auto shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-full bg-surface border border-border text-text-muted font-medium flex items-center justify-center hover:bg-surface-hover active:scale-95 transition-all mx-auto"
          >
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
};