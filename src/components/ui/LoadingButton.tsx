import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, SxProps, Theme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface LoadingButtonProps {
  loading: boolean;
  disabled?: boolean;
  loadingText?: string;
  successText?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  children: React.ReactNode;
  fullWidth?: boolean;
  sx?: SxProps<Theme>; // Soporte explícito para la propiedad sx de Material UI
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  disabled = false,
  loadingText = 'Guardando...',
  successText = 'Guardado',
  type = 'submit',
  onClick,
  children,
  fullWidth = false,
  sx,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>; // Solución definitiva a ts(2503)
    if (loading) {
      setShowSuccess(false);
    } else if (!loading && !disabled && loadingText) {
      setShowSuccess(true);
      timer = setTimeout(() => setShowSuccess(false), 800);
    }
    return () => clearTimeout(timer);
  }, [loading, disabled, loadingText]);

  const isButtonDisabled = disabled || loading || showSuccess;

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={isButtonDisabled}
      variant="contained"
      fullWidth={fullWidth}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        py: 1,
        px: 3,
        minHeight: '40px',
        transition: 'all 0.2s ease-in-out',
        ...sx, // Inyecta los estilos sx adicionales pasados por props
      }}
      startIcon={
        loading ? (
          <CircularProgress size={16} color="inherit" />
        ) : showSuccess ? (
          <CheckIcon fontSize="small" />
        ) : undefined
      }
    >
      {loading ? loadingText : showSuccess ? successText : children}
    </Button>
  );
};