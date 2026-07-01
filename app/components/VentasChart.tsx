"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function VentasChart({ data }: { data: any[] }) {
  // Le damos formato a la fecha para que no quede un texto gigante abajo
  const formatXAxis = (tickItem: any) => {
    const date = new Date(tickItem + 'T00:00:00'); // Compensamos zona horaria
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  };

  const formatTooltip = (value: any) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
  };

  if (!data || data.length === 0) return <p className="text-zinc-500 text-sm">No hay datos para graficar</p>;

  // Invertimos el array para que el gráfico vaya del pasado al presente (de izquierda a derecha)
  const chartData = [...data].reverse();

  return (
    <div className="h-80 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
          <XAxis 
            dataKey="fecha" 
            tickFormatter={formatXAxis} 
            stroke="#a1a1aa" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            minTickGap={20}
          />
          <YAxis 
            stroke="#a1a1aa" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(val) => `$${val / 1000}k`} // Abreviamos miles
          />
          <Tooltip 
            formatter={formatTooltip} 
            labelFormatter={formatXAxis}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
          />
          <Line 
            type="monotone" 
            dataKey="ingresos" 
            stroke="#1E3F20" 
            strokeWidth={3} 
            dot={false} 
            activeDot={{ r: 6, fill: '#1E3F20', stroke: '#fff', strokeWidth: 2 }} 
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}