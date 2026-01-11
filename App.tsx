import React, { useState } from 'react';
import { initialData } from './mockData';
import { InspectionRecord } from './types';
import { Dashboard } from './components/Dashboard';
import { InputForm } from './components/InputForm';
import { ReportSlides } from './components/ReportSlides';
import { LayoutDashboard, FileText, Menu, X } from 'lucide-react';

function App() {
  const [data, setData] = useState<InspectionRecord[]>(initialData);
  const [currentView, setCurrentView] = useState<'dashboard' | 'report'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddRecord = (record: InspectionRecord) => {
    setData(prev => [record, ...prev]);
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
        setData(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-[#002F6C] text-white p-4 flex justify-between items-center">
        <span className="font-bold text-lg">Galena SSO</span>
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-[#002F6C] text-white flex-shrink-0 transition-all duration-300`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center font-bold text-[#002F6C] text-xl">
              G
            </div>
            <div>
              <h1 className="text-lg font-bold">Galena SSO</h1>
              <p className="text-xs text-gray-300">Gestión Controles Críticos</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => { setCurrentView('dashboard'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'dashboard' ? 'bg-[#D4AF37] text-[#002F6C] font-bold' : 'hover:bg-blue-900 text-gray-200'
              }`}
            >
              <LayoutDashboard size={20} /> Panel de Control
            </button>
            <button 
              onClick={() => { setCurrentView('report'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'report' ? 'bg-[#D4AF37] text-[#002F6C] font-bold' : 'hover:bg-blue-900 text-gray-200'
              }`}
            >
              <FileText size={20} /> Generar Reporte
            </button>
          </nav>
        </div>
        
        <div className="p-6 mt-auto border-t border-blue-900">
            <p className="text-xs text-gray-400">Versión 2026.1.2</p>
            <p className="text-xs text-gray-500 mt-1">Gold Fields - Cerro Corona</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex justify-between items-center mb-6">
            <div>
               <h2 className="text-2xl font-bold text-gray-800">
                 {currentView === 'dashboard' ? 'Panel de Gestión Operativa' : 'Reporte Ejecutivo Semanal'}
               </h2>
               <p className="text-gray-500 text-sm">
                 Semana 2 - Enero 2026 | Carguío, Acarreo y Vías
               </p>
            </div>
            {currentView === 'dashboard' && <InputForm onAdd={handleAddRecord} />}
          </div>

          {currentView === 'dashboard' ? (
            <Dashboard data={data} onDelete={handleDeleteRecord} />
          ) : (
            <ReportSlides data={data} />
          )}

        </div>
      </div>
    </div>
  );
}

export default App;