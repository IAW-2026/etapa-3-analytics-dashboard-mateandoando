// app/logistica/page.tsx
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import ShippingCharts from "../components/ShippingCharts";
import RefreshButton from "../components/RefreshButtonShipping"; 

async function getShippingMetrics() {
  const shippingUrl = process.env.NEXT_PUBLIC_SHIPPING_URL || "https://proyecto-c-shipping-mateandoando.vercel.app";
  const apiKey = process.env.SHIPPING_API_KEY || "";
  try {
    const res = await fetch(`${shippingUrl}/api/shippings/analytics`, {
      headers: { "x-api-key": apiKey },
      cache: "no-store", 
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function LogisticaDashboard() {
  const analyticsData = await getShippingMetrics();

  // <-- 2. CALCULAMOS EL TOTAL DE ENTREGADOS BUSCANDO EN EL GRÁFICO
  const totalDelivered = analyticsData?.by_status?.find(
    (item: any) => item.status === "ENTREGADO"
  )?.count || 0;

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans text-zinc-800">
      
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 sm:p-12 overflow-y-auto">
        
        {/* <-- 3. CABECERA ACTUALIZADA CON EL BOTÓN Y LA ETIQUETA "LIVE DATA" */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-200 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#1E3F20] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Inteligencia Logística
            </h1>
            <p className="text-zinc-500 font-medium">Monitoreo corporativo y rendimiento de distribución.</p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            
            <RefreshButton />

            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-2 h-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Data
            </span>
          </div>
        </div>

        {!analyticsData ? (
          <div className="bg-red-50 text-red-800 p-6 rounded-2xl border border-red-200 shadow-sm">
            <h3 className="font-bold mb-1">Error de Conexión</h3>
            <p className="text-sm">No se pudieron recuperar las métricas operativas.</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* CARD KPIS SUPERIORES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-[#1E3F20] p-6 rounded-2xl shadow-md border border-[#152e16] relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <h3 className="text-[#C6E0B4] text-xs font-bold uppercase tracking-wider mb-2">Volumen Total</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-white">{analyticsData.total_shipments || 0}</span>
                  <span className="text-emerald-100/70 text-sm font-medium">envíos</span>
                </div>
              </div>

              {/* <-- 4. ACTUALIZAMOS LA TARJETA DE ENTREGAS EXITOSAS */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Entregas Exitosas</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-[#1E3F20]">{totalDelivered}</span>
                  <span className="text-zinc-400 text-sm font-medium">paquetes</span>
                </div>
              </div>

              {/* <-- 5. ACTUALIZAMOS EL CÁLCULO DE LA TASA DE EFECTIVIDAD */}
              <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
                <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Tasa de Efectividad</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-[#1E3F20]">
                    {analyticsData.total_shipments > 0 
                      ? Math.round((totalDelivered / analyticsData.total_shipments) * 100) 
                      : 0}%
                  </span>
                  <span className="text-[#1E3F20] opacity-80 text-sm font-medium">efectivo</span>
                </div>
              </div>

            </div>

            {/* 2. COMPONENTE DE GRÁFICOS DE TREMOR */}
            <ShippingCharts data={analyticsData} />

            {/* 3. TABLA DE DETALLES HISTÓRICOS */}
            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50">
                <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">
                  Auditoría Tabular Histórica
                </h2>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-zinc-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-zinc-500 text-xs uppercase tracking-wider">Métrica Logística</th>
                    <th className="px-6 py-4 font-bold text-zinc-500 text-xs uppercase tracking-wider text-right">Impacto Operativo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-zinc-700">Paquetes procesados históricamente</td>
                    <td className="px-6 py-4 font-mono text-zinc-600 text-right">{analyticsData.total_shipments} u.</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-zinc-700">Entregas concretadas (Último ciclo)</td>
                    <td className="px-6 py-4 font-mono text-emerald-600 font-medium text-right">{analyticsData.recent_deliveries} u.</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}