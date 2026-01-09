import { useState } from 'react'
import { Check, X, Building2, User, Package, TrendingUp, Hash, Loader2 } from 'lucide-react'

function NewCycleModal({ onClose, onSubmit }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        company_code: '1000',
        purchase_type: 'Nacional',
        client: '',
        vendor: '',
        material: '',
        quantity: '',
        margin: '',
        creator: ''
    })

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden fade-in border border-slate-200">
                <div className="bg-blue-900 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/grupo-portland-logo.png" alt="Portland" className="h-5 w-auto brightness-0 invert" />
                        <h2 className="text-white font-bold text-sm tracking-tight border-l border-white/20 pl-3">Nuevo Ciclo SAP</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form className="p-6 space-y-4 max-h-[80vh] overflow-y-auto" onSubmit={async (e) => {
                    e.preventDefault()
                    setLoading(true)
                    await onSubmit(formData)
                    setLoading(false)
                }}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nombre Descriptivo del Ciclo</label>
                            <input
                                required
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 font-bold"
                                placeholder="Ej: Importación Repuestos Q1"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Sociedad (Soc.)</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-900"
                                    value={formData.company_code}
                                    onChange={e => setFormData({ ...formData, company_code: e.target.value })}
                                >
                                    <option value="1000">1000 - Portland Chile</option>
                                    <option value="2000">2000 - Portland Perú</option>
                                    <option value="3000">3000 - Portland Colombia</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Tipo de Compra</label>
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, purchase_type: 'Nacional' })}
                                        className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${formData.purchase_type === 'Nacional' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-400'}`}
                                    >NACIONAL</button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, purchase_type: 'Importación' })}
                                        className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${formData.purchase_type === 'Importación' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-400'}`}
                                    >IMPORTACIÓN</button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Proveedor (Vendor)</label>
                                <div className="relative">
                                    <input required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold" placeholder="ID PROVEEDOR" value={formData.vendor} onChange={e => setFormData({ ...formData, vendor: e.target.value.toUpperCase() })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Cliente (Customer)</label>
                                <div className="relative">
                                    <input required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold" placeholder="ID CLIENTE" value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value.toUpperCase() })} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Material</label>
                                <input required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold" placeholder="CÓDIGO MATERIAL" value={formData.material} onChange={e => setFormData({ ...formData, material: e.target.value.toUpperCase() })} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Cantidad</label>
                                    <input type="number" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold" placeholder="0" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Margen %</label>
                                    <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold" placeholder="0.0" value={formData.margin} onChange={e => setFormData({ ...formData, margin: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all border border-slate-100">Cancelar</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 bg-blue-900 text-white text-sm font-bold rounded-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Lanzar Nuevo Ciclo</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewCycleModal
