"use client";

import { BarChart, DonutChart, Card, Title, Legend } from "@tremor/react";

interface BuyerChartsProps {
  data: {
    total_users: number;
    active_buyers: number;
    total_orders: number;
    orders_by_status: Record<string, number>;
  };
}

export default function BuyerCharts({ data }: BuyerChartsProps) {
  const statusData = Object.entries(data.orders_by_status).map(([status, count]) => ({
    Estado: status,
    Órdenes: count,
  }));

  const inactive = Math.max(0, (data.total_users ?? 0) - (data.active_buyers ?? 0));
  const buyerData = [
    { name: "Activos", Compradores: data.active_buyers ?? 0 },
    { name: "Sin compras aprobadas", Compradores: inactive },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Preload Tremor color classes */}
      <div className="hidden bg-emerald-500 fill-emerald-500 text-emerald-500 bg-zinc-400 fill-zinc-400 text-zinc-400"></div>

      <Card className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <Title
          className="text-[#1E3F20] font-bold text-base mb-4"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Distribución de Órdenes por Estado
        </Title>
        <BarChart
          className="h-72 mt-4"
          data={statusData}
          index="Estado"
          categories={["Órdenes"]}
          colors={["emerald"]}
          layout="vertical"
          yAxisWidth={120}
        />
      </Card>

      <Card className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
        <Title
          className="text-[#1E3F20] font-bold text-base mb-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Actividad de Compradores
        </Title>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
          <DonutChart
            className="h-48 w-48"
            data={buyerData}
            category="Compradores"
            index="name"
            colors={["emerald", "zinc"]}
          />
          <Legend
            className="max-w-xs"
            categories={buyerData.map((b) => b.name)}
            colors={["emerald", "zinc"]}
          />
        </div>
      </Card>
    </div>
  );
}
