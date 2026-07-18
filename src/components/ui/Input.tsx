import React, { forwardRef, useId } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

// Variantes para controlar el estado del borde y focus basándonos en el feedback de validación
const inputVariants = cva(
  "w-full bg-surface text-text-main border rounded-md px-4 h-11 text-sm transition-all duration-200 placeholder:text-text-muted focus:outline-none focus:ring-1 disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      state: {
        normal: "border-border focus:border-primary focus:ring-primary/50",
        error: "border-danger focus:border-danger focus:ring-danger/50 text-danger",
        success: "border-primary focus:border-primary focus:ring-primary/50",
      }
    },
    defaultVariants: {
      state: "normal",
    }
  }
);

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'state'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  isSuccess?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, errorText, isSuccess, disabled, type = "text", ...props }, ref) => {
    const generatedId = useId();
    const helperId = `${generatedId}-helper`;
    const errorId = `${generatedId}-error`;

    // Determinamos el estado semántico actual del input
    let currentState: 'normal' | 'error' | 'success' = 'normal';
    if (errorText) currentState = 'error';
    else if (isSuccess) currentState = 'success';

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label 
            htmlFor={generatedId} 
            className={cn(
              "text-xs font-semibold tracking-wide uppercase transition-colors duration-200",
              currentState === 'error' ? "text-danger" : "text-text-muted"
            )}
          >
            {label}
          </label>
        )}

        <div className="relative w-full">
          <input
            id={generatedId}
            type={type}
            className={cn(inputVariants({ state: currentState, className }))}
            disabled={disabled}
            ref={ref}
            aria-invalid={currentState === 'error'}
            aria-describedby={cn(
              helperText && helperId,
              errorText && errorId
            ) || undefined}
            {...props}
          />
        </div>

        {/* Texto de ayuda secundario */}
        {helperText && !errorText && (
          <p id={helperId} className="text-xs text-text-muted mt-0.5 leading-relaxed">
            {helperText}
          </p>
        )}

        {/* Mensaje de error dinámico */}
        {errorText && (
          <p id={errorId} className="text-xs text-danger font-medium mt-0.5 animate-fade-in" aria-live="assertive">
            {errorText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';