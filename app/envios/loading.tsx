// app/logistica/loading.tsx
import Sidebar from "../components/Sidebar";

export default function LogisticaLoading() {
  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans text-zinc-800 select-none">
      
      <Sidebar />

      {/* ESQUELETO DEL CONTENIDO */}
      <main className="flex-1 p-8 sm:p-12 overflow-y-auto animate-pulse">
        
        {/* Cabecera falsa */}
        <div className="mb-10 flex justify-between items-end border-b border-zinc-200 pb-6">
          <div className="space-y-3 w-full max-w-sm">
            <div className="h-9 bg-zinc-200 rounded-xl w-3/4"></div>
            <div className="h-4 bg-zinc-200 rounded-md w-full"></div>
          </div>
          <div className="w-24 h-8 bg-zinc-200 rounded-full hidden sm:block"></div>
        </div>

        <div className="space-y-8">
          
          {/* KPIs falsos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="h-32 bg-zinc-200 rounded-2xl"></div>
            <div className="h-32 bg-zinc-200 rounded-2xl"></div>
            <div className="h-32 bg-zinc-200 rounded-2xl"></div>
          </div>

          {/* Gráficos falsos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80 bg-zinc-200 rounded-2xl"></div>
            <div className="h-80 bg-zinc-200 rounded-2xl"></div>
          </div>

          {/* Tabla falsa */}
          <div className="h-44 bg-zinc-200 rounded-2xl"></div>

        </div>
      </main>
    </div>
  );
}