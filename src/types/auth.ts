import { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  // Preparado para OAuth y contraseñas en fases posteriores
  signInWithProvider: (provider: 'google' | 'github') => Promise<void>;
}