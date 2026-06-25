import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Diccionario de contextos según la página que invoca a la IA
const CONFIGURACION_PROMPTS: Record<string, { rol: string; enfoque: string }> = {
  general: {
    rol: "un Director de Operaciones (COO) senior",
    enfoque: "la salud global del ecosistema cruzando usuarios, órdenes generadas, logística y estado de los servicios."
  },
  ventas: {
    rol: "un Analista Comercial y de Ingresos senior",
    enfoque: "el rendimiento financiero, el ticket promedio, los artículos vendidos y los motivos de pérdida de conversión por cancelaciones."
  },
  compras: {
    rol: "un Experto en Growth Marketing y Conversión",
    enfoque: "el engagement de los compradores, la tasa de conversión de registros a usuarios activos y el comportamiento del consumidor."
  },
  logistica: {
    rol: "un Gerente de Cadena de Suministro y Distribución",
    enfoque: "la eficiencia de los envíos, la proporción de paquetes entregados frente a los problemas en tránsito y el rendimiento del correo."
  },
  pagos: {
    rol: "an Auditor Financiero y Especialista en Pasarelas de Pago senior",
    enfoque: "el volumen transaccionado, la facturación total en ARS, las métricas financieras críticas y la tasa de éxito o problemas con la Payments API."
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { datos, tipo } = body;

    if (!datos || !tipo || !CONFIGURACION_PROMPTS[tipo]) {
      return NextResponse.json({ error: "Faltan parámetros o el tipo de reporte es inválido" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const datosEnTexto = JSON.stringify(datos, null, 2);
    
    // Obtenemos la configuración específica para esta página
    const { rol, enfoque } = CONFIGURACION_PROMPTS[tipo];

    const prompt = `
      Sos ${rol} experto en e-commerce.
      Tu tarea es evaluar las métricas en tiempo real que se te proporcionan y darle al usuario un insight estratégico, ultra directo y accionable.

      Reporte actual de la sección (${tipo.toUpperCase()}):
      ${datosEnTexto}

      Reglas estrictas para tu respuesta:
      1. Tu enfoque principal debe ser ${enfoque}.
      2. Detectá el principal cuello de botella o la métrica más destacada y explicala en base a los números reales provistos.
      3. Sé extremadamente directo. No saludes, no uses introducciones cordiales. Ve al grano.
      4. Longitud máxima: 3 líneas de texto.
    `;

    const result = await model.generateContent(prompt);
    const textoInsight = result.response.text();

    return NextResponse.json({ insight: textoInsight }, { status: 200 });

  } catch (error) {
    console.error("Error en API de insights:", error);
    return NextResponse.json({ error: "Error interno del servidor analítico" }, { status: 500 });
  }
}