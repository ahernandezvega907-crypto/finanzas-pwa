import { supabase } from '../../../lib/supabase';

export const CURRENT_POLICY_VERSION = '2026-08-11';

export const consentService = {
  async hasAcceptedCurrentPolicy(): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data, error } = await supabase
      .from('consent_log')
      .select('id')
      .eq('profile_id', user.id)
      .eq('policy_version', CURRENT_POLICY_VERSION)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error verificando consentimiento:', error.message);
      return false;
    }

    return data !== null;
  },

  async recordConsent(): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado.');
    }

    const { error } = await supabase.from('consent_log').insert([
      {
        profile_id: user.id,
        policy_version: CURRENT_POLICY_VERSION,
      },
    ]);

    if (error) {
      throw new Error(`Error al registrar consentimiento: ${error.message}`);
    }
  },
};