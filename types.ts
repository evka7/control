export enum RiskCategory {
  OPERACION = 'Operación Mina (Carguío, Acarreo, Descarga)',
  VIAS = 'Mantenimiento de Vías'
}

export enum CriticalRisk {
  ATROPELLO = 'Atropello de Personas / Colisión Equipos',
  VOLCADURA = 'Volcadura / Pérdida de Control',
  CAIDA_NIVEL = 'Caída a Distinto Nivel (Botadero/Talud)',
  FALLA_TERRENO = 'Falla de Terreno / Colapso',
  INTERACCION = 'Interacción Equipos Livianos vs Pesados'
}

export enum CriticalControl {
  MUROS_SEGURIDAD = 'Muros de Seguridad (1/2 llanta)',
  ANTIFATIGA = 'Sistema Antifatiga / Cámaras',
  COMUNICACION = 'Comunicación Bidireccional / Radio',
  SEGREGACION = 'Segregación y Delimitación de Áreas',
  INSPECCION_PREUSO = 'Inspección Pre-Uso (Vuelta del Gallo)',
  TALUD_ESTABLE = 'Estabilidad de Talud / Piso',
  DISENO_VIA = 'Diseño y Ancho de Vía',
  SENALIZACION = 'Señalización y Prioridad de Paso'
}

export enum VerificationStatus {
  CUMPLIDE = 'Conforme',
  NO_CUMPLIDE = 'Observado', // Representa Mejora Continua
  NO_APLICA = 'No Aplica'
}

export interface InspectionRecord {
  id: string;
  week: number;
  date: string;
  riskCategory: RiskCategory;
  criticalRisk: CriticalRisk; 
  control: CriticalControl;
  status: VerificationStatus;
  observations: string;
  observationStatus: 'Abierto' | 'Cerrado';
  auditor: string;
}

// Updated Mapping based on "Actividad Completa" vs "Vías"
export const CategoryRiskMap: Record<RiskCategory, CriticalRisk[]> = {
  [RiskCategory.OPERACION]: [
    CriticalRisk.ATROPELLO, 
    CriticalRisk.VOLCADURA, 
    CriticalRisk.CAIDA_NIVEL, 
    CriticalRisk.FALLA_TERRENO
  ],
  [RiskCategory.VIAS]: [
    CriticalRisk.INTERACCION, 
    CriticalRisk.VOLCADURA, 
    CriticalRisk.ATROPELLO
  ]
};

// Controls remain mapped to risks
export const RiskControlMap: Record<CriticalRisk, CriticalControl[]> = {
  [CriticalRisk.ATROPELLO]: [CriticalControl.SEGREGACION, CriticalControl.COMUNICACION],
  [CriticalRisk.VOLCADURA]: [CriticalControl.ANTIFATIGA, CriticalControl.DISENO_VIA, CriticalControl.INSPECCION_PREUSO],
  [CriticalRisk.CAIDA_NIVEL]: [CriticalControl.MUROS_SEGURIDAD, CriticalControl.TALUD_ESTABLE],
  [CriticalRisk.FALLA_TERRENO]: [CriticalControl.TALUD_ESTABLE, CriticalControl.SEGREGACION],
  [CriticalRisk.INTERACCION]: [CriticalControl.SENALIZACION, CriticalControl.COMUNICACION, CriticalControl.DISENO_VIA]
};