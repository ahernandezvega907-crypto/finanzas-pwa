import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface PremiumState {
  isPremium: boolean;
  premiumExpiresAt: string | null;
  loading: boolean;
  error: string | null;
}

export function usePremium(): PremiumState & { refresh: () => Promise<void> } {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [premiumExpiresAt, setPremiumExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPremiumStatus = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('No autenticado');
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_premium, premium_expires_at')
        .eq('id', user.id)
        .single();

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      const active = !!profile?.is_premium;
      const expiresAt = profile?.premium_expires_at || null;

      if (active && expiresAt && new Date(expiresAt) < new Date()) {
        setIsPremium(false);
        setPremiumExpiresAt(expiresAt);
      } else {
        setIsPremium(active);
        setPremiumExpiresAt(expiresAt);
      }
    } catch (err: any) {
      setError(err.message || 'Error al consultar suscripción');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPremiumStatus();
  }, [fetchPremiumStatus]);

  return { isPremium, premiumExpiresAt, loading, error, refresh: fetchPremiumStatus };
}