import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  PlusCircle, ShoppingCart, Package, History, 
  CreditCard, Truck, FileText, DollarSign, Layout 
} from 'lucide-react';

const STEPS = [
  { id: 'PO', label: 'Pedido de Compra', field: 'po_number', icon: ShoppingCart },
  { id: 'GR', label: 'Entrada Mercancía', field: 'gr_number', icon: Package },
  { id: 'SO', label: 'Pedido de Venta', field: 'so_number', icon: History },
  { id: 'CR', label: 'Aprobación Crédito', field: 'cr_approved', icon: CreditCard },
  { id: 'DL', label: 'Entrega Cliente', field: 'dl_number', icon: Truck },
  { id: 'INV', label: 'Factura Cliente', field: 'inv_number', icon: FileText },
  { id: 'PAY', label: 'Registro Pago', field: 'pay_number', icon: DollarSign }
];

const STATUS_FLOW = [
  'Pendiente de PO', 'PO Registrada', 'Stock en Almacén', 
  'Pedido Venta OK', 'Crédito Liberado', 'Entregado', 'Facturado', 'Pagado'
];

export default function App() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. CARGAR DATOS Y ESCUCHAR CAMBIOS EN TIEMPO REAL
  useEffect(() => {
    fetchCycles();

    // Suscripción Realtime (Equivalente a onSnapshot)
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'test_cycles' }, () => {
        fetchCycles();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchCycles = async () => {
    const { data } = await supabase.from('test_cycles').select('*').order('created_at', { ascending: false });
    setCycles(data || []);
    setLoading(false);
  };

  // 2. INSERTAR (Equivalente a .add)
  const handleCreate = async (name) => {
    await supabase.from('test_cycles').insert([{
      name,
      status: STATUS_FLOW[0],
      current_step: 0,
      documents: {} // Objeto JSONB vacío
    }]);
  };

  // 3. ACTUALIZAR (Equivalente a .update con mezcla de JSON)
  const handleUpdate = async (cycle, stepIdx, value) => {
    const nextStep = stepIdx + 1;
    const { error } = await supabase
      .from('test_cycles')
      .update({
        // Mantenemos lo que había en documents y agregamos el nuevo campo
        documents: { ...cycle.documents, [STEPS[stepIdx].field]: value },
        current_step: nextStep,
        status: STATUS_FLOW[nextStep]
      })
      .eq('id', cycle.id);
    
    if (error) alert("Error actualizando: " + error.message);
  };

  if (loading) return <div className="p-10 text-center font-bold">Iniciando SAP GUI...</div>;

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-800">SAP S/4HANA Training</h1>
        <button 
          onClick={() => handleCreate(prompt("Nombre del Ciclo:"))}
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2"
        >
          <PlusCircle size={20} /> Nuevo Escenario
        </button>
      </header>

      <div className="grid gap-6">
        {cycles.map(cycle => (
          <div key={cycle.id} className="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-blue-500">
            <h2 className="text-xl font-bold mb-4">{cycle.name} - <span className="text-blue-600">{cycle.status}</span></h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STEPS.map((step, idx) => (
                <div key={step.id} className={`min-w-[150px] p-4 rounded-2xl border ${cycle.current_step >= idx ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 opacity-40'}`}>
                  <p className="text-[10px] font-black uppercase text-slate-400">{step.label}</p>
                  <p className="text-xs font-mono font-bold">{cycle.documents[step.field] || '---'}</p>
                  {cycle.current_step === idx && (
                    <button 
                      onClick={() => handleUpdate(cycle, idx, prompt(`Ingrese ${step.label}:`))}
                      className="mt-2 text-[10px] bg-slate-800 text-white px-2 py-1 rounded w-full"
                    >
                      REGISTRAR
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}