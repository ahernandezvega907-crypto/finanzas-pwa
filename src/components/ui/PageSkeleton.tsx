import React from "react";

export const PageSkeleton = React.memo(function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      {/* Título de la Página */}
      <div className="h-8 w-56 rounded bg-zinc-800" />

      {/* Grid de Tarjetas de Resumen (4 Columnas) */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl h-28 bg-zinc-900 border border-zinc-800 p-5 space-y-3"
          >
            <div className="h-4 w-1/2 bg-zinc-800 rounded" />
            <div className="h-6 w-3/4 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>

      {/* Contenedor Grande para Gráfico Principal */}
      <div className="rounded-2xl h-96 bg-zinc-900 border border-zinc-800" />
    </div>
  );
});

export default PageSkeleton;