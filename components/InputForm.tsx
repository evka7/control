import React, { useState, useEffect } from 'react';
import { InspectionRecord, RiskCategory, CriticalRisk, CriticalControl, VerificationStatus, CategoryRiskMap, RiskControlMap } from '../types';
import { PlusCircle, Save } from 'lucide-react';

interface InputFormProps {
  onAdd: (record: InspectionRecord) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InspectionRecord>>({
    riskCategory: RiskCategory.OPERACION,
    status: VerificationStatus.CUMPLIDE,
    observationStatus: 'Cerrado',
    week: 2
  });

  // Dynamic Options
  const [availableRisks, setAvailableRisks] = useState<CriticalRisk[]>([]);
  const [availableControls, setAvailableControls] = useState<CriticalControl[]>([]);

  // Update Risks when Category changes
  useEffect(() => {
    if (formData.riskCategory) {
      const risks = CategoryRiskMap[formData.riskCategory];
      setAvailableRisks(risks);
      setFormData(prev => ({ ...prev, criticalRisk: risks[0] }));
    }
  }, [formData.riskCategory]);

  // Update Controls when Risk changes
  useEffect(() => {
    if (formData.criticalRisk) {
      const controls = RiskControlMap[formData.criticalRisk];
      setAvailableControls(controls || []);
      setFormData(prev => ({ ...prev, control: controls ? controls[0] : undefined }));
    }
  }, [formData.criticalRisk]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.riskCategory || !formData.control || !formData.status || !formData.criticalRisk) return;

    const newRecord: InspectionRecord = {
      id: Date.now().toString(),
      week: formData.week || 2,
      date: new Date().toISOString().split('T')[0],
      riskCategory: formData.riskCategory,
      criticalRisk: formData.criticalRisk,
      control: formData.control,
      status: formData.status,
      observations: formData.observations || 'Sin observaciones',
      observationStatus: formData.observationStatus as 'Abierto' | 'Cerrado',
      auditor: 'Supervisor'
    };

    onAdd(newRecord);
    setIsOpen(false);
    setFormData(prev => ({ ...prev, observations: '' }));
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors shadow-md"
      >
        <PlusCircle size={20} />
        Registrar Verificación
      </button>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
      <h3 className="text-lg font-bold text-gf-blue mb-4 flex items-center gap-2">
        <PlusCircle size={20} /> Registro de Control Crítico (Guía 2026)
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Actividad (Categoría)</label>
          <select 
            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50"
            value={formData.riskCategory}
            onChange={e => setFormData({...formData, riskCategory: e.target.value as RiskCategory})}
          >
            {Object.values(RiskCategory).map(rc => <option key={rc} value={rc}>{rc}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Riesgo Crítico Asociado</label>
          <select 
            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={formData.criticalRisk}
            onChange={e => setFormData({...formData, criticalRisk: e.target.value as CriticalRisk})}
          >
            {availableRisks.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Control Crítico a Verificar</label>
          <select 
            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 font-semibold text-[#002F6C]"
            value={formData.control}
            onChange={e => setFormData({...formData, control: e.target.value as CriticalControl})}
          >
            {availableControls.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Verificación</label>
          <select 
            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value as VerificationStatus})}
          >
            <option value={VerificationStatus.CUMPLIDE}>Conforme (Cumple)</option>
            <option value={VerificationStatus.NO_CUMPLIDE}>Observado (Mejora Continua)</option>
            <option value={VerificationStatus.NO_APLICA}>No Aplica</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones / Hallazgo</label>
          <textarea 
            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
            rows={2}
            value={formData.observations}
            onChange={e => setFormData({...formData, observations: e.target.value})}
            placeholder="Detalle la observación o evidencia de cumplimiento..."
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
          <button 
            type="button" 
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="flex items-center gap-2 bg-[#002F6C] text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-900 transition-colors"
          >
            <Save size={18} /> Guardar Registro
          </button>
        </div>

      </form>
    </div>
  );
};