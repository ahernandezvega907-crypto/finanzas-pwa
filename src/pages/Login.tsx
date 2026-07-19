import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  // Extraemos tanto login como register desde tu hook personalizado
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  // Estado para alternar entre Login (false) y Registro (true)
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    console.log("Formulario enviado con:", email, "Modo registro:", isRegistering);

    if (!email || !password) {
      setLoginError('Por favor, rellena todos los campos.');
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    try {
      if (isRegistering) {
        console.log("Intentando registrar usuario en Supabase...");
        // Asumiendo que tu hook useAuth expone la función de registro (usualmente llamada register o signUp)
        if (register) {
          await register(email, password);
          console.log("¡Registro exitoso! Redirigiendo...");
          navigate('/dashboard');
        } else {
          throw new Error("La función de registro no está disponible en useAuth");
        }
      } else {
        console.log("Intentando conectar con Supabase (Login)...");
        await login(email, password);
        console.log("¡Login exitoso! Redirigiendo...");
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error("Error capturado durante el proceso de autenticación:", err);
      setLoginError(err?.message || 'Ocurrió un error con tus credenciales o la conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-lg border border-border space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-white">MoneyFlow</h2>
          <p className="text-sm text-text-muted">
            {isRegistering ? 'Crea tu cuenta para el control financiero' : 'Accede a tu control inteligente financiero'}
          </p>
        </div>

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
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-black font-semibold rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Procesando...' : isRegistering ? 'Registrarse e Ingresar' : 'Ingresar de forma segura'}
          </button>
        </form>

        {/* Enlace interactivo para alternar entre Login y Registro */}
        <div className="text-center pt-2">
          <p className="text-sm text-text-muted">
            {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setLoginError(null);
              }}
              className="ml-2 text-emerald-400 hover:text-emerald-300 font-medium underline bg-transparent border-none cursor-pointer"
            >
              {isRegistering ? 'Inicia sesión aquí' : 'Regístrate aquí'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}