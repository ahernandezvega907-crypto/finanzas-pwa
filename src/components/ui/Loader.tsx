import React from 'react';
import { cn } from '../../utils/cn';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  fullPage = false, 
  className, 
  ...props 
}) => {
  const sizeClasses = {
    sm: "h-5 w-5 stroke-[3]",
    md: "h-8 w-8 stroke-[2.5]",
    lg: "h-12 w-12 stroke-[2]",
  };

  const loaderContent = (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <svg
        className={cn("animate-spin text-primary", sizeClasses[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-10"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};