'use client';

import { useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';

interface InsightIAProps {
  datosReales: any;
  tipo: 'general' | 'ventas' | 'compras' | 'logistica' | 'pagos';
}

export default function InsightIA({ datosReales, tipo }: InsightIAProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const pedirInsight = async () => {
    // Si ya tenemos el insight, solo abrimos el panel
    if (insight) {
      setIsOpen(true);
      return;
    }

    setCargando(true);
    setIsOpen(true); // Abrimos el panel para mostrar el estado de carga
    
    try {
      const response = await fetch('/api/analytics/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          datos: datosReales, 
          tipo: tipo 
        }),
      });

      const data = await response.json();
      setInsight(data.insight);
    } catch (error) {
      console.error(error);
      setInsight("No se pudo generar el consejo en este momento. Por favor, intentá de nuevo más tarde.");
    } finally {
      setCargando(false);
    }
  };

  const limpiarYBuscarDeNuevo = () => {
    setInsight(null);
    pedirInsight();
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      
      {/* PANEL FLOTANTE (POPOVER) */}
      <div 
        className={`mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-200 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header del Panel */}
        <div className="bg-[#1E3F20] px-4 py-3 flex justify-between items-center">
          <h3 className="text-white font-medium text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Auditoría IA — {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </h3>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-zinc-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Panel */}
        <div className="p-5 bg-zinc-50 min-h-[120px] flex flex-col justify-center">
          {cargando ? (
            <div className="flex flex-col items-center justify-center py-4 gap-3 text-zinc-500">
              <Loader2 className="w-6 h-6 animate-spin text-[#1E3F20]" />
              <p className="text-sm font-medium">Analizando métricas y detectando patrones...</p>
            </div>
          ) : (
            <div>
              <p className="text-sm leading-relaxed text-zinc-700 italic">
                "{insight}"
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-zinc-200 pt-3">
                <button 
                  onClick={limpiarYBuscarDeNuevo} 
                  className="text-xs font-medium text-[#1E3F20] hover:text-[#2c5c2f] hover:underline"
                >
                  Regenerar análisis
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-xs text-zinc-500 hover:text-zinc-800 bg-zinc-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTÓN FLOTANTE (TRIGGER) */}
      <button
        onClick={isOpen ? () => setIsOpen(false) : pedirInsight}
        className="flex items-center gap-2 bg-[#1E3F20] text-white px-5 py-3.5 rounded-full shadow-lg hover:bg-[#2c5c2f] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 active:scale-95 group"
      >
        {cargando ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Sparkles className="w-5 h-5 text-amber-300 group-hover:animate-pulse" />
        )}
        <span className="text-sm font-semibold tracking-wide pr-1">Consultar IA</span>
      </button>

    </div>
  );
}