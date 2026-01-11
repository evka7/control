import { InspectionRecord, RiskCategory, CriticalRisk, CriticalControl, VerificationStatus } from './types';

export const initialData: InspectionRecord[] = [
  {
    id: '1',
    week: 2,
    date: '2026-01-08',
    riskCategory: RiskCategory.VIAS,
    criticalRisk: CriticalRisk.VOLCADURA,
    control: CriticalControl.MUROS_SEGURIDAD,
    status: VerificationStatus.CUMPLIDE,
    observations: 'Muros reconformados en acceso principal',
    observationStatus: 'Cerrado',
    auditor: 'Juan Pérez'
  },
  {
    id: '2',
    week: 2,
    date: '2026-01-09',
    riskCategory: RiskCategory.OPERACION, // Was Acarreo
    criticalRisk: CriticalRisk.VOLCADURA,
    control: CriticalControl.ANTIFATIGA,
    status: VerificationStatus.NO_CUMPLIDE,
    observations: 'Alerta de fatiga requiere calibración en equipo 402',
    observationStatus: 'Abierto',
    auditor: 'Maria Lopez'
  },
  {
    id: '3',
    week: 2,
    date: '2026-01-09',
    riskCategory: RiskCategory.OPERACION, // Was Carguio
    criticalRisk: CriticalRisk.ATROPELLO,
    control: CriticalControl.SEGREGACION,
    status: VerificationStatus.CUMPLIDE,
    observations: 'Conos y letreros visibles en pala 05',
    observationStatus: 'Cerrado',
    auditor: 'Carlos Ruiz'
  },
  {
    id: '4',
    week: 2,
    date: '2026-01-10',
    riskCategory: RiskCategory.OPERACION, // Was Descarga
    criticalRisk: CriticalRisk.CAIDA_NIVEL,
    control: CriticalControl.MUROS_SEGURIDAD,
    status: VerificationStatus.CUMPLIDE,
    observations: 'Altura de berma 1.8m conforme',
    observationStatus: 'Cerrado',
    auditor: 'Juan Pérez'
  },
  {
    id: '5',
    week: 2,
    date: '2026-01-11',
    riskCategory: RiskCategory.VIAS,
    criticalRisk: CriticalRisk.INTERACCION,
    control: CriticalControl.DISENO_VIA,
    status: VerificationStatus.NO_CUMPLIDE,
    observations: 'Ancho de vía reducido por material de derrumbe en km 4',
    observationStatus: 'Abierto',
    auditor: 'Ana Soto'
  }
];