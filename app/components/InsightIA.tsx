'use client';

import { useState } from 'react';

interface InsightIAProps {
  datosReales: any;
  tipo: 'general' | 'ventas' | 'compras' | 'logistica' | 'pagos';
}

export default function InsightIA({ datosReales, tipo }: InsightIAProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const pedirInsight = async () => {
    setCargando(true);
    try {
      const response = await fetch('/api/analytics/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          datos: datosReales, 
          tipo: tipo // Enviamos el contexto de la página actual
        }),
      });

      const data = await response.json();
      setInsight(data.insight);
    } catch (error) {
      console.error(error);
      setInsight("No se pudo generar el consejo en este momento.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-[#1E3F20]" style={{ fontFamily: 'Georgia, serif' }}>
            ✨ Asistente de Negocios IA — Análisis de {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </h3>
          <p className="text-sm text-zinc-500">
            Obtené una auditoría inteligente basada en los datos actuales de este módulo.
          </p>
        </div>

        {!insight && (
          <button
            onClick={pedirInsight}
            disabled={cargando}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              cargando
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : 'bg-[#1E3F20] text-white hover:bg-[#2c5c2f] active:scale-95 shadow-sm'
            }`}
          >
            {cargando ? 'Analizando variables...' : 'Generar Insight'}
          </button>
        )}
      </div>

      {insight && (
        <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100 animate-fadeIn">
          <p className="text-sm leading-relaxed text-zinc-700 italic">
            "{insight}"
          </p>
          <button 
            onClick={() => setInsight(null)} 
            className="mt-2 text-xs text-zinc-400 hover:text-zinc-600 underline"
          >
            Limpiar análisis
          </button>
        </div>
      )}
    </div>
  );
}