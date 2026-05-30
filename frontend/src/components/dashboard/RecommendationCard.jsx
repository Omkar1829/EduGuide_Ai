import { ThumbsUp, ThumbsDown, ChevronDown, Lightbulb, GraduationCap, Target, Layers } from 'lucide-react'

const typeIcons = {
  course: GraduationCap,
  career: Target,
  skill: Layers,
  general: Lightbulb,
}

const RecommendationCard = ({ recommendation, onAccept, onReject }) => {
  const {
    id,
    title = 'Recommendation',
    description = '',
    confidence = 0,
    reasoning = '',
    type = 'general',
    status = 'pending',
  } = recommendation || {}

  const typeColors = {
    course: 'from-blue-500 to-indigo-600',
    career: 'from-violet-500 to-purple-600',
    skill: 'from-emerald-500 to-teal-600',
    general: 'from-indigo-500 to-purple-500',
  }

  const badgeColor = {
    course: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    career: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
    skill: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    general: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20',
  }

  const confidenceColor =
    confidence >= 80 ? 'text-emerald-400' : confidence >= 50 ? 'text-amber-400' : 'text-rose-400'

  const TypeIcon = typeIcons[type] || Lightbulb

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 flex flex-col gap-3.5 hover:border-white/[0.14] transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider border ${badgeColor[type] || badgeColor.general}`}>
          <TypeIcon className="w-3 h-3" />
          {type}
        </div>
        {status !== 'pending' && (
          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-medium border ${
            status === 'accepted'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
              : 'bg-rose-500/15 text-rose-300 border-rose-500/20'
          }`}>
            {status}
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="text-base font-bold text-white leading-tight group-hover:text-indigo-200 transition-colors duration-300">
        {title}
      </h4>

      {description && (
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{description}</p>
      )}

      {/* Confidence meter */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs text-gray-600 font-medium">Confidence:</span>
        <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${
              confidence >= 80
                ? 'from-emerald-500 to-teal-400'
                : confidence >= 50
                  ? 'from-amber-500 to-orange-400'
                  : 'from-rose-500 to-pink-400'
            } transition-all duration-700 shadow-sm`}
            style={{ width: `${confidence}%` }}
          />
        </div>
        <span className={`text-xs font-bold ${confidenceColor}`}>{confidence}%</span>
      </div>

      {/* Reasoning */}
      {reasoning && (
        <details className="group/reason">
          <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-300 transition-colors select-none flex items-center gap-1">
            <ChevronDown className="w-3 h-3 transition-transform group-open/reason:rotate-180" />
            View reasoning
          </summary>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed pl-4 border-l border-white/[0.06]">
            {reasoning}
          </p>
        </details>
      )}

      {/* Actions */}
      {status === 'pending' && (
        <div className="flex gap-2.5 mt-1">
          <button
            onClick={() => onAccept?.(id)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] transition-all active:scale-95"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            Accept
          </button>
          <button
            onClick={() => onReject?.(id)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/[0.10] text-gray-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-300 hover:scale-[1.02] transition-all active:scale-95"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            Reject
          </button>
        </div>
      )}
    </div>
  )
}

export default RecommendationCard
