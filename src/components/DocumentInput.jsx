import { useState } from 'react'
import { Send, CheckCircle2, Loader2 } from 'lucide-react'

function DocumentInput({ step, onSubmit }) {
    const [value, setValue] = useState('')
    const [error, setError] = useState('')
    const [isChecked, setIsChecked] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (step.inputType === 'text') {
            const trimmedValue = value.trim()
            if (!trimmedValue) {
                setError('El campo es obligatorio')
                return
            }

            if (step.validation) {
                if (!step.validation.pattern.test(trimmedValue)) {
                    setError(step.validation.error)
                    return
                }
            }

            setLoading(true)
            await onSubmit(trimmedValue)
            setLoading(false)
            setValue('')
        } else if (step.inputType === 'checkbox') {
            if (!isChecked) {
                setError('Debe marcar la casilla para confirmar')
                return
            }
            setLoading(true)
            await onSubmit('CONFIRMADO')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {step.inputType === 'checkbox' ? (
                <div className="space-y-1">
                    <div
                        onClick={() => {
                            setIsChecked(!isChecked)
                            if (error) setError('')
                        }}
                        className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition-all ${isChecked ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-slate-200 hover:border-blue-900'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all ${isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                            }`}>
                            {isChecked && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                            <p className={`text-sm font-bold ${isChecked ? 'text-emerald-700' : 'text-slate-600'}`}>{step.buttonLabel}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Confirme validación en transacción {step.transaction}</p>
                        </div>
                    </div>
                    {error && <p className="text-[11px] text-red-500 font-bold ml-1">{error}</p>}
                </div>
            ) : (
                <div className="space-y-1">
                    <div className="relative">
                        <input
                            type="text"
                            required
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value)
                                if (error) setError('')
                            }}
                            placeholder={step.placeholder}
                            className={`w-full bg-slate-50 border p-4 rounded-xl text-sm font-bold text-blue-900 placeholder-slate-300 focus:outline-none transition-all ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 focus:border-blue-900'}`}
                        />
                    </div>
                    {error && <p className="text-[11px] text-red-500 font-bold ml-1">{error}</p>}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-800 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-lg shadow-blue-900/10"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> {step.buttonLabel}</>}
            </button>

            <p className="text-[10px] text-center text-slate-400 font-semibold uppercase tracking-widest">
                Acción requerida para: {Array.isArray(step.team) ? step.team.join(' / ') : step.team}
            </p>
        </form>
    )
}

export default DocumentInput
