// app/page.tsx
import Sidebar from "./components/Sidebar";

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
  // Simulación temporal
  return { total_revenue: 1250000, successful_transactions: 85 };
}

// --- 2. LA PÁGINA PRINCIPAL DEL DASHBOARD ---

export default async function AnalyticsDashboard() {
  // Ejecutamos las 4 llamadas EN PARALELO para que el dashboard cargue rapidísimo
  const [shippingData, buyerData, sellerData, paymentsData] = await Promise.all([
    getShippingMetrics(),
    getBuyerMetrics(),
    getSellerMetrics(),
    getPaymentsMetrics()
  ]);

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

        <div className="space-y-10">
          
          {/* GRILLA DE LOS 4 MÓDULOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. BUYER APP */}
            <div className={`p-6 rounded-2xl shadow-sm border ${buyerData ? 'bg-[#C6E0B4] border-[#a8c994]' : 'bg-white border-zinc-200'}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${buyerData ? 'text-[#1E3F20]' : 'text-zinc-500'}`}>Compradores Registrados</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1E3F20]">
                  {buyerData?.total_users ?? '—'}
                </span>
                <span className={`text-sm font-medium ${buyerData ? 'text-[#1E3F20] opacity-80' : 'text-zinc-400'}`}>usuarios</span>
              </div>
            </div>

            {/* 2. SELLER APP (Datos Reales) - Iluminada en verde */}
            <div className={`p-6 rounded-2xl shadow-sm border ${sellerData ? 'bg-[#C6E0B4] border-[#a8c994]' : 'bg-white border-zinc-200'}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${sellerData ? 'text-[#1E3F20]' : 'text-zinc-500'}`}>Órdenes Generadas</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1E3F20]">
                  {sellerData ? sellerData.general.total_ordenes_validas : 0}
                </span>
                <span className={`text-sm font-medium ${sellerData ? 'text-[#1E3F20] opacity-80' : 'text-zinc-400'}`}>pedidos</span>
              </div>
            </div>

            {/* 3. SHIPPING APP (Datos Reales) */}
            <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
              <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Envíos Procesados</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1E3F20]">
                  {shippingData ? shippingData.total_shipments : 0}
                </span>
                <span className="text-[#1E3F20] opacity-80 text-sm font-medium">paquetes</span>
              </div>
            </div>

            {/* 4. PAYMENTS APP */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Volumen Transaccionado</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#1E3F20]">
                  ${(paymentsData.total_revenue / 1000).toFixed(1)}k
                </span>
                <span className="text-zinc-400 text-sm font-medium">ARS</span>
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
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                <span className="text-sm font-medium text-zinc-600">Payments API (Mock)</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}