import React, { createContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // Inicialización asíncrona de la sesión actual
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (isMounted) {
        if (!error && session) {
          setUser(session.user);
        }
        setLoading(false);
      }
    });

    // Suscripción al listener global de autenticación de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // No cambiamos loading aquí de forma manual para evitar parpadeos visuales;
    // la respuesta asíncrona de onAuthStateChange se encargará de resolver el flujo.
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } finally {
      // Limpieza optimista y segura en caso de que falle la conexión durante el cierre de sesión
      setUser(null);
      setLoading(false);
    }
  }, []);

  // Memorización de referencia perfecta del Value del Provider
  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    loading,
    login,
    signOut,
  }), [user, loading, login, signOut]);

  // Permitimos renderizar los hijos de manera inmediata delegando las pantallas de carga (Splash)
  // al Router o componente consumidor para evitar desmontajes abruptos de toda la App
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};