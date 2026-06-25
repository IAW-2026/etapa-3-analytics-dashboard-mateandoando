// app/page.tsx
import Sidebar from "./components/Sidebar";
import InsightIA from "./components/InsightIA";

// --- 1. FUNCIONES DE FETCH (Las 4 APIs del sistema) ---

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
    return null;
  }
}

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
    return null;
  }
}

async function getPaymentsMetrics() {
  const paymentsUrl = process.env.NEXT_PUBLIC_PAYMENTS_URL || "https://proyecto-c-payments-mateandoando.vercel.app";
  const apiKey = process.env.ANALYTICS_PAYMENTS_API_KEY || ""; 
  
  try {
    const res = await fetch(`${paymentsUrl}/api/payments/analytics`, {
      headers: { "x-api-key": apiKey },
      cache: "no-store", 
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

// --- 2. LA PÁGINA PRINCIPAL DEL DASHBOARD ---

export default async function AnalyticsDashboard() {
  const [shippingData, buyerData, sellerData, paymentsData] = await Promise.all([
    getShippingMetrics(),
    getBuyerMetrics(),
    getSellerMetrics(),
    getPaymentsMetrics()
  ]);
  
  const metricasConsolidadas = {
    compradores: buyerData,
    ventas: sellerData,
    logistica: shippingData,
    pagos: paymentsData
  };

  // --- LÓGICA DE PROCESAMIENTO PARA LOS 3 GRÁFICOS ---

  // 1. Datos del Embudo
  const totalOrdenes = sellerData?.general?.total_ordenes_validas ?? 0;
  const totalPagosAprobados = paymentsData?.transactions_by_status?.find(
    (item: { status: string; count: number }) => item.status === "APROBADO"
  )?.count ?? 0;
  
  // Protección matemática por si las DBs están desincronizadas (ej: más pagos que órdenes)
  const maxFunnel = Math.max(totalOrdenes, totalPagosAprobados, 1);
  const anchoOrdenes = Math.round((totalOrdenes / maxFunnel) * 100);
  const anchoPagos = Math.round((totalPagosAprobados / maxFunnel) * 100);
  const tasaConversion = totalOrdenes > 0 ? Math.round((totalPagosAprobados / totalOrdenes) * 100) : (totalPagosAprobados > 0 ? 100 : 0);
  const tasaAbandono = totalOrdenes > 0 ? Math.max(0, 100 - tasaConversion) : 0;

  // 2. Datos de Costo Logístico
  const revenueTotal = paymentsData?.financial_metrics?.total_revenue_ars ?? 0;
  const revenueProductos = sellerData?.general?.volumen_transaccionado_ars ?? 0;
  // Lo que sobra entre lo que cobró Payments y lo que valen los productos, es el envío.
  const costoLogisticoEstimado = Math.max(0, revenueTotal - revenueProductos); 
  const pctProductos = revenueTotal > 0 ? Math.round((revenueProductos / revenueTotal) * 100) : 0;
  const pctLogistica = revenueTotal > 0 ? Math.round((costoLogisticoEstimado / revenueTotal) * 100) : 0;

  // 3. Datos de Salud de la Cadena (Entregas)
  const paquetesVendidos = sellerData?.detailed?.total_paquetes_vendidos ?? 0;
  const paquetesEntregados = sellerData?.detailed?.by_status?.find(
    (s: { status: string; count: number }) => s.status === "ENTREGADO"
  )?.count ?? 0;
  const pctEntregados = paquetesVendidos > 0 ? Math.round((paquetesEntregados / paquetesVendidos) * 100) : 0;
  const pctPendientes = paquetesVendidos > 0 ? 100 - pctEntregados : 0;

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans text-zinc-800">
      
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 sm:p-12 overflow-y-auto">
        
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-[#1E3F20] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Visión General del Sistema
            </h1>
            <p className="text-zinc-600">Métricas consolidadas de todos los módulos en tiempo real.</p>
          </div>
        </div>
        
        <InsightIA datosReales={metricasConsolidadas} tipo="general" />
        
        <div className="space-y-10 mt-10">
          
          {/* GRILLA DE LOS 4 MÓDULOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-6 rounded-2xl shadow-sm border ${buyerData ? 'bg-[#C6E0B4] border-[#a8c994]' : 'bg-white border-zinc-200'}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${buyerData ? 'text-[#1E3F20]' : 'text-zinc-500'}`}>Compradores Registrados</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1E3F20]">{buyerData?.total_users ?? '—'}</span>
                <span className={`text-sm font-medium ${buyerData ? 'text-[#1E3F20] opacity-80' : 'text-zinc-400'}`}>usuarios</span>
              </div>
            </div>

            <div className={`p-6 rounded-2xl shadow-sm border ${sellerData ? 'bg-[#C6E0B4] border-[#a8c994]' : 'bg-white border-zinc-200'}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${sellerData ? 'text-[#1E3F20]' : 'text-zinc-500'}`}>Órdenes Generadas</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1E3F20]">{totalOrdenes}</span>
                <span className={`text-sm font-medium ${sellerData ? 'text-[#1E3F20] opacity-80' : 'text-zinc-400'}`}>pedidos</span>
              </div>
            </div>

            <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
              <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Envíos Procesados</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1E3F20]">{shippingData ? shippingData.total_shipments : 0}</span>
                <span className="text-[#1E3F20] opacity-80 text-sm font-medium">paquetes</span>
              </div>
            </div>

            <div className={`p-6 rounded-2xl shadow-sm border ${paymentsData ? 'bg-[#C6E0B4] border-[#a8c994]' : 'bg-white border-zinc-200'}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${paymentsData ? 'text-[#1E3F20]' : 'text-zinc-500'}`}>Volumen Transaccionado</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1E3F20]">
                  ${revenueTotal ? (revenueTotal / 1000).toFixed(1) : '—'}k
                </span>
                <span className={`text-sm font-medium ${paymentsData ? 'text-[#1E3F20] opacity-80' : 'text-zinc-400'}`}>ARS</span>
              </div>
            </div>
          </div>

          {/* SECTOR GRÁFICOS INTELIGENTES (CROSS-METRICS) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* GRÁFICO 1: EMBUDO DE CONVERSIÓN (Ancho Completo en móviles, Mitad en PC) */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex flex-col justify-between">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#1E3F20]" style={{ fontFamily: 'Georgia, serif' }}>
                  Embudo de Conversión (Seller vs Payments)
                </h3>
                <p className="text-xs text-zinc-500">Efectividad desde el carrito hasta la aprobación del pago.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-zinc-700">1. Órdenes Creadas</span>
                    <span className="font-bold text-zinc-900">{totalOrdenes} intenciones</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-6 rounded-lg overflow-hidden">
                    <div className="bg-[#1E3F20] h-full rounded-lg transition-all" style={{ width: `${anchoOrdenes}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-zinc-700">2. Pagos Aprobados</span>
                    <span className="font-bold text-[#1E3F20]">{totalPagosAprobados} aprobadas</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-6 rounded-lg overflow-hidden">
                    <div className="bg-[#C6E0B4] h-full rounded-lg transition-all" style={{ width: `${anchoPagos}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-zinc-100 text-center">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <span className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Conversión</span>
                  <span className="text-xl font-extrabold text-emerald-900">{tasaConversion}%</span>
                </div>
                <div className="p-2 bg-red-50 rounded-xl">
                  <span className="block text-[10px] font-bold text-red-700 uppercase tracking-wider">Abandono</span>
                  <span className="text-xl font-extrabold text-red-900">{tasaAbandono}%</span>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: LOS OTROS DOS GRÁFICOS APILADOS */}
            <div className="flex flex-col gap-6">
              
              {/* GRÁFICO 2: COSTO LOGÍSTICO (Payments vs Seller) */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex-1">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#1E3F20]" style={{ fontFamily: 'Georgia, serif' }}>
                    Distribución de Ingresos
                  </h3>
                  <p className="text-xs text-zinc-500">Proporción entre el valor de los productos y el costo de envío.</p>
                </div>
                
                <div className="w-full h-8 flex rounded-lg overflow-hidden mb-3">
                  <div className="bg-[#1E3F20] h-full flex items-center justify-center text-xs text-white font-bold transition-all" style={{ width: `${pctProductos}%` }}>
                    {pctProductos > 10 ? `${pctProductos}%` : ''}
                  </div>
                  <div className="bg-amber-400 h-full flex items-center justify-center text-xs text-amber-900 font-bold transition-all" style={{ width: `${pctLogistica}%` }}>
                    {pctLogistica > 10 ? `${pctLogistica}%` : ''}
                  </div>
                </div>
                
                <div className="flex justify-between text-xs font-medium text-zinc-600">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#1E3F20]"></span>
                    Valor Productos (${(revenueProductos/1000).toFixed(1)}k)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    Envíos (${(costoLogisticoEstimado/1000).toFixed(1)}k)
                  </div>
                </div>
              </div>

              {/* GRÁFICO 3: SALUD DE CADENA DE SUMINISTRO (Seller vs Shipping) */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex-1">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#1E3F20]" style={{ fontFamily: 'Georgia, serif' }}>
                    Salud de Entregas Físicas
                  </h3>
                  <p className="text-xs text-zinc-500">Progreso de los {paquetesVendidos} paquetes vendidos.</p>
                </div>

                <div className="w-full h-8 flex rounded-lg overflow-hidden mb-3">
                  <div className="bg-[#C6E0B4] h-full flex items-center justify-center text-xs text-[#1E3F20] font-bold transition-all" style={{ width: `${pctEntregados}%` }}>
                    {pctEntregados > 10 ? `${pctEntregados}%` : ''}
                  </div>
                  <div className="bg-zinc-200 h-full flex items-center justify-center text-xs text-zinc-500 font-bold transition-all" style={{ width: `${pctPendientes}%` }}>
                    {pctPendientes > 10 ? `${pctPendientes}%` : ''}
                  </div>
                </div>

                <div className="flex justify-between text-xs font-medium text-zinc-600">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#C6E0B4]"></span>
                    Ya Entregados ({paquetesEntregados})
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-zinc-200"></span>
                    En Proceso ({paquetesVendidos - paquetesEntregados})
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ESTADO DE LAS CONEXIONES */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1E3F20] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Estado de las APIs (Health Check)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${buyerData ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-sm font-medium text-zinc-600">Buyer API</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${sellerData ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-sm font-medium text-zinc-600">Seller API</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${shippingData ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-sm font-medium text-zinc-600">Shipping API</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${paymentsData ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-sm font-medium text-zinc-600">Payments API</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}