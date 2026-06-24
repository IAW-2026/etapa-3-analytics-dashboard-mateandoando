// app/logistica/page.tsx
import Link from "next/link";
import Sidebar from "../components/Sidebar";

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

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans text-zinc-800">
      
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 sm:p-12 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#1E3F20] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Reporte de Logística
          </h1>
          <p className="text-zinc-600">Detalle operativo de la aplicación de envíos (Shipping App).</p>
        </div>

        {!analyticsData ? (
          <div className="bg-red-50 text-red-800 p-6 rounded-2xl border border-red-200">
            <h3 className="font-bold mb-1">No se pudieron cargar las métricas de logística</h3>
            <p className="text-sm">Revisá la conexión con tu API en producción.</p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
                <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Total Procesados</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#1E3F20]">{analyticsData.total_shipments || 0}</span>
                  <span className="text-[#1E3F20] text-sm font-medium opacity-80">paquetes</span>
                </div>
              </div>
              <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
                <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Entregas (Últ. 7 días)</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#1E3F20]">{analyticsData.recent_deliveries || 0}</span>
                  <span className="text-[#1E3F20] text-sm font-medium opacity-80">completadas</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#1E3F20] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Desglose por Estado Logístico
              </h2>
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-6 py-4 font-bold text-zinc-600 text-xs uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-4 font-bold text-zinc-600 text-xs uppercase tracking-wider">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {analyticsData.by_status?.length > 0 ? (
                      analyticsData.by_status.map((item: any, i: number) => (
                        <tr key={i} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-[#1E3F20]">{item.status}</td>
                          <td className="px-6 py-4 text-zinc-600">{item.count} paquetes</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={2} className="px-6 py-8 text-center text-zinc-500">Sin datos registrados.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}