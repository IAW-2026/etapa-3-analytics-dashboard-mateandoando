// app/components/ShippingCharts.tsx
"use client";

import { BarChart, DonutChart, Card, Title, Legend } from "@tremor/react";

interface ChartsProps {
  data: {
    by_status?: { status: string; count: number }[];
    by_carrier?: { carrier: string; count: number }[];
  };
}

export default function ShippingCharts({ data }: ChartsProps) {
  // Modelamos los datos de estados
  const statusData = data.by_status?.map((item) => ({
    "Estado": item.status.replace("_", " "),
    "Paquetes": item.count,
  })) || [];

  // Modelamos los datos de transportistas
  const carrierData = data.by_carrier?.map((item) => ({
    name: item.carrier || "Sin asignar",
    "Cantidad": item.count,
  })) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div className="hidden bg-emerald-500 fill-emerald-500 text-emerald-500 bg-teal-500 fill-teal-500 text-teal-500 bg-amber-500 fill-amber-500 text-amber-500 bg-zinc-500 fill-zinc-500 text-zinc-500"></div>

      <Card className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <Title className="text-[#1E3F20] font-bold text-base mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Volumen Operativo por Estado
        </Title>
        <BarChart
          className="h-72 mt-4"
          data={statusData}
          index="Estado"
          categories={["Paquetes"]}
          colors={["emerald"]}
          layout="vertical" 
          yAxisWidth={120} 
        />
      </Card>

      {/* GRÁFICO 2: DONUTCHART DE TRANSPORTISTAS */}
      <Card className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
        <div>
          <Title className="text-[#1E3F20] font-bold text-base mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Participación de Mercado (Couriers)
          </Title>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
          <DonutChart
            className="h-48 w-48"
            data={carrierData}
            category="Cantidad"
            index="name"
            colors={["emerald", "teal", "amber", "zinc"]}
          />
          <Legend
            className="max-w-xs"
            categories={carrierData.map((c) => c.name)}
            colors={["emerald", "teal", "amber", "zinc"]}
          />
        </div>
      </Card>

    </div>
  );
}