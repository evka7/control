import { GoogleGenAI } from "@google/genai";
import { InspectionRecord, VerificationStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateExecutiveSummary = async (records: InspectionRecord[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Error: API Key no configurada. Configure process.env.API_KEY para generar el resumen ejecutivo.";
  }

  const complianceCount = records.filter(r => r.status === VerificationStatus.CUMPLIDE).length;
  const total = records.length;
  const improvementOpps = records.filter(r => r.status === VerificationStatus.NO_CUMPLIDE);
  
  const dataSummary = JSON.stringify({
    totalInspections: total,
    conformanceRate: ((complianceCount / total) * 100).toFixed(1) + '%',
    improvementOpportunities: improvementOpps.length,
    criticalRisksAddressed: Array.from(new Set(records.map(r => r.criticalRisk))),
    details: records.map(r => `${r.criticalRisk} (${r.control}): ${r.status}`).join('\n')
  });

  const prompt = `
    Actúa como un Gerente de Seguridad (SSO) en Minería.
    Analiza los siguientes datos de verificaciones de controles críticos (Semana Actual):
    ${dataSummary}

    Genera un Resumen Ejecutivo en formato Markdown para la Gerencia de Operaciones.
    IMPORTANTE: No uses el término "Fallas" o "Errores". Usa "Oportunidades de Mejora" o "Desviaciones Identificadas".
    
    Estructura (3 secciones breves):
    1. **Conclusiones**: Resumen del desempeño general y adherencia a los controles. ¿Qué riesgos se gestionaron mejor?
    2. **Foco de Mejora Continua**: Analiza las observaciones (si las hay) no como críticas negativas, sino como áreas donde se debe reforzar el estándar.
    3. **Plan de Acción**: Recomendación concreta para la siguiente semana basada en los datos.

    Mantén un tono constructivo, profesional y orientado a la excelencia operativa.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No se pudo generar el resumen.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Error al conectar con Gemini para el análisis ejecutivo.";
  }
};