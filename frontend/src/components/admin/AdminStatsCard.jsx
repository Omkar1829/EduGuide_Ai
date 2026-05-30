import { TrendingUp, TrendingDown } from 'lucide-react'

const AdminStatsCard = ({ title, value, icon, color = 'primary', change, changeType = 'positive' }) => {
  const colors = {
    primary: 'from-indigo-500 to-indigo-600',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-500 to-pink-500',
    sky: 'from-sky-500 to-blue-500',
    violet: 'from-violet-500 to-purple-500',
  }

  return (
    <div className="relative group p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]
                    hover:bg-white/[0.07] hover:border-white/[0.15] hover:shadow-2xl hover:shadow-indigo-500/5
                    hover:scale-[1.02] transition-all duration-300 cursor-default overflow-hidden">
      {/* Subtle gradient glow */}
      <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br ${colors[color]} opacity-10 blur-2xl
                       group-hover:opacity-20 transition-opacity duration-500`} />

      <div className="relative flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg
                        group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
          {typeof icon === 'string' ? (
            <span className="text-white text-lg">{icon}</span>
          ) : (
            <span className="text-white">{icon}</span>
          )}
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-lg ${
            changeType === 'positive'
              ? 'text-emerald-400 bg-emerald-400/10'
              : 'text-rose-400 bg-rose-400/10'
          }`}>
            {changeType === 'positive' ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {change}
          </span>
        )}
      </div>
      <div className="relative">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400 mt-1">{title}</p>
      </div>
    </div>
  )
}

export default AdminStatsCard
