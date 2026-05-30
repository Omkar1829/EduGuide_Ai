import { useMemo } from 'react'
import { UserCheck, AlertCircle } from 'lucide-react'

const ProfileCompletionCard = ({ percentage = 0, userName = '' }) => {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const gradientId = useMemo(() => `progress-${Math.random().toString(36).slice(2, 9)}`, [])
  const glowFilterId = useMemo(() => `pglow-${Math.random().toString(36).slice(2, 9)}`, [])

  const colorClass = useMemo(() => {
    if (percentage >= 80) return 'text-emerald-400'
    if (percentage >= 50) return 'text-amber-400'
    return 'text-rose-400'
  }, [percentage])

  const gradientColors = useMemo(() => {
    if (percentage >= 80) return ['#34d399', '#10b981']
    if (percentage >= 50) return ['#fbbf24', '#f59e0b']
    return ['#fb7185', '#f43f5e']
  }, [percentage])

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center gap-5 hover:border-white/[0.14] transition-all duration-300 group">
      <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500 group-hover:text-gray-400 transition-colors">
        Profile Completion
      </h3>

      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors[0]} />
              <stop offset="100%" stopColor={gradientColors[1]} />
            </linearGradient>
            <filter id={glowFilterId}>
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="10"
          />

          {/* Progress arc */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter={`url(#${glowFilterId})`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${colorClass} tracking-tight`}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      {percentage < 100 && (
        <div className="flex items-center gap-2 text-center">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-gray-400">
            {userName ? `${userName}, complete` : 'Complete'} your profile for better recommendations
          </p>
        </div>
      )}
      {percentage >= 100 && (
        <div className="flex items-center gap-2 text-center">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <p className="text-xs text-emerald-400 font-medium">
            Your profile is fully complete!
          </p>
        </div>
      )}
    </div>
  )
}

export default ProfileCompletionCard
