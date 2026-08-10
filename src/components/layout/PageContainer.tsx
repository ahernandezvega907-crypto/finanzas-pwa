import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="w-full max-w-screen-2xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
      {children}
    </div>
  );
}