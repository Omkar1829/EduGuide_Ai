import { Map, CheckCircle2, Circle, Clock } from 'lucide-react'

const RoadmapPreview = ({ roadmap }) => {
  const {
    title = 'Career Roadmap',
    steps = [],
    currentStep = 0,
    estimatedDuration = '',
  } = roadmap || {}

  const defaultSteps = steps.length > 0 ? steps : [
    { title: 'Foundation', description: 'Build core skills', status: 'completed' },
    { title: 'Intermediate', description: 'Deepen expertise', status: 'current' },
    { title: 'Advanced', description: 'Specialize & projects', status: 'upcoming' },
    { title: 'Professional', description: 'Job-ready skills', status: 'upcoming' },
  ]

  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      dot: 'bg-emerald-500 shadow-lg shadow-emerald-500/30 border-emerald-400/30',
      line: 'bg-emerald-500/60',
      iconClass: 'text-white',
    },
    current: {
      icon: Clock,
      dot: 'bg-indigo-500 shadow-lg shadow-indigo-500/30 border-indigo-400/30 animate-pulse',
      line: 'bg-gray-700/50',
      iconClass: 'text-white',
    },
    upcoming: {
      icon: Circle,
      dot: 'bg-gray-800 border-gray-600/50',
      line: 'bg-gray-700/30',
      iconClass: 'text-gray-500',
    },
  }

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.14] transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Map className="w-4 h-4 text-white" />
          </span>
          {title}
        </h3>
        {estimatedDuration && (
          <span className="text-[10px] text-gray-400 bg-white/[0.05] border border-white/[0.06] px-3 py-1.5 rounded-lg font-semibold">
            {estimatedDuration}
          </span>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {defaultSteps.map((step, idx) => {
          const config = statusConfig[step.status] || statusConfig.upcoming
          const StepIcon = config.icon
          return (
            <div key={idx} className="flex gap-4 group/step">
              {/* Timeline dot + line */}
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full border ${config.dot} flex items-center justify-center flex-shrink-0 group-hover/step:scale-110 transition-transform duration-300`}>
                  <StepIcon className={`w-3.5 h-3.5 ${config.iconClass}`} />
                </div>
                {idx < defaultSteps.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[2rem] ${config.line} rounded-full transition-all duration-500`} />
                )}
              </div>

              {/* Content */}
              <div className="pb-6">
                <p className={`text-sm font-semibold ${
                  step.status === 'completed'
                    ? 'text-emerald-300'
                    : step.status === 'current'
                      ? 'text-white'
                      : 'text-gray-500'
                } group-hover/step:text-white transition-colors duration-300`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{step.description}</p>
                {step.status === 'current' && (
                  <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-lg bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                    <Clock className="w-2.5 h-2.5" />
                    In Progress
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RoadmapPreview
