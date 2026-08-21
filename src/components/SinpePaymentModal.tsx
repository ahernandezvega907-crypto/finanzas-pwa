import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';

interface SinpePaymentModalProps {
  visible: boolean;
  onClose: () => void;
  sinpePhone: string;
  sinpeOwner: string;
  plan: 'mensual' | 'anual';
}

export const SinpePaymentModal: React.FC<SinpePaymentModalProps> = ({
  visible,
  onClose,
  sinpePhone,
  sinpeOwner,
  plan,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [warning, setWarning] = useState<string>('');

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(sinpePhone);
      setCopied(true);
    } catch {
      setWarning('No se pudo copiar automáticamente. Copia el número manualmente: ' + sinpePhone);
    }
  };

  const handleSubmitProof = () => {
    if (!referenceNumber.trim()) return;

    const planLabel =
      plan === 'mensual'
        ? 'Premium Mensual (₡2.990/mes)'
        : 'Premium Anual (₡24.900/año)';

    const mensaje = `Hola, acabo de realizar un SINPE Móvil. Número de referencia: ${referenceNumber.trim()}. Me gustaría activar mi plan ${planLabel} en MoneyFlow.`;
    const url = `https://wa.me/506${sinpePhone}?text=${encodeURIComponent(mensaje)}`;

    const win = window.open(url, '_blank');

    if (!win || win.closed) {
      setWarning(
        'No pudimos abrir WhatsApp automáticamente. Copia el número y escríbenos manualmente por WhatsApp.'
      );
      return;
    }

    setSubmitted(true);
  };

  const handleCloseAll = () => {
    setSubmitted(false);
    setReferenceNumber('');
    setWarning('');
    onClose();
  };

  return (
    <>
      <Dialog open={visible} onClose={handleCloseAll} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700 }}>
          Pago por SINPE Móvil
          <IconButton
            onClick={handleCloseAll}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {submitted ? (
            <Alert severity="success" sx={{ my: 2 }}>
              ¡Comprobante enviado por WhatsApp! Validaremos tu transferencia y activaremos tu cuenta Premium a la brevedad.
            </Alert>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Realiza la transferencia desde la aplicación de tu banco mediante SINPE Móvil con los siguientes datos:
              </Typography>

              <Box
                sx={{
                  bgcolor: 'action.hover',
                  p: 2,
                  borderRadius: 2,
                  mb: 3,
                  border: '1px dashed',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Número SINPE Móvil
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1 }}>
                    {sinpePhone}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyPhone}
                    variant="outlined"
                  >
                    Copiar
                  </Button>
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Titular de la cuenta
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {sinpeOwner}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Notificar comprobante
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="Número de referencia / Comprobante"
                placeholder="Ej: 12345678"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                sx={{ mb: 1 }}
              />
              {warning && (
                <Typography variant="caption" color="warning.main" sx={{ display: 'block', mb: 1 }}>
                  {warning}
                </Typography>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          {submitted ? (
            <Button fullWidth variant="contained" onClick={handleCloseAll}>
              Entendido
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              disabled={!referenceNumber.trim()}
              startIcon={<SendIcon />}
              onClick={handleSubmitProof}
            >
              Confirmar Transferencia
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        message="Número SINPE copiado al portapapeles"
      />
    </>
  );
};

export default SinpePaymentModal;