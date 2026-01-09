import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import { APP_ID, DEMO_CYCLES, TEAMS } from './lib/constants'
import Dashboard from './components/Dashboard'
import NewCycleModal from './components/NewCycleModal'
import { Building2, ChevronRight, UserCircle } from 'lucide-react'

function App() {
  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const [userArea, setUserArea] = useState(localStorage.getItem('sap_training_area') || null)
  const [userName, setUserName] = useState(localStorage.getItem('sap_training_user') || '')

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setDemoMode(true)
      setCycles(DEMO_CYCLES)
      setLoading(false)
      return
    }

    fetchCycles()

    const channel = supabase
      .channel('test_cycles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'test_cycles',
          filter: `app_id=eq.${APP_ID}`
        },
        (payload) => handleRealtimeChange(payload)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchCycles = async () => {
    try {
      const { data, error } = await supabase
        .from('test_cycles')
        .select('*')
        .eq('app_id', APP_ID)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCycles(data || [])
    } catch (error) {
      console.error('Error fetching cycles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRealtimeChange = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload
    if (eventType === 'INSERT') {
      setCycles(prev => [newRecord, ...prev])
    } else if (eventType === 'UPDATE') {
      setCycles(prev => prev.map(c => c.id === newRecord.id ? newRecord : c))
    } else if (eventType === 'DELETE') {
      setCycles(prev => prev.filter(c => c.id !== oldRecord.id))
    }
  }

  const selectArea = (area, name) => {
    setUserArea(area)
    setUserName(name)
    localStorage.setItem('sap_training_area', area)
    localStorage.setItem('sap_training_user', name)
  }

  const handleLogout = () => {
    setUserArea(null)
    setUserName('')
    localStorage.removeItem('sap_training_area')
    localStorage.removeItem('sap_training_user')
  }

  // --- RENDERING VIEWS ---

  if (!userArea) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl fade-in">
          <div className="flex items-center justify-start gap-4 mb-10">
            <img src="grupo-portland-logo.png" alt="Grupo Portland" className="h-8 w-auto" />
            <div className="h-4 w-px bg-slate-200" />
            <img src="sap-project-logo.png" alt="Proyecto SAP S/4HANA" className="h-6 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 pt-4">Monitor de Flujos SAP</h1>
          <p className="text-slate-500 py-10 mb-6 text-sm leading-relaxed border-y border-slate-50">
            Ingrese su nombre y seleccione su departamento.
          </p>

          <div className="space-y-6 text-left">
            <div className="pt-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Nombre Completo</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm font-bold text-blue-900 focus:outline-none focus:border-blue-900"
                placeholder="Juan Pérez"
              />
            </div>
            <div className="pt-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Elija un ROL para ingresar</label>

              <div className="space-y-3">
                {TEAMS.map((team) => (
                  <button
                    key={team}
                    onClick={() => selectArea(team, userName)}
                    disabled={!userName.trim()}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-900 hover:bg-slate-50 transition-all text-left font-medium text-slate-700 group"
                  >
                    <span>{team}</span>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-900" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            SAP S/4HANA Training • Enterprise
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Dashboard
        cycles={cycles}
        loading={loading}
        demoMode={demoMode}
        userName={userName}
        userArea={userArea}
        onNewCycle={() => setShowModal(true)}
        onLogout={handleLogout}
        onUpdateDocument={async (cycleId, key, value, nextStep) => {
          const currentCycle = cycles.find(c => c.id === cycleId)

          const documentData = {
            value: value,
            user: userName,
            area: userArea,
            at: new Date().toISOString()
          }

          const newDocuments = { ...(currentCycle.documents || {}), [key]: documentData }

          // Optimistic local update
          setCycles(prev => prev.map(c => c.id === cycleId ? {
            ...c, documents: newDocuments, current_step: nextStep
          } : c))

          if (demoMode) return

          try {
            const { error } = await supabase.from('test_cycles').update({
              documents: newDocuments,
              current_step: nextStep
            }).eq('id', cycleId)

            if (error) throw error
          } catch (error) {
            console.error('Update error:', error)
            alert('Error al actualizar: ' + error.message)
            // Rollback if needed or just fetch again
            fetchCycles()
          }
        }}
      />

      {showModal && (
        <NewCycleModal
          onClose={() => setShowModal(false)}
          onSubmit={async (data) => {
            const tempId = Date.now()
            const newCycle = {
              id: tempId,
              app_id: APP_ID,
              ...data,
              creator: userName, // Auto-assign current user
              current_step: 0,
              documents: {},
              created_at: new Date().toISOString()
            }

            // Optimistic local update
            setCycles(prev => [newCycle, ...prev])
            setShowModal(false)

            if (demoMode) return

            try {
              const { data: insertedData, error } = await supabase
                .from('test_cycles')
                .insert([{ ...data, app_id: APP_ID, creator: userName, current_step: 0, documents: {} }])
                .select()
                .single()

              if (error) throw error

              // Replace temp record with real one from DB (to get correct ID/dates)
              if (insertedData) {
                setCycles(prev => prev.map(c => c.id === tempId ? insertedData : c))
              }
            } catch (error) {
              console.error('Insert error:', error)
              alert('Error al crear ciclo: ' + error.message)
              fetchCycles() // Reset state to server state
            }
          }}
        />
      )}
    </div>
  )
}

export default App
