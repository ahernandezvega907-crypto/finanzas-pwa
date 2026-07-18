import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    // 1. Esto DEBE detener la recarga del navegador pase lo que pase
    e.preventDefault(); 
    console.log("Formulario enviado con:", email);

    if (!email || !password) {
      setLoginError('Por favor, rellena todos los campos.');
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    try {
      console.log("Intentando conectar con Supabase...");
      await login(email, password);
      
      console.log("¡Login exitoso! Redirigiendo...");
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Error capturado durante el login:", err);
      setLoginError(err?.message || 'Credenciales incorrectas o error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-lg border border-border space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-white">MoneyFlow</h2>
          <p className="text-sm text-text-muted">Accede a tu control inteligente financiero</p>
        </div>

        {/* Forzamos el onSubmit aquí */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {loginError && (
            <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg text-center">
              ⚠️ {loginError}
            </div>
          )}

          <Input 
            label="Correo electrónico" 
            type="email" 
            placeholder="nombre@correo.com" 
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          
          <Input 
            label="Contraseña" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          
          {/* Usamos un botón normal si el componente personalizado 'Button' no propaga bien el type="submit" */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-black font-semibold rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Ingresando...' : 'Ingresar de forma segura'}
          </button>
        </form>
      </div>
    </div>
  );
}