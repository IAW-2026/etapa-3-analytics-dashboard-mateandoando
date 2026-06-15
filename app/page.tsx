"use client";
import { Card, Metric, Text, Title, Grid, Flex, AreaChart, BarList } from "@tremor/react";

// --- DATOS MOCKEADOS (Para estructurar la vista) ---
const mockVentas = [
  { fecha: "Lun", Ingresos: 125000 },
  { fecha: "Mar", Ingresos: 180000 },
  { fecha: "Mie", Ingresos: 95000 },
  { fecha: "Jue", Ingresos: 210000 },
  { fecha: "Vie", Ingresos: 253000 },
];

const mockTopProductos = [
  { name: "Mate Imperial Custom", value: 85 },
  { name: "Termo Stanley 1L", value: 62 },
  { name: "Canasta Ecocuero", value: 45 },
];
// ---------------------------------------------------
const dataFormatter = (number: number) => `$${Intl.NumberFormat("es-AR").format(number)}`;
export default function AnalyticsDashboard() {
  return (
    <main className="p-8 md:p-12 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <Title className="text-3xl font-black text-slate-900">Analytics Dashboard</Title>
        <Text className="text-slate-500">Visión general del sistema MateandoAndo (Datos Simulados)</Text>
      </div>

      {/* 1. TARJETAS DE KPIs (Métricas Clave) */}
      <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
        <Card decoration="top" decorationColor="blue">
          <Text>Ingresos Totales</Text>
          <Metric>$ 863.000</Metric>
        </Card>
        <Card decoration="top" decorationColor="emerald">
          <Text>Pedidos Completados</Text>
          <Metric>142</Metric>
        </Card>
        <Card decoration="top" decorationColor="amber">
          <Text>Usuarios Activos</Text>
          <Metric>1.205</Metric>
        </Card>
        <Card decoration="top" decorationColor="purple">
          <Text>Vendedores Registrados</Text>
          <Metric>18</Metric>
        </Card>
      </Grid>

      {/* 2. GRÁFICOS Y TABLAS */}
      <Grid numItemsLg={2} className="gap-6 mt-6">
        
        {/* Gráfico de Evolución */}
        <Card>
          <Title>Evolución de Ingresos (Últimos 5 días)</Title>
          <AreaChart
            className="h-72 mt-4"
            data={mockVentas}
            index="fecha"
            categories={["Ingresos"]}
            colors={["emerald"]}
            valueFormatter={dataFormatter}
          />
        </Card>

        {/* Ranking de Productos */}
        <Card>
          <Title>Productos más vendidos</Title>
          <Flex className="mt-4 border-b border-slate-100 pb-2">
            <Text className="font-bold">Producto</Text>
            <Text className="font-bold">Unidades</Text>
          </Flex>
          <BarList data={mockTopProductos} className="mt-2" color="blue" />
        </Card>

      </Grid>
    </main>
  );
}