import { useMemo } from 'react'
import { Target } from 'lucide-react'

const CareerScoreGauge = ({ score = 0, label = 'Career Compatibility' }) => {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const gradientId = useMemo(() => `gauge-${Math.random().toString(36).slice(2, 9)}`, [])
  const glowId = useMemo(() => `glow-${Math.random().toString(36).slice(2, 9)}`, [])

  const scoreColor = useMemo(() => {
    if (score >= 80) return { text: 'text-emerald-400', gradient: ['#34d399', '#10b981'], glow: 'shadow-emerald-500/20' }
    if (score >= 60) return { text: 'text-indigo-400', gradient: ['#818cf8', '#6366f1'], glow: 'shadow-indigo-500/20' }
    if (score >= 40) return { text: 'text-amber-400', gradient: ['#fbbf24', '#f59e0b'], glow: 'shadow-amber-500/20' }
    return { text: 'text-rose-400', gradient: ['#fb7185', '#f43f5e'], glow: 'shadow-rose-500/20' }
  }, [score])

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center hover:border-white/[0.14] transition-all duration-300 group">
      <div className={`relative w-44 h-44 ${scoreColor.glow} shadow-2xl rounded-full`}>
        {/* Subtle radial background glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/[0.03] to-transparent" />

        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={scoreColor.gradient[0]} />
              <stop offset="100%" stopColor={scoreColor.gradient[1]} />
            </linearGradient>
            <filter id={glowId}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="12"
          />

          {/* Subtle middle track */}
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.02)"
            strokeWidth="18"
          />

          {/* Score arc */}
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter={`url(#${glowId})`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Target className={`w-4 h-4 ${scoreColor.text} mb-1 opacity-50`} />
          <span className={`text-4xl font-bold ${scoreColor.text} tracking-tight`}>
            {score}
          </span>
          <span className="text-[11px] text-gray-500 mt-0.5 font-medium">out of 100</span>
        </div>
      </div>

      <p className="text-sm font-semibold text-gray-300 mt-4 group-hover:text-white transition-colors duration-300">
        {label}
      </p>
    </div>
  )
}

export default CareerScoreGauge
