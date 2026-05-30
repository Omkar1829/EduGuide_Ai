import { Clock, FileText, BookOpen, Briefcase, User, Sparkles } from 'lucide-react'

const iconMap = {
  '📝': FileText,
  '📚': BookOpen,
  '💼': Briefcase,
  '👤': User,
  '✨': Sparkles,
}

const ActivityTimeline = ({ activities = [] }) => {
  const defaultActivities = activities.length > 0 ? activities : [
    { id: 1, action: 'Completed quiz "Data Structures"', time: '2 hours ago', icon: '📝', color: 'bg-emerald-500' },
    { id: 2, action: 'Enrolled in "React Masterclass"', time: '5 hours ago', icon: '📚', color: 'bg-blue-500' },
    { id: 3, action: 'Saved job at "Google"', time: '1 day ago', icon: '💼', color: 'bg-violet-500' },
    { id: 4, action: 'Updated profile information', time: '2 days ago', icon: '👤', color: 'bg-amber-500' },
    { id: 5, action: 'Accepted recommendation "ML Engineer"', time: '3 days ago', icon: '✨', color: 'bg-pink-500' },
  ]

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.14] transition-all duration-300">
      <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-3">
        <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Clock className="w-4 h-4 text-white" />
        </span>
        Recent Activity
      </h3>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

        <div className="space-y-1">
          {defaultActivities.map((activity, idx) => {
            const IconComponent = iconMap[activity.icon] || FileText
            return (
              <div
                key={activity.id || idx}
                className="flex items-start gap-4 group relative pl-0 py-2 rounded-xl hover:bg-white/[0.03] transition-all duration-300 cursor-default"
              >
                <div className={`relative z-10 w-8 h-8 rounded-full ${activity.color} bg-opacity-20 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <IconComponent className="w-3.5 h-3.5 text-white/80" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm text-gray-300 leading-tight group-hover:text-white transition-colors duration-300">
                    {activity.action}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-1">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ActivityTimeline
