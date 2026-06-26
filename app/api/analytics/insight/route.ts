// app/api/analytics/insight/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { datos, tipo } = body;

    if (!datos) {
      return NextResponse.json({ error: "Faltan los datos para analizar" }, { status: 400 });
    }

    // El .trim() es clave acá: elimina cualquier espacio invisible o salto de línea de tu .env
    const apiKey = process.env.GEMINI_API_KEY?.trim(); 
    if (!apiKey) {
      return NextResponse.json({ error: "Falta configurar GEMINI_API_KEY en el servidor" }, { status: 500 });
    }

    // Inicializamos el cliente oficial de Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const promptTexto = `
      Actúa como un analista de Business Intelligence experto en e-commerce.
      A continuación te paso el reporte en formato JSON del módulo de "${tipo.toUpperCase()}":
      
      ${JSON.stringify(datos)}
      
      Tu tarea: Analizar los números más críticos y darle un consejo estratégico, advertencia comercial o insight de negocio al dueño de la tienda.
      Reglas de formato obligatorias:
      1. Sé extremadamente directo y conciso (máximo 30 a 40 palabras).
      2. Nombra al menos 1 o 2 números específicos del JSON para respaldar tu consejo.
      3. No uses saludos, ni introducciones, ni despidas. Empezá directamente con el análisis.
    `;

    // Ejecutamos la petición a través del SDK
    const result = await model.generateContent(promptTexto);
    const response = await result.response;
    const insightGenerado = response.text();

    return NextResponse.json({ insight: insightGenerado.trim() });

  } catch (error) {
    console.error("Error generando insight:", error);
    return NextResponse.json({ error: "Fallo interno en el servidor de IA" }, { status: 500 });
  }
}