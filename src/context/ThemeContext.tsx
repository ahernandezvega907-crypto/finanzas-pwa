import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback, useRef } from 'react';

export type ThemeMode = 'dark' | 'light';

export interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Función pura externa para determinar el tema inicial de forma determinista y limpia
const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark';

  const savedTheme = localStorage.getItem('mf_theme') as ThemeMode | null;
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  // Si no hay preferencia explícita, respetamos la configuración de su sistema operativo
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return systemPrefersDark ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicialización perezosa de un único ciclo para evitar bloquear el hilo principal
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);
  
  // Guardamos una referencia para bloquear la primera escritura redundante en disco durante el montado
  const isMounted = useRef(false);

  // Sincronización atómica con el DOM y Persistencia en localStorage
  useEffect(() => {
    const root = document.documentElement;
    
    // Sincronización con Tailwind CSS (modo class) y selectores CSS tradicionales (modo dataset)
    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('data-theme', theme);

    if (isMounted.current) {
      localStorage.setItem('mf_theme', theme);
    } else {
      isMounted.current = true;
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
  }, []);

  const contextValue = useMemo<ThemeContextType>(() => ({
    theme,
    toggleTheme,
    setTheme,
  }), [theme, toggleTheme, setTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};