// app/compras/page.tsx
import Sidebar from "../components/Sidebar";
import InsightIA from "../components/InsightIA";
import BuyerCharts from "../components/BuyerCharts";

async function getBuyerMetrics() {
  const buyerUrl = process.env.NEXT_PUBLIC_BUYER_URL || "https://proyecto-c-buyer2-mateandoando.vercel.app";
  const apiKey = process.env.BUYER_API_KEY || "";
  try {
    const res = await fetch(`${buyerUrl}/api/metrics/engagement`, {
      headers: { "x-api-key": apiKey },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error al buscar métricas de compradores:", error);
    return null;
  }
}

export default async function ComprasPage() {
  const data = await getBuyerMetrics();

  const totalOrders: number = data?.total_orders ?? 0;

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans text-zinc-800">

      <Sidebar />

      <main className="flex-1 p-8 sm:p-12 overflow-y-auto">

        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-200 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#1E3F20] mb-2" style={{ fontFamily: "Georgia, serif" }}>
              Inteligencia de Compradores
            </h1>
            <p className="text-zinc-500 font-medium">Engagement, conversión y distribución de órdenes (Buyer App).</p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-2 h-8 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Data
          </span>
        </div>

        {!data ? (
          <div className="bg-red-50 text-red-800 p-6 rounded-2xl border border-red-200 shadow-sm">
            <h3 className="font-bold mb-1">Error de Conexión</h3>
            <p className="text-sm">Verificá las variables de entorno NEXT_PUBLIC_BUYER_URL y BUYER_API_KEY.</p>
          </div>
        ) : (
          <div className="space-y-8">

            {data && <InsightIA datosReales={data} tipo="compras" />}

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#1E3F20] p-6 rounded-2xl shadow-md border border-[#152e16] relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <h3 className="text-[#C6E0B4] text-xs font-bold uppercase tracking-wider mb-2">Compradores Registrados</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-white">{data.total_users ?? '—'}</span>
                  <span className="text-emerald-100/70 text-sm font-medium">usuarios</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Compradores Activos</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-[#1E3F20]">{data.active_buyers ?? '—'}</span>
                  <span className="text-zinc-400 text-sm font-medium">con compra aprobada</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Total de Órdenes</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-[#1E3F20]">{data.total_orders ?? '—'}</span>
                  <span className="text-zinc-400 text-sm font-medium">órdenes</span>
                </div>
              </div>

              <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
                <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Tasa de Conversión</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-[#1E3F20]">{data.conversion_rate ?? '—'}%</span>
                  <span className="text-[#1E3F20] opacity-80 text-sm font-medium">órdenes pagadas</span>
                </div>
              </div>
            </div>

            {/* CHARTS */}
            <BuyerCharts data={data} />

            {/* TABLA DE ÓRDENES POR ESTADO CON PORCENTAJE */}
            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50">
                <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">
                  Auditoría de Órdenes por Estado
                </h2>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-zinc-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-zinc-500 text-xs uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 font-bold text-zinc-500 text-xs uppercase tracking-wider text-right">Órdenes</th>
                    <th className="px-6 py-4 font-bold text-zinc-500 text-xs uppercase tracking-wider text-right">Participación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {data.orders_by_status && Object.keys(data.orders_by_status).length > 0 ? (
                    Object.entries(data.orders_by_status as Record<string, number>).map(([status, count]) => {
                      const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                      return (
                        <tr key={status} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-[#1E3F20]">{status}</td>
                          <td className="px-6 py-4 font-mono text-zinc-600 text-right">{count}</td>
                          <td className="px-6 py-4 text-right">
                            <span className="inline-flex items-center gap-2">
                              <span className="w-20 bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                                <span
                                  className="h-1.5 bg-[#1E3F20] rounded-full block"
                                  style={{ width: `${pct}%` }}
                                />
                              </span>
                              <span className="font-mono text-zinc-600 w-8 text-right">{pct}%</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                        Sin órdenes registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* INGRESOS TOTALES AL PIE */}
              <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Ingresos Totales (Aprobados)</span>
                <span className="font-mono font-bold text-[#1E3F20] text-base">
                  ${data.total_revenue != null ? data.total_revenue.toLocaleString("es-AR") : "—"} ARS
                </span>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
