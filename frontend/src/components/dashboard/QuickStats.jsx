import { BookOpen, Briefcase, FileText, Sparkles, TrendingUp } from 'lucide-react'

const iconMap = {
  '📚': BookOpen,
  '💼': Briefcase,
  '📝': FileText,
  '✨': Sparkles,
}

const colorGradients = {
  'from-blue-500 to-cyan-500': 'shadow-blue-500/20',
  'from-violet-500 to-purple-500': 'shadow-violet-500/20',
  'from-amber-500 to-orange-500': 'shadow-amber-500/20',
  'from-emerald-500 to-teal-500': 'shadow-emerald-500/20',
}

const QuickStats = ({ stats = [] }) => {
  const defaultStats = stats.length > 0 ? stats : [
    { label: 'Courses Enrolled', value: 0, icon: '📚', color: 'from-blue-500 to-cyan-500' },
    { label: 'Jobs Saved', value: 0, icon: '💼', color: 'from-violet-500 to-purple-500' },
    { label: 'Quizzes Taken', value: 0, icon: '📝', color: 'from-amber-500 to-orange-500' },
    { label: 'Recommendations', value: 0, icon: '✨', color: 'from-emerald-500 to-teal-500' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {defaultStats.map((stat, idx) => {
        const IconComponent = iconMap[stat.icon] || TrendingUp
        const shadowClass = colorGradients[stat.color] || 'shadow-indigo-500/20'

        return (
          <div
            key={idx}
            className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 group cursor-default hover:border-white/[0.15] hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg ${shadowClass} group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight group-hover:text-indigo-100 transition-colors">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-1.5 font-semibold uppercase tracking-wider group-hover:text-gray-400 transition-colors">
              {stat.label}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default QuickStats
