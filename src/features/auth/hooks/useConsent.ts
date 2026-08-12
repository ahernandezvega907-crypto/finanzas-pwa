import { useState, useEffect, useCallback } from 'react';
import { consentService } from '../services/consent.service';

export function useConsent() {
  const [needsConsent, setNeedsConsent] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkConsent = useCallback(async () => {
    setLoading(true);
    const accepted = await consentService.hasAcceptedCurrentPolicy();
    setNeedsConsent(!accepted);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkConsent();
  }, [checkConsent]);

  const acceptConsent = useCallback(async () => {
    await consentService.recordConsent();
    setNeedsConsent(false);
  }, []);

  return { needsConsent, loading, acceptConsent };
}