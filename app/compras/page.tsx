// app/compras/page.tsx
import Sidebar from "../components/Sidebar";
import InsightIA from "../components/InsightIA";
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

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans text-zinc-800">

      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 sm:p-12 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#1E3F20] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Reporte de Compradores
          </h1>
          <p className="text-zinc-600">Métricas de engagement y conversión de la aplicación de compras (Buyer App).</p>
        </div>

        {!data ? (
          <div className="bg-red-50 text-red-800 p-6 rounded-2xl border border-red-200">
            <h3 className="font-bold mb-1">No se pudieron cargar las métricas de compradores</h3>
            <p className="text-sm">Verificá las variables de entorno NEXT_PUBLIC_BUYER_URL y BUYER_API_KEY.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {data && <InsightIA datosReales={data} tipo="compras"/>}
            {/* TARJETAS DE MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
                <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Compradores Registrados</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#1E3F20]">{data.total_users ?? '—'}</span>
                  <span className="text-[#1E3F20] text-sm font-medium opacity-80">usuarios</span>
                </div>
              </div>

              <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
                <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Compradores Activos</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#1E3F20]">{data.active_buyers ?? '—'}</span>
                  <span className="text-[#1E3F20] text-sm font-medium opacity-80">con al menos 1 compra aprobada</span>
                </div>
              </div>

              <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
                <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Tasa de Conversión</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#1E3F20]">{data.conversion_rate ?? '—'}</span>
                  <span className="text-[#1E3F20] text-sm font-medium opacity-80">% de órdenes pagadas</span>
                </div>
              </div>

              <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
                <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Ingresos Totales</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#1E3F20]">
                    ${data.total_revenue != null ? data.total_revenue.toLocaleString('es-AR') : '—'}
                  </span>
                  <span className="text-[#1E3F20] text-sm font-medium opacity-80">ARS</span>
                </div>
              </div>
            </div>

            {/* TABLA DE ÓRDENES POR ESTADO */}
            <div>
              <h2 className="text-xl font-bold text-[#1E3F20] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Desglose de Órdenes por Estado
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
                    {data.orders_by_status && Object.keys(data.orders_by_status).length > 0 ? (
                      Object.entries(data.orders_by_status as Record<string, number>).map(([status, count]) => (
                        <tr key={status} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-[#1E3F20]">{status}</td>
                          <td className="px-6 py-4 text-zinc-600">{count} órdenes</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-6 py-8 text-center text-zinc-500">
                          Sin órdenes registradas.
                        </td>
                      </tr>
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