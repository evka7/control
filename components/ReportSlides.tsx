import React, { useEffect, useState } from 'react';
import { InspectionRecord, VerificationStatus } from '../types';
import { generateExecutiveSummary } from '../services/geminiService';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CheckCircle, AlertOctagon, TrendingUp, Lightbulb, FileText } from 'lucide-react';

interface ReportSlidesProps {
  data: InspectionRecord[];
}

export const ReportSlides: React.FC<ReportSlidesProps> = ({ data }) => {
  const [aiSummary, setAiSummary] = useState<string>('Analizando desempeño mensual...');

  useEffect(() => {
    let isMounted = true;
    generateExecutiveSummary(data).then(text => {
      if(isMounted) setAiSummary(text);
    });
    return () => { isMounted = false; };
  }, [data]);

  // Data Logic for Report
  const total = data.length;
  const compliance = Math.round((data.filter(r => r.status === VerificationStatus.CUMPLIDE).length / total) * 100) || 0;
  const improvementOpps = data.filter(r => r.status === VerificationStatus.NO_CUMPLIDE);

  const pieData = [
      { name: 'Controles Conformes', value: data.filter(r => r.status === VerificationStatus.CUMPLIDE).length, color: '#10b981' },
      { name: 'Mejora Continua', value: data.filter(r => r.status === VerificationStatus.NO_CUMPLIDE).length, color: '#F59E0B' }, // Yellow/Orange for Improvement
      { name: 'No Aplica', value: data.filter(r => r.status === VerificationStatus.NO_APLICA).length, color: '#9ca3af' },
  ];

  return (
    <div className="space-y-12 pb-10">
      
      {/* Slide 1: Executive Summary & Conclusions */}
      <div className="bg-white w-full aspect-[16/9] shadow-2xl p-8 flex flex-col relative overflow-hidden border border-gray-200">
        <div className="absolute top-0 left-0 w-full h-4 bg-[#002F6C]"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] opacity-10 rounded-bl-full"></div>
        
        <header className="flex justify-between items-end mb-6 border-b-2 border-gray-100 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#002F6C]">Reporte Mensual de Controles Críticos</h1>
            <p className="text-gray-500 text-lg">Resumen Ejecutivo y Conclusiones de Gestión</p>
          </div>
          <div className="text-right">
             <div className="text-4xl font-black text-[#D4AF37]">{compliance}%</div>
             <div className="text-sm font-bold text-gray-600 uppercase">Desempeño del Mes</div>
          </div>
        </header>

        <div className="grid grid-cols-5 gap-8 flex-grow">
          <div className="col-span-3 space-y-4">
             <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                <FileText className="text-[#002F6C]" /> 
                <span>Conclusiones y Plan de Acción</span>
             </div>
             <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-6 rounded-lg border-l-4 border-[#D4AF37] h-full overflow-y-auto">
                {aiSummary}
             </div>
          </div>
          
          <div className="col-span-2 flex flex-col justify-center items-center bg-gray-50 rounded-xl p-4">
             <h3 className="text-center font-bold text-gray-600 mb-4">Adherencia Mensual</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={pieData} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={0} // Reduced to 100% pie (full)
                            outerRadius={90} 
                            dataKey="value"
                            label={({ percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                        >
                            {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                        </Pie>
                        <Legend verticalAlign="bottom"/>
                    </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="text-center mt-4">
                <p className="text-xs text-gray-500">Muestra de Gestión (Verificaciones)</p>
                <p className="text-2xl font-bold text-[#002F6C]">{total}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Slide 2: Continuous Improvement Opportunities */}
      <div className="bg-white w-full aspect-[16/9] shadow-2xl p-8 flex flex-col relative overflow-hidden border border-gray-200">
        <div className="absolute top-0 left-0 w-full h-4 bg-[#D4AF37]"></div>
        
        <header className="mb-6 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-[#002F6C]">Oportunidades de Mejora Continua</h1>
                <p className="text-gray-500">Foco en el Refuerzo de Estándares (Sin desviaciones críticas)</p>
            </div>
             <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold">
                <TrendingUp size={18} />
                Gestión Preventiva
            </div>
        </header>

        <div className="flex-grow overflow-hidden">
            <table className="min-w-full text-left text-sm">
                <thead className="bg-[#002F6C] text-white uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Fecha</th>
                        <th className="px-4 py-3">Riesgo Crítico</th>
                        <th className="px-4 py-3">Control a Mejorar</th>
                        <th className="px-4 py-3">Observación</th>
                        <th className="px-4 py-3 rounded-tr-lg">Estado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {improvementOpps.length > 0 ? improvementOpps.map((issue) => (
                        <tr key={issue.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{issue.date}</td>
                            <td className="px-4 py-3 text-gray-600 font-medium">{issue.criticalRisk}</td>
                            <td className="px-4 py-3 font-bold text-[#002F6C]">{issue.control}</td>
                            <td className="px-4 py-3 text-gray-700">{issue.observations}</td>
                            <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                                    issue.observationStatus === 'Cerrado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {issue.observationStatus === 'Cerrado' ? <CheckCircle size={12}/> : <Lightbulb size={12}/>}
                                    {issue.observationStatus === 'Cerrado' ? 'SOLUCIONADO' : 'EN SEGUIMIENTO'}
                                </span>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="text-center py-20">
                                <div className="flex flex-col items-center text-gray-400">
                                    <CheckCircle size={48} className="text-green-500 mb-2"/>
                                    <p className="text-lg font-medium text-gray-600">Desempeño Sobresaliente</p>
                                    <p>Todos los controles verificados cumplen con el estándar.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            {improvementOpps.length > 0 && (
                <div className="mt-8 bg-blue-50 p-4 rounded border border-blue-200 text-blue-900 text-sm flex gap-3">
                    <Lightbulb className="flex-shrink-0" />
                    <div>
                        <strong>Acción Requerida:</strong> Las oportunidades de mejora detectadas deben ser socializadas en la charla de 5 minutos para asegurar el entendimiento del control por parte de todos los operadores.
                    </div>
                </div>
            )}
        </div>
      </div>

    </div>
  );
};