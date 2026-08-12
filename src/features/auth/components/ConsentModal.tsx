import { useConsent } from '../hooks/useConsent';

export function ConsentModal() {
  const { needsConsent, loading, acceptConsent } = useConsent();

  if (!needsConsent) return null;

  const handleAccept = async () => {
    try {
      await acceptConsent();
    } catch (error) {
      console.error('Error al aceptar consentimiento:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl bg-surface border border-border p-6 shadow-2xl text-text-main">
        <h2 className="text-xl font-bold mb-3 text-primary">Términos y Privacidad</h2>
        <p className="text-sm text-text-muted mb-4 leading-relaxed">
          Para continuar utilizando MoneyFlow y hacer uso de las herramientas asistidas por Inteligencia Artificial, debes aceptar nuestros términos de servicio y políticas de tratamiento de datos financieros.
        </p>

        <a
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium text-primary hover:underline mb-6"
        >
          Leer la Política de Privacidad completa
        </a>

        <button
          onClick={handleAccept}
          disabled={loading}
          className="w-full h-11 rounded-md bg-primary text-background text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Aceptar y Continuar'}
        </button>
      </div>
    </div>
  );
}