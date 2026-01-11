import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import { ShieldCheck, AlertTriangle, ClipboardList, TrendingUp, Trash2 } from 'lucide-react';
import { StatCard } from './StatCard';
import { InspectionRecord, VerificationStatus } from '../types';

interface DashboardProps {
  data: InspectionRecord[];
  onDelete?: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onDelete }) => {
  
  // Calculate KPIs
  const kpis = useMemo(() => {
    const total = data.length;
    const passed = data.filter(r => r.status === VerificationStatus.CUMPLIDE).length;
    const compliance = total > 0 ? Math.round((passed / total) * 100) : 0;
    const openObs = data.filter(r => r.observationStatus === 'Abierto').length;
    const improvementOpps = data.filter(r => r.status === VerificationStatus.NO_CUMPLIDE).length;
    // Get unique risks worked on
    const risksWorked = Array.from(new Set(data.map(d => d.criticalRisk)));

    return { total, compliance, openObs, improvementOpps, risksWorked };
  }, [data]);

  const pieDataObs = [
    { name: 'Abiertas', value: kpis.openObs },
    { name: 'Cerradas', value: data.filter(r => r.observationStatus === 'Cerrado').length },
  ];

  const COLORS = ['#ef4444', '#10b981']; 

  // Colors for risk tags - Elegant corporate palette
  const RISK_COLORS = [
    'bg-[#002F6C] text-white border-[#002F6C]',
    'bg-[#D4AF37] text-white border-[#D4AF37]',
    'bg-gray-700 text-white border-gray-700',
    'bg-blue-600 text-white border-blue-600',
  ];

  return (
    <div className="space-y-6">
      {/* KPI Row - Monthly Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Desempeño Mensual" 
          value={`${kpis.compliance}%`} 
          subtext="Adherencia a Controles"
          icon={ShieldCheck} 
          color="blue"
        />
        <StatCard 
          title="Riesgos Gestionados" 
          value={kpis.risksWorked.length} 
          subtext="Focos de Riesgo Activos"
          icon={TrendingUp} 
          color="gold"
        />
        <StatCard 
          title="Verificaciones" 
          value={kpis.total} 
          subtext="Total Acumulado"
          icon={ClipboardList} 
          color="green"
        />
        <StatCard 
          title="Mejora Continua" 
          value={kpis.improvementOpps} 
          subtext="Oportunidades Detectadas"
          icon={AlertTriangle} 
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Tag Cloud */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gf-blue mb-4">Riesgos Críticos Gestionados (Acumulado)</h3>
          <div className="p-4 bg-gray-50 rounded-lg min-h-[280px]">
            {kpis.risksWorked.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {kpis.risksWorked.map((risk, index) => (
                  <span 
                    key={risk} 
                    className={`px-4 py-2 rounded shadow-sm text-sm font-medium ${RISK_COLORS[index % RISK_COLORS.length]}`}
                  >
                    {risk}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center mt-10">No hay riesgos registrados aún.</p>
            )}
            <div className="mt-8 border-t pt-4 border-gray-200">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Resumen de Actividad</h4>
                <p className="text-gray-700 text-sm">
                    Durante el periodo mensual se han reforzado <strong>{kpis.total}</strong> controles críticos, 
                    manteniendo un enfoque preventivo en <strong>{kpis.risksWorked.length}</strong> riesgos de alto potencial.
                </p>
            </div>
          </div>
        </div>

        {/* Observations Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gf-blue mb-4">Gestión de Hallazgos</h3>
          <div className="h-72 flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieDataObs}
                  cx="50%"
                  cy="50%"
                  innerRadius={0} // Full pie (Reduce al 100%)
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieDataObs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-500 font-bold uppercase">Cierre de Brechas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Management Table - Updated to include Control Column */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gf-blue">Registro de Verificaciones (Detalle)</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Gestión Activa</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-3 w-32">Fecha</th>
                        <th className="px-6 py-3">Riesgo Crítico</th>
                        <th className="px-6 py-3">Control Crítico</th>
                        <th className="px-6 py-3 w-32">Estado</th>
                        <th className="px-6 py-3 w-20 text-right">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-6 py-3 font-medium text-gray-900">{record.date}</td>
                            <td className="px-6 py-3 text-gray-700 font-semibold">{record.criticalRisk}</td>
                            <td className="px-6 py-3 text-blue-800">{record.control}</td>
                            <td className="px-6 py-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                    record.status === VerificationStatus.CUMPLIDE ? 'bg-green-50 text-green-700 border-green-200' :
                                    record.status === VerificationStatus.NO_CUMPLIDE ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                                }`}>
                                    {record.status === VerificationStatus.NO_CUMPLIDE ? 'MEJORA' : record.status}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-right">
                                {onDelete && (
                                    <button 
                                        onClick={() => onDelete(record.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-2"
                                        title="Eliminar registro"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                No hay registros esta semana. Utilice el botón "Registrar Verificación".
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};