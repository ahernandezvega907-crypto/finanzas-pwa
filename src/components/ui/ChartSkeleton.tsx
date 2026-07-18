import React from "react";

export const ChartSkeleton = React.memo(function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 animate-pulse">
      {/* Título de la tarjeta */}
      <div className="h-6 w-40 rounded bg-zinc-800 mb-6" />

      {/* Área del Gráfico */}
      <div className="h-72 rounded-xl bg-zinc-800/50 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-zinc-700 border-t-transparent animate-spin" />
      </div>

      {/* Leyendas inferiores */}
      <div className="mt-6 flex justify-center gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-3 w-16 rounded bg-zinc-800"
          />
        ))}
      </div>
    </div>
  );
});

export default ChartSkeleton;