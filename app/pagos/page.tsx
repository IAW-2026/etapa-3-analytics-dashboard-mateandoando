// app/pagos/page.tsx
import Sidebar from "../components/Sidebar";

async function getPaymentsMetrics() {
  // Asegurate de tener estas variables en el .env de la Analytics App
  const paymentsUrl = process.env.NEXT_PUBLIC_PAYMENTS_URL || "https://tu-payment-app.vercel.app";
  const apiKey = process.env.PAYMENTS_API_KEY || ""; 

  try {
    const res = await fetch(`${paymentsUrl}/api/payments/analytics`, {
      headers: { "x-api-key": apiKey },
      cache: "no-store", // Para que siempre traiga los datos en vivo y no los guarde en caché
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error al buscar métricas de pagos:", error);
    return null;
  }
}

export default async function PagosPage() {
  const data = await getPaymentsMetrics();

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

            {/* TABLA DE TRANSACCIONES POR ESTADO */}
            <div>
              <h2 className="text-xl font-bold text-[#1E3F20] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Desglose Financiero por Estado
              </h2>
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
                        <tr key={item.status} className="hover:bg-zinc-50 transition-colors">
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