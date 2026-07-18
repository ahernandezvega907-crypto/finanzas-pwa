import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

// 1. Definición de las variantes visuales acopladas a nuestros Design Tokens de Tailwind v4
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-background font-bold hover:brightness-110 shadow-[0_0_15px_rgba(20,241,149,0.2)]",
        secondary: "bg-secondary text-background font-bold hover:brightness-110 shadow-[0_0_15px_rgba(0,217,255,0.2)]",
        outline: "border border-border bg-transparent text-text-main hover:bg-surface hover:text-white",
        ghost: "bg-transparent text-text-muted hover:bg-surface hover:text-text-main",
        danger: "bg-danger text-white font-semibold hover:brightness-110 shadow-[0_0_15px_rgba(239,68,108,0.15)]",
      },
      size: {
        sm: "h-9 px-3 text-xs rounded-sm",
        md: "h-11 px-5 text-sm rounded-md",
        lg: "h-13 px-8 text-base rounded-lg",
      },
      fullWidth: {
        true: "w-full",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

// 2. Tipado estricto extendiendo las propiedades de un botón nativo de HTML
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// 3. Componente con ForwardRef para permitir control de foco externo o librerías de animaciones
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-live={isLoading ? "polite" : "off"}
        {...props}
      >
        {/* Spinner de carga optimizado */}
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Renderizado condicional de iconos respetando la accesibilidad */}
        {!isLoading && leftIcon && <span className="flex items-center" aria-hidden="true">{leftIcon}</span>}
        
        <span>{children}</span>
        
        {!isLoading && rightIcon && <span className="flex items-center" aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';