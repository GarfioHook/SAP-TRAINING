import { useState } from 'react'
import { MoreHorizontal, ArrowRight, Lock, Building2, Globe } from 'lucide-react'
import { WORKFLOW_STEPS } from '../lib/constants'
import WorkflowStepper from './WorkflowStepper'
import DocumentInput from './DocumentInput'

function TestCycleCard({ cycle, userArea, onUpdateDocument }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [showScenario, setShowScenario] = useState(false)
    const currentStepData = WORKFLOW_STEPS[cycle.current_step]
    const isCompleted = cycle.current_step >= 7

    // Support multi-team step ownership
    const allowedTeams = currentStepData ? (Array.isArray(currentStepData.team) ? currentStepData.team : [currentStepData.team]) : []
    const canEdit = !isCompleted && (allowedTeams.includes(userArea) || userArea === 'Administrador')

    const formatTeamDisplay = (team) => {
        if (Array.isArray(team)) return team.join(' / ')
        return team
    }

    // Bulletproof function to render values that might be objects (fixes React Error #31)
    const renderSafeValue = (val) => {
        if (!val) return 'POR REGISTRAR'
        if (typeof val === 'object' && !Array.isArray(val)) {
            // If it's our metadata object {value, user, at, area}
            return String(val.value || 'OK')
        }
        return String(val)
    }

    return (
        <div className={`exec-card rounded-xl overflow-hidden fade-in flex flex-col border border-slate-200 bg-white ${canEdit ? 'ring-2 ring-amber-400 ring-offset-0 shadow-lg shadow-amber-400/10' : ''
            }`}>
            {/* Header Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                        <h3
                            onClick={() => setShowScenario(!showScenario)}
                            className="font-extrabold text-blue-900 truncate pr-2 cursor-pointer hover:text-blue-700 flex items-center gap-2 group transition-colors"
                        >
                            {renderSafeValue(cycle.name)}
                            <ArrowRight className={`w-3.5 h-3.5 transition-transform ${showScenario ? 'rotate-90' : ''} text-slate-300 group-hover:text-blue-500`} />
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                                <Building2 className="w-3 h-3" /> Soc: {renderSafeValue(cycle.company_code || '1000')}
                            </span>
                            <span className="text-[10px] text-slate-200">|</span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                                <Globe className="w-3 h-3" /> {renderSafeValue(cycle.purchase_type || 'Nacional')}
                            </span>
                        </div>
                    </div>
                    <div className={`shrink-0 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-900/5'
                        }`}>
                        {isCompleted ? 'Finalizado' : `Paso ${cycle.current_step + 1}/7`}
                    </div>
                </div>

                {/* Scenario details panel (Toggleable) */}
                {showScenario && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 fade-in shadow-inner">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-1">Contexto Real SAP</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">Proveedor</span>
                                <span className="text-[11px] font-bold text-slate-800">{renderSafeValue(cycle.vendor)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">Cliente</span>
                                <span className="text-[11px] font-bold text-slate-800">{renderSafeValue(cycle.client)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">Material</span>
                                <span className="text-[11px] font-bold text-slate-800">{renderSafeValue(cycle.material)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">Sociedad</span>
                                <span className="text-[11px] font-bold text-slate-800">{renderSafeValue(cycle.company_code || '1000')}</span>
                            </div>
                        </div>
                        <p className="mt-3 pt-3 border-t border-slate-200 text-[9px] text-slate-400 italic font-medium">
                            * Verifique estos datos en S/4HANA antes de registrar
                        </p>
                    </div>
                )}

                {/* Progress Visual */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full mb-6 relative overflow-hidden mt-auto">
                    <div
                        className={`absolute left-0 top-0 h-full transition-all duration-700 ease-out ${isCompleted ? 'bg-emerald-500' : 'bg-blue-900'
                            }`}
                        style={{ width: `${(cycle.current_step / 7) * 100}%` }}
                    />
                </div>

                {/* Status Badge */}
                {!isCompleted && (
                    <div className={`p-3 rounded-xl flex items-center justify-between transition-all ${canEdit ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 border border-slate-100 opacity-60'
                        }`}>
                        <div className="flex items-center gap-2">
                            {canEdit ? (
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            ) : (
                                <Lock className="w-3 h-3 text-slate-400" />
                            )}
                            <span className={`text-[11px] font-bold uppercase tracking-tight ${canEdit ? 'text-amber-700' : 'text-slate-400'
                                }`}>
                                {canEdit ? 'Tu turno: ' : 'En espera: '}
                                {formatTeamDisplay(currentStepData?.team)}
                            </span>
                        </div>
                        {canEdit && (
                            <span className="text-[10px] font-extrabold text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-sm">
                                {renderSafeValue(currentStepData?.transaction)}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Visual Stepper */}
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
                <WorkflowStepper currentStep={cycle.current_step} />
            </div>

            {/* Footer Buttons */}
            <div className="flex border-t border-slate-100">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex-1 py-4 text-xs font-bold text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    {isExpanded ? 'Cerrar Detalles' : <><MoreHorizontal className="w-4 h-4" /> Ver Historial</>}
                </button>
                {canEdit && !isExpanded && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="flex-1 py-4 bg-blue-900 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all active:scale-95"
                    >
                        Registrar Ahora <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Expanded Content Section */}
            {isExpanded && (
                <div className="p-6 border-t border-slate-100 bg-white fade-in space-y-8">
                    {/* Active Input Area */}
                    {canEdit && !isCompleted && (
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Ejecución de Paso</h4>
                            <DocumentInput
                                step={currentStepData}
                                onSubmit={(val) => onUpdateDocument(cycle.id, currentStepData.documentKey, val, cycle.current_step + 1)}
                            />
                        </div>
                    )}

                    {!canEdit && !isCompleted && (
                        <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                                <Lock className="w-5 h-5 text-slate-300" />
                            </div>
                            <p className="text-xs font-semibold text-slate-500 italic">
                                Acceso restringido. Solo el área de {formatTeamDisplay(currentStepData?.team)} puede realizar este registro.
                            </p>
                        </div>
                    )}

                    {/* Audit Trail / History */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trazabilidad SAP</h4>
                            <span className="text-[9px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Audit Trail</span>
                        </div>

                        <div className="space-y-4">
                            {WORKFLOW_STEPS.map((step) => {
                                const doc = cycle.documents?.[step.documentKey]
                                const isDone = step.index < cycle.current_step
                                const isMetadata = doc && typeof doc === 'object' && !Array.isArray(doc)

                                return (
                                    <div key={step.index} className="flex flex-col group">
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-blue-900' : 'bg-slate-200'}`} />
                                                <span className={`font-bold ${isDone ? 'text-slate-700' : 'text-slate-300'}`}>
                                                    {renderSafeValue(step.transaction)}
                                                </span>
                                                <span className={`font-medium ${isDone ? 'text-slate-500' : 'text-slate-300'}`}>
                                                    - {renderSafeValue(step.name)}
                                                </span>
                                            </div>
                                            <span className={`font-mono font-bold px-2 py-1 rounded ${doc ? 'text-blue-900 bg-blue-50 border border-blue-100' : 'text-slate-300'
                                                }`}>
                                                {renderSafeValue(doc)}
                                            </span>
                                        </div>

                                        {isMetadata && (
                                            <div className="mt-2 ml-3.5 pl-3 border-l-2 border-slate-100 flex flex-col gap-0.5">
                                                <p className="text-[10px] text-slate-500 font-bold">
                                                    Registrado por: <span className="text-blue-900">{renderSafeValue(doc.user)}</span>
                                                </p>
                                                <div className="flex items-center gap-2 text-[9px] text-slate-400 font-medium">
                                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded uppercase">{renderSafeValue(doc.area || 'Sistema')}</span>
                                                    <span>•</span>
                                                    <span>{doc.at ? new Date(doc.at).toLocaleString() : 'N/A'}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TestCycleCard
