import { BarChart3, TrendingDown, TrendingUp, Minus } from 'lucide-react'

const SkillGapChart = ({ skillGaps = [] }) => {
  const defaultGaps = skillGaps.length > 0 ? skillGaps : [
    { skill: 'JavaScript', current: 85, required: 90 },
    { skill: 'React', current: 70, required: 85 },
    { skill: 'Node.js', current: 60, required: 80 },
    { skill: 'TypeScript', current: 40, required: 75 },
    { skill: 'System Design', current: 30, required: 70 },
    { skill: 'DevOps', current: 20, required: 60 },
  ]

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.14] transition-all duration-300 group">
      <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
          <BarChart3 className="w-4 h-4 text-white" />
        </span>
        Skill Gap Analysis
      </h3>

      <div className="space-y-5">
        {defaultGaps.map((gap, idx) => {
          const gapSize = gap.required - gap.current
          const GapIcon = gapSize <= 10 ? TrendingUp : gapSize <= 25 ? Minus : TrendingDown
          const gapColor = gapSize <= 10 ? 'text-emerald-400' : gapSize <= 25 ? 'text-amber-400' : 'text-rose-400'
          const barGradient = gapSize <= 10
            ? 'from-emerald-500 to-teal-400'
            : gapSize <= 25
              ? 'from-amber-500 to-orange-400'
              : 'from-rose-500 to-pink-400'

          return (
            <div key={idx} className="group/bar">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-300 group-hover/bar:text-white transition-colors">
                  {gap.skill}
                </span>
                <span className={`flex items-center gap-1 text-[10px] font-bold ${gapColor}`}>
                  <GapIcon className="w-3 h-3" />
                  Gap: {gapSize}%
                </span>
              </div>

              {/* Bar track */}
              <div className="relative h-3 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.04]">
                {/* Current level bar */}
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${barGradient} rounded-full transition-all duration-700 group-hover/bar:shadow-sm`}
                  style={{ width: `${gap.current}%` }}
                />
                {/* Required level marker */}
                <div
                  className="absolute inset-y-0 left-0 border-r-2 border-dashed border-white/30 transition-all duration-700"
                  style={{ width: `${gap.required}%` }}
                />
              </div>

              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-gray-600 font-medium">Current: {gap.current}%</span>
                <span className="text-[10px] text-gray-600 font-medium">Required: {gap.required}%</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-6 pt-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          <span className="text-[10px] text-gray-500 font-medium">Current Level</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0 border-t-2 border-dashed border-white/30" />
          <span className="text-[10px] text-gray-500 font-medium">Required Level</span>
        </div>
      </div>
    </div>
  )
}

export default SkillGapChart
