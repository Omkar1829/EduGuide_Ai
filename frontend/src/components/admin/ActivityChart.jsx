import Card from '../common/Card'

const ActivityChart = ({ data = [], title = 'Activity', type = 'bar', color = 'primary' }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  const colors = {
    primary: { bar: 'from-indigo-500 to-indigo-400', line: 'stroke-indigo-500', dot: 'fill-indigo-500', area: 'from-indigo-500/20' },
    emerald: { bar: 'from-emerald-500 to-emerald-400', line: 'stroke-emerald-500', dot: 'fill-emerald-500', area: 'from-emerald-500/20' },
    amber: { bar: 'from-amber-500 to-amber-400', line: 'stroke-amber-500', dot: 'fill-amber-500', area: 'from-amber-500/20' },
    rose: { bar: 'from-rose-500 to-rose-400', line: 'stroke-rose-500', dot: 'fill-rose-500', area: 'from-rose-500/20' },
  }

  const c = colors[color] || colors.primary

  if (type === 'line') {
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * 100
      const y = 100 - (d.value / maxValue) * 80
      return `${x},${y}`
    }).join(' ')

    return (
      <Card header={title}>
        <div className="h-48 relative">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id={`area-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className={c.area} stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points={`0,100 ${points} 100,100`}
              fill={`url(#area-${color})`}
            />
            <polyline
              points={points}
              fill="none"
              className={c.line}
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
            {data.map((d, i) => {
              const x = (i / (data.length - 1 || 1)) * 100
              const y = 100 - (d.value / maxValue) * 80
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="1"
                  className={c.dot}
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
          </svg>
        </div>
        <div className="flex justify-between mt-3 text-xs text-gray-500">
          {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1).map((d, i) => (
            <span key={i}>{d.label}</span>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card header={title}>
      <div className="flex items-end gap-1 h-48">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="w-full flex justify-center">
              <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">{d.value}</span>
            </div>
            <div
              className={`w-full bg-gradient-to-t ${c.bar} rounded-t-md transition-all duration-500 min-h-[2px] group-hover:opacity-90`}
              style={{ height: `${(d.value / maxValue) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-3 text-xs text-gray-500">
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1).map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </Card>
  )
}

export default ActivityChart
