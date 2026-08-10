import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline';
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverable = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Estilos base y curvatura acoplados a tus tokens globales
          "overflow-hidden rounded-lg transition-all duration-200 text-text-main",
          // Mapeo semántico de variantes
          variant === 'default' && "bg-surface border border-border shadow-sm",
          variant === 'outline' && "bg-transparent border border-border",
          // Micro-interacción premium opcional
          hoverable && "hover:border-border/80 hover:shadow-md hover:translate-y-[-2px] cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';