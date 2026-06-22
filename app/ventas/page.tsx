//app/ventas/page.tsx
import Link from "next/link";
import Sidebar from "../components/Sidebar";

async function getSellerMetrics() {
  const sellerUrl = process.env.NEXT_PUBLIC_SELLER_URL || "http://localhost:3000";
  const apiKey = process.env.SELLER_API_KEY || "";
  
  try {
    const res = await fetch(`${sellerUrl}/api/sellers/analytics`, {
      headers: { "x-api-key": apiKey },
      cache: "no-store", 
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error al buscar métricas comerciales:", error);
    return null;
  }
}

export default async function VentasDashboard() {
  const analyticsData = await getSellerMetrics();

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans text-zinc-800">
      
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 sm:p-12 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#1E3F20] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Reporte Comercial de Ventas
          </h1>
          <p className="text-zinc-600">Monitoreo transaccional del catálogo de productos y rendimiento de las tiendas (Seller App).</p>
        </div>

        {!analyticsData ? (
          <div className="bg-red-50 text-red-800 p-6 rounded-2xl border border-red-200">
            <h3 className="font-bold mb-1">No se pudieron cargar las métricas comerciales</h3>
            <p className="text-sm">Verificá las variables de entorno o la conexión con la base de datos de Neon.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* TARGETAS DE MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
                <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Artículos Totales Vendidos</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#1E3F20]">
                    {analyticsData.detailed?.total_paquetes_vendidos || 0}
                  </span>
                  <span className="text-[#1E3F20] text-sm font-medium opacity-80">paquetes comerciales</span>
                </div>
              </div>
              <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
                <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Ticket Promedio por Compra</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#1E3F20]">
                    ${analyticsData.detailed?.ticket_promedio_ars?.toLocaleString('es-AR') || 0}
                  </span>
                  <span className="text-[#1E3F20] text-sm font-medium opacity-80">ARS</span>
                </div>
              </div>
            </div>

            {/* TABLA DE ESTADOS COMERCIALES */}
            <div>
              <h2 className="text-xl font-bold text-[#1E3F20] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Desglose Operativo por Estado de Venta
              </h2>
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-6 py-4 font-bold text-zinc-600 text-xs uppercase tracking-wider">Estado de Comercialización</th>
                      <th className="px-6 py-4 font-bold text-zinc-600 text-xs uppercase tracking-wider">Volumen registrado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {analyticsData.detailed?.by_status?.length > 0 ? (
                      analyticsData.detailed.by_status.map((item: any, i: number) => (
                        <tr key={i} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-[#1E3F20]">
                            {item.status}
                          </td>
                          <td className="px-6 py-4 text-zinc-600">
                            {item.count} unidades de paquetes
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-6 py-8 text-center text-zinc-500">
                          Sin movimientos transaccionales en la base de datos.
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