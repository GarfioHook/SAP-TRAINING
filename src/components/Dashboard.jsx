import { Activity, Plus, Database, LogOut, User, CheckCircle2 } from 'lucide-react'
import TestCycleCard from './TestCycleCard'
import { WORKFLOW_STEPS } from '../lib/constants'

function Dashboard({ cycles, loading, demoMode, userName, userArea, onNewCycle, onLogout, onUpdateDocument }) {
    const myPendingTasks = cycles.filter(c => {
        const stepData = c.current_step < 7 ? WORKFLOW_STEPS[c.current_step] : null
        if (!stepData) return false

        // Handle both single team or array of teams
        const allowedTeams = Array.isArray(stepData.team) ? stepData.team : [stepData.team]
        return allowedTeams.includes(userArea)
    }).length

    const completedCycles = cycles.filter(c => c.current_step >= 7).length

    return (
        <div className="min-h-screen">
            {/* Top Header */}
            <nav className="glass-header px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="grupo-portland-logo.png" alt="Grupo Portland" className="h-7 w-auto" />
                        <div className="h-4 w-px bg-slate-200" />
                        <img src="sap-project-logo.png" alt="Proyecto SAP S/4HANA" className="h-6 w-auto" />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs text-slate-400 font-medium">USUARIO / ÁREA</span>
                            <span className="text-sm font-bold text-blue-900">{import.meta.env.DEV ? '👤' : ''} {userName} | {userArea}</span>
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
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="exec-card p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tareas Pendientes</p>
                            <h3 className="text-3xl font-bold text-blue-900">{myPendingTasks}</h3>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                            <Activity className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>

                    <div className="exec-card p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Ciclos</p>
                            <h3 className="text-3xl font-bold text-blue-900">{cycles.length}</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Database className="w-6 h-6 text-blue-900" />
                        </div>
                    </div>

                    <div className="exec-card p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Completados</p>
                            <h3 className="text-3xl font-bold text-emerald-600">{completedCycles}</h3>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
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
                            <TestCycleCard
                                key={cycle.id}
                                cycle={cycle}
                                userArea={userArea}
                                onUpdateDocument={onUpdateDocument}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Dashboard
