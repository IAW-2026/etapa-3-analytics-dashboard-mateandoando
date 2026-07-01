// app/ventas/page.tsx
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import InsightIA from "../components/InsightIA";
import { TrendingUp, Package, DollarSign, ShoppingCart, AlertCircle, Award, CircleMinus, Star, Truck } from "lucide-react";
import VentasChart from "../components/VentasChart";
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
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-[#1E3F20] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Reporte Comercial de Ventas
            </h1>
            <p className="text-zinc-600">Auditoría financiera, rendimiento de tiendas y estado del catálogo.</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Última actualización</span>
            <p className="text-sm font-medium text-zinc-600">{new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {!analyticsData ? (
          <div className="bg-red-50 text-red-800 p-6 rounded-2xl border border-red-200 flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h3 className="font-bold mb-1">Error de conexión con el servidor de métricas</h3>
              <p className="text-sm">Verificá las variables de entorno o la conexión con la base de datos de Neon.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <InsightIA datosReales={analyticsData} tipo="ventas"/>

            {/* ROW 1: KPIs FINANCIEROS Y OPERATIVOS (Grid de 4) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:border-[#a8c994] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Recaudación Bruta</h3>
                  <div className="p-2 bg-[#eef7ea] rounded-lg text-[#1E3F20]"><DollarSign className="w-5 h-5" /></div>
                </div>
                <span className="text-3xl font-extrabold text-zinc-900">
                  ${(analyticsData.general?.volumen_transaccionado_ars || 0).toLocaleString('es-AR')}
                </span>
                <p className="text-xs text-[#1E3F20] font-medium mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Últimos 30 días
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:border-[#a8c994] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Órdenes Generadas</h3>
                  <div className="p-2 bg-[#eef7ea] rounded-lg text-[#1E3F20]"><ShoppingCart className="w-5 h-5" /></div>
                </div>
                <span className="text-3xl font-extrabold text-zinc-900">
                  {analyticsData.general?.total_ordenes_validas || 0}
                </span>
                <p className="text-xs text-zinc-500 mt-2">Transacciones exitosas</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:border-[#a8c994] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Ticket Promedio</h3>
                  <div className="p-2 bg-[#eef7ea] rounded-lg text-[#1E3F20]"><DollarSign className="w-5 h-5" /></div>
                </div>
                <span className="text-3xl font-extrabold text-zinc-900">
                  ${(analyticsData.detailed?.ticket_promedio_ars || 0).toLocaleString('es-AR')}
                </span>
                <p className="text-xs text-zinc-500 mt-2">Gasto promedio por comprador</p>
                {/* MÉTRICA CRUZADA LOGÍSTICA */}
                <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-xs font-medium text-amber-600">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Envío prom: ${(analyticsData.detailed?.costo_envio_promedio || 0).toLocaleString('es-AR')}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:border-[#a8c994] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Artículos Vendidos</h3>
                  <div className="p-2 bg-[#eef7ea] rounded-lg text-[#1E3F20]"><Package className="w-5 h-5" /></div>
                </div>
                <span className="text-3xl font-extrabold text-zinc-900">
                  {analyticsData.detailed?.total_paquetes_vendidos || 0}
                </span>
                <p className="text-xs text-zinc-500 mt-2">Unidades físicas despachadas</p>
              </div>
            </div>

            {/* ROW 2: GRÁFICOS Y TABLAS AVANZADAS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Columna Izquierda (Ocupa 2 espacios) - Gráficos y Desglose */}
              <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col">
                   <h3 className="text-lg font-bold text-[#1E3F20]">Evolución de Ventas (Últimos 30 días)</h3>
                   <VentasChart data={analyticsData.charts?.evolucion_ventas || []} />
                </div>

                {/* Tabla de Estados (La que ya tenías, pero estilizada) */}
                <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-zinc-100">
                    <h2 className="text-lg font-bold text-[#1E3F20]">Desglose Operativo de Paquetes</h2>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="px-6 py-3 font-bold text-zinc-500 text-xs uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 font-bold text-zinc-500 text-xs uppercase tracking-wider">Volumen</th>
                        <th className="px-6 py-3 font-bold text-zinc-500 text-xs uppercase tracking-wider w-1/3">Progreso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {analyticsData.detailed?.by_status?.length > 0 ? (
                        analyticsData.detailed.by_status.map((item: any, i: number) => {
                          // Calculamos porcentaje visual
                          const total = analyticsData.detailed.total_paquetes_vendidos;
                          const porcentaje = total > 0 ? Math.round((item.count / total) * 100) : 0;
                          
                          return (
                            <tr key={i} className="hover:bg-zinc-50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-zinc-800">{item.status}</td>
                              <td className="px-6 py-4 text-zinc-600">{item.count} unid.</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-full bg-zinc-200 rounded-full h-2">
                                    <div className="bg-[#a8c994] h-2 rounded-full" style={{ width: `${porcentaje}%` }}></div>
                                  </div>
                                  <span className="text-xs text-zinc-500 font-medium">{porcentaje}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr><td colSpan={3} className="px-6 py-8 text-center text-zinc-500">Sin datos registrados.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Columna Derecha (Ocupa 1 espacio) - Rankings y Alertas */}
              <div className="space-y-6">
                
                {/* Ranking de Vendedores */}
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <Award className="w-5 h-5 text-amber-500" />
                    <h2 className="text-lg font-bold text-zinc-800">Top Vendedores</h2>
                  </div>
                  <div className="space-y-4">
                    {analyticsData.charts?.top_vendedores?.map((vendedor: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <div>
                          <p className="text-sm font-bold text-zinc-800">{vendedor.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-zinc-500">{vendedor.sales_made} ventas</p>
                            <span className="text-zinc-300">•</span>
                            {/* ESTRELLAS DE REPUTACIÓN */}
                            <div className="flex items-center text-amber-500">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs font-bold ml-1">{Number(vendedor.rating || 0).toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`text-sm font-black ${idx === 0 ? 'text-[#1E3F20]' : 'text-zinc-400'}`}>
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alerta de Stock Muerto */}
                <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <CircleMinus className="w-5 h-5 text-rose-500" />
                    <h2 className="text-lg font-bold text-zinc-800">Stock Inactivo</h2>
                  </div>
                  {analyticsData.charts?.stock_inactivo?.length > 0 ? (
                    <ul className="space-y-3">
                      {analyticsData.charts.stock_inactivo.map((prod: any, idx: number) => (
                        <li key={idx} className="text-sm text-rose-700 flex justify-between border-b border-rose-50 pb-2">
                          <span className="truncate pr-2">{prod.name}</span>
                          <span className="font-bold">{prod.stock} ud.</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-zinc-500">Excelente, todo tu catálogo tiene stock disponible.</p>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}