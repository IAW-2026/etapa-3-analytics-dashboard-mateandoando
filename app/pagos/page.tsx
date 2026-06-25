// app/pagos/page.tsx
import Sidebar from "../components/Sidebar";
import InsightIA from "../components/InsightIA";

async function getPaymentsMetrics() {
  const paymentsUrl = process.env.NEXT_PUBLIC_PAYMENTS_URL || "proyecto-c-payments-mateandoando.vercel.app";
  const apiKey = process.env.ANALYTICS_PAYMENTS_API_KEY || ""; 

  try {
    const res = await fetch(`${paymentsUrl}/api/payments/analytics`, {
      headers: { "x-api-key": apiKey },
      cache: "no-store", 
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error al buscar métricas de pagos:", error);
    return null;
  }
}

export default async function PagosPage(props: { searchParams: any }) {
  // Soportamos de manera segura el manejo de searchParams para cualquier versión de Next.js
  const resolvedParams = props.searchParams instanceof Promise ? await props.searchParams : props.searchParams;
  const periodo = resolvedParams?.periodo || "semanal";

  const data = await getPaymentsMetrics();
  const totalTx = data?.financial_metrics?.total_processed_transactions || 1;
  const timeline = data?.sales_timeline || [];

  // --- LÓGICA DE PROCESAMIENTO TEMPORAL ---
  let graficosDatos: { label: string; count: number; monto: number }[] = [];
  
  // Usamos el 25 de Junio de 2026 como fecha de referencia para las muestras
  const fechaActual = new Date('2026-06-25T23:59:59.000Z');

  if (periodo === "semanal") {
    // Últimos 7 días corridos (Agrupados por Día)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(fechaActual);
      d.setDate(d.getDate() - i);
      const fechaStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
      
      const txsDelDia = timeline.filter((t: any) => t.date.startsWith(fechaStr));
      const monto = txsDelDia.reduce((sum: number, t: any) => sum + t.price, 0);
      graficosDatos.push({ label, count: txsDelDia.length, monto });
    }
  } else if (periodo === "mensual") {
    // Mes actual (Agrupado por Semanas del mes de Junio)
    const semanas = [
      { label: "Sem. 1 (1-7)", inicio: 1, fin: 7 },
      { label: "Sem. 2 (8-14)", inicio: 8, fin: 14 },
      { label: "Sem. 3 (15-21)", inicio: 15, fin: 21 },
      { label: "Sem. 4 (22-25)", inicio: 22, fin: 25 },
    ];

    semanas.forEach(sem => {
      const txsSemana = timeline.filter((t: any) => {
        const d = new Date(t.date);
        return d.getMonth() === 5 && d.getDate() >= sem.inicio && d.getDate() <= sem.fin;
      });
      const monto = txsSemana.reduce((sum: number, t: any) => sum + t.price, 0);
      graficosDatos.push({ label: sem.label, count: txsSemana.length, monto });
    });
  } else {
    // Vista Anual (Agrupado por los meses transcurridos del 2026)
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
    meses.forEach((mes, index) => {
      const txsMes = timeline.filter((t: any) => {
        const d = new Date(t.date);
        return d.getFullYear() === 2026 && d.getMonth() === index;
      });
      const monto = txsMes.reduce((sum: number, t: any) => sum + t.price, 0);
      graficosDatos.push({ label: mes, count: txsMes.length, monto });
    });
  }

  // Calculamos el valor máximo para proporcionar escalabilidad visual proporcional a las barras
  const maxMonto = Math.max(...graficosDatos.map(g => g.monto), 1);

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans text-zinc-800">
      
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 sm:p-12 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#1E3F20] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Reporte Financiero
          </h1>
          <p className="text-zinc-600">Métricas de ingresos, tickets promedio y estado de las transacciones de la plataforma.</p>
        </div>

        {!data ? (
          <div className="bg-red-50 text-red-800 p-6 rounded-2xl border border-red-200">
            <h3 className="font-bold mb-1">No se pudieron cargar las métricas financieras</h3>
            <p className="text-sm">Verificá las variables de entorno NEXT_PUBLIC_PAYMENTS_URL y PAYMENTS_API_KEY.</p>
          </div>
        ) : (
          <div className="space-y-10">
            <InsightIA datosReales={data} tipo="pagos"/>
            
            {/* TARJETAS DE MÉTRICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
                <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Ingresos Totales</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#1E3F20]">
                    ${data.financial_metrics?.total_revenue_ars != null ? data.financial_metrics.total_revenue_ars.toLocaleString('es-AR') : '—'}
                  </span>
                  <span className="text-[#1E3F20] text-sm font-medium opacity-80">ARS</span>
                </div>
              </div>

              <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
                <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Ticket Promedio</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#1E3F20]">
                    ${data.financial_metrics?.average_ticket_ars != null ? data.financial_metrics.average_ticket_ars.toLocaleString('es-AR') : '—'}
                  </span>
                  <span className="text-[#1E3F20] text-sm font-medium opacity-80">ARS</span>
                </div>
              </div>

              <div className="bg-[#C6E0B4] p-6 rounded-2xl shadow-sm border border-[#a8c994]">
                <h3 className="text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">Volumen de Operaciones</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#1E3F20]">
                    {data.financial_metrics?.total_processed_transactions ?? '—'}
                  </span>
                  <span className="text-[#1E3F20] text-sm font-medium opacity-80">transacciones</span>
                </div>
              </div>
            </div>

            {/* GRÁFICO DINÁMICO TEMPORAL */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1E3F20]" style={{ fontFamily: 'Georgia, serif' }}>
                    Evolución Temporal de Ingresos
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">Volumen monetario facturado según el rango seleccionado.</p>
                </div>

                {/* SELECTOR DE PERÍODO (BOTONES INTERACTIVOS) */}
                <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl w-fit self-start sm:self-center">
                  <a href="?periodo=semanal" className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${periodo === 'semanal' ? 'bg-white text-[#1E3F20] shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}>
                    Semanal
                  </a>
                  <a href="?periodo=mensual" className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${periodo === 'mensual' ? 'bg-white text-[#1E3F20] shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}>
                    Mensual
                  </a>
                  <a href="?periodo=anual" className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${periodo === 'anual' ? 'bg-white text-[#1E3F20] shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}>
                    Anual
                  </a>
                </div>
              </div>

              {/* BARRAS VERTICALES REUTILIZANDO LOS ESTILOS DEL PROYECTO */}
              <div className="h-64 flex items-end gap-3 sm:gap-6 pt-8 border-b border-zinc-200 px-4 relative">
                {graficosDatos.map((item) => {
                  // Altura proporcional (mínimo 6% para que no quede invisible si está en cero)
                  const alturaBarra = item.monto > 0 ? Math.round((item.monto / maxMonto) * 85) + 5 : 6;
                  
                  return (
                    <div key={item.label} className="flex-1 flex flex-col items-center group h-full justify-end relative">
                      
                      {/* TOOLTIP EMERGENTE AL PASAR EL MOUSE */}
                      <div className="absolute pointer-events-none bottom-full mb-2 bg-zinc-950 text-white text-[10px] p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-20 text-center min-w-[80px]">
                        <span className="block font-extrabold text-emerald-400">${item.monto.toLocaleString('es-AR')}</span>
                        <span className="block text-zinc-400 border-t border-zinc-800 mt-1 pt-0.5">{item.count} operaciones</span>
                      </div>

                      {/* LA BARRA REACTIVA */}
                      <div 
                        className={`w-full rounded-t-xl transition-all duration-500 cursor-pointer ${item.monto > 0 ? 'bg-[#C6E0B4] hover:bg-[#1E3F20]' : 'bg-zinc-100 hover:bg-zinc-200'}`}
                        style={{ height: `${alturaBarra}%` }}
                      ></div>

                      {/* ETIQUETA INFERIOR */}
                      <span className="text-[10px] sm:text-xs font-bold text-zinc-500 mt-3 mb-1 whitespace-nowrap">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GRÁFICO VISUAL Y TABLA APILADOS */}
            <div className="grid grid-cols-1 gap-6">
              
              {/* GRÁFICO: DISTRIBUCIÓN DE ESTADOS */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-[#1E3F20]" style={{ fontFamily: 'Georgia, serif' }}>
                    Distribución de Estados
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">Proporción del volumen de transacciones según su resolución.</p>
                </div>

                <div className="w-full h-10 flex rounded-xl overflow-hidden mb-4 border border-zinc-100">
                  {data.transactions_by_status?.map((item: { status: string, count: number }) => {
                    const pct = Math.round((item.count / totalTx) * 100);
                    let bgColor = 'bg-zinc-200';
                    let textColor = 'text-zinc-600';
                    
                    if (item.status === 'APROBADO') { bgColor = 'bg-[#1E3F20]'; textColor = 'text-white'; }
                    if (item.status === 'PENDIENTE') { bgColor = 'bg-amber-400'; textColor = 'text-amber-900'; }
                    if (item.status === 'CANCELADO' || item.status === 'RECHAZADO') { bgColor = 'bg-red-400'; textColor = 'text-white'; }

                    return pct > 0 ? (
                      <div 
                        key={item.status} 
                        className={`${bgColor} h-full flex items-center justify-center text-xs font-bold transition-all ${textColor}`} 
                        style={{ width: `${pct}%` }}
                        title={`${item.status}: ${item.count} (${pct}%)`}
                      >
                        {pct > 5 ? `${pct}%` : ''}
                      </div>
                    ) : null;
                  })}
                </div>

                <div className="flex flex-wrap gap-6 text-sm font-medium text-zinc-600">
                  {data.transactions_by_status?.map((item: { status: string, count: number }) => {
                    let dotColor = 'bg-zinc-200';
                    if (item.status === 'APROBADO') dotColor = 'bg-[#1E3F20]';
                    if (item.status === 'PENDIENTE') dotColor = 'bg-amber-400';
                    if (item.status === 'CANCELADO' || item.status === 'RECHAZADO') dotColor = 'bg-red-400';

                    return (
                      <div key={`legend-${item.status}`} className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${dotColor}`}></span>
                        {item.status} <span className="text-zinc-400">({item.count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TABLA DE TRANSACCIONES POR ESTADO */}
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-6 py-4 font-bold text-zinc-600 text-xs uppercase tracking-wider">Estado de la Transacción</th>
                      <th className="px-6 py-4 font-bold text-zinc-600 text-xs uppercase tracking-wider">Volumen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {data.transactions_by_status && data.transactions_by_status.length > 0 ? (
                      data.transactions_by_status.map((item: { status: string, count: number }) => (
                        <tr key={`table-${item.status}`} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-[#1E3F20]">{item.status}</td>
                          <td className="px-6 py-4 text-zinc-600">{item.count} operaciones</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-6 py-8 text-center text-zinc-500">
                          Sin transacciones registradas.
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