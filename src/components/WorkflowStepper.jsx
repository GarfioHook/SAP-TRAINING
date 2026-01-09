import { WORKFLOW_STEPS } from '../lib/constants'

function WorkflowStepper({ currentStep }) {
    return (
        <div className="flex items-center justify-between gap-1 w-full h-8 px-1">
            {WORKFLOW_STEPS.map((step, index) => {
                const isDone = index < currentStep
                const isNow = index === currentStep

                return (
                    <div
                        key={step.index}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${isDone ? 'bg-blue-900' : isNow ? 'bg-amber-400 animate-pulse' : 'bg-slate-200'
                            }`}
                        title={`${step.transaction}: ${step.name}`}
                    />
                )
            })}
        </div>
    )
}

export default WorkflowStepper
