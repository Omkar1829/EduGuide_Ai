const ProgressBar = ({
  percentage = 0,
  label = '',
  showPercentage = true,
  size = 'md',
  color = 'primary',
}) => {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const colorClasses = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    secondary: 'bg-gradient-to-r from-purple-500 to-pink-500',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-500',
  }

  const glowClasses = {
    primary: 'shadow-indigo-500/30',
    secondary: 'shadow-purple-500/30',
    success: 'shadow-emerald-500/30',
    warning: 'shadow-amber-500/30',
  }

  const percentColorClasses = {
    primary: 'text-indigo-400',
    secondary: 'text-purple-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
  }

  const clampedPercentage = Math.min(100, Math.max(0, percentage))

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-gray-300">{label}</span>
          )}
          {showPercentage && (
            <span
              className={`text-sm font-semibold ${percentColorClasses[color] || percentColorClasses.primary}`}
            >
              {Math.round(clampedPercentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full rounded-full bg-white/[0.08] overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className={`
            ${sizeClasses[size]} rounded-full
            ${colorClasses[color] || colorClasses.primary}
            ${clampedPercentage > 0 ? `shadow-sm ${glowClasses[color] || glowClasses.primary}` : ''}
            transition-all duration-700 ease-out
          `}
          style={{ width: `${clampedPercentage}%` }}
          role="progressbar"
          aria-valuenow={Math.round(clampedPercentage)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || 'Progress'}
        />
      </div>
    </div>
  )
}

export default ProgressBar
