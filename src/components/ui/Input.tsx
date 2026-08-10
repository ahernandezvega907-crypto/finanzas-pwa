import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

// 1. Variantes para los estados semánticos del Input
const inputVariants = cva(
  "h-11 w-full rounded-md border bg-surface px-3.5 py-2 text-sm text-text-main placeholder:text-text-muted/40 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2",
  {
    variants: {
      state: {
        default: "border-border focus:border-primary focus:ring-primary/20",
        success: "border-success focus:border-success focus:ring-success/20",
        error: "border-danger focus:border-danger focus:ring-danger/20",
      }
    },
    defaultVariants: {
      state: "default",
    }
  }
);

// 2. Interfaz formal y fuertemente tipada
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  fullWidth?: boolean;
}

// 3. Componente con ForwardRef
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, helperText, error, success, fullWidth = true, id, disabled, ...props }, ref) => {
    const generatedId = id || React.useId();
    const helperId = `${generatedId}-helper`;
    const errorId = `${generatedId}-error`;

    // Determinación atómica del estado visual semántico
    const visualState = error ? "error" : success ? "success" : "default";

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-auto")}>
        {/* Accesibilidad: Vinculación explícita mediante htmlFor */}
        {label && (
          <label
            htmlFor={generatedId}
            className={cn(
              "text-xs font-semibold select-none tracking-wide transition-colors duration-200",
              error ? "text-danger" : "text-text-muted"
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative w-full">
          <input
            type={type}
            id={generatedId}
            ref={ref}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={cn(
              error && errorId,
              helperText && !error && helperId
            ) || undefined}
            className={cn(inputVariants({ state: visualState, className }))}
            {...props}
          />
        </div>

        {/* Texto de Ayuda / Feedback Semántico */}
        {helperText && !error && (
          <p id={helperId} className="text-xs text-text-muted/80 tracking-wide mt-0.5">
            {helperText}
          </p>
        )}

        {/* Mensaje de Error con rol de alerta para lectores de pantalla */}
        {error && (
          <span 
            id={errorId}
            className="text-xs font-medium text-danger transition-all animate-in fade-in duration-200 mt-0.5"
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';