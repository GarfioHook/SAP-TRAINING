import { Activity, Plus, Database, LogOut, User, CheckCircle2, ShieldCheck, Search, ArrowUpRight, History } from 'lucide-react'
import TestCycleCard from './TestCycleCard'
import { WORKFLOW_STEPS } from '../lib/constants'
import { useState } from 'react'

function Dashboard({ cycles, loading, demoMode, userName, userArea, onNewCycle, onLogout, onUpdateDocument }) {
    const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'admin-track'
    const [filterStep, setFilterStep] = useState(0)

    const myPendingTasks = cycles.filter(c => {
        const stepData = c.current_step < 7 ? WORKFLOW_STEPS[c.current_step] : null
        if (!stepData) return false

        // Handle both single team or array of teams
        const allowedTeams = Array.isArray(stepData.team) ? stepData.team : [stepData.team]
        return allowedTeams.includes(userArea)
    }).length

    const completedCycles = cycles.filter(c => c.current_step >= 7).length

    const adminResults = cycles.filter(c => {
        const step = WORKFLOW_STEPS[filterStep]
        return c.documents && c.documents[step.documentKey]
    }).map(c => ({
        id: c.id,
        name: c.name,
        doc: c.documents[WORKFLOW_STEPS[filterStep].documentKey]
    }))

    const scrollToCycle = (cycleId) => {
        setActiveTab('overview')
        setTimeout(() => {
            const element = document.getElementById(`cycle-${cycleId}`)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                element.classList.add('ring-4', 'ring-blue-500', 'ring-offset-2')
                setTimeout(() => element.classList.remove('ring-4', 'ring-blue-500', 'ring-offset-2'), 3000)
            }
        }, 100)
    }

    return (
        <div className="min-h-screen">
            {/* Top Header */}
            <nav className="glass-header px-6 py-4 border-b border-slate-200">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="grupo-portland-logo.png" alt="Grupo Portland" className="h-7 w-auto" />
                        <div className="h-4 w-px bg-slate-200" />
                        <img src="sap-project-logo.png" alt="Proyecto SAP S/4HANA" className="h-6 w-auto" />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Navegando como</span>
                            <span className="text-sm font-bold text-blue-900">{userName} | {userArea}</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Cambiar Área"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Admin Tabs */}
                {userArea === 'Administrador' && (
                    <div className="flex items-center gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-white text-blue-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Activity className="w-4 h-4" />
                            Vista General
                        </button>
                        <button
                            onClick={() => setActiveTab('admin-track')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'admin-track' ? 'bg-white text-blue-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Seguimiento Admin
                        </button>
                    </div>
                )}

                {activeTab === 'overview' ? (
                    <>
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="exec-card p-6 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tareas Pendientes</p>
                                    <h3 className="text-3xl font-bold text-blue-900">{myPendingTasks}</h3>
                                </div>
                                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100">
                                    <Activity className="w-6 h-6 text-amber-600" />
                                </div>
                            </div>

                            <div className="exec-card p-6 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Ciclos</p>
                                    <h3 className="text-3xl font-bold text-blue-900">{cycles.length}</h3>
                                </div>
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                                    <Database className="w-6 h-6 text-blue-900" />
                                </div>
                            </div>

                            <div className="exec-card p-6 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Completados</p>
                                    <h3 className="text-3xl font-bold text-emerald-600">{completedCycles}</h3>
                                </div>
                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                        </div>

                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Flujos de Entrenamiento</h2>
                            {(userArea === 'Administrador' || userArea === 'Comercial') && (
                                <button
                                    onClick={onNewCycle}
                                    className="btn-navy px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-900/10"
                                >
                                    <Plus className="w-4 h-4" />
                                    Nuevo Ciclo
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-slate-500 font-medium">Cargando datos maestros...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cycles.map(cycle => (
                                    <div id={`cycle-${cycle.id}`} key={cycle.id} className="transition-all duration-300 rounded-xl">
                                        <TestCycleCard
                                            cycle={cycle}
                                            userArea={userArea}
                                            onUpdateDocument={onUpdateDocument}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="fade-in space-y-8">
                        {/* Admin Tracker Header */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <ShieldCheck className="w-32 h-32 text-blue-900" />
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
                                        <History className="w-6 h-6" /> Seguimiento de Uso
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1">Monitoreo de registros generados por usuario y paso del proceso.</p>
                                </div>
                                <div className="flex flex-col gap-2 min-w-[280px]">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filtrar por Etapa del Proceso</label>
                                    <select
                                        value={filterStep}
                                        onChange={(e) => setFilterStep(Number(e.target.value))}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-blue-900 focus:outline-none focus:border-blue-900 transition-all cursor-pointer hover:border-blue-400"
                                    >
                                        {WORKFLOW_STEPS.map(step => (
                                            <option key={step.index} value={step.index}>
                                                {step.index + 1}. {step.transaction} - {step.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Results Table */}
                            <div className="mt-10 overflow-hidden border border-slate-100 rounded-xl shadow-inner bg-slate-50/30">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/80 text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                            <th className="px-6 py-4 font-bold">Ciclo de Entrenamiento</th>
                                            <th className="px-6 py-4 font-bold">Documento Generado</th>
                                            <th className="px-6 py-4 font-bold">Abonado por</th>
                                            <th className="px-6 py-4 font-bold">Timestamp / Área</th>
                                            <th className="px-6 py-4 font-bold text-right">Detalle</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {adminResults.length > 0 ? (
                                            adminResults.map((result) => (
                                                <tr key={result.id} className="hover:bg-white transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <span className="font-extrabold text-blue-900 text-sm">{result.name}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-100 rounded-lg font-mono font-bold text-xs shadow-sm">
                                                            {typeof result.doc === 'object' ? result.doc.value : result.doc}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-slate-700 text-sm">{typeof result.doc === 'object' ? result.doc.user : 'N/A'}</td>
                                                    <td className="px-6 py-4 text-[11px]">
                                                        <div className="flex flex-col">
                                                            <span className="text-slate-500 font-bold">{typeof result.doc === 'object' && result.doc.at ? new Date(result.doc.at).toLocaleString() : 'N/A'}</span>
                                                            <span className="text-slate-400 font-medium uppercase tracking-tight">{typeof result.doc === 'object' ? result.doc.area : 'Sistema'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => scrollToCycle(result.id)}
                                                            className="p-2 text-slate-300 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all group-hover:text-blue-600"
                                                            title="Localizar en Dashboard"
                                                        >
                                                            <ArrowUpRight className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-24 text-center">
                                                    <Search className="w-12 h-12 text-slate-200 mx-auto mb-4 opacity-50" />
                                                    <p className="text-slate-400 font-bold text-base">No hay registros para esta etapa todavía</p>
                                                    <p className="text-slate-300 text-xs mt-1 uppercase tracking-widest font-bold">Seleccione otro paso para auditar</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Dashboard
